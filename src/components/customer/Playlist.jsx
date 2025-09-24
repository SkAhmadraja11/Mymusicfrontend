
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { createPlaylist, getUserPlaylists, addSongToPlaylist, deletePlaylist, searchSongs } from '../../utils/api';
import { Box, Typography, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Alert } from '@mui/material';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

const Playlist = () => {
  const { user } = useContext(AuthContext);
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState('');
  const [songQuery, setSongQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const data = await getUserPlaylists(user.id);
        setPlaylists(data);
      } catch (err) {
        setError('Failed to fetch playlists');
      }
    };
    fetchPlaylists();
  }, [user.id]);

  const handleCreate = async () => {
    if (!name) {
      setError('Playlist name is required');
      return;
    }
    try {
      const newPlaylist = await createPlaylist(name, user.id);
      setPlaylists([...playlists, newPlaylist]);
      setName('');
    } catch (err) {
      setError('Failed to create playlist');
    }
  };

  const handleAddSong = async (playlistId, songId) => {
    try {
      const updatedPlaylist = await addSongToPlaylist(playlistId, songId);
      setPlaylists(playlists.map((p) => (p.id === playlistId ? updatedPlaylist : p)));
    } catch (err) {
      setError('Failed to add song to playlist');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePlaylist(id);
      setPlaylists(playlists.filter((p) => p.id !== id));
    } catch (err) {
      setError('Failed to delete playlist');
    }
  };

  const handleSearchSongs = async () => {
    if (!songQuery) {
      setError('Song search query is required');
      return;
    }
    try {
      const data = await searchSongs(songQuery, 'title');
      setSongs(data);
    } catch (err) {
      setError('Failed to search songs');
    }
  };

  return (
    <Box className="container card" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        <PlaylistAddIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> My Playlists
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ mb: 2 }}>
        <TextField
          className="input-field"
          label="Playlist Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button className="btn" variant="contained" onClick={handleCreate} sx={{ mt: 2 }}>
          Create Playlist
        </Button>
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          className="input-field"
          label="Search Songs"
          value={songQuery}
          onChange={(e) => setSongQuery(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button className="btn" variant="contained" onClick={handleSearchSongs} sx={{ mt: 2 }}>
          Search Songs
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Songs</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {playlists.map((playlist) => (
            <TableRow key={playlist.id}>
              <TableCell>{playlist.name}</TableCell>
              <TableCell>
                {playlist.songs.map((song) => song.title).join(', ')}
                <Box sx={{ mt: 1 }}>
                  {songs.map((song) => (
                    <Button
                      key={song.id}
                      className="btn"
                      variant="outlined"
                      onClick={() => handleAddSong(playlist.id, song.id)}
                      sx={{ m: 1 }}
                    >
                      Add {song.title}
                    </Button>
                  ))}
                </Box>
              </TableCell>
              <TableCell>
                <Button className="btn" variant="contained" color="error" onClick={() => handleDelete(playlist.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default Playlist;
