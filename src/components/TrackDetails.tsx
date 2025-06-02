import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import type { Track } from '../types';

interface TrackDetailsProps {
  track: Track;
  onClose: () => void;
  onLike: () => void;
  onDelete: () => void;
  onAddComment: (text: string) => void;
  onDeleteComment: (commentId: string) => void;
}

const TrackDetails: React.FC<TrackDetailsProps> = ({
  track,
  onClose,
  onLike,
  onDelete,
  onAddComment,
  onDeleteComment,
}) => {
  const theme = useTheme();
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  return (
    <Dialog
      open={true}
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
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{track.title}</Typography>
          <Box>
            <IconButton onClick={onLike} color={track.liked ? 'primary' : 'default'}>
              {track.liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <IconButton onClick={onDelete} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Track Information
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Artist: {track.artist}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Plays: {track.playCount}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Added: {new Date(track.createdAt).toLocaleDateString()}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            SoundCloud Player
          </Typography>
          <iframe
            width="100%"
            height="166"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={`https://w.soundcloud.com/player/?url=${track.soundcloudUrl}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
          />
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Comments
          </Typography>
          <List>
            {track.comments.map((comment) => (
              <React.Fragment key={comment.id}>
                <ListItem>
                  <ListItemText
                    primary={comment.text}
                    secondary={new Date(comment.createdAt).toLocaleString()}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => onDeleteComment(comment.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddComment();
                }
              }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              Add
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TrackDetails; 