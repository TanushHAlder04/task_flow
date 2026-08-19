import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';
import { api } from '../services/api';

/**
 * Custom hook for dark mode theme management.
 * Persists preference to localStorage and toggles the 'dark' class on <html>.
 * Syncs with backend API when authenticated.
 */
function useTheme(isAuthenticated = false) {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);

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
      if (isAuthenticated) {
        api.updateTheme(nextMode).catch(err => console.warn('Theme backend sync failed:', err));
      }
      return nextMode;
    });
  };

  return { darkMode, toggleDarkMode, setDarkMode };
}

export default useTheme;
