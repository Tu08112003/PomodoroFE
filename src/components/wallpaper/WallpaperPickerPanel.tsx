import React, { useState } from 'react';
import { Image as ImageIcon, Video, X, Link as LinkIcon, Check, Trash2 } from 'lucide-react';
import { INITIAL_WALLPAPERS } from '../../data/presets';
import { Wallpaper, DimmerSettings } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface WallpaperPickerPanelProps {
  wallpapers?: Wallpaper[];
  onSaveWallpaper?: (wp: Wallpaper) => void;
  onDeleteWallpaper?: (wp: Wallpaper) => void;
  currentWallpaper: Wallpaper;
  onSelectWallpaper: (wp: Wallpaper) => void;
  dimmer: DimmerSettings;
  onUpdateDimmer: (dimmer: Partial<DimmerSettings>) => void;
  onClose: () => void;
}

export const WallpaperPickerPanel: React.FC<WallpaperPickerPanelProps> = ({
  currentWallpaper,
  onSelectWallpaper,
  dimmer,
  onUpdateDimmer,
  onClose,
  wallpapers: savedWallpapers = [],
  onSaveWallpaper,
  onDeleteWallpaper,
}) => {
  const { t } = useLanguage();
  const [wallpapers] = useState<Wallpaper[]>(INITIAL_WALLPAPERS);
  const [customUrl, setCustomUrl] = useState('');
  const [customType, setCustomType] = useState<'image' | 'video'>('image');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    const customWp: Wallpaper = {
      id: `custom-${Date.now()}`,
      title: 'Custom Wallpaper',
      type: customType,
      url: customUrl.trim(),
      category: 'custom',
    };
    onSelectWallpaper(customWp);
    onSaveWallpaper?.(customWp);
    setCustomUrl('');
  };

  // Calculate percentage fill for Dimmer Opacity (0.1 min to 0.85 max)
  const opacityPercent = Math.round(((dimmer.opacity - 0.1) / (0.85 - 0.1)) * 100);
  // Calculate percentage fill for Blur (0px min to 20px max)
  const blurPercent = Math.round((dimmer.blur / 20) * 100);

  return (
    <div className="w-80 sm:w-96 p-5 rounded-2xl bg-slate-900/85 backdrop-blur-2xl border border-white/15 shadow-2xl text-slate-100 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-sm tracking-wide text-white">{t.wallpaperTitle}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Dimmer & Blur Controls */}
      <div className="bg-white/5 rounded-xl p-3.5 border border-white/5 flex flex-col gap-3.5">
        {/* Dimmer Opacity Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">{t.dimmerOpacity}</span>
            <span className="text-xs font-mono font-semibold text-indigo-300">
              {Math.round(dimmer.opacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="0.85"
            step="0.01"
            value={dimmer.opacity}
            onChange={(e) => onUpdateDimmer({ opacity: parseFloat(e.target.value) })}
            style={{
              background: `linear-gradient(to right, #818cf8 0%, #4f46e5 ${opacityPercent}%, rgba(30, 41, 59, 0.8) ${opacityPercent}%, rgba(30, 41, 59, 0.8) 100%)`,
            }}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer transition-all shadow-inner"
          />
        </div>

        {/* Backdrop Blur Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">{t.dimmerBlur}</span>
            <span className="text-xs font-mono font-semibold text-indigo-300">{dimmer.blur}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={dimmer.blur}
            onChange={(e) => onUpdateDimmer({ blur: parseInt(e.target.value) })}
            style={{
              background: `linear-gradient(to right, #818cf8 0%, #4f46e5 ${blurPercent}%, rgba(30, 41, 59, 0.8) ${blurPercent}%, rgba(30, 41, 59, 0.8) 100%)`,
            }}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Custom Wallpaper Form */}
      <form onSubmit={handleCustomSubmit} className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">{t.customWallpaperSection}</span>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder={t.customUrlPlaceholder}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>
          <button
            type="button"
            onClick={() => setCustomType(customType === 'image' ? 'video' : 'image')}
            className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors flex items-center gap-1 shrink-0"
          >
            {customType === 'video' ? <Video className="w-3.5 h-3.5 text-indigo-400" /> : <ImageIcon className="w-3.5 h-3.5 text-sky-400" />}
            {customType === 'video' ? t.videoType : t.imageType}
          </button>
          <button
            type="submit"
            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shrink-0"
          >
            {t.saveButton}
          </button>
        </div>
      </form>

      {/* Custom Gallery */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">{t.customGallery}</span>
        <div className="grid grid-cols-2 gap-2.5 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
          {savedWallpapers.map((wp) => {
            const isSelected = currentWallpaper.id === wp.id;
            return (
              <div key={wp.id} className="relative group aspect-video rounded-xl overflow-hidden border border-white/10">
                <button onClick={() => onSelectWallpaper(wp)} className="w-full h-full text-left">
                  <img src={wp.url} alt={wp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[10px] font-medium text-white truncate pr-6">{wp.title}</span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1.5 left-1.5 p-1 rounded-full bg-indigo-600 text-white shadow-md">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
                <button
                  onClick={() => {
                    if (isSelected) onSelectWallpaper(wallpapers[0]);
                    onDeleteWallpaper?.(wp);
                  }}
                  title={t.deleteWallpaper}
                  aria-label={t.deleteWallpaper}
                  className="absolute top-1.5 right-1.5 rounded-lg bg-slate-950/70 p-1.5 text-slate-200 hover:bg-red-500/80 hover:text-white"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Default Gallery */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">{t.curatedGallery}</span>
        <div className="grid grid-cols-2 gap-2.5 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
          {wallpapers.map((wp) => {
            const isSelected = currentWallpaper.id === wp.id;
            return (
              <button
                key={wp.id}
                onClick={() => onSelectWallpaper(wp)}
                className={`relative group aspect-video rounded-xl overflow-hidden border transition-all ${
                  isSelected ? 'border-indigo-400 ring-2 ring-indigo-400/40 shadow-lg' : 'border-white/10 hover:border-white/30'
                }`}
              >
                <img src={wp.url} alt={wp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2">
                  <span className="text-[10px] font-medium text-white truncate">{wp.title}</span>
                </div>
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-indigo-600 text-white shadow-md">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
