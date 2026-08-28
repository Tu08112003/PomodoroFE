import React, { useState } from 'react';
import { Radio, Volume2, VolumeX, Link as LinkIcon, Play, X, ExternalLink, Trash2 } from 'lucide-react';
import { INITIAL_LOFI_STATIONS } from '../../data/presets';
import { LofiStation } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface YouTubePlayerPanelProps {
  onClose: () => void;
  savedStations?: LofiStation[];
  onSaveStation?: (station: LofiStation, url: string) => void;
  onDeleteStation?: (station: LofiStation) => void;
}

export const YouTubePlayerPanel: React.FC<YouTubePlayerPanelProps> = ({
  onClose,
  savedStations = [],
  onSaveStation,
  onDeleteStation,
}) => {
  const { t } = useLanguage();
  const [stations] = useState<LofiStation[]>(INITIAL_LOFI_STATIONS);
  const [currentStation, setCurrentStation] = useState<LofiStation>(INITIAL_LOFI_STATIONS[0]);
  const [customInput, setCustomInput] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract YouTube video ID from various URL formats
  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const extractedId = extractVideoId(customInput.trim());
    if (extractedId) {
      const customStation: LofiStation = {
        id: `custom-${Date.now()}`,
        name: 'Custom YouTube Video',
        channel: 'User Link',
        videoId: extractedId,
        isLive: false,
        category: 'chill',
      };
      setCurrentStation(customStation);
      onSaveStation?.(customStation, customInput.trim());
      setCustomInput('');
      setIsPlaying(true);
      setIsMuted(false);
    } else {
      alert(t.invalidYoutubeUrl);
    }
  };

  const handleStationSelect = (st: LofiStation) => {
    setCurrentStation(st);
    setIsPlaying(true);
    setIsMuted(false);
  };

  const renderStationList = (stationList: LofiStation[], canDelete = false) => (
    <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
      {stationList.map((st) => {
        const isSelected = currentStation.id === st.id;
        return (
          <div
            key={st.id}
            className={`flex items-center rounded-xl border transition-all duration-200 ${
              isSelected
                ? 'bg-violet-600/30 border-violet-400/50 text-white font-medium shadow-md'
                : 'bg-slate-950/30 border-white/5 text-slate-300'
            }`}
          >
            <button
              onClick={() => handleStationSelect(st)}
              className="flex min-w-0 flex-1 items-center justify-between p-2.5 text-left hover:text-white"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Play className={`w-3.5 h-3.5 ${isSelected ? 'text-violet-400 fill-current' : 'text-slate-500'}`} />
                <span className="text-xs truncate">{st.name}</span>
              </div>
              {st.isLive ? (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                  Live
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  Mix
                </span>
              )}
            </button>
            {canDelete && (
              <button
                onClick={() => {
                  if (isSelected) {
                    setCurrentStation(stations[0]);
                    setIsPlaying(false);
                    setIsMuted(false);
                  }
                  onDeleteStation?.(st);
                }}
                title={t.featuredStations.deleteStation}
                aria-label={t.featuredStations.deleteStation}
                className="mr-1.5 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-red-500/15 hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="w-80 sm:w-96 p-5 rounded-2xl bg-slate-900/90 backdrop-blur-2xl border border-white/15 shadow-2xl text-slate-100 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-violet-400" />
          <h3 className="font-semibold text-sm tracking-wide text-white">{t.youtubeTitle}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Embedded IFrame Player Container */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-white/10 shadow-inner group">
        <iframe
          key={`${currentStation.videoId}-${isPlaying ? 'play' : 'pause'}-${isMuted ? 'muted' : 'unmuted'}`}
          src={`https://www.youtube-nocookie.com/embed/${currentStation.videoId}?autoplay=${
            isPlaying ? 1 : 0
          }&mute=${isMuted ? 1 : 0}&loop=1&playlist=${currentStation.videoId}&enablejsapi=1&controls=1&rel=0`}
          title={currentStation.name}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full object-cover"
        />

        {/* Play / Unmute Gesture Overlay */}
        {!isPlaying && (
          <button
            onClick={() => {
              setIsPlaying(true);
              setIsMuted(false);
            }}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-white p-4 transition-opacity hover:bg-slate-950/70"
          >
            <div className="p-3 rounded-full bg-violet-600 shadow-lg shadow-violet-500/50 animate-bounce">
              <Play className="w-6 h-6 fill-current ml-0.5" />
            </div>
            <span className="text-xs font-semibold text-center">{t.unmuteNotice}</span>
          </button>
        )}
      </div>

      {/* Currently Playing Info & Controls */}
      <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex items-center justify-between">
        <div className="flex flex-col truncate pr-2">
          <span className="text-xs font-semibold text-violet-300 truncate">{currentStation.name}</span>
          <span className="text-[10px] text-slate-400 truncate">{currentStation.channel}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setIsPlaying(!isPlaying);
              if (!isPlaying) setIsMuted(false);
            }}
            title={isPlaying ? t.pauseFocus : t.playButton}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isPlaying ? <Play className="w-4 h-4 text-amber-400 fill-current" /> : <Play className="w-4 h-4 text-violet-400" />}
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? 'Bật tiếng' : 'Tắt tiếng'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-violet-400" />}
          </button>

          <a
            href={`https://www.youtube.com/watch?v=${currentStation.videoId}`}
            target="_blank"
            rel="noreferrer"
            title={t.openOnYoutube}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Paste Custom YouTube URL Form */}
      <form onSubmit={handleCustomSubmit} className="relative flex items-center">
        <LinkIcon className="absolute left-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder={t.customLinkPlaceholder}
          className="w-full pl-9 pr-14 py-2 text-xs rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-400 transition-colors"
        />
        <button
          type="submit"
          className="absolute right-1 px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-medium transition-colors"
        >
          {t.playButton}
        </button>
      </form>

      {/* Custom Stations Grid */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">{t.featuredStations.youtubeCustomStation}</span>
        {renderStationList(savedStations, true)}
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">{t.featuredStations.defaultStation}</span>
        {renderStationList(stations)}
      </div>
    </div>
  );
};
