# SoundCloud Playlist Manager

A modern web application that allows users to create and manage personal playlists using SoundCloud embedded links. The application features a beautiful, responsive design with both light and dark themes.

## Features

- Create and manage multiple playlists
- Add SoundCloud tracks to playlists using embedded links
- Like/unlike tracks
- Filter playlists and tracks
- Dark/Light theme support
- Persistent storage using IndexedDB
- Responsive design for all devices

## Technical Stack

- React with TypeScript
- Material-UI for components and theming
- IndexedDB for local storage
- Vite for build tooling

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Application Flow

1. **Playlist Management**
   - Create new playlists
   - Delete existing playlists
   - Rename playlists
   - View all playlists

2. **Track Management**
   - Add tracks using SoundCloud embedded links
   - Remove tracks from playlists
   - Like/unlike tracks
   - Filter tracks by name or artist

3. **Theme**
   - Toggle between light and dark themes
   - Theme preference is saved in local storage

4. **Data Persistence**
   - All playlists and tracks are stored in IndexedDB
   - Data persists across browser sessions

## Development Progress

The application development is tracked through Git commits, showing the evolution of features and improvements over time. Each commit represents a working version of the application.
