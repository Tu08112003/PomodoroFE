import { LofiStation, SoundTrack, SoundPreset, Wallpaper } from '../types';

export const INITIAL_LOFI_STATIONS: LofiStation[] = [
  {
    id: 'study-session',
    name: '1 A.M Study Session - Cozy Lofi',
    channel: 'Lofi Girl',
    videoId: 'lTRiuFIWV54',
    isLive: false,
    category: 'study'
  },
  {
    id: 'chillhop-essentials',
    name: 'Chillhop Essentials - Relax Beats',
    channel: 'Chillhop Music',
    videoId: '7NOSDKb0HlU',
    isLive: false,
    category: 'chill'
  },
  {
    id: 'code-fi',
    name: 'Code-Fi - Lofi Beats to Code & Focus',
    channel: 'The AMP Channel',
    videoId: 'f02mOEt11OQ',
    isLive: false,
    category: 'synthwave'
  }
];

export const INITIAL_WALLPAPERS: Wallpaper[] = [
  {
    id: 'pine-forest',
    title: 'Misty Pine Forest',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80',
    category: 'forest'
  },
  {
    id: 'ocean-sunset',
    title: 'Ocean Sunset Horizon',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
    category: 'ocean'
  },
  {
    id: 'snowy-mountain',
    title: 'Snowy Mountain Peak',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80',
    category: 'mountain'
  },
  {
    id: 'tokyo-night',
    title: 'Tokyo Cyberpunk Rain',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1920&q=80',
    category: 'city'
  },
  {
    id: 'lofi-room-animated',
    title: 'Cozy Lofi Study Room',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1920&q=80',
    category: 'anime'
  },
  {
    id: 'starry-sky',
    title: 'Milky Way & Starry Night',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80',
    category: 'mountain'
  }
];

export const INITIAL_SOUND_TRACKS: SoundTrack[] = [
  {
    id: 'rain',
    name: 'Mưa Rào',
    icon: 'CloudRain',
    audioUrl: '/audio/rain.mp3',
    volume: 0,
    isPlaying: false,
    category: 'weather'
  },
  {
    id: 'thunder',
    name: 'Sấm Chớp Mờ',
    icon: 'CloudLightning',
    audioUrl: '/audio/thunder.mp3',
    volume: 0,
    isPlaying: false,
    category: 'weather'
  },
  {
    id: 'campfire',
    name: 'Lửa Trại',
    icon: 'Flame',
    audioUrl: '/audio/campfire.mp3',
    volume: 0,
    isPlaying: false,
    category: 'nature'
  },
  {
    id: 'wind',
    name: 'Gió Rừng',
    icon: 'Wind',
    audioUrl: '/audio/wind.mp3',
    volume: 0,
    isPlaying: false,
    category: 'weather'
  },
  {
    id: 'waves',
    name: 'Sóng Biển',
    icon: 'Waves',
    audioUrl: '/audio/waves.mp3',
    volume: 0,
    isPlaying: false,
    category: 'nature'
  },
  {
    id: 'birds',
    name: 'Chim Hót',
    icon: 'Bird',
    audioUrl: '/audio/birds.mp3',
    volume: 0,
    isPlaying: false,
    category: 'nature'
  },
  {
    id: 'crickets',
    name: 'Đêm Rừng / Dế Mèn',
    icon: 'Moon',
    audioUrl: '/audio/crickets.mp3',
    volume: 0,
    isPlaying: false,
    category: 'cozy'
  },
  {
    id: 'stream',
    name: 'Dòng Suối Mát',
    icon: 'Coffee',
    audioUrl: '/audio/stream.mp3',
    volume: 0,
    isPlaying: false,
    category: 'urban'
  }
];

export const SOUND_PRESETS: SoundPreset[] = [
  {
    id: 'cozy-rain',
    name: 'Mưa Ấm Cúng',
    icon: 'CloudRain',
    volumes: { rain: 0.7, thunder: 0.4, campfire: 0.5 }
  },
  {
    id: 'night-camping',
    name: 'Đêm Cắm Trại',
    icon: 'Flame',
    volumes: { campfire: 0.8, crickets: 0.6, wind: 0.4 }
  },
  {
    id: 'beach-cafe',
    name: 'Bờ Biển & Suối',
    icon: 'Coffee',
    volumes: { stream: 0.6, waves: 0.5, birds: 0.3 }
  }
];
