"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/apiClient";
import { mapApiTodo } from "../services/adapters";
import { readAnonymousTodos, writeAnonymousTodos } from "../services/storage";
import { DailyTodoState, TodoItem } from "../types";

function today() {
  return new Date().toISOString().split("T")[0];
}

function initialState(): DailyTodoState {
  return {
    lastResetDate: today(),
    tasks: [
      {
        id: "local-1",
        text: "Tập trung làm việc 4 phiên Pomodoro ( Deep Work )",
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: "local-2",
        text: "Uống 2 lít nước & giãn cơ nhẹ nhàng",
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ],
  };
}

function taskKey(text: string) {
  return text.trim().toLocaleLowerCase();
}

function findLocalTasksToUpload(
  localTasks: TodoItem[],
  remoteTasks: TodoItem[],
) {
  const remoteClientIds = new Set(
    remoteTasks.map((task) => task.clientId).filter(Boolean),
  );
  const legacyTextCounts = new Map<string, number>();

  remoteTasks.forEach((task) => {
    if (!task.clientId) {
      const key = taskKey(task.text);
      legacyTextCounts.set(key, (legacyTextCounts.get(key) || 0) + 1);
    }
  });

  return localTasks.filter((task) => {
    if (!task.id.startsWith("local-") || remoteClientIds.has(task.id))
      return false;
    const key = taskKey(task.text);
    const legacyCount = legacyTextCounts.get(key) || 0;
    if (legacyCount > 0) {
      legacyTextCounts.set(key, legacyCount - 1);
      return false;
    }
    return true;
  });
}

function mergeTasks(remoteTasks: TodoItem[], uploadedTasks: TodoItem[]) {
  const seen = new Set<string>();
  return [...remoteTasks, ...uploadedTasks].filter((task) => {
    const key = task.clientId
      ? `client:${task.clientId}`
      : `legacy:${taskKey(task.text)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function useCloudTodos() {
  const { user, status } = useAuth();
  const [state, setState] = useState<DailyTodoState>(() => initialState());
  const hasLoadedAnonymousState = useRef(false);
  const anonymousStateRef = useRef<DailyTodoState | null>(null);
  const skipAnonymousPersistRef = useRef(false);
  const scopeRef = useRef("loading");
  const requestIdRef = useRef(0);
  const scope =
    status === "authenticated" && user ? `authenticated:${user._id}` : status;

  useEffect(() => {
    const local = readAnonymousTodos(initialState());
    const hydrated =
      local.lastResetDate === today()
        ? local
        : {
            lastResetDate: today(),
            tasks: local.tasks.filter((task) => !task.completed),
          };
    anonymousStateRef.current = hydrated;
    hasLoadedAnonymousState.current = true;
    if (status !== "authenticated") setState(hydrated);
  }, [status]);

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    const previousScope = scopeRef.current;
    scopeRef.current = scope;
    if (status !== "authenticated" || !user) {
      if (previousScope.startsWith("authenticated:")) {
        skipAnonymousPersistRef.current = true;
        anonymousStateRef.current = null;
        setState(readAnonymousTodos(initialState()));
      } else {
        const anonymous = readAnonymousTodos(initialState());
        anonymousStateRef.current = anonymous;
        setState(anonymous);
      }
      return;
    }

    const wasAuthenticated = previousScope.startsWith("authenticated:");
    const local = wasAuthenticated
      ? { lastResetDate: today(), tasks: [] }
      : readAnonymousTodos({ lastResetDate: today(), tasks: [] });
    anonymousStateRef.current = null;
    api.todos
      .list()
      .then(async (remote) => {
        if (requestId !== requestIdRef.current || scopeRef.current !== scope)
          return;
        const remoteTasks = remote.map(mapApiTodo);
        const localOnly = findLocalTasksToUpload(local.tasks, remoteTasks);
        const uploadResults = await Promise.all(
          localOnly.map(async (task) => ({
            task,
            remote: await api.todos
              .create(task.text, task.id)
              .catch(() => null),
          })),
        );
        if (requestId !== requestIdRef.current || scopeRef.current !== scope)
          return;
        const uploadedTasks = uploadResults
          .filter((result) => result.remote)
          .map((result) => mapApiTodo(result.remote!));
        const failedTasks = uploadResults
          .filter((result) => !result.remote)
          .map((result) => result.task);
        const merged = mergeTasks(remoteTasks, uploadedTasks);
        writeAnonymousTodos({
          lastResetDate: local.lastResetDate,
          tasks: failedTasks,
        });
        anonymousStateRef.current = null;
        setState({
          lastResetDate: today(),
          tasks: merged.filter(
            (task) => !task.completed || local.lastResetDate === today(),
          ),
        });
      })
      .catch(() => undefined);
  }, [scope, status, user]);

  useEffect(() => {
    if (skipAnonymousPersistRef.current) {
      skipAnonymousPersistRef.current = false;
      return;
    }
    if (
      hasLoadedAnonymousState.current &&
      status === "anonymous" &&
      anonymousStateRef.current
    ) {
      writeAnonymousTodos(state);
      anonymousStateRef.current = state;
    }
  }, [state, status]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (state.lastResetDate !== today()) {
        setState((current) => ({
          lastResetDate: today(),
          tasks: current.tasks.filter((task) => !task.completed),
        }));
      }
    }, 60000);
    return () => window.clearInterval(interval);
  }, [state.lastResetDate]);

  const addTask = useCallback(
    (text: string) => {
      const content = text.trim();
      if (!content) return;
      const requestId = requestIdRef.current;
      const taskScope = scopeRef.current;
      const localTask: TodoItem = {
        id: `local-${Date.now()}`,
        text: content,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setState((current) => ({
        ...current,
        tasks: [localTask, ...current.tasks],
      }));
      if (status === "authenticated") {
        api.todos
          .create(content, localTask.id)
          .then((remote) => {
            if (
              requestId !== requestIdRef.current ||
              taskScope !== scopeRef.current
            )
              return;
            setState((current) => ({
              ...current,
              tasks: current.tasks.map((task) =>
                task.id === localTask.id ? mapApiTodo(remote) : task,
              ),
            }));
          })
          .catch(() => undefined);
      }
    },
    [status],
  );

  const toggleTask = useCallback(
    (id: string) => {
      const task = state.tasks.find((item) => item.id === id);
      if (!task) return;
      const nextCompleted = !task.completed;
      setState((current) => ({
        ...current,
        tasks: current.tasks.map((item) =>
          item.id === id
            ? {
                ...item,
                completed: nextCompleted,
                completedAt: nextCompleted
                  ? new Date().toISOString()
                  : undefined,
              }
            : item,
        ),
      }));
      if (status === "authenticated" && !id.startsWith("local-")) {
        void api.todos
          .update(id, { completed: nextCompleted })
          .catch(() => undefined);
      }
    },
    [state.tasks, status],
  );

  const deleteTask = useCallback(
    (id: string) => {
      setState((current) => ({
        ...current,
        tasks: current.tasks.filter((task) => task.id !== id),
      }));
      if (status === "authenticated" && !id.startsWith("local-"))
        api.todos.remove(id).catch(() => undefined);
    },
    [status],
  );

  const clearCompleted = useCallback(() => {
    const completed = state.tasks.filter(
      (task) => task.completed && !task.id.startsWith("local-"),
    );
    setState((current) => ({
      ...current,
      tasks: current.tasks.filter((task) => !task.completed),
    }));
    if (status === "authenticated")
      Promise.all(completed.map((task) => api.todos.remove(task.id))).catch(
        () => undefined,
      );
  }, [state.tasks, status]);

  return {
    tasks: state.tasks,
    lastResetDate: state.lastResetDate,
    addTask,
    toggleTask,
    deleteTask,
    clearCompleted,
  };
}
