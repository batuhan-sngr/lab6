export interface Track {
  id: string;
  title: string;
  artist: string;
  soundcloudUrl: string;
  liked: boolean;
  createdAt: number;
  playCount: number;
  duration?: number;
  rating?: number;
  notes?: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  createdAt: number;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  tracks: Track[];
  createdAt: number;
  updatedAt: number;
  category?: string;
  tags: string[];
  isPublic: boolean;
  playCount: number;
  viewCount: number;
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