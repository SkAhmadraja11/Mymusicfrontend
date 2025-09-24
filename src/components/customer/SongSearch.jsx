
import { useState } from 'react';
import { searchSongs, getRecommendedSongs } from '../../utils/api';
import { Box, Typography, TextField, Button, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SongSearch = () => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('genre');
  const [songs, setSongs] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query) {
      setError('Search query is required');
      return;
    }
    try {
      const data = await searchSongs(query, type);
      setSongs(data);
      const recs = await getRecommendedSongs(query);
      setRecommendations(recs);
    } catch (err) {
      setError('Search failed');
    }
  };

  return (
    <Box className="container card" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        <SearchIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Song Search
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          className="input-field"
          label="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
        />
        <TextField
          select
          label="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          sx={{ width: 150 }}
        >
          <MenuItem value="genre">Genre</MenuItem>
          <MenuItem value="artist">Artist</MenuItem>
          <MenuItem value="album">Album</MenuItem>
        </TextField>
        <Button className="btn" variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>
      <Typography variant="h6">Search Results</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Artist</TableCell>
            <TableCell>Genre</TableCell>
            <TableCell>Album</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {songs.map((song) => (
            <TableRow key={song.id}>
              <TableCell>{song.title}</TableCell>
              <TableCell>{song.artist}</TableCell>
              <TableCell>{song.genre}</TableCell>
              <TableCell>{song.album}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Typography variant="h6" sx={{ mt: 2 }}>Recommended Songs</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Artist</TableCell>
            <TableCell>Genre</TableCell>
            <TableCell>Album</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recommendations.map((song) => (
            <TableRow key={song.id}>
              <TableCell>{song.title}</TableCell>
              <TableCell>{song.artist}</TableCell>
              <TableCell>{song.genre}</TableCell>
              <TableCell>{song.album}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default SongSearch;
