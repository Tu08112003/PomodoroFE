import React from 'react';
import { Wallpaper, DimmerSettings } from '../../types';

interface BackgroundLayerProps {
  wallpaper: Wallpaper;
  dimmer: DimmerSettings;
}

export const BackgroundLayer: React.FC<BackgroundLayerProps> = ({ wallpaper, dimmer }) => {
  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none select-none">
      {/* Media Layer */}
      {wallpaper.type === 'video' ? (
        <video
          key={wallpaper.url}
          src={wallpaper.url}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover transform scale-105 transition-all duration-700"
        />
      ) : (
        <div
          key={wallpaper.url}
          className="w-full h-full bg-cover bg-center bg-no-repeat transform scale-105 transition-all duration-700"
          style={{ backgroundImage: `url('${wallpaper.url}')` }}
        />
      )}

      {/* Dimmer Overlay & Backdrop Blur */}
      <div
        className="absolute inset-0 bg-slate-950 transition-all duration-300"
        style={{
          opacity: dimmer.opacity,
          backdropFilter: `blur(${dimmer.blur}px)`,
          WebkitBackdropFilter: `blur(${dimmer.blur}px)`,
        }}
      />
    </div>
  );
};
