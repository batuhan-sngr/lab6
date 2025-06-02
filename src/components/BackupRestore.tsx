import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { usePlaylists } from '../contexts/PlaylistContext';
import { useSettings } from '../contexts/SettingsContext';
import { db } from '../services/db';
import type { BackupData } from '../types';

interface BackupRestoreProps {
  open: boolean;
  onClose: () => void;
}

const BackupRestore: React.FC<BackupRestoreProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const { playlists } = usePlaylists();
  const { settings } = useSettings();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleBackup = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const backupData: BackupData = {
        playlists: playlists.map(playlist => ({
          ...playlist,
          updatedAt: Date.now(),
          tags: playlist.tags || [],
          isPublic: playlist.isPublic || false,
          playCount: playlist.playCount || 0,
          viewCount: playlist.viewCount || 0,
          tracks: playlist.tracks.map(track => ({
            ...track,
            playCount: track.playCount || 0,
            comments: track.comments || [],
          })),
        })),
        settings,
        version: '1.0.0',
        timestamp: Date.now(),
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `playlist-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccess('Backup created successfully');
    } catch (err) {
      setError('Failed to create backup');
      console.error('Backup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const text = await file.text();
      const backupData: BackupData = JSON.parse(text);

      // Validate backup data
      if (!backupData.playlists || !backupData.settings || !backupData.version) {
        throw new Error('Invalid backup file format');
      }

      // Validate version compatibility
      if (backupData.version !== '1.0.0') {
        throw new Error('Incompatible backup version');
      }

      // Restore data
      await db.restoreFromBackup(backupData);

      setSuccess('Backup restored successfully. Reloading page...');
      
      // Reload the page after a short delay to show the success message
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore backup');
      console.error('Restore error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: theme.palette.background.paper,
          backgroundImage: 'none',
        },
      }}
    >
      <DialogTitle>Backup & Restore</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Backup
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Create a backup of your playlists and settings. The backup file will be
            downloaded to your computer.
          </Typography>
          <Button
            variant="contained"
            onClick={handleBackup}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            Create Backup
          </Button>
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Restore
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Restore your playlists and settings from a backup file. This will
            replace your current data.
          </Typography>
          <Button
            variant="outlined"
            component="label"
            disabled={isLoading}
          >
            Choose Backup File
            <input
              type="file"
              hidden
              accept=".json"
              onChange={handleRestore}
            />
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BackupRestore; 