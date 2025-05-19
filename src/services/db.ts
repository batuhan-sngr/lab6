import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Playlist, Track, ThemeMode } from '../types';

interface PlaylistDB extends DBSchema {
  playlists: {
    key: string;
    value: Playlist;
  };
  theme: {
    key: string;
    value: ThemeMode;
  };
}

class DatabaseService {
  private db: IDBPDatabase<PlaylistDB> | null = null;

  async init() {
    this.db = await openDB<PlaylistDB>('playlist-manager', 1, {
      upgrade(db) {
        db.createObjectStore('playlists');
        db.createObjectStore('theme');
      },
    });
  }

  async getPlaylists(): Promise<Playlist[]> {
    if (!this.db) await this.init();
    return (await this.db!.getAll('playlists')) || [];
  }

  async getPlaylist(id: string): Promise<Playlist | undefined> {
    if (!this.db) await this.init();
    return await this.db!.get('playlists', id);
  }

  async savePlaylist(playlist: Playlist): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.put('playlists', playlist, playlist.id);
  }

  async deletePlaylist(id: string): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.delete('playlists', id);
  }

  async getTheme(): Promise<ThemeMode> {
    if (!this.db) await this.init();
    return (await this.db!.get('theme', 'current')) || { mode: 'light' };
  }

  async saveTheme(theme: ThemeMode): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.put('theme', theme, 'current');
  }
}

export const db = new DatabaseService(); 