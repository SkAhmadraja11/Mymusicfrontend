
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#1e3c72' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" component={Link} to="/">
          <MusicNoteIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Music Streaming App
        </Typography>
        {user ? (
          <>
            <Button color="inherit" component={Link} to={`/${user.role.toLowerCase()}`}>
              Dashboard
            </Button>
            <Button color="inherit" component={Link} to="/profile">
              Profile
            </Button>
            {user.role === 'ADMIN' && (
              <>
                <Button color="inherit" component={Link} to="/admin/users">
                  Users
                </Button>
                <Button color="inherit" component={Link} to="/admin/songs">
                  Songs
                </Button>
                <Button color="inherit" component={Link} to="/admin/playlists">
                  Playlists
                </Button>
              </>
            )}
            {user.role === 'CUSTOMER' && (
              <>
                <Button color="inherit" component={Link} to="/customer/search">
                  Search
                </Button>
                <Button color="inherit" component={Link} to="/customer/playlists">
                  Playlists
                </Button>
                <Button color="inherit" component={Link} to="/customer/ratings">
                  Ratings
                </Button>
              </>
            )}
            {user.role === 'ARTIST' && (
              <Button color="inherit" component={Link} to="/artist/upload">
                Upload Song
              </Button>
            )}
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
