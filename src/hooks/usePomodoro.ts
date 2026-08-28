import { useState, useEffect, useRef } from 'react';
import { TimerMode, TimerSettings } from '../types';

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  soundEnabled: true,
};

export function usePomodoro() {
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [mode, setMode] = useState<TimerMode>('work');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);

  const getDurationForMode = (m: TimerMode, s: TimerSettings) => {
    switch (m) {
      case 'work':
        return s.workDuration * 60;
      case 'shortBreak':
        return s.shortBreakDuration * 60;
      case 'longBreak':
        return s.longBreakDuration * 60;
    }
  };

  const [timeLeft, setTimeLeft] = useState<number>(() => getDurationForMode('work', DEFAULT_SETTINGS));

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Soft chime sound alert
    audioRef.current = new Audio('https://cdn.freesound.org/previews/411/411089_5121236-lq.mp3');
  }, []);

  const totalTime = getDurationForMode(mode, settings);
  const progressPercentage = Math.min(100, Math.max(0, ((totalTime - timeLeft) / totalTime) * 100));

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (settings.soundEnabled && audioRef.current) {
        audioRef.current.play().catch(() => {});
      }

      if (mode === 'work') {
        setCompletedSessions((prev) => prev + 1);
        // Switch to Short Break or Long Break
        if ((completedSessions + 1) % 4 === 0) {
          switchMode('longBreak');
        } else {
          switchMode('shortBreak');
        }
      } else {
        switchMode('work');
      }
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft, mode, settings, completedSessions]);

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(getDurationForMode(newMode, settings));
  };

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getDurationForMode(mode, settings));
  };

  const updateSettings = (newSettings: Partial<TimerSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    if (!isRunning) {
      setTimeLeft(getDurationForMode(mode, updated));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    mode,
    timeLeft,
    totalTime,
    isRunning,
    completedSessions,
    progressPercentage,
    formattedTime: formatTime(timeLeft),
    settings,
    switchMode,
    toggleTimer,
    resetTimer,
    updateSettings,
  };
}
