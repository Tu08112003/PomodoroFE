'use client';

import React, { useState } from 'react';
import { Minimize2 } from 'lucide-react';
import { INITIAL_WALLPAPERS } from './data/presets';
import { Wallpaper, DimmerSettings, ActivePanel } from './types';
import { usePomodoro } from './hooks/usePomodoro';
import { useAudioMixer } from './hooks/useAudioMixer';
import { useLanguage } from './context/LanguageContext';
import { BackgroundLayer } from './components/background/BackgroundLayer';
import { PomodoroTimer } from './components/pomodoro/PomodoroTimer';
import { NavigationDock } from './components/dock/NavigationDock';
import { YouTubePlayerPanel } from './components/music/YouTubePlayerPanel';
import { AmbientMixerPanel } from './components/mixer/AmbientMixerPanel';
import { WallpaperPickerPanel } from './components/wallpaper/WallpaperPickerPanel';
import { TodoListPanel } from './components/todo/TodoListPanel';
import { Header } from './components/header/Header';
import { useAuth } from './context/AuthContext';
import { useCloudTodos } from './hooks/useCloudTodos';
import { useCloudWallpapers } from './hooks/useCloudWallpapers';
import { useCloudStations } from './hooks/useCloudStations';

export function AppContent() {
  const { t } = useLanguage();
  const { user, status: authStatus } = useAuth();
  const [currentWallpaper, setCurrentWallpaper] = useState<Wallpaper>(INITIAL_WALLPAPERS[0]);
  const [dimmer, setDimmer] = useState<DimmerSettings>({ opacity: 0.5, blur: 0 });
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [isZenMode, setIsZenMode] = useState<boolean>(false);

  // Custom Hooks
  const pomodoro = usePomodoro();
  const mixer = useAudioMixer();
  const todo = useCloudTodos();
  const { customWallpapers, saveWallpaper, deleteWallpaper } = useCloudWallpapers();
  const { savedStations, saveStation, deleteStation } = useCloudStations();

  const handleUpdateDimmer = (newDimmer: Partial<DimmerSettings>) => {
    setDimmer((prev) => ({ ...prev, ...newDimmer }));
  };

  const soundTrackActiveCount = mixer.tracks.filter((t) => t.isPlaying && t.volume > 0).length;
  const todoPendingCount = todo.tasks.filter((t) => !t.completed).length;

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col justify-between p-4 sm:p-6 text-slate-100 font-sans select-none">
      {/* Layer 0: Background & Dimmer */}
      <BackgroundLayer wallpaper={currentWallpaper} dimmer={dimmer} />

      {/* Layer 1: Top Navigation Bar */}
      {!isZenMode && <Header onEnterZenMode={() => setIsZenMode(true)} />}

      {/* Layer 2: Main Workspace Canvas - Central Pomodoro Clock */}
      <main className="relative z-10 flex-1 flex items-center justify-center">
        <PomodoroTimer
          mode={pomodoro.mode}
          formattedTime={pomodoro.formattedTime}
          isRunning={pomodoro.isRunning}
          progressPercentage={pomodoro.progressPercentage}
          completedSessions={pomodoro.completedSessions}
          onSwitchMode={pomodoro.switchMode}
          onToggleTimer={pomodoro.toggleTimer}
          onResetTimer={pomodoro.resetTimer}
          isZenMode={isZenMode}
          onToggleZenMode={() => setIsZenMode(!isZenMode)}
        />
      </main>

      {/* Zen Mode Floating Exit Button */}
      {isZenMode && (
        <button
          onClick={() => setIsZenMode(false)}
          className="fixed top-6 right-6 z-50 p-3 rounded-full bg-slate-900/80 backdrop-blur-2xl border border-white/20 text-slate-300 hover:text-white hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-2 text-xs font-semibold"
        >
          <Minimize2 className="w-4 h-4 text-violet-400" />
          {t.exitZenMode}
        </button>
      )}

      {/* Layer 3: Slide-Over Active Glass Panels */}
      {!isZenMode && activePanel && (
        <div className="fixed bottom-24 right-4 sm:right-8 z-30">
          {activePanel === 'music' && (
            <YouTubePlayerPanel
              key={authStatus === 'authenticated' && user ? `authenticated:${user._id}` : authStatus}
              savedStations={savedStations}
              onSaveStation={(station, url) => {
                void saveStation(station, url);
              }}
              onDeleteStation={(station) => {
                deleteStation(station);
              }}
              onClose={() => setActivePanel(null)}
            />
          )}

          {activePanel === 'mixer' && (
            <AmbientMixerPanel
              tracks={mixer.tracks}
              masterVolume={mixer.masterVolume}
              onSetMasterVolume={mixer.setMasterVolume}
              isMasterMuted={mixer.isMasterMuted}
              onSetIsMasterMuted={mixer.setIsMasterMuted}
              onSetTrackVolume={mixer.setTrackVolume}
              onToggleTrack={mixer.toggleTrack}
              onApplyPreset={mixer.applyPreset}
              onStopAll={mixer.stopAll}
              onClose={() => setActivePanel(null)}
            />
          )}

          {activePanel === 'wallpaper' && (
            <WallpaperPickerPanel
              currentWallpaper={currentWallpaper}
              wallpapers={customWallpapers}
              onSaveWallpaper={(wallpaper) => {
                void saveWallpaper(wallpaper).then(setCurrentWallpaper);
              }}
              onDeleteWallpaper={(wallpaper) => {
                if (currentWallpaper.id === wallpaper.id) setCurrentWallpaper(INITIAL_WALLPAPERS[0]);
                deleteWallpaper(wallpaper);
              }}
              onSelectWallpaper={setCurrentWallpaper}
              dimmer={dimmer}
              onUpdateDimmer={handleUpdateDimmer}
              onClose={() => setActivePanel(null)}
            />
          )}

          {activePanel === 'todo' && (
            <TodoListPanel
              cloudStatus={authStatus}
              tasks={todo.tasks}
              lastResetDate={todo.lastResetDate}
              onAddTask={todo.addTask}
              onToggleTask={todo.toggleTask}
              onDeleteTask={todo.deleteTask}
              onClearCompleted={todo.clearCompleted}
              onClose={() => setActivePanel(null)}
            />
          )}
        </div>
      )}

      {/* Layer 4: Floating Glass Dock Navigation */}
      <NavigationDock
        activePanel={activePanel}
        onTogglePanel={(panel) => setActivePanel(panel)}
        isZenMode={isZenMode}
        onToggleZenMode={() => setIsZenMode(!isZenMode)}
        soundTrackActiveCount={soundTrackActiveCount}
        todoPendingCount={todoPendingCount}
      />
    </div>
  );
}
