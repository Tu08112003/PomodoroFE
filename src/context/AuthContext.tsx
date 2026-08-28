'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, ApiError, ApiUser, setAccessToken, setAuthFailureHandler } from '../services/apiClient';

type AuthStatus = 'loading' | 'anonymous' | 'authenticated';

interface AuthContextValue {
  user: ApiUser | null;
  status: AuthStatus;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function errorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return Array.isArray(error.body.message) ? error.body.message.join(', ') : error.body.message || error.message;
  }
  return error instanceof Error ? error.message : 'Request failed';
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAuthFailureHandler(() => {
      setAccessToken(null);
      setUser(null);
      setStatus('anonymous');
    });

    api.refresh()
      .then(() => api.me())
      .then((profile) => {
        setUser(profile);
        setStatus('authenticated');
      })
      .catch(() => {
        setAccessToken(null);
        setStatus('anonymous');
      });

    return () => setAuthFailureHandler(null);
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const result = await api.login({ email, password });
      setAccessToken(result.accessToken);
      setUser(result.user);
      setStatus('authenticated');
    } catch (requestError) {
      setError(errorMessage(requestError));
      throw requestError;
    }
  };

  const register = async (email: string, password: string, displayName?: string) => {
    setError(null);
    try {
      const result = await api.register({ email, password, displayName });
      setAccessToken(result.accessToken);
      setUser(result.user);
      setStatus('authenticated');
    } catch (requestError) {
      setError(errorMessage(requestError));
      throw requestError;
    }
  };

  const logout = async () => {
    const currentUser = user;
    setUser(null);
    setStatus('anonymous');
    try {
      if (currentUser) await api.logout();
    } finally {
      setAccessToken(null);
    }
  };

  const value = useMemo(
    () => ({ user, status, error, login, register, logout, clearError: () => setError(null) }),
    [user, status, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
