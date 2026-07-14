import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, login as apiLogin, signup as apiSignup, logout as apiLogout } from '../api/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((res) => setUser(res.data.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const clearSession = () => setUser(null);
    window.addEventListener('metroscope:unauthorized', clearSession);
    return () => window.removeEventListener('metroscope:unauthorized', clearSession);
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await apiLogin(credentials);
    setUser(res.data.data.user);
    return res.data;
  }, []);

  const signup = useCallback(async (data) => {
    const res = await apiSignup(data);
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  const value = { user, loading, login, signup, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
