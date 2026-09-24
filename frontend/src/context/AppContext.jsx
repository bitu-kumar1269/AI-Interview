/**
 * context/AppContext.jsx
 *
 * Global UI/app-level state:
 *  - Sidebar open/close
 *  - Global loading overlay
 *  - Theme preference ('dark' | 'light') with localStorage persistence & HTML class sync
 *
 * Usage:
 *   import { useAppContext } from '@/context';
 *   const { theme, isDark, toggleTheme, isSidebarOpen, toggleSidebar } = useAppContext();
 */

import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';

// ─── Theme Helper ─────────────────────────────────────────────────
const getStoredTheme = () => {
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    const adminSaved = localStorage.getItem('admin-dark-mode');
    if (adminSaved !== null) {
      return JSON.parse(adminSaved) ? 'dark' : 'light';
    }
  } catch {
    // Ignore error
  }
  return 'dark'; // Default to black theme
};

// ─── Initial State ────────────────────────────────────────────────
const initialState = {
  isSidebarOpen:    false,
  isGlobalLoading:  false,
  theme:            getStoredTheme(),
};

// ─── Action Types ─────────────────────────────────────────────────
const APP_ACTIONS = {
  TOGGLE_SIDEBAR:       'TOGGLE_SIDEBAR',
  SET_SIDEBAR:          'SET_SIDEBAR',
  SET_GLOBAL_LOADING:   'SET_GLOBAL_LOADING',
  SET_THEME:            'SET_THEME',
};

// ─── Reducer ──────────────────────────────────────────────────────
const appReducer = (state, action) => {
  switch (action.type) {
    case APP_ACTIONS.TOGGLE_SIDEBAR:
      return { ...state, isSidebarOpen: !state.isSidebarOpen };

    case APP_ACTIONS.SET_SIDEBAR:
      return { ...state, isSidebarOpen: action.payload };

    case APP_ACTIONS.SET_GLOBAL_LOADING:
      return { ...state, isGlobalLoading: action.payload };

    case APP_ACTIONS.SET_THEME:
      return { ...state, theme: action.payload };

    default:
      return state;
  }
};

// ─── Context ──────────────────────────────────────────────────────
export const AppContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Synchronize theme with <html> class & localStorage
  useEffect(() => {
    const root = document.documentElement;
    const isLight = state.theme === 'light';

    if (isLight) {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    }

    try {
      localStorage.setItem('theme', state.theme);
      localStorage.setItem('admin-dark-mode', JSON.stringify(!isLight));
    } catch {
      // Ignore write errors
    }
  }, [state.theme]);

  // Listen to window storage events for cross-tab sync
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
        dispatch({ type: APP_ACTIONS.SET_THEME, payload: e.newValue });
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const toggleSidebar     = useCallback(() => dispatch({ type: APP_ACTIONS.TOGGLE_SIDEBAR }), []);
  const setSidebar        = useCallback((v) => dispatch({ type: APP_ACTIONS.SET_SIDEBAR, payload: v }), []);
  const setGlobalLoading  = useCallback((v) => dispatch({ type: APP_ACTIONS.SET_GLOBAL_LOADING, payload: v }), []);
  const setTheme          = useCallback((t) => dispatch({ type: APP_ACTIONS.SET_THEME, payload: t }), []);
  const toggleTheme       = useCallback(() => {
    dispatch({
      type: APP_ACTIONS.SET_THEME,
      payload: state.theme === 'dark' ? 'light' : 'dark',
    });
  }, [state.theme]);

  const value = {
    ...state,
    isDark: state.theme === 'dark',
    toggleSidebar,
    setSidebar,
    setGlobalLoading,
    setTheme,
    toggleTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// ─── Hook ─────────────────────────────────────────────────────────
export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside <AppProvider>');
  return ctx;
};
