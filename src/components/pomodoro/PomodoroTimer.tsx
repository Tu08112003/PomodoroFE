import React from 'react';
import { Play, Pause, RotateCcw, Maximize2, Sparkles } from 'lucide-react';
import { TimerMode } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface PomodoroTimerProps {
  mode: TimerMode;
  formattedTime: string;
  isRunning: boolean;
  progressPercentage: number;
  completedSessions: number;
  onSwitchMode: (mode: TimerMode) => void;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  isZenMode: boolean;
  onToggleZenMode: () => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  mode,
  formattedTime,
  isRunning,
  progressPercentage,
  completedSessions,
  onSwitchMode,
  onToggleTimer,
  onResetTimer,
  isZenMode,
  onToggleZenMode,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center text-center z-10 transition-all duration-500">
      {/* Mode Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-xl mb-6">
        <button
          onClick={() => onSwitchMode('work')}
          className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
            mode === 'work'
              ? 'bg-violet-600/90 text-white shadow-lg shadow-violet-500/25 border border-violet-400/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          {t.workTab}
        </button>

        <button
          onClick={() => onSwitchMode('shortBreak')}
          className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
            mode === 'shortBreak'
              ? 'bg-sky-600/90 text-white shadow-lg shadow-sky-500/25 border border-sky-400/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          {t.shortBreakTab}
        </button>

        <button
          onClick={() => onSwitchMode('longBreak')}
          className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
            mode === 'longBreak'
              ? 'bg-indigo-600/90 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          {t.longBreakTab}
        </button>
      </div>

      {/* Main Digital Clock Display with Circular Progress */}
      <div className="relative group flex items-center justify-center my-2">
        {/* Glowing Ambient Backdrop Ring */}
        <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/20 via-sky-500/20 to-indigo-600/20 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition duration-700 pointer-events-none" />

        <div className="relative flex flex-col items-center justify-center w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-slate-900/40 backdrop-blur-2xl border border-white/10 shadow-2xl">
          {/* Circular SVG Progress Bar */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              className="stroke-slate-800/50 fill-none"
              strokeWidth="2.5"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              className={`fill-none transition-all duration-1000 stroke-current ${
                mode === 'work'
                  ? 'text-violet-500'
                  : mode === 'shortBreak'
                  ? 'text-sky-400'
                  : 'text-indigo-400'
              }`}
              strokeWidth="3"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progressPercentage) / 100}
              strokeLinecap="round"
            />
          </svg>

          {/* Time Digits */}
          <span className="font-mono text-6xl sm:text-7xl font-bold tracking-tight text-white drop-shadow-md select-none">
            {formattedTime}
          </span>

          {/* Completed Sessions Count */}
          <span className="mt-2 text-xs font-medium text-slate-400 tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            {t.completedSessions} <strong className="text-white ml-1">{completedSessions}</strong>
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={onResetTimer}
          title={t.resetTimer}
          className="p-3.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={onToggleTimer}
          className={`px-8 py-3.5 rounded-full font-semibold text-sm tracking-wide shadow-xl flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 ${
            isRunning
              ? 'bg-amber-500/90 hover:bg-amber-500 text-slate-950 shadow-amber-500/25 border border-amber-300/40'
              : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-violet-600/30 border border-white/20'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 fill-current" />
              {t.pauseFocus}
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current ml-0.5" />
              {t.startFocus}
            </>
          )}
        </button>

        <button
          onClick={onToggleZenMode}
          title={isZenMode ? t.exitZenMode : t.zenModeTooltip}
          className={`p-3.5 rounded-full backdrop-blur-md border hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg ${
            isZenMode
              ? 'bg-violet-600 text-white border-violet-400'
              : 'bg-slate-900/60 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
