import { ApiTodo, ApiWallpaper, ApiYoutubeTrack } from './apiClient';
import { LofiStation, TodoItem, Wallpaper } from '../types';

export function mapApiTodo(todo: ApiTodo): TodoItem {
  return {
    id: todo._id,
    clientId: todo.clientId,
    text: todo.content,
    completed: todo.completed,
    createdAt: todo.createdAt,
  };
}

export function mapApiWallpaper(wallpaper: ApiWallpaper): Wallpaper {
  return {
    id: wallpaper._id,
    title: wallpaper.label || 'Saved wallpaper',
    type: wallpaper.type === 'video' ? 'video' : 'image',
    url: wallpaper.url,
    category: 'custom',
  };
}

export function mapApiYoutubeTrack(track: ApiYoutubeTrack): LofiStation {
  return {
    id: track._id,
    name: track.title,
    channel: 'Saved track',
    videoId: track.videoId,
    category: 'chill',
    isLive: false,
  };
}
