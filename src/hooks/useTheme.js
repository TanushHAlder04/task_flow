import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';
import { api } from '../services/api';

/**
 * Custom hook for dark mode theme management.
 * - In Guest Mode: Persists strictly to localStorage ('taskflow_guest_darkMode').
 * - In Authenticated Mode: Syncs with backend API when logged in with a valid token.
 */
function useTheme(isAuthenticated = false, token = null) {
  const [darkMode, setDarkMode] = useLocalStorage('taskflow_guest_darkMode', false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const nextMode = !prev;
      if (isAuthenticated && token) {
        api.updateTheme(nextMode).catch(err => console.warn('Theme backend sync failed:', err));
      }
      return nextMode;
    });
  };

  return { darkMode, toggleDarkMode, setDarkMode };
}

export default useTheme;
