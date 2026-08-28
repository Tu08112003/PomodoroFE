import React, { useState } from "react";
import { Cloud, LogOut, User, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

interface InformationProps {
  onClose: () => void;
}

export const Information: React.FC<InformationProps> = ({ onClose }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [busy, setBusy] = useState(false);

  const handleLogout = async () => {
    setBusy(true);
    try {
      await logout();
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="absolute -left-25 top-12 z-50 w-80 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-white/15 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Cloud className="w-4 h-4 text-sky-400" />
          <span className="text-sm font-semibold">{t.auth.workspaceTitle}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white"
          aria-label={t.auth.close}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/40 px-3 py-3">
          <User className="w-4 h-4 text-sky-400" />
          <div className="text-xs font-semibold text-slate-200">
            {t.auth.personalInfo}
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={busy}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-3 py-2 text-xs hover:bg-slate-700 disabled:opacity-50"
        >
          <LogOut className="w-3.5 h-3.5" /> {t.auth.logout}
        </button>
      </div>
    </div>
  );
};