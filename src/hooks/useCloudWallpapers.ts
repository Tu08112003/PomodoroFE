"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/apiClient";
import { mapApiWallpaper } from "../services/adapters";
import {
  readAnonymousWallpapers,
  writeAnonymousWallpapers,
} from "../services/storage";
import { Wallpaper } from "../types";

const isRemoteId = (id: string) => /^[a-f\d]{24}$/i.test(id);

export function useCloudWallpapers() {
  const { user, status } = useAuth();
  const [customWallpapers, setCustomWallpapers] = useState<Wallpaper[]>(() =>
    readAnonymousWallpapers(),
  );
  const scopeRef = useRef("loading");
  const requestIdRef = useRef(0);
  const skipAnonymousPersistRef = useRef(false);
  const pendingDeletesRef = useRef(new Set<string>());
  const scope =
    status === "authenticated" && user ? `authenticated:${user._id}` : status;

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    const previousScope = scopeRef.current;
    scopeRef.current = scope;
    skipAnonymousPersistRef.current =
      status === "anonymous" && previousScope.startsWith("authenticated:");
    const anonymousWallpapers =
      status === "authenticated" && previousScope === "anonymous"
        ? readAnonymousWallpapers()
        : status === "anonymous"
          ? readAnonymousWallpapers()
          : [];
    pendingDeletesRef.current.clear();
    setCustomWallpapers(anonymousWallpapers);

    if (status !== "authenticated" || !user) return;
    api.wallpapers
      .list()
      .then(async (items) => {
        if (requestId !== requestIdRef.current || scopeRef.current !== scope)
          return;
        const remote = items.map(mapApiWallpaper);
        const remoteUrls = new Set(remote.map((item) => item.url));
        const localOnly = anonymousWallpapers.filter(
          (item) => !remoteUrls.has(item.url),
        );
        const uploadResults = await Promise.all(
          localOnly.map(async (item) => ({
            item,
            remote: await api.wallpapers
              .create({
                url: item.url,
                type: item.type,
                label: item.title,
              })
              .catch(() => null),
          })),
        );
        if (requestId !== requestIdRef.current || scopeRef.current !== scope)
          return;
        const uploaded = uploadResults
          .filter((result) => result.remote)
          .map((result) => mapApiWallpaper(result.remote!));
        const failed = uploadResults
          .filter((result) => !result.remote)
          .map((result) => result.item);
        setCustomWallpapers([...uploaded, ...remote]);
        writeAnonymousWallpapers(failed);
      })
      .catch(() => undefined);
  }, [scope, status, user]);

  useEffect(() => {
    if (status === "anonymous" && !skipAnonymousPersistRef.current) {
      writeAnonymousWallpapers(customWallpapers);
    }
    skipAnonymousPersistRef.current = false;
  }, [customWallpapers, status]);

  const saveWallpaper = async (wallpaper: Wallpaper) => {
    const requestId = requestIdRef.current;
    const localWallpaper = {
      ...wallpaper,
      id: wallpaper.id || `local-${Date.now()}`,
    };
    pendingDeletesRef.current.delete(wallpaper.url);
    setCustomWallpapers((items) => [
      localWallpaper,
      ...items.filter((item) => item.url !== localWallpaper.url),
    ]);
    if (status !== "authenticated") return localWallpaper;
    try {
      const saved = await api.wallpapers.create({
        url: wallpaper.url,
        type: wallpaper.type,
        label: wallpaper.title,
      });
      const mapped = mapApiWallpaper(saved);
      if (
        requestId !== requestIdRef.current ||
        scopeRef.current !== scope ||
        pendingDeletesRef.current.has(mapped.url)
      ) {
        if (
          isRemoteId(mapped.id) &&
          pendingDeletesRef.current.has(mapped.url)
        ) {
          void api.wallpapers.remove(mapped.id).catch(() => undefined);
        }
        return localWallpaper;
      }
      setCustomWallpapers((items) => [
        mapped,
        ...items.filter((item) => item.url !== mapped.url),
      ]);
      return mapped;
    } catch {
      return localWallpaper;
    }
  };

  const deleteWallpaper = useCallback(
    (wallpaper: Wallpaper) => {
      ++requestIdRef.current;
      pendingDeletesRef.current.add(wallpaper.url);
      setCustomWallpapers((items) =>
        items.filter(
          (item) => item.id !== wallpaper.id && item.url !== wallpaper.url,
        ),
      );
      if (status === "authenticated" && isRemoteId(wallpaper.id)) {
        void api.wallpapers.remove(wallpaper.id).catch(() => undefined);
      }
    },
    [status],
  );

  return { customWallpapers, saveWallpaper, deleteWallpaper };
}
