
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { loginUser } from '../../utils/api';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }
    try {
      const userData = await loginUser({ username, password });
      login(userData);
      navigate(`/${userData.role.toLowerCase()}`);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <Box className="container card" sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        <LoginIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Login
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
      <Button className="btn" variant="contained" onClick={handleLogin} sx={{ mt: 2 }}>
        Login
      </Button>
    </Box>
  );
};

export default Login;
