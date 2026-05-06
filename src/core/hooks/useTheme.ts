import { useState, useEffect } from 'react';
import { theme } from '../config/theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface UseThemeReturn {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  theme: typeof theme;
}

export const useTheme = (): UseThemeReturn => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme-mode') as ThemeMode;
    return saved || 'system';
  });
  
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      const isDarkMode = 
        mode === 'dark' || 
        (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      setIsDark(isDarkMode);
      
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      localStorage.setItem('theme-mode', mode);
    };

    updateTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => updateTheme();
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, [mode]);

  const toggleTheme = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { mode, isDark, setMode, toggleTheme, theme };
};