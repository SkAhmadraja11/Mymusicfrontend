
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { updateProfile } from '../utils/api';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUpdate = async () => {
    if (!username || !email) {
      setError('Username and email are required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format');
      return;
    }
    try {
      const updatedUser = await updateProfile(user.id, { username, email, password, role: user.role });
      login(updatedUser);
      navigate(`/${user.role.toLowerCase()}`);
    } catch (err) {
      setError('Update failed');
    }
  };

  return (
    <Box className="container card" sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        <AccountCircleIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Profile
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        className="input-field"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        className="input-field"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        className="input-field"
        label="Password (optional)"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Typography variant="body1">Role: {user?.role}</Typography>
      <Button className="btn" variant="contained" onClick={handleUpdate} sx={{ mt: 2 }}>
        Update Profile
      </Button>
    </Box>
  );
};

export default Profile;
