
import { useState, useEffect } from 'react';
import { getAllUsers, getUserPlaylists, deletePlaylist } from '../../utils/api';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, Alert } from '@mui/material';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

const PlaylistManagement = () => {
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const users = await getAllUsers();
        const userPlaylists = await Promise.all(
          users.filter((u) => u.role === 'CUSTOMER').map((u) => getUserPlaylists(u.id))
        );
        setPlaylists(userPlaylists.flat());
      } catch (err) {
        setError('Failed to fetch playlists');
      }
    };
    fetchPlaylists();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deletePlaylist(id);
      setPlaylists(playlists.filter((playlist) => playlist.id !== id));
    } catch (err) {
      setError('Failed to delete playlist');
    }
  };

  return (
    <Box className="container card" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        <PlaylistAddIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Playlist Management
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Songs</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {playlists.map((playlist) => (
            <TableRow key={playlist.id}>
              <TableCell>{playlist.name}</TableCell>
              <TableCell>{playlist.user.username}</TableCell>
              <TableCell>{playlist.songs.length}</TableCell>
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

export default PlaylistManagement;
