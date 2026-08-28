import React, { useState } from "react";
import { Cloud, Lock, LogIn, Mail, User, UserPlus, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

interface LoginProps {
  onClose: () => void;
}

export const Login: React.FC<LoginProps> = ({ onClose }) => {
  const { status, error, login, register } = useAuth();
  const { t } = useLanguage();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "login") await login(email, password);
      else await register(email, password, displayName || undefined);
      onClose();
    } catch {
      // AuthContext exposes the API error in the panel.
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-slate-900/95 backdrop-blur-2xl border border-white/15 shadow-2xl overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-8 pt-10 pb-6 bg-gradient-to-b from-sky-500/10 to-transparent">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 p-1.5 rounded-full text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
            aria-label={t.auth.close}
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-500/15 border border-sky-400/20 mb-4">
              <Cloud className="w-8 h-8 text-sky-400" />
            </div>

            <h2 className="text-xl font-semibold text-white">
              {mode === "login" ? t.auth.loginTitle : t.auth.registerTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {mode === "login"
                ? t.auth.loginSubtitle
                : t.auth.registerSubtitle}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="px-8 pb-8 space-y-3.5">
          {mode === "register" && (
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder={t.auth.displayNamePlaceholder}
                className="w-full rounded-xl bg-slate-950/70 border border-white/10 pl-10 pr-3.5 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/10"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t.auth.emailPlaceholder}
              className="w-full rounded-xl bg-slate-950/70 border border-white/10 pl-10 pr-3.5 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/10"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              required
              minLength={6}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t.auth.passwordPlaceholder}
              className="w-full rounded-xl bg-slate-950/70 border border-white/10 pl-10 pr-3.5 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/10"
            />
          </div>

          {error && (
            <p className="text-xs text-red-300 bg-red-500/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            disabled={busy || status === "loading"}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {mode === "login" ? (
              <LogIn className="w-4 h-4" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            {mode === "login" ? t.auth.loginSubmit : t.auth.registerSubmit}
          </button>

          <div className="pt-3 text-center border-t border-white/5 mt-4">
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-xs text-slate-400 hover:text-sky-300 transition-colors"
            >
              {mode === "login" ? (
                <>
                  {t.auth.noAccountPrompt}{" "}
                  <span className="text-sky-400 font-medium">{t.auth.registerAction}</span>
                </>
              ) : (
                <>
                  {t.auth.hasAccountPrompt}{" "}
                  <span className="text-sky-400 font-medium">{t.auth.loginAction}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
