import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
import { ThemeMode } from '../types';
import { db } from '../services/db';

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>({ mode: 'light' });

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await db.getTheme();
      setThemeMode(savedTheme);
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newMode = themeMode.mode === 'light' ? 'dark' : 'light';
    const newTheme = { mode: newMode };
    setThemeMode(newTheme);
    await db.saveTheme(newTheme);
  };

  const theme = createTheme({
    palette: {
      mode: themeMode.mode,
      primary: {
        main: '#1DB954', // Spotify-like green
      },
      secondary: {
        main: '#FF5500', // SoundCloud-like orange
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 