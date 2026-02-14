import { useState } from 'react';
import { api } from '../utils/api';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    setLoginError('');
    
    try {
      const response = await api.login(username, password);
      const data = await response.json();
      
      if (response.ok) {
        setCurrentUser(data);
        return { success: true };
      } else {
        setLoginError(data.message || 'Invalid username or password');
        return { success: false };
      }
    } catch (error) {
      setLoginError('Connection error. Please check if backend is running.');
      console.error('Login error:', error);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return { currentUser, loginError, loading, login, logout };
};