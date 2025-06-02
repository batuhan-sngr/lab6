import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Slider,
  Typography,
  Paper,
  useTheme,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  VolumeUp,
  VolumeOff,
} from '@mui/icons-material';
import type { Track } from '../types';

interface MiniPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onVolumeChange: (volume: number) => void;
  volume: number;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({
  currentTrack,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onVolumeChange,
  volume,
}) => {
  const theme = useTheme();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (currentTrack) {
      // Reset time when track changes
      setCurrentTime(0);
      // In a real implementation, you would get the actual duration from the SoundCloud player
      setDuration(180); // Example duration in seconds
    }
  }, [currentTrack]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVolumeToggle = () => {
    if (isMuted) {
      onVolumeChange(1);
    } else {
      onVolumeChange(0);
    }
    setIsMuted(!isMuted);
  };

  if (!currentTrack) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        p: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        bgcolor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 200 }}>
        <IconButton onClick={onPrevious} size="small">
          <SkipPrevious />
        </IconButton>
        <IconButton onClick={onPlayPause} size="small">
          {isPlaying ? <Pause /> : <PlayArrow />}
        </IconButton>
        <IconButton onClick={onNext} size="small">
          <SkipNext />
        </IconButton>
      </Box>

      <Box sx={{ flexGrow: 1, mx: 2 }}>
        <Typography variant="subtitle2" noWrap>
          {currentTrack.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {currentTrack.artist}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {formatTime(currentTime)}
          </Typography>
          <Slider
            size="small"
            value={currentTime}
            max={duration}
            onChange={(_, value) => setCurrentTime(value as number)}
            sx={{ mx: 1 }}
          />
          <Typography variant="caption" color="text.secondary">
            {formatTime(duration)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 100 }}>
        <IconButton onClick={handleVolumeToggle} size="small">
          {isMuted ? <VolumeOff /> : <VolumeUp />}
        </IconButton>
        <Slider
          size="small"
          value={volume}
          min={0}
          max={1}
          step={0.1}
          onChange={(_, value) => onVolumeChange(value as number)}
          sx={{ width: 80 }}
        />
      </Box>
    </Paper>
  );
};

export default MiniPlayer; 