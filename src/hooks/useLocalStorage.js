import { useState, useEffect } from 'react';

/**
 * Custom hook that syncs state with localStorage.
 * Includes error handling for corrupted or unavailable storage.
 * 
 * @param {string} key - The localStorage key
 * @param {*} defaultValue - The default value if nothing is stored
 * @returns {[*, Function]} - State value and setter
 */
function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error writing to localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
