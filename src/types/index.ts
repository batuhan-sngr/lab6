export interface Track {
  id: string;
  title: string;
  artist: string;
  soundcloudUrl: string;
  liked: boolean;
  createdAt: number;
  playCount: number;
  comments: Comment[];
  duration?: number;
  rating?: number;
  notes?: string;
}

export interface Comment {
  id: string;
  text: string;
  createdAt: number;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  createdAt: number;
  updatedAt: number;
  tags: string[];
  isPublic: boolean;
  playCount: number;
  viewCount: number;
  description?: string;
  coverImage?: string;
  category?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'high-contrast';
  viewMode: 'grid' | 'list';
  sortBy: 'name' | 'date' | 'playCount';
  sortOrder: 'asc' | 'desc';
  showMiniPlayer: boolean;
  autoPlay: boolean;
  keyboardShortcuts: boolean;
}

export interface BackupData {
  playlists: Playlist[];
  settings: AppSettings;
  version: string;
  timestamp: number;
}

export interface ThemeMode {
  mode: 'light' | 'dark' | 'high-contrast';
} 