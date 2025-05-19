export interface Track {
  id: string;
  title: string;
  artist: string;
  soundcloudUrl: string;
  liked: boolean;
  createdAt: number;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  createdAt: number;
}

export interface ThemeMode {
  mode: 'light' | 'dark';
} 