import React, { createContext, useState, useEffect, useCallback } from 'react';
import { User, AuthContextType, LoginCredentials, RegisterData } from '../../types/auth.types';
import { authService } from '../../services/auth.service';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    const response = await authService.login(credentials);
    localStorage.setItem('token', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);
    setUser(response.user);
    setIsAuthenticated(true);
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<void> => {
    const response = await authService.register(data);
    localStorage.setItem('token', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);
    setUser(response.user);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const forgotPassword = useCallback(async (email: string): Promise<void> => {
    await authService.forgotPassword(email);
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string): Promise<void> => {
    await authService.resetPassword(token, newPassword);
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>): Promise<void> => {
    const updatedUser = await authService.updateProfile(data);
    setUser(updatedUser);
  }, []);

  const changePassword = useCallback(async (oldPassword: string, newPassword: string): Promise<void> => {
    await authService.changePassword(oldPassword, newPassword);
  }, []);

  const hasRole = useCallback((roles: string[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    changePassword,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
