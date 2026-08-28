import { DailyTodoState, Wallpaper } from '../types';

export const ANONYMOUS_TODO_KEY = 'vibespace_daily_todo_v1';
export const ANONYMOUS_WALLPAPER_KEY = 'vibespace_custom_wallpapers_v1';
export const ANONYMOUS_STATION_KEY = 'vibespace_saved_stations_v1';

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // LocalStorage is optional for anonymous mode.
  }
}

export function readAnonymousTodos(fallback: DailyTodoState): DailyTodoState {
  return readJson(ANONYMOUS_TODO_KEY, fallback);
}

export function writeAnonymousTodos(value: DailyTodoState) {
  writeJson(ANONYMOUS_TODO_KEY, value);
}

export function clearAnonymousTodos() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(ANONYMOUS_TODO_KEY);
  } catch {
    // LocalStorage is optional for anonymous mode.
  }
}

export function readAnonymousWallpapers(): Wallpaper[] {
  return readJson<Wallpaper[]>(ANONYMOUS_WALLPAPER_KEY, []);
}

export function writeAnonymousWallpapers(value: Wallpaper[]) {
  writeJson(ANONYMOUS_WALLPAPER_KEY, value);
}

export function clearAnonymousWallpapers() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(ANONYMOUS_WALLPAPER_KEY);
  } catch {
    // LocalStorage is optional for anonymous mode.
  }
}

export function clearAnonymousStations() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(ANONYMOUS_STATION_KEY);
  } catch {
    // LocalStorage is optional for anonymous mode.
  }
}
