import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Playlist, Track } from '../types';
import { db } from '../services/db';

interface PlaylistContextType {
  playlists: Playlist[];
  addPlaylist: (name: string) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  addTrack: (playlistId: string, track: Omit<Track, 'id' | 'createdAt'>) => Promise<void>;
  removeTrack: (playlistId: string, trackId: string) => Promise<void>;
  toggleLike: (playlistId: string, trackId: string) => Promise<void>;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const PlaylistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    const loadPlaylists = async () => {
      const loadedPlaylists = await db.getPlaylists();
      setPlaylists(loadedPlaylists);
    };
    loadPlaylists();
  }, []);

  const addPlaylist = async (name: string) => {
    const newPlaylist: Playlist = {
      id: crypto.randomUUID(),
      name,
      tracks: [],
      createdAt: Date.now(),
    };
    await db.savePlaylist(newPlaylist);
    setPlaylists([...playlists, newPlaylist]);
  };

  const deletePlaylist = async (id: string) => {
    await db.deletePlaylist(id);
    setPlaylists(playlists.filter(playlist => playlist.id !== id));
  };

  const addTrack = async (playlistId: string, track: Omit<Track, 'id' | 'createdAt'>) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;

    const newTrack: Track = {
      ...track,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };

    const updatedPlaylist = {
      ...playlist,
      tracks: [...playlist.tracks, newTrack],
    };

    await db.savePlaylist(updatedPlaylist);
    setPlaylists(playlists.map(p => p.id === playlistId ? updatedPlaylist : p));
  };

  const removeTrack = async (playlistId: string, trackId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;

    const updatedPlaylist = {
      ...playlist,
      tracks: playlist.tracks.filter(track => track.id !== trackId),
    };

    await db.savePlaylist(updatedPlaylist);
    setPlaylists(playlists.map(p => p.id === playlistId ? updatedPlaylist : p));
  };

  const toggleLike = async (playlistId: string, trackId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;

    const updatedPlaylist = {
      ...playlist,
      tracks: playlist.tracks.map(track =>
        track.id === trackId ? { ...track, liked: !track.liked } : track
      ),
    };

    await db.savePlaylist(updatedPlaylist);
    setPlaylists(playlists.map(p => p.id === playlistId ? updatedPlaylist : p));
  };

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        addPlaylist,
        deletePlaylist,
        addTrack,
        removeTrack,
        toggleLike,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylists = () => {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error('usePlaylists must be used within a PlaylistProvider');
  }
  return context;
}; 