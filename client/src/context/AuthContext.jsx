import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('campustales_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Check token validity and load current user on app start
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('campustales_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.warn('Session verification failed, logging out:', error.message);
        localStorage.removeItem('campustales_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, []);

  // Listen for 401 unauthorized events dispatched from Axios interceptor
  useEffect(() => {
    const handleUnauthorized = (event) => {
      localStorage.removeItem('campustales_token');
      setToken(null);
      setUser(null);
      const reason = event.detail || 'Session expired. Please log in again.';
      toast.error(reason, { id: 'auth-toast' });
    };

    window.addEventListener('campustales:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('campustales:unauthorized', handleUnauthorized);
    };
  }, []);

  // Register function
  const register = async (formData) => {
    try {
      const response = await api.post('/auth/register', formData);
      if (response.data.success) {
        const { token: newToken, user: newUser } = response.data;
        localStorage.setItem('campustales_token', newToken);
        setToken(newToken);
        setUser(newUser);
        toast.success(`Welcome to CampusTales, ${newUser.name}! 🎉`, {
          id: 'auth-toast',
        });
        return { success: true, user: newUser };
      }
    } catch (error) {
      const msg = error.message || 'Registration failed. Please check your details.';
      toast.error(msg, { id: 'auth-toast' });
      return { success: false, error: msg };
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        const { token: newToken, user: newUser } = response.data;
        localStorage.setItem('campustales_token', newToken);
        setToken(newToken);
        setUser(newUser);
        toast.success(`Welcome back, ${newUser.name}! ✨`, {
          id: 'auth-toast',
        });
        return { success: true, user: newUser };
      }
    } catch (error) {
      const msg = error.message || 'Invalid email or password.';
      toast.error(msg, { id: 'auth-toast' });
      return { success: false, error: msg };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('campustales_token');
    setToken(null);
    setUser(null);
    toast('Logged out. See you soon!', {
      icon: '👋',
      id: 'auth-toast',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user),
        isLoading,
        register,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      register: async () => ({ success: false, error: 'Auth provider initializing' }),
      login: async () => ({ success: false, error: 'Auth provider initializing' }),
      logout: () => {},
      setUser: () => {},
    };
  }
  return context;
};

export default AuthContext;
