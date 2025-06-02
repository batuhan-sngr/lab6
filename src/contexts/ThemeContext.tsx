import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, CircularProgress, Box } from '@mui/material';
import type { ThemeMode } from '../types';
import { useSettings } from './SettingsContext';

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, updateSettings, isLoading } = useSettings();
  const [themeMode, setThemeMode] = useState<ThemeMode>({ mode: 'light' });

  useEffect(() => {
    if (!isLoading && settings) {
      setThemeMode({ mode: settings.theme });
    }
  }, [settings, isLoading]);

  const toggleTheme = async () => {
    const newMode = themeMode.mode === 'light' 
      ? 'dark' 
      : themeMode.mode === 'dark' 
        ? 'high-contrast' 
        : 'light';
    const newTheme: ThemeMode = { mode: newMode };
    setThemeMode(newTheme);
    await updateSettings({ theme: newMode });
  };

  const theme = createTheme({
    palette: {
      mode: themeMode.mode === 'high-contrast' ? 'dark' : themeMode.mode,
      primary: {
        main: '#1DB954', // Spotify-like green
      },
      secondary: {
        main: '#FF5500', // SoundCloud-like orange
      },
      ...(themeMode.mode === 'high-contrast' && {
        background: {
          default: '#000000',
          paper: '#000000',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#FFFFFF',
        },
        divider: '#FFFFFF',
      }),
    },
  });

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: theme.palette.background.default,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// Export the hook as a named export
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}; 