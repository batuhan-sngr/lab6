import React, { createContext, useContext, useEffect, useState } from 'react';
import { CircularProgress, Box } from '@mui/material';
import type { AppSettings } from '../types';
import { db } from '../services/db';

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  isLoading: boolean;
}

const defaultSettings: AppSettings = {
  theme: 'light',
  viewMode: 'grid',
  sortBy: 'date',
  sortOrder: 'desc',
  showMiniPlayer: true,
  autoPlay: false,
  keyboardShortcuts: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await db.getSettings();
        if (savedSettings) {
          setSettings(savedSettings);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      await db.saveSettings(updatedSettings);
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const resetSettings = async () => {
    try {
      await db.saveSettings(defaultSettings);
      setSettings(defaultSettings);
    } catch (error) {
      console.error('Error resetting settings:', error);
    }
  };

  const value = {
    settings,
    updateSettings,
    resetSettings,
    isLoading,
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// Export the hook as a named export
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}; 