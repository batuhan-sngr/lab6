import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  AppBar,
  Toolbar,
  Chip,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Backup as BackupIcon,
} from '@mui/icons-material';
import { usePlaylists } from '../contexts/PlaylistContext';
import ThemeToggle from './ThemeToggle';
import BackupRestore from './BackupRestore';
import TrackDetails from './TrackDetails';
import PlaylistStats from './PlaylistStats';
import type { Track } from '../types';

const PlaylistManager: React.FC = () => {
  const { playlists, addPlaylist, deletePlaylist, addTrack, removeTrack, toggleLike, addComment, deleteComment } = usePlaylists();
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newTrackUrl, setNewTrackUrl] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [isAddPlaylistOpen, setIsAddPlaylistOpen] = useState(false);
  const [isAddTrackOpen, setIsAddTrackOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<{ track: Track; playlistId: string } | null>(null);
  const [draggedTrack, setDraggedTrack] = useState<{ track: Track; sourcePlaylistId: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddPlaylist = async () => {
    try {
      setError(null);
      if (newPlaylistName.trim()) {
        await addPlaylist(newPlaylistName.trim());
        setNewPlaylistName('');
        setIsAddPlaylistOpen(false);
      }
    } catch (err) {
      setError('Failed to create playlist');
      console.error('Error creating playlist:', err);
    }
  };

  const handleAddTrack = async () => {
    try {
      setError(null);
      if (selectedPlaylist && newTrackUrl.trim()) {
        // Extract title and artist from SoundCloud URL (this is a simplified version)
        const title = 'Track from SoundCloud';
        const artist = 'Unknown Artist';
        
        await addTrack(selectedPlaylist, {
          title,
          artist,
          soundcloudUrl: newTrackUrl.trim(),
          liked: false,
          playCount: 0,
          comments: [],
        });
        
        setNewTrackUrl('');
        setSelectedPlaylist(null);
        setIsAddTrackOpen(false);
      }
    } catch (err) {
      setError('Failed to add track');
      console.error('Error adding track:', err);
    }
  };

  const handleCloseAddPlaylist = () => {
    setNewPlaylistName('');
    setError(null);
    setIsAddPlaylistOpen(false);
  };

  const handleCloseAddTrack = () => {
    setNewTrackUrl('');
    setSelectedPlaylist(null);
    setError(null);
    setIsAddTrackOpen(false);
  };

  const handleDragStart = (track: Track, playlistId: string) => {
    setDraggedTrack({ track, sourcePlaylistId: playlistId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetPlaylistId: string) => {
    if (draggedTrack && draggedTrack.sourcePlaylistId !== targetPlaylistId) {
      // Add track to target playlist
      await addTrack(targetPlaylistId, {
        title: draggedTrack.track.title,
        artist: draggedTrack.track.artist,
        soundcloudUrl: draggedTrack.track.soundcloudUrl,
        liked: draggedTrack.track.liked,
        playCount: draggedTrack.track.playCount,
        comments: draggedTrack.track.comments,
      });

      // Remove track from source playlist
      await removeTrack(draggedTrack.sourcePlaylistId, draggedTrack.track.id);
    }
    setDraggedTrack(null);
  };

  return (
    <Box>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SoundCloud Playlist Manager
          </Typography>
          <Button
            color="inherit"
            startIcon={<BackupIcon />}
            onClick={() => setIsBackupOpen(true)}
          >
            Backup
          </Button>
          <ThemeToggle />
        </Toolbar>
      </AppBar>

      <Box sx={{ mt: 4, mb: 4 }}>
        <Button variant="contained" onClick={() => setIsAddPlaylistOpen(true)} startIcon={<AddIcon />}>
          New Playlist
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {playlists.map((playlist) => (
          <Box 
            key={playlist.id} 
            sx={{ 
              width: { xs: '100%', md: 'calc(50% - 12px)', lg: 'calc(33.33% - 16px)' },
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Paper
              sx={{
                p: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(playlist.id)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {playlist.name}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Chip
                      size="small"
                      label={`${playlist.tracks.length} tracks`}
                      color="primary"
                      variant="outlined"
                    />
                    {playlist.isPublic && (
                      <Chip
                        size="small"
                        label="Public"
                        color="success"
                        variant="outlined"
                      />
                    )}
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Created: {new Date(playlist.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Updated: {new Date(playlist.updatedAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => deletePlaylist(playlist.id)}
                  sx={{ color: 'error.main' }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              <PlaylistStats playlist={playlist} />

              <Box sx={{ flexGrow: 1, mt: 2 }}>
                {playlist.tracks.map((track) => (
                  <Box
                    key={track.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1,
                      p: 1,
                      borderRadius: 1,
                      bgcolor: 'action.hover',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'action.selected',
                      },
                    }}
                    draggable
                    onDragStart={() => handleDragStart(track, playlist.id)}
                    onClick={() => setSelectedTrack({ track, playlistId: playlist.id })}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2">{track.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {track.artist}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(playlist.id, track.id);
                      }}
                      color={track.liked ? 'primary' : 'default'}
                    >
                      {track.liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </Box>
                ))}
              </Box>

              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => {
                  setSelectedPlaylist(playlist.id);
                  setIsAddTrackOpen(true);
                }}
                sx={{ mt: 2 }}
              >
                Add Track
              </Button>
            </Paper>
          </Box>
        ))}
      </Box>

      <Dialog open={isAddPlaylistOpen} onClose={handleCloseAddPlaylist}>
        <DialogTitle>Create New Playlist</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Playlist Name"
            fullWidth
            value={newPlaylistName}
            onChange={(e) => {
              setNewPlaylistName(e.target.value);
              setError(null);
            }}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddPlaylist}>Cancel</Button>
          <Button onClick={handleAddPlaylist} variant="contained" disabled={!newPlaylistName.trim()}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isAddTrackOpen} onClose={handleCloseAddTrack}>
        <DialogTitle>Add Track to Playlist</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="SoundCloud URL"
            fullWidth
            value={newTrackUrl}
            onChange={(e) => {
              setNewTrackUrl(e.target.value);
              setError(null);
            }}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddTrack}>Cancel</Button>
          <Button onClick={handleAddTrack} variant="contained" disabled={!newTrackUrl.trim()}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <BackupRestore
        open={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
      />

      {selectedTrack && (
        <TrackDetails
          track={selectedTrack.track}
          onClose={() => setSelectedTrack(null)}
          onLike={() => {
            toggleLike(selectedTrack.playlistId, selectedTrack.track.id);
            setSelectedTrack(null);
          }}
          onDelete={() => {
            removeTrack(selectedTrack.playlistId, selectedTrack.track.id);
            setSelectedTrack(null);
          }}
          onAddComment={(text) => {
            addComment(selectedTrack.playlistId, selectedTrack.track.id, text);
          }}
          onDeleteComment={(commentId) => {
            deleteComment(selectedTrack.playlistId, selectedTrack.track.id, commentId);
          }}
        />
      )}
    </Box>
  );
};

export default PlaylistManager; 