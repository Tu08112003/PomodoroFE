import React from 'react';
import { Radio, Sliders, Image as ImageIcon, CheckSquare, Maximize2 } from 'lucide-react';
import { ActivePanel } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface NavigationDockProps {
  activePanel: ActivePanel;
  onTogglePanel: (panel: ActivePanel) => void;
  isZenMode: boolean;
  onToggleZenMode: () => void;
  soundTrackActiveCount: number;
  todoPendingCount: number;
}

export const NavigationDock: React.FC<NavigationDockProps> = ({
  activePanel,
  onTogglePanel,
  isZenMode,
  onToggleZenMode,
  soundTrackActiveCount,
  todoPendingCount,
}) => {
  const { t } = useLanguage();

  if (isZenMode) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="flex items-center gap-2 p-2 rounded-full bg-slate-900/80 backdrop-blur-2xl border border-white/15 shadow-2xl shadow-slate-950/80">
        {/* YouTube Lofi Player Icon */}
        <button
          onClick={() => onTogglePanel(activePanel === 'music' ? null : 'music')}
          title={t.musicDock}
          className={`relative p-3 rounded-full transition-all duration-300 ${
            activePanel === 'music'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30 scale-105'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Radio className="w-5 h-5" />
          {activePanel === 'music' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white shadow-glow" />
          )}
        </button>

        {/* Ambient White Noise Mixer Icon */}
        <button
          onClick={() => onTogglePanel(activePanel === 'mixer' ? null : 'mixer')}
          title={t.mixerDock}
          className={`relative p-3 rounded-full transition-all duration-300 ${
            activePanel === 'mixer'
              ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/30 scale-105'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Sliders className="w-5 h-5" />
          {soundTrackActiveCount > 0 && activePanel !== 'mixer' && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          )}
          {activePanel === 'mixer' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white shadow-glow" />
          )}
        </button>

        {/* Wallpaper Studio Icon */}
        <button
          onClick={() => onTogglePanel(activePanel === 'wallpaper' ? null : 'wallpaper')}
          title={t.wallpaperDock}
          className={`relative p-3 rounded-full transition-all duration-300 ${
            activePanel === 'wallpaper'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <ImageIcon className="w-5 h-5" />
          {activePanel === 'wallpaper' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white shadow-glow" />
          )}
        </button>

        {/* Daily Todo List Icon */}
        <button
          onClick={() => onTogglePanel(activePanel === 'todo' ? null : 'todo')}
          title={t.todoDock}
          className={`relative p-3 rounded-full transition-all duration-300 ${
            activePanel === 'todo'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <CheckSquare className="w-5 h-5" />
          {todoPendingCount > 0 && activePanel !== 'todo' && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950">
              {todoPendingCount}
            </span>
          )}
          {activePanel === 'todo' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white shadow-glow" />
          )}
        </button>

        <div className="w-px h-6 bg-white/15 my-auto mx-1" />

        {/* Zen Focus Mode Button */}
        <button
          onClick={onToggleZenMode}
          title={t.zenDock}
          className="p-3 rounded-full text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 transition-all duration-200"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
