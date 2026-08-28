'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/apiClient';
import { mapApiYoutubeTrack } from '../services/adapters';
import { clearAnonymousStations } from '../services/storage';
import { LofiStation } from '../types';

export function useCloudStations() {
  const { user, status } = useAuth();
  const [savedStations, setSavedStations] = useState<LofiStation[]>([]);
  const scopeRef = useRef('loading');
  const requestIdRef = useRef(0);
  const pendingDeletesRef = useRef(new Set<string>());
  const scope = status === 'authenticated' && user ? `authenticated:${user._id}` : status;

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    scopeRef.current = scope;
    pendingDeletesRef.current.clear();
    setSavedStations([]);

    if (status !== 'authenticated' || !user) {
      clearAnonymousStations();
      return;
    }

    api.youtubeTracks.list().then((items) => {
      if (requestId !== requestIdRef.current || scopeRef.current !== scope) return;
      setSavedStations(items.map(mapApiYoutubeTrack));
    }).catch(() => undefined);
  }, [scope, status, user]);

  const saveStation = async (station: LofiStation, url: string) => {
    const requestId = requestIdRef.current;
    const localStation = { ...station, id: station.id || `local-${Date.now()}` };
    pendingDeletesRef.current.delete(station.videoId);
    setSavedStations((items) => [localStation, ...items.filter((item) => item.videoId !== localStation.videoId)]);

    if (status !== 'authenticated') return localStation;

    try {
      const saved = await api.youtubeTracks.create({ url, videoId: station.videoId, title: station.name });
      const mapped = mapApiYoutubeTrack(saved);
      if (requestId !== requestIdRef.current || scopeRef.current !== scope || pendingDeletesRef.current.has(mapped.videoId)) {
        if (/^[a-f\d]{24}$/i.test(mapped.id)) void api.youtubeTracks.remove(mapped.id).catch(() => undefined);
        return localStation;
      }
      setSavedStations((items) => [mapped, ...items.filter((item) => item.videoId !== mapped.videoId)]);
      return mapped;
    } catch {
      return localStation;
    }
  };

  const deleteStation = useCallback((station: LofiStation) => {
    ++requestIdRef.current;
    pendingDeletesRef.current.add(station.videoId);
    setSavedStations((items) => items.filter((item) => item.id !== station.id && item.videoId !== station.videoId));
    if (status === 'authenticated' && /^[a-f\d]{24}$/i.test(station.id)) {
      void api.youtubeTracks.remove(station.id).catch(() => undefined);
    }
  }, [status]);

  return { savedStations, saveStation, deleteStation };
}
