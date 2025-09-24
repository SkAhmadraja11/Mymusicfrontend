
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { registerUser } from '../../utils/api';
import { TextField, Button, Box, Typography, Alert, MenuItem } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password || !email || !role) {
      setError('All fields are required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format');
      return;
    }
    try {
      const userData = await registerUser({ username, password, email, role });
      login(userData);
      navigate(`/${userData.role.toLowerCase()}`);
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <Box className="container card" sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        <PersonAddIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Register
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
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
        select
        label="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        fullWidth
        margin="normal"
      >
        <MenuItem value="CUSTOMER">Customer</MenuItem>
        <MenuItem value="ARTIST">Artist</MenuItem>
        <MenuItem value="ADMIN">Admin</MenuItem>
      </TextField>
      <Button className="btn" variant="contained" onClick={handleRegister} sx={{ mt: 2 }}>
        Register
      </Button>
    </Box>
  );
};

export default Register;
