import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import { useSettings } from '../contexts/SettingsContext';

interface KeyboardShortcutsProps {
  open: boolean;
  onClose: () => void;
}

interface Shortcut {
  key: string;
  description: string;
  category: string;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const { settings } = useSettings();

  const shortcuts: Shortcut[] = [
    {
      key: 'Space',
      description: 'Play/Pause current track',
      category: 'Playback',
    },
    {
      key: '→',
      description: 'Next track',
      category: 'Playback',
    },
    {
      key: '←',
      description: 'Previous track',
      category: 'Playback',
    },
    {
      key: '↑',
      description: 'Volume up',
      category: 'Playback',
    },
    {
      key: '↓',
      description: 'Volume down',
      category: 'Playback',
    },
    {
      key: 'M',
      description: 'Mute/Unmute',
      category: 'Playback',
    },
    {
      key: 'L',
      description: 'Like/Unlike current track',
      category: 'Tracks',
    },
    {
      key: 'D',
      description: 'Delete current track',
      category: 'Tracks',
    },
    {
      key: 'N',
      description: 'New playlist',
      category: 'Playlists',
    },
    {
      key: 'F',
      description: 'Focus search',
      category: 'Navigation',
    },
    {
      key: 'T',
      description: 'Toggle theme',
      category: 'Settings',
    },
    {
      key: '?',
      description: 'Show keyboard shortcuts',
      category: 'Help',
    },
  ];

  const categories = Array.from(new Set(shortcuts.map((s) => s.category)));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: theme.palette.background.paper,
          backgroundImage: 'none',
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6">Keyboard Shortcuts</Typography>
          {!settings.keyboardShortcuts && (
            <Typography
              variant="caption"
              color="error"
              sx={{ ml: 'auto' }}
            >
              Keyboard shortcuts are disabled
            </Typography>
          )}
        </Box>
      </DialogTitle>
      <DialogContent>
        {categories.map((category) => (
          <Box key={category} sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{
                color: theme.palette.primary.main,
                mb: 1,
                fontWeight: 'bold',
              }}
            >
              {category}
            </Typography>
            <List dense>
              {shortcuts
                .filter((s) => s.category === category)
                .map((shortcut) => (
                  <ListItem key={shortcut.key}>
                    <ListItemText
                      primary={shortcut.description}
                      secondary={
                        <Box
                          component="kbd"
                          sx={{
                            display: 'inline-block',
                            px: 1,
                            py: 0.5,
                            bgcolor: theme.palette.background.default,
                            borderRadius: 1,
                            border: `1px solid ${theme.palette.divider}`,
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                          }}
                        >
                          {shortcut.key}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
            </List>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default KeyboardShortcuts; 