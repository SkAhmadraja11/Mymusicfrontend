
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { addRating, getUserRatings, searchSongs } from '../../utils/api';
import { Box, Typography, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Alert, Rating } from '@mui/material';
import StarRateIcon from '@mui/icons-material/StarRate';

const SongRating = () => {
  const { user } = useContext(AuthContext);
  const [ratings, setRatings] = useState([]);
  const [songQuery, setSongQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [ratingValue, setRatingValue] = useState(0);
  const [review, setReview] = useState('');
  const [selectedSongId, setSelectedSongId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const data = await getUserRatings(user.id);
        setRatings(data);
      } catch (err) {
        setError('Failed to fetch ratings');
      }
    };
    fetchRatings();
  }, [user.id]);

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

  const handleAddRating = async () => {
    if (!selectedSongId || !ratingValue) {
      setError('Song and rating are required');
      return;
    }
    try {
      const rating = { rating: ratingValue, review, user: { id: user.id }, song: { id: selectedSongId } };
      const newRating = await addRating(rating);
      setRatings([...ratings, newRating]);
      setRatingValue(0);
      setReview('');
      setSelectedSongId('');
    } catch (err) {
      setError('Failed to add rating');
    }
  };

  return (
    <Box className="container card" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        <StarRateIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> My Ratings
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
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
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1">Select Song:</Typography>
        {songs.map((song) => (
          <Button
            key={song.id}
            className="btn"
            variant={selectedSongId === song.id ? 'contained' : 'outlined'}
            onClick={() => setSelectedSongId(song.id)}
            sx={{ m: 1 }}
          >
            {song.title}
          </Button>
        ))}
        <Rating
          value={ratingValue}
          onChange={(e, newValue) => setRatingValue(newValue)}
          max={5}
          sx={{ mt: 2 }}
        />
        <TextField
          className="input-field"
          label="Review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button className="btn" variant="contained" onClick={handleAddRating} sx={{ mt: 2 }}>
          Add Rating
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Song</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Review</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ratings.map((rating) => (
            <TableRow key={rating.id}>
              <TableCell>{rating.song.title}</TableCell>
              <TableCell>{rating.rating}</TableCell>
              <TableCell>{rating.review}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default SongRating;
