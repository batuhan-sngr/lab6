import React from 'react';
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  MusicNote as MusicNoteIcon,
  Favorite as FavoriteIcon,
  AccessTime as AccessTimeIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import type { Playlist } from '../types';

interface PlaylistStatsProps {
  playlist: Playlist;
}

const PlaylistStats: React.FC<PlaylistStatsProps> = ({ playlist }) => {
  const theme = useTheme();

  const totalDuration = playlist.tracks.reduce((sum, track) => sum + (track.duration || 0), 0);
  const likedTracks = playlist.tracks.filter(track => track.liked).length;
  const totalTracks = playlist.tracks.length;
  const averageRating = playlist.tracks.reduce((sum, track) => sum + (track.rating || 0), 0) / totalTracks || 0;

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const stats = [
    {
      label: 'Total Tracks',
      value: totalTracks,
      icon: <MusicNoteIcon />,
      color: theme.palette.primary.main,
    },
    {
      label: 'Liked Tracks',
      value: likedTracks,
      icon: <FavoriteIcon />,
      color: theme.palette.error.main,
    },
    {
      label: 'Total Duration',
      value: formatDuration(totalDuration),
      icon: <AccessTimeIcon />,
      color: theme.palette.info.main,
    },
    {
      label: 'Average Rating',
      value: averageRating.toFixed(1),
      icon: <StarIcon />,
      color: theme.palette.warning.main,
    },
  ];

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Playlist Statistics
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
        {stats.map((stat) => (
          <Box key={stat.label}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ color: stat.color, mr: 1 }}>{stat.icon}</Box>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </Box>
            <Typography variant="h6" color={stat.color}>
              {stat.value}
            </Typography>
            {stat.label === 'Liked Tracks' && (
              <Box sx={{ mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={(likedTracks / totalTracks) * 100}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    bgcolor: theme.palette.action.hover,
                    '& .MuiLinearProgress-bar': {
                      bgcolor: stat.color,
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {Math.round((likedTracks / totalTracks) * 100)}% of tracks liked
                </Typography>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default PlaylistStats; 