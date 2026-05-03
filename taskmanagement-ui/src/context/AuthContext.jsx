import React, { createContext, useState } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';
import { handleApiError } from '../utils/helpers';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [token, setToken] = useState(authService.getToken());
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(credentials);
      
      const userData = {
        id: data.id,
        username: data.username,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
      };
      
      setUser(userData);
      setToken(data.token);
      setIsAuthenticated(true);
      
      // Store in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast.success('Login successful!');
      return data;
    } catch (err) {
      const message = handleApiError(err);
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.register(userData);
      
      const newUserData = {
        id: data.id,
        username: data.username,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
      };
      
      setUser(newUserData);
      setToken(data.token);
      setIsAuthenticated(true);
      
      // Store in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(newUserData));
      
      toast.success('Registration successful!');
      return data;
    } catch (err) {
      const message = handleApiError(err);
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout(); // This already clears localStorage in your service
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setError(null);
    toast.success('Logged out successfully');
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// useAuth hook moved to src/hooks/useAuth.js to fix Vite Fast Refresh warning
