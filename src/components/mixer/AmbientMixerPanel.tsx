import React from 'react';
import {
  CloudRain,
  CloudLightning,
  Flame,
  Wind,
  Waves,
  Coffee,
  Bird,
  Moon,
  Keyboard,
  Volume2,
  VolumeX,
  Sliders,
  X,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { SoundTrack } from '../../types';
import { SOUND_PRESETS } from '../../data/presets';
import { useLanguage } from '../../context/LanguageContext';

interface AmbientMixerPanelProps {
  tracks: SoundTrack[];
  masterVolume: number;
  onSetMasterVolume: (vol: number) => void;
  isMasterMuted: boolean;
  onSetIsMasterMuted: (muted: boolean) => void;
  onSetTrackVolume: (id: string, vol: number) => void;
  onToggleTrack: (id: string) => void;
  onApplyPreset: (volumes: Record<string, number>) => void;
  onStopAll: () => void;
  onClose: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  CloudRain,
  CloudLightning,
  Flame,
  Wind,
  Waves,
  Coffee,
  Bird,
  Moon,
  Keyboard,
};

export const AmbientMixerPanel: React.FC<AmbientMixerPanelProps> = ({
  tracks,
  masterVolume,
  onSetMasterVolume,
  isMasterMuted,
  onSetIsMasterMuted,
  onSetTrackVolume,
  onToggleTrack,
  onApplyPreset,
  onStopAll,
  onClose,
}) => {
  const { t } = useLanguage();

  const getTranslatedTrackName = (id: string, fallback: string) => {
    switch (id) {
      case 'rain': return t.rainSound;
      case 'thunder': return t.thunderSound;
      case 'campfire': return t.campfireSound;
      case 'wind': return t.windSound;
      case 'waves': return t.wavesSound;
      case 'birds': return t.birdsSound;
      case 'crickets': return t.cricketsSound;
      case 'stream': return t.cafeSound;
      default: return fallback;
    }
  };

  const getTranslatedPresetName = (id: string, fallback: string) => {
    switch (id) {
      case 'cozy-rain': return t.presetCozyRain;
      case 'night-camping': return t.presetNightCampfire;
      case 'beach-cafe': return t.presetBeachCafe;
      default: return fallback;
    }
  };

  const masterPercent = isMasterMuted ? 0 : Math.round(masterVolume * 100);

  return (
    <div className="w-80 sm:w-96 p-5 rounded-2xl bg-slate-900/85 backdrop-blur-2xl border border-white/15 shadow-2xl text-slate-100 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-sky-400" />
          <h3 className="font-semibold text-sm tracking-wide text-white">{t.mixerTitle}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Master Volume & Preset Control Bar */}
      <div className="flex items-center justify-between bg-white/5 rounded-xl p-3 border border-white/5">
        <div className="flex items-center gap-2.5 flex-1 pr-4">
          <button
            onClick={() => onSetIsMasterMuted(!isMasterMuted)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            {isMasterMuted || masterVolume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-sky-400" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMasterMuted ? 0 : masterVolume}
            onChange={(e) => {
              onSetIsMasterMuted(false);
              onSetMasterVolume(parseFloat(e.target.value));
            }}
            style={{
              background: `linear-gradient(to right, #38bdf8 0%, #0284c7 ${masterPercent}%, rgba(30, 41, 59, 0.8) ${masterPercent}%, rgba(30, 41, 59, 0.8) 100%)`,
            }}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer transition-all shadow-inner"
          />
        </div>

        <button
          onClick={onStopAll}
          title={t.stopAll}
          className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[11px] font-medium border border-red-500/30 transition-colors flex items-center gap-1 shrink-0"
        >
          <RotateCcw className="w-3 h-3" />
          {t.stopAll}
        </button>
      </div>

      {/* Quick Sound Presets */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-sky-400" /> {t.vibePresets}
        </span>
        <div className="grid grid-cols-3 gap-2">
          {SOUND_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onApplyPreset(preset.volumes)}
              className="px-2 py-2 rounded-xl bg-slate-950/40 hover:bg-sky-500/20 border border-white/5 hover:border-sky-400/40 text-[11px] font-medium text-slate-300 hover:text-white transition-all text-center truncate"
            >
              {getTranslatedPresetName(preset.id, preset.name)}
            </button>
          ))}
        </div>
      </div>

      {/* Audio Tracks Grid */}
      <div className="grid grid-cols-1 gap-2.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
        {tracks.map((track) => {
          const IconComponent = ICON_MAP[track.icon] || Sliders;
          const isActive = track.isPlaying && track.volume > 0;
          const trackName = getTranslatedTrackName(track.id, track.name);
          const trackPercent = Math.round(track.volume * 100);

          return (
            <div
              key={track.id}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                isActive
                  ? 'bg-sky-950/40 border-sky-400/40 text-white shadow-sm'
                  : 'bg-slate-950/30 border-white/5 text-slate-400 hover:bg-white/5'
              }`}
            >
              <button
                onClick={() => onToggleTrack(track.id)}
                className="flex items-center gap-2.5 flex-1 text-left min-w-0 pr-2"
              >
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    isActive ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className={`text-xs font-medium truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                  {trackName}
                </span>
              </button>

              <div className="flex items-center gap-2.5 w-32">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={track.volume}
                  onChange={(e) => onSetTrackVolume(track.id, parseFloat(e.target.value))}
                  style={{
                    background: isActive
                      ? `linear-gradient(to right, #38bdf8 0%, #0284c7 ${trackPercent}%, rgba(30, 41, 59, 0.8) ${trackPercent}%, rgba(30, 41, 59, 0.8) 100%)`
                      : `linear-gradient(to right, #64748b 0%, #475569 ${trackPercent}%, rgba(30, 41, 59, 0.8) ${trackPercent}%, rgba(30, 41, 59, 0.8) 100%)`,
                  }}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer transition-all shadow-inner"
                />
                <span className="text-[10px] font-mono text-sky-300 font-semibold w-7 text-right">
                  {trackPercent}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
