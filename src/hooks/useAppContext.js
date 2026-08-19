import { createContext, useContext } from 'react';

/**
 * The shared app context — created here so the context object
 * lives in a non-component file, keeping AppContext.jsx
 * a pure component export for React Fast Refresh.
 */
export const AppContext = createContext(null);

/**
 * Hook to consume the app context.
 * Throws if used outside AppProvider.
 */
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
