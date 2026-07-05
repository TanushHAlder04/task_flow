import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

/**
 * Custom hook for dark mode theme management.
 * Persists preference to localStorage and toggles the 'dark' class on <html>.
 */
function useTheme() {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return { darkMode, toggleDarkMode };
}

export default useTheme;
