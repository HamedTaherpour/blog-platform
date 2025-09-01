'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthService } from '@/services';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('conduit_token');
    const savedUser = localStorage.getItem('conduit_user');

    if (savedToken && savedUser) {
      try {
        // setToken(savedToken);
        // setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('conduit_token');
        localStorage.removeItem('conduit_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await AuthService.login({
        user: { email, password }
      });

      const { user: userData } = response;
      setUser(userData);
      setToken(userData.token);

      // Save to localStorage
      localStorage.setItem('conduit_token', userData.token);
      localStorage.setItem('conduit_user', JSON.stringify(userData));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await AuthService.register({
        user: { username, email, password }
      });

      const { user: userData } = response;
      setUser(userData);
      setToken(userData.token);

      // Save to localStorage
      localStorage.setItem('conduit_token', userData.token);
      localStorage.setItem('conduit_user', JSON.stringify(userData));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('conduit_token');
    localStorage.removeItem('conduit_user');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
