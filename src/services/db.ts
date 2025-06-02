import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { Playlist, AppSettings, BackupData } from '../types';

interface PlaylistDB extends DBSchema {
  playlists: {
    key: string;
    value: Playlist;
    indexes: { 'by-name': string };
  };
  settings: {
    key: string;
    value: AppSettings & { id: string };
  };
}

class Database {
  private db: IDBPDatabase<PlaylistDB> | null = null;
  private static instance: Database;
  private initPromise: Promise<IDBPDatabase<PlaylistDB>> | null = null;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private async createDB(): Promise<IDBPDatabase<PlaylistDB>> {
    return openDB<PlaylistDB>('playlist-manager', 5, {
      upgrade(db) {
        // Always delete existing stores to ensure clean state
        if (db.objectStoreNames.contains('playlists')) {
          db.deleteObjectStore('playlists');
        }
        if (db.objectStoreNames.contains('settings')) {
          db.deleteObjectStore('settings');
        }

        // Create new stores with proper configuration
        const playlistStore = db.createObjectStore('playlists', { keyPath: 'id' });
        playlistStore.createIndex('by-name', 'name', { unique: false });
        db.createObjectStore('settings', { keyPath: 'id' });
      },
      blocked() {
        console.warn('Database access blocked');
      },
      blocking() {
        console.warn('Database access blocking');
      },
      terminated: () => {
        console.warn('Database connection terminated');
        this.db = null;
        this.initPromise = null;
      },
    });
  }

  async init(): Promise<IDBPDatabase<PlaylistDB>> {
    if (this.db) {
      return this.db;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.createDB();
    try {
      this.db = await this.initPromise;
      return this.db;
    } catch (error) {
      this.initPromise = null;
      throw error;
    }
  }

  async getPlaylists(): Promise<Playlist[]> {
    try {
      const db = await this.init();
      const tx = db.transaction('playlists', 'readonly');
      const store = tx.objectStore('playlists');
      const playlists = await store.getAll();
      await tx.done;
      return playlists;
    } catch (error) {
      console.error('Error getting playlists:', error);
      return [];
    }
  }

  async savePlaylist(playlist: Playlist): Promise<void> {
    if (!playlist.id) {
      throw new Error('Playlist must have an id');
    }

    try {
      const db = await this.init();
      const tx = db.transaction('playlists', 'readwrite');
      const store = tx.objectStore('playlists');
      await store.put(playlist);
      await tx.done;
    } catch (error) {
      console.error('Error saving playlist:', error);
      throw error;
    }
  }

  async deletePlaylist(id: string): Promise<void> {
    try {
      const db = await this.init();
      const tx = db.transaction('playlists', 'readwrite');
      const store = tx.objectStore('playlists');
      await store.delete(id);
      await tx.done;
    } catch (error) {
      console.error('Error deleting playlist:', error);
      throw error;
    }
  }

  async getSettings(): Promise<AppSettings | null> {
    try {
      const db = await this.init();
      const tx = db.transaction('settings', 'readonly');
      const store = tx.objectStore('settings');
      const settings = await store.get('app-settings');
      await tx.done;
      return settings || null;
    } catch (error) {
      console.error('Error getting settings:', error);
      return null;
    }
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      const db = await this.init();
      const tx = db.transaction('settings', 'readwrite');
      const store = tx.objectStore('settings');
      await store.put({ ...settings, id: 'app-settings' });
      await tx.done;
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  async restoreFromBackup(backupData: BackupData): Promise<void> {
    try {
      const db = await this.init();
      const tx = db.transaction(['playlists', 'settings'], 'readwrite');

      // Clear existing data
      await tx.objectStore('playlists').clear();
      await tx.objectStore('settings').clear();

      // Restore playlists
      for (const playlist of backupData.playlists) {
        if (!playlist.id) {
          throw new Error('Playlist in backup must have an id');
        }
        await tx.objectStore('playlists').put(playlist);
      }

      // Restore settings
      await tx.objectStore('settings').put({ ...backupData.settings, id: 'app-settings' });

      await tx.done;
    } catch (error) {
      console.error('Error restoring from backup:', error);
      throw error;
    }
  }
}

// Create and export a single instance
const db = Database.getInstance();
export { db }; 