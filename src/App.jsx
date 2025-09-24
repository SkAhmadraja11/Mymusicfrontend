
import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/Profile';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import SongManagement from './components/admin/SongManagement';
import PlaylistManagement from './components/admin/PlaylistManagement';
import CustomerDashboard from './components/customer/CustomerDashboard';
import SongSearch from './components/customer/SongSearch';
import Playlist from './components/customer/Playlist';
import SongRating from './components/customer/SongRating';
import ArtistDashboard from './components/artist/ArtistDashboard';
import SongUpload from './components/artist/SongUpload';
import { Box } from '@mui/material';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role.toLowerCase()}`} />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to={`/${user.role.toLowerCase()}`} />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/admin" element={user && user.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/login" />} />
            <Route path="/admin/users" element={user && user.role === 'ADMIN' ? <UserManagement /> : <Navigate to="/login" />} />
            <Route path="/admin/songs" element={user && user.role === 'ADMIN' ? <SongManagement /> : <Navigate to="/login" />} />
            <Route path="/admin/playlists" element={user && user.role === 'ADMIN' ? <PlaylistManagement /> : <Navigate to="/login" />} />
            <Route path="/customer" element={user && user.role === 'CUSTOMER' ? <CustomerDashboard /> : <Navigate to="/login" />} />
            <Route path="/customer/search" element={user && user.role === 'CUSTOMER' ? <SongSearch /> : <Navigate to="/login" />} />
            <Route path="/customer/playlists" element={user && user.role === 'CUSTOMER' ? <Playlist /> : <Navigate to="/login" />} />
            <Route path="/customer/ratings" element={user && user.role === 'CUSTOMER' ? <SongRating /> : <Navigate to="/login" />} />
            <Route path="/artist" element={user && user.role === 'ARTIST' ? <ArtistDashboard /> : <Navigate to="/login" />} />
            <Route path="/artist/upload" element={user && user.role === 'ARTIST' ? <SongUpload /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to={user ? `/${user.role.toLowerCase()}` : '/login'} />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}

export default App;
