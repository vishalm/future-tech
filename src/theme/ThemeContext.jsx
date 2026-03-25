import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { themes, defaultTheme } from './themes';

const ThemeContext = createContext(null);

export function ThemeProvider({ children, initialTheme }) {
  const [themeId, setThemeId] = useState(() => {
    return initialTheme || localStorage.getItem('futuretech_theme') || defaultTheme;
  });

  const theme = themes[themeId] || themes[defaultTheme];

  // Apply CSS variables to document
  useEffect(() => {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(theme.vars)) {
      root.style.setProperty(key, value);
    }
    localStorage.setItem('futuretech_theme', themeId);
  }, [themeId, theme]);

  const switchTheme = useCallback((id) => {
    if (themes[id]) {
      setThemeId(id);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, themeId, switchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
