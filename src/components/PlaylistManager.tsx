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
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Add as AddIcon, Delete as DeleteIcon, Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon } from '@mui/icons-material';
import { usePlaylists } from '../contexts/PlaylistContext';
import ThemeToggle from './ThemeToggle';

const PlaylistManager: React.FC = () => {
  const { playlists, addPlaylist, deletePlaylist, addTrack, removeTrack, toggleLike } = usePlaylists();
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newTrackUrl, setNewTrackUrl] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [isAddPlaylistOpen, setIsAddPlaylistOpen] = useState(false);
  const [isAddTrackOpen, setIsAddTrackOpen] = useState(false);

  const handleAddPlaylist = async () => {
    if (newPlaylistName.trim()) {
      await addPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setIsAddPlaylistOpen(false);
    }
  };

  const handleAddTrack = async () => {
    if (selectedPlaylist && newTrackUrl.trim()) {
      // Extract title and artist from SoundCloud URL (this is a simplified version)
      const title = 'Track from SoundCloud';
      const artist = 'Unknown Artist';
      
      await addTrack(selectedPlaylist, {
        title,
        artist,
        soundcloudUrl: newTrackUrl.trim(),
        liked: false,
      });
      
      setNewTrackUrl('');
      setIsAddTrackOpen(false);
    }
  };

  return (
    <Box>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SoundCloud Playlist Manager
          </Typography>
          <ThemeToggle />
        </Toolbar>
      </AppBar>

      <Box sx={{ mt: 4, mb: 4 }}>
        <Button variant="contained" onClick={() => setIsAddPlaylistOpen(true)} startIcon={<AddIcon />}>
          New Playlist
        </Button>
      </Box>

      <Grid container spacing={3}>
        {playlists.map((playlist) => (
          <Grid item xs={12} md={6} lg={4} key={playlist.id}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{playlist.name}</Typography>
                <IconButton onClick={() => deletePlaylist(playlist.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>

              {playlist.tracks.map((track) => (
                <Box key={track.id} sx={{ mb: 2, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle1">{track.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {track.artist}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton onClick={() => toggleLike(playlist.id, track.id)} color="primary">
                        {track.liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      </IconButton>
                      <IconButton onClick={() => removeTrack(playlist.id, track.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <iframe
                    width="100%"
                    height="166"
                    scrolling="no"
                    frameBorder="no"
                    allow="autoplay"
                    src={`https://w.soundcloud.com/player/?url=${track.soundcloudUrl}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
                  />
                </Box>
              ))}

              <Button
                fullWidth
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => {
                  setSelectedPlaylist(playlist.id);
                  setIsAddTrackOpen(true);
                }}
              >
                Add Track
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Add Playlist Dialog */}
      <Dialog open={isAddPlaylistOpen} onClose={() => setIsAddPlaylistOpen(false)}>
        <DialogTitle>Create New Playlist</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Playlist Name"
            fullWidth
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddPlaylistOpen(false)}>Cancel</Button>
          <Button onClick={handleAddPlaylist} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Track Dialog */}
      <Dialog open={isAddTrackOpen} onClose={() => setIsAddTrackOpen(false)}>
        <DialogTitle>Add Track to Playlist</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="SoundCloud Track URL"
            fullWidth
            value={newTrackUrl}
            onChange={(e) => setNewTrackUrl(e.target.value)}
            placeholder="https://soundcloud.com/..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddTrackOpen(false)}>Cancel</Button>
          <Button onClick={handleAddTrack} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlaylistManager; 