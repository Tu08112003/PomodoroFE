'use client';

import React, { useEffect, useState } from 'react';
import { Cloud, Clock, Globe, Maximize2, Sparkles } from 'lucide-react';
import { AuthGate } from '../auth/AuthGate';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface HeaderProps {
  onEnterZenMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onEnterZenMode }) => {
  const { lang, toggleLang, t } = useLanguage();
  const { user, status: authStatus } = useAuth();
  const [isAuthPanelOpen, setIsAuthPanelOpen] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [currentDateStr, setCurrentDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const locale = lang === 'vi' ? 'vi-VN' : 'en-US';
      setCurrentTimeStr(
        now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      );
      setCurrentDateStr(
        now.toLocaleDateString(locale, {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [lang]);

  const authLabel = authStatus === 'authenticated'
    ? user?.displayName || user?.email || 'Cloud'
    : 'Login';

  return (
    <header className="relative z-20 flex items-center justify-between w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center gap-3 p-2 px-4 rounded-full bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-lg">
        <div className="p-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 shadow-md">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <h1 className="font-bold text-base tracking-wide bg-gradient-to-r from-white via-slate-200 to-violet-300 bg-clip-text text-transparent">
          Pomodoro
        </h1>
      </div>

      <div className="hidden sm:flex items-center gap-3 p-2 px-5 rounded-full bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-lg text-xs font-medium text-slate-300">
        <Clock className="w-3.5 h-3.5 text-violet-400" />
        <span className="font-mono text-white font-semibold">{currentTimeStr}</span>
        <span className="text-white/20">|</span>
        <span className="capitalize text-slate-400">{currentDateStr}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setIsAuthPanelOpen((open) => !open)}
            title={authStatus === 'authenticated' ? user?.email || 'Cloud workspace' : 'Sign in to sync'}
            className="flex items-center gap-1.5 p-2 px-3 rounded-full bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-lg text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <Cloud className={`w-3.5 h-3.5 ${authStatus === 'authenticated' ? 'text-emerald-400' : 'text-sky-400'}`} />
            <span className="hidden sm:inline">{authLabel}</span>
          </button>
          {isAuthPanelOpen && <AuthGate onClose={() => setIsAuthPanelOpen(false)} />}
        </div>
        <button
          onClick={toggleLang}
          title="Switch Language (Tiếng Việt / English)"
          className="flex items-center gap-1.5 p-2 px-3 rounded-full bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-lg text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-sky-400" />
          <span className="uppercase text-[11px] tracking-wider">
            {lang === 'vi' ? 'VI' : 'EN'}
          </span>
        </button>

        <button
          onClick={onEnterZenMode}
          className="flex items-center gap-2 p-2 px-4 rounded-full bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all"
        >
          <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">{t.zenMode}</span>
        </button>
      </div>
    </header>
  );
};
