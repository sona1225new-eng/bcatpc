import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => authService.getCurrentUser());
  const [token, setToken] = useState(() => authService.getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = authService.getToken();
      if (!storedToken) {
        setAdmin(null);
        setLoading(false);
        return;
      }

      try {
        const res = await authService.getMe();
        if (res.data) {
          setAdmin(res.data);
          localStorage.setItem('tp_admin_user', JSON.stringify(res.data));
        }
      } catch (err) {
        // Stored token is invalid or expired
        localStorage.removeItem('tp_admin_token');
        localStorage.removeItem('tp_admin_user');
        setAdmin(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.data?.token) {
      setToken(res.data.token);
      setAdmin(res.data.admin);
    }
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setAdmin(null);
    setToken(null);
  };

  const changePassword = async (currentPassword, newPassword) => {
    return authService.changePassword(currentPassword, newPassword);
  };

  const value = {
    admin,
    token,
    isAuthenticated: Boolean(admin && token),
    loading,
    login,
    logout,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
