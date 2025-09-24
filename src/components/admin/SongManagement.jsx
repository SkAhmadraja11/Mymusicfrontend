
import { useState, useEffect } from 'react';
import { addSong, updateSong, deleteSong, getAllUsers } from '../../utils/api';
import { Box, Typography, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Alert } from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const SongManagement = () => {
  const [songs, setSongs] = useState([]);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [album, setAlbum] = useState('');
  const [url, setUrl] = useState('');
  const [artistId, setArtistId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const artists = await getAllUsers();
        const artistSongs = await Promise.all(
          artists.filter((u) => u.role === 'ARTIST').map((a) => getSongsByArtist(a.id))
        );
        setSongs(artistSongs.flat());
      } catch (err) {
        setError('Failed to fetch songs');
      }
    };
    fetchSongs();
  }, []);

  const handleAdd = async () => {
    if (!title || !artist || !url || !artistId) {
      setError('Title, artist, URL, and artist ID are required');
      return;
    }
    try {
      const song = { title, artist, genre, album, url, artistUser: { id: artistId } };
      const newSong = await addSong(song);
      setSongs([...songs, newSong]);
      setTitle('');
      setArtist('');
      setGenre('');
      setAlbum('');
      setUrl('');
      setArtistId('');
    } catch (err) {
      setError('Failed to add song');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSong(id);
      setSongs(songs.filter((song) => song.id !== id));
    } catch (err) {
      setError('Failed to delete song');
    }
  };

  return (
    <Box className="container card" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        <MusicNoteIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Song Management
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ mb: 2 }}>
        <TextField
          className="input-field"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          className="input-field"
          label="Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          className="input-field"
          label="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          className="input-field"
          label="Album"
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          className="input-field"
          label="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          className="input-field"
          label="Artist ID"
          value={artistId}
          onChange={(e) => setArtistId(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button className="btn" variant="contained" onClick={handleAdd} sx={{ mt: 2 }}>
          Add Song
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Artist</TableCell>
            <TableCell>Genre</TableCell>
            <TableCell>Album</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {songs.map((song) => (
            <TableRow key={song.id}>
              <TableCell>{song.title}</TableCell>
              <TableCell>{song.artist}</TableCell>
              <TableCell>{song.genre}</TableCell>
              <TableCell>{song.album}</TableCell>
              <TableCell>
                <Button className="btn" variant="contained" color="error" onClick={() => handleDelete(song.id)}>
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

export default SongManagement;
