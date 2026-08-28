import { useState, useEffect } from 'react';
import { TodoItem, DailyTodoState } from '../types';

const STORAGE_KEY = 'vibespace_daily_todo_v1';

export function useDailyStorage() {
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const [todoState, setTodoState] = useState<DailyTodoState>(() => ({
    lastResetDate: getTodayString(),
    tasks: [
      {
        id: '1',
        text: 'Tập trung làm việc 4 phiên Pomodoro ( Deep Work )',
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        text: 'Uống 2 lít nước & giãn cơ nhẹ nhàng',
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ],
  }));

  // Load from LocalStorage on mount
  useEffect(() => {
    const todayStr = getTodayString();
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: DailyTodoState = JSON.parse(saved);
        if (parsed.lastResetDate !== todayStr) {
          const pendingTasks = parsed.tasks.filter((t) => !t.completed);
          setTodoState({
            lastResetDate: todayStr,
            tasks: pendingTasks,
          });
        } else {
          setTodoState(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to parse LocalStorage todo state:', e);
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todoState));
    } catch (e) {
      console.error('Failed to save todo state to LocalStorage:', e);
    }
  }, [todoState]);

  // Daily reset check every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const todayStr = getTodayString();
      if (todoState.lastResetDate !== todayStr) {
        setTodoState((prev) => ({
          lastResetDate: todayStr,
          tasks: prev.tasks.filter((t) => !t.completed),
        }));
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [todoState.lastResetDate]);

  const addTask = (text: string) => {
    if (!text.trim()) return;
    const newTask: TodoItem = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodoState((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));
  };

  const toggleTask = (id: string) => {
    setTodoState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? new Date().toISOString() : undefined,
            }
          : t
      ),
    }));
  };

  const deleteTask = (id: string) => {
    setTodoState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
  };

  const clearCompleted = () => {
    setTodoState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => !t.completed),
    }));
  };

  return {
    tasks: todoState.tasks,
    lastResetDate: todoState.lastResetDate,
    addTask,
    toggleTask,
    deleteTask,
    clearCompleted,
  };
}
