
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const CustomerDashboard = () => {
  return (
    <Box className="container card" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        <MusicNoteIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Customer Dashboard
      </Typography>
      <Button className="btn" variant="contained" component={Link} to="/customer/search" sx={{ m: 1 }}>
        Search Songs
      </Button>
      <Button className="btn" variant="contained" component={Link} to="/customer/playlists" sx={{ m: 1 }}>
        My Playlists
      </Button>
      <Button className="btn" variant="contained" component={Link} to="/customer/ratings" sx={{ m: 1 }}>
        My Ratings
      </Button>
    </Box>
  );
};

export default CustomerDashboard;
