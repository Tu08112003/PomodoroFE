export type WallpaperType = 'image' | 'video';

export interface Wallpaper {
  id: string;
  title: string;
  type: WallpaperType;
  url: string;
  thumbnail?: string;
  category: 'forest' | 'ocean' | 'mountain' | 'city' | 'anime' | 'custom';
}

export interface LofiStation {
  id: string;
  name: string;
  channel: string;
  videoId: string;
  playlistId?: string;
  isLive?: boolean;
  category: 'chill' | 'coffee' | 'synthwave' | 'study' | 'sleep';
}

export interface SoundTrack {
  id: string;
  name: string;
  icon: string; // Lucide icon name or emoji
  audioUrl: string;
  volume: number; // 0 to 1
  isPlaying: boolean;
  category: 'nature' | 'urban' | 'weather' | 'cozy';
}

export interface SoundPreset {
  id: string;
  name: string;
  icon: string;
  volumes: Record<string, number>; // trackId -> volume
}

export interface TodoItem {
  id: string;
  clientId?: string;
  text: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface DailyTodoState {
  lastResetDate: string; // YYYY-MM-DD
  tasks: TodoItem[];
}

export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export interface TimerSettings {
  workDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  soundEnabled: boolean;
}

export interface DimmerSettings {
  opacity: number; // 0.1 to 0.85
  blur: number; // 0 to 20px
}

export type ActivePanel = 'music' | 'mixer' | 'wallpaper' | 'todo' | 'settings' | null;
