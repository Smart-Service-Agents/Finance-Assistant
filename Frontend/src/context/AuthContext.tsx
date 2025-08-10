import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, LoginCredentials, RegisterCredentials } from '../types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  togglePremium: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState({
          isAuthenticated: true,
          user,
          loading: false
        });
      } catch (error) {
        localStorage.removeItem('user');
        console.log(error);
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    setAuthState(prev => ({ ...prev, loading: true }));

    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + 'login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || 'Login failed' };
      }


      localStorage.setItem('user', JSON.stringify(result.user));
      
      setAuthState({ isAuthenticated: true, user: result.user, loading: false });

      return { success: true };
    } catch (err) {
      console.log(err);
      return { success: false, error: 'Failed to connect to server' };
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<{ success: boolean; error?: string }> => {
    setAuthState(prev => ({ ...prev, loading: true }));

    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + 'sign-up/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();


      if (!response.ok) {
        return { success: false, error: result.error || 'Registration failed' };
      }

      localStorage.setItem('user', JSON.stringify(result.user));
      setAuthState({ isAuthenticated: true, user: result.user, loading: false });

      return { success: true };
    } catch (err) {
      console.log(err);
      return { success: false, error: 'Failed to connect to server' };
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false
    });
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!authState.user) return { success: false, error: 'Not authenticated' };

    await new Promise(resolve => setTimeout(resolve, 500));

    const updatedUser = { ...authState.user, ...updates };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    setAuthState(prev => ({
      ...prev,
      user: updatedUser
    }));

    return { success: true };
  };

  const togglePremium = async (): Promise<{ success: boolean; error?: string }> => {
    if (!authState.user) return { success: false, error: 'Not authenticated' };

    await new Promise(resolve => setTimeout(resolve, 1000));

    const updatedUser = { ...authState.user, isPremium: !authState.user.isPremium };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    setAuthState(prev => ({
      ...prev,
      user: updatedUser
    }));

    return { success: true };
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      register,
      logout,
      updateProfile,
      togglePremium
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
