
import { Box, Typography } from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#1e3c72', color: '#fff', p: 2, textAlign: 'center', mt: 'auto' }}>
      <MusicNoteIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
      <Typography variant="body2">
        &copy; 2025 Music Streaming App. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
