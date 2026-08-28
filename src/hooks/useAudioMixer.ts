import { useState, useEffect, useRef } from "react";
import { INITIAL_SOUND_TRACKS } from "../data/presets";
import { SoundTrack } from "../types";

const STORAGE_KEY = "vibespace_sound_mixer_v2";

export function useAudioMixer() {
  const audioMapRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const [tracks, setTracks] = useState<SoundTrack[]>(INITIAL_SOUND_TRACKS);
  const [masterVolume, setMasterVolume] = useState<number>(1);
  const [isMasterMuted, setIsMasterMuted] = useState<boolean>(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: SoundTrack[] = JSON.parse(saved);
        setTracks(
          INITIAL_SOUND_TRACKS.map((initTrack) => {
            const found = parsed.find((p) => p.id === initTrack.id);
            return found
              ? {
                  ...initTrack,
                  volume: found.volume,
                  isPlaying: found.isPlaying,
                }
              : initTrack;
          }),
        );
      }
    } catch (e) {
      console.error("Failed to load sound mixer state:", e);
    }
  }, []);

  // Initialize HTML5 Audio elements
  useEffect(() => {
    tracks.forEach((track) => {
      if (!audioMapRef.current.has(track.id)) {
        const audio = new Audio(track.audioUrl);
        audio.loop = true;
        audio.preload = "auto";
        audioMapRef.current.set(track.id, audio);
      }
    });

    return () => {
      audioMapRef.current.forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
      audioMapRef.current.clear();
    };
  }, []);

  // Sync Audio playback & volumes
  useEffect(() => {
    tracks.forEach((track) => {
      let audio = audioMapRef.current.get(track.id);
      if (!audio) {
        audio = new Audio(track.audioUrl);
        audio.loop = true;
        audio.preload = "auto";
        audioMapRef.current.set(track.id, audio);
      }

      if (
        typeof window !== "undefined" &&
        audio.src !== window.location.origin + track.audioUrl &&
        !audio.src.endsWith(track.audioUrl)
      ) {
        audio.src = track.audioUrl;
      }

      const effectiveVol = isMasterMuted
        ? 0
        : Math.max(0, Math.min(1, track.volume * masterVolume));
      audio.volume = effectiveVol;

      if (track.isPlaying && effectiveVol > 0) {
        if (audio.paused) {
          audio.play().catch(() => {});
        }
      } else {
        if (!audio.paused) {
          audio.pause();
        }
      }
    });

    try {
      const toSave = tracks.map((t) => ({
        id: t.id,
        volume: t.volume,
        isPlaying: t.isPlaying,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.error("Failed to save sound mixer state:", e);
    }
  }, [tracks, masterVolume, isMasterMuted]);

  const unlockAudio = () => {
    tracks.forEach((track) => {
      if (track.isPlaying && track.volume > 0) {
        const audio = audioMapRef.current.get(track.id);
        if (audio && audio.paused) {
          audio.play().catch(() => {});
        }
      }
    });
  };

  const setTrackVolume = (id: string, volume: number) => {
    unlockAudio();
    setTracks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              volume,
              isPlaying: volume > 0,
            }
          : t,
      ),
    );
  };

  const toggleTrack = (id: string) => {
    unlockAudio();
    setTracks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextIsPlaying = !t.isPlaying;
          const nextVolume = nextIsPlaying
            ? t.volume > 0
              ? t.volume
              : 0.6
            : t.volume;
          return {
            ...t,
            isPlaying: nextIsPlaying,
            volume: nextVolume,
          };
        }
        return t;
      }),
    );
  };

  const applyPreset = (presetVolumes: Record<string, number>) => {
    unlockAudio();
    setTracks((prev) =>
      prev.map((t) => {
        const targetVol = presetVolumes[t.id] ?? 0;
        return {
          ...t,
          volume: targetVol,
          isPlaying: targetVol > 0,
        };
      }),
    );
  };

  const stopAll = () => {
    audioMapRef.current.forEach((audio) => audio.pause());
    setTracks((prev) =>
      prev.map((t) => ({
        ...t,
        isPlaying: false,
      })),
    );
  };

  return {
    tracks,
    masterVolume,
    setMasterVolume,
    isMasterMuted,
    setIsMasterMuted,
    setTrackVolume,
    toggleTrack,
    applyPreset,
    stopAll,
  };
}
