import { CssBaseline, Container, Box } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import { PlaylistProvider } from './contexts/PlaylistContext';
import { SettingsProvider } from './contexts/SettingsContext';
import PlaylistManager from './components/PlaylistManager';

function App() {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <PlaylistProvider>
          <CssBaseline />
          <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
              <PlaylistManager />
            </Box>
          </Container>
        </PlaylistProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
}

export default App;
