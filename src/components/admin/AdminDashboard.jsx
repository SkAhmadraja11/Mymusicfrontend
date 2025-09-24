
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const AdminDashboard = () => {
  return (
    <Box className="container card" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        <AdminPanelSettingsIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Admin Dashboard
      </Typography>
      <Button className="btn" variant="contained" component={Link} to="/admin/users" sx={{ m: 1 }}>
        Manage Users
      </Button>
      <Button className="btn" variant="contained" component={Link} to="/admin/songs" sx={{ m: 1 }}>
        Manage Songs
      </Button>
      <Button className="btn" variant="contained" component={Link} to="/admin/playlists" sx={{ m: 1 }}>
        Manage Playlists
      </Button>
    </Box>
  );
};

export default AdminDashboard;
