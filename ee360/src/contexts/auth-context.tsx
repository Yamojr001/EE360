import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'super_admin' | 'farm_manager' | 'water_manager';
  sector: 'farm' | 'water' | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isFarmManager: boolean;
  isWaterManager: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]           = useState<User | null>(null);
  const [token, setToken]         = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('ee360_token');
    const storedUser  = localStorage.getItem('ee360_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      try { setUser(JSON.parse(storedUser)); } catch { /* ignore */ }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<{ token: string; user: User }>('/auth/login', { email, password });
    const { token: t, user: u } = res.data;
    localStorage.setItem('ee360_token', t);
    localStorage.setItem('ee360_user', JSON.stringify(u));
    setToken(t);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ee360_token');
    localStorage.removeItem('ee360_user');
    api.post('/auth/logout').catch(() => {});
    setToken(null);
    setUser(null);
  }, []);

  const value: AuthState = {
    user, token, isLoading,
    isAuthenticated: !!token,
    isSuperAdmin:   user?.role === 'super_admin',
    isFarmManager:  user?.role === 'farm_manager'  || user?.role === 'super_admin',
    isWaterManager: user?.role === 'water_manager' || user?.role === 'super_admin',
    login, logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
