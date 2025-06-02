import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Playlist, Track } from '../types';
import { db } from '../services/db';

interface PlaylistContextType {
  playlists: Playlist[];
  addPlaylist: (name: string) => Promise<Playlist>;
  deletePlaylist: (id: string) => Promise<void>;
  addTrack: (playlistId: string, track: Omit<Track, 'id' | 'createdAt'>) => Promise<void>;
  removeTrack: (playlistId: string, trackId: string) => Promise<void>;
  toggleLike: (playlistId: string, trackId: string) => Promise<void>;
  updatePlaylist: (id: string, updates: Partial<Playlist>) => Promise<void>;
  addComment: (playlistId: string, trackId: string, text: string) => Promise<void>;
  deleteComment: (playlistId: string, trackId: string, commentId: string) => Promise<void>;
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

  const addPlaylist = async (name: string): Promise<Playlist> => {
    const newPlaylist: Playlist = {
      id: crypto.randomUUID(),
      name,
      tracks: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: [],
      isPublic: false,
      playCount: 0,
      viewCount: 0,
    };
    await db.savePlaylist(newPlaylist);
    setPlaylists((prev) => [...prev, newPlaylist]);
    return newPlaylist;
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
      playCount: 0,
      comments: [],
    };

    const updatedPlaylist = {
      ...playlist,
      tracks: [...playlist.tracks, newTrack],
      updatedAt: Date.now(),
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
      updatedAt: Date.now(),
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
      updatedAt: Date.now(),
    };

    await db.savePlaylist(updatedPlaylist);
    setPlaylists(playlists.map(p => p.id === playlistId ? updatedPlaylist : p));
  };

  const updatePlaylist = async (id: string, updates: Partial<Playlist>) => {
    const playlist = playlists.find(p => p.id === id);
    if (!playlist) return;

    const updatedPlaylist = {
      ...playlist,
      ...updates,
      updatedAt: Date.now(),
    };

    await db.savePlaylist(updatedPlaylist);
    setPlaylists(playlists.map(p => p.id === id ? updatedPlaylist : p));
  };

  const addComment = async (playlistId: string, trackId: string, text: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;

    const updatedPlaylist = {
      ...playlist,
      tracks: playlist.tracks.map(track => {
        if (track.id === trackId) {
          return {
            ...track,
            comments: [
              ...track.comments,
              {
                id: crypto.randomUUID(),
                text,
                createdAt: Date.now(),
              },
            ],
          };
        }
        return track;
      }),
      updatedAt: Date.now(),
    };

    await db.savePlaylist(updatedPlaylist);
    setPlaylists(playlists.map(p => p.id === playlistId ? updatedPlaylist : p));
  };

  const deleteComment = async (playlistId: string, trackId: string, commentId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;

    const updatedPlaylist = {
      ...playlist,
      tracks: playlist.tracks.map(track => {
        if (track.id === trackId) {
          return {
            ...track,
            comments: track.comments.filter(comment => comment.id !== commentId),
          };
        }
        return track;
      }),
      updatedAt: Date.now(),
    };

    await db.savePlaylist(updatedPlaylist);
    setPlaylists(playlists.map(p => p.id === playlistId ? updatedPlaylist : p));
  };

  const value = {
    playlists,
    addPlaylist,
    deletePlaylist,
    addTrack,
    removeTrack,
    toggleLike,
    updatePlaylist,
    addComment,
    deleteComment,
  };

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
};

function usePlaylists() {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error('usePlaylists must be used within a PlaylistProvider');
  }
  return context;
}

export { usePlaylists }; 