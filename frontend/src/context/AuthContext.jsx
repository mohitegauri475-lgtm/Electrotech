import React, { createContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(storage.getUser());
  const [token, setToken] = useState(storage.getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = storage.getToken();
      if (savedToken) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          storage.setUser(userData);
        } catch (err) {
          console.error('Failed to restore user session:', err);
          storage.clearAuth();
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    storage.setToken(data.token);
    storage.setUser(data.user);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    storage.setToken(data.token);
    storage.setUser(data.user);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    storage.clearAuth();
    setToken(null);
    setUser(null);
  };

  const updateUserProfile = async (profileData) => {
    const updatedUser = await authService.updateProfile(profileData);
    storage.setUser(updatedUser);
    setUser(updatedUser);
    return updatedUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
