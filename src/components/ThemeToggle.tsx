import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import {
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Contrast as HighContrastIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { themeMode, toggleTheme } = useThemeContext();

  const getNextMode = (currentMode: string) => {
    switch (currentMode) {
      case 'light':
        return 'dark';
      case 'dark':
        return 'high-contrast';
      case 'high-contrast':
        return 'light';
      default:
        return 'light';
    }
  };

  const getIcon = (mode: string) => {
    switch (mode) {
      case 'light':
        return <DarkIcon />;
      case 'dark':
        return <HighContrastIcon />;
      case 'high-contrast':
        return <LightIcon />;
      default:
        return <DarkIcon />;
    }
  };

  const getTooltipText = (mode: string) => {
    const nextMode = getNextMode(mode);
    return `Switch to ${nextMode} mode`;
  };

  return (
    <Tooltip title={getTooltipText(themeMode.mode)}>
      <IconButton onClick={toggleTheme} color="inherit">
        {getIcon(themeMode.mode)}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle; 