import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { createPlaylist, getUserPlaylists, addSongToPlaylist, deletePlaylist } from '../../utils/api';
import { Box, Typography, TextField, Button, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import './style.css';

const SongSearch = () => {
    const { user } = useContext(AuthContext);
    
    // Song Search States
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [searchResults, setSearchResults] = useState([]);
    const [recommendedSongs, setRecommendedSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    
    // Audio Player States
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const audioRef = useRef(new Audio());
    
    // Playlist States
    const [playlists, setPlaylists] = useState([]);
    const [playlistName, setPlaylistName] = useState('');
    const [playlistError, setPlaylistError] = useState('');
    const [addToPlaylistDialog, setAddToPlaylistDialog] = useState({
        open: false,
        song: null
    });

    // Mock data for initial recommended songs
    const mockRecommendedSongs = [
        {
            title: "Trending Now",
            songs: [
                { 
                    id: 1, 
                    name: "Blinding Lights", 
                    artist: "The Weeknd", 
                    genre: "Pop", 
                    album: "After Hours",
                    imageUrl: "/bindinglight.jpg",
                    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                    year: 2020
                },
                { 
                    id: 2, 
                    name: "Flowers", 
                    artist: "Miley Cyrus", 
                    genre: "Pop", 
                    album: "Endless Summer Vacation",
                    imageUrl: "/flower.jpeg",
                    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                    year: 2023
                }
            ]
        },
        {
            title: "Based on Your History",
            songs: [
                { 
                    id: 3, 
                    name: "Save Your Tears", 
                    artist: "The Weeknd", 
                    genre: "Pop", 
                    album: "After Hours",
                    imageUrl: "/assets/song3.jpg",
                    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                    year: 2020
                }
            ]
        }
    ];

    // Mock database of songs for search
    const allSongs = [
        { 
            id: 1, 
            name: "Blinding Lights", 
            artist: "The Weeknd", 
            genre: "Pop", 
            album: "After Hours",
            imageUrl: "/bindinglight.jpg",
            audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            year: 2020,
            type: "song",
            duration: "3:20"
        },
        { 
            id: 2, 
            name: "Shape of You", 
            artist: "Ed Sheeran", 
            genre: "Pop", 
            album: "÷",
            imageUrl: "/flower.jpeg",
            audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            year: 2017,
            type: "song",
            duration: "3:54"
        },
        { 
            id: 3, 
            name: "Bohemian Rhapsody", 
            artist: "Queen", 
            genre: "Rock", 
            album: "A Night at the Opera",
            imageUrl: "/assets/song3.jpg",
            audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
            year: 1975,
            type: "song",
            duration: "5:55"
        }
    ];

    // Load playlists on component mount
    useEffect(() => {
        const loadPlaylists = async () => {
            if (user?.id) {
                try {
                    const data = await getUserPlaylists(user.id);
                    setPlaylists(data);
                } catch (err) {
                    setPlaylistError('Failed to fetch playlists');
                }
            }
        };
        loadPlaylists();
        setRecommendedSongs(mockRecommendedSongs);
    }, [user?.id]);

    // Playlist Functions
    const handleCreatePlaylist = async () => {
        if (!playlistName) {
            setPlaylistError('Playlist name is required');
            return;
        }
        if (!user?.id) {
            setPlaylistError('User not authenticated');
            return;
        }
        try {
            const newPlaylist = await createPlaylist(playlistName, user.id);
            setPlaylists([...playlists, newPlaylist]);
            setPlaylistName('');
            setPlaylistError('');
        } catch (err) {
            setPlaylistError('Failed to create playlist');
        }
    };

    const handleAddToPlaylist = async (playlistId, song) => {
        try {
            const updatedPlaylist = await addSongToPlaylist(playlistId, song.id);
            setPlaylists(playlists.map((p) => (p.id === playlistId ? updatedPlaylist : p)));
            setAddToPlaylistDialog({ open: false, song: null });
        } catch (err) {
            setPlaylistError('Failed to add song to playlist');
        }
    };

    const handleDeletePlaylist = async (id) => {
        try {
            await deletePlaylist(id);
            setPlaylists(playlists.filter((p) => p.id !== id));
        } catch (err) {
            setPlaylistError('Failed to delete playlist');
        }
    };

    const openAddToPlaylistDialog = (song) => {
        setAddToPlaylistDialog({ open: true, song });
    };

    const closeAddToPlaylistDialog = () => {
        setAddToPlaylistDialog({ open: false, song: null });
    };

    // Audio Player Functions
    const handlePlaySong = (song) => {
        if (currentSong && currentSong.id === song.id) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        } else {
            if (currentSong) {
                audioRef.current.pause();
            }
            
            setCurrentSong(song);
            audioRef.current.src = song.audioUrl;
            audioRef.current.volume = volume;
            
            audioRef.current.play()
                .then(() => {
                    setIsPlaying(true);
                })
                .catch(error => {
                    console.error('Error playing song:', error);
                    setPlaylistError('Error playing song. Please try again.');
                });
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        audioRef.current.volume = newVolume;
    };

    const handleProgressChange = (e) => {
        const newProgress = parseFloat(e.target.value);
        setProgress(newProgress);
        audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
    };

    // Audio event listeners
    useEffect(() => {
        const audio = audioRef.current;

        const updateProgress = () => {
            if (audio.duration) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setProgress(0);
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('loadedmetadata', updateProgress);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('loadedmetadata', updateProgress);
        };
    }, []);

    // Search Functions
    const performSearch = () => {
        setLoading(true);
        let filteredSongs = [...allSongs];

        if (searchTerm.trim() !== '') {
            filteredSongs = filteredSongs.filter(song =>
                song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                song.album.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedGenre !== 'all') {
            filteredSongs = filteredSongs.filter(song =>
                song.genre.toLowerCase() === selectedGenre.toLowerCase()
            );
        }

        if (selectedType !== 'all') {
            filteredSongs = filteredSongs.filter(song =>
                song.type === selectedType
            );
        }

        const categorizedResults = categorizeSongs(filteredSongs);
        setSearchResults(categorizedResults);
        setHasSearched(true);
        setLoading(false);
    };

    const categorizeSongs = (songs) => {
        if (songs.length === 0) return [];

        const categories = {};
        
        songs.forEach(song => {
            let category = '';
            
            if (selectedGenre !== 'all') {
                category = `${selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1)} Results`;
            } else if (searchTerm.trim() !== '') {
                category = `Search Results for "${searchTerm}"`;
            } else {
                category = `${song.genre.charAt(0).toUpperCase() + song.genre.slice(1)} Songs`;
            }
            
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(song);
        });
        
        return Object.keys(categories).map(title => ({
            title,
            songs: categories[title]
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        performSearch();
    };

    const handleReset = () => {
        setSearchTerm('');
        setSelectedType('all');
        setSelectedGenre('all');
        setSearchResults([]);
        setHasSearched(false);
    };

    const getPlayButtonText = (song) => {
        if (currentSong && currentSong.id === song.id) {
            return isPlaying ? '⏸️ Pause' : '▶ Play';
        }
        return '▶ Play';
    };

    return (
        <div className="song-search-page">
            {/* Audio Player Bar */}
            {currentSong && (
                <div className="audio-player-bar">
                    <div className="now-playing">
                        <img src={currentSong.imageUrl} alt={currentSong.name} className="now-playing-image" />
                        <div className="now-playing-info">
                            <h4>{currentSong.name}</h4>
                            <p>{currentSong.artist}</p>
                        </div>
                    </div>
                    
                    <div className="player-controls">
                        <button 
                            className="control-btn"
                            onClick={() => handlePlaySong(currentSong)}
                        >
                            {isPlaying ? '⏸️' : '▶'}
                        </button>
                        
                        <div className="progress-container">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={progress}
                                onChange={handleProgressChange}
                                className="progress-bar"
                            />
                        </div>
                    </div>
                    
                    <div className="volume-control">
                        <span>🔊</span>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="volume-bar"
                        />
                    </div>
                </div>
            )}

            {/* Playlist Management Section */}
            <Box className="playlist-section" sx={{ mt: 2, p: 3, backgroundColor: 'background.paper', borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>
                    <PlaylistAddIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> My Playlists
                </Typography>
                
                {playlistError && <Alert severity="error" sx={{ mb: 2 }}>{playlistError}</Alert>}
                
                {/* Create Playlist Form */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
                    <TextField
                        label="New Playlist Name"
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                        size="small"
                        sx={{ flexGrow: 1 }}
                    />
                    <Button variant="contained" onClick={handleCreatePlaylist}>
                        Create Playlist
                    </Button>
                </Box>

                {/* Playlists List */}
                {playlists.map((playlist) => (
                    <Box key={playlist.id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6">{playlist.name}</Typography>
                            <Button 
                                variant="outlined" 
                                color="error" 
                                size="small"
                                onClick={() => handleDeletePlaylist(playlist.id)}
                            >
                                Delete
                            </Button>
                        </Box>
                        <Typography variant="body2" color="textSecondary">
                            Songs: {playlist.songs?.map(song => song.title).join(', ') || 'No songs yet'}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* Song Search Section */}
            <div className="search-header">
                <h1>🔍 Song Search</h1>
                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-filters">
                        <select 
                            value={selectedType} 
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Types</option>
                            <option value="songs">Songs</option>
                            <option value="artists">Artists</option>
                            <option value="albums">Albums</option>
                            <option value="playlists">Playlists</option>
                        </select>
                        
                        <select 
                            value={selectedGenre} 
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Genres</option>
                            <option value="pop">Pop</option>
                            <option value="rock">Rock</option>
                            <option value="jazz">Jazz</option>
                            <option value="hiphop">Hip Hop</option>
                            <option value="electronic">Electronic</option>
                            <option value="classical">Classical</option>
                        </select>
                    </div>
                    
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search for songs, artists, albums..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="search-btn" disabled={loading}>
                            {loading ? 'Searching...' : 'SEARCH'}
                        </button>
                        {hasSearched && (
                            <button type="button" onClick={handleReset} className="reset-btn">
                                Clear
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Search Results Section */}
            {hasSearched && (
                <div className="results-section">
                    <h2>
                        {searchTerm ? `Search Results for "${searchTerm}"` : 'Search Results'}
                        {selectedGenre !== 'all' && ` in ${selectedGenre}`}
                    </h2>
                    
                    {loading ? (
                        <div className="loading">Searching songs...</div>
                    ) : searchResults.length > 0 ? (
                        searchResults.map((category, index) => (
                            <div key={index} className="category-section">
                                <h3 className="category-title">{category.title}</h3>
                                <div className="songs-grid">
                                    {category.songs.map(song => (
                                        <div key={song.id} className="song-card">
                                            <div className="song-image">
                                                <img 
                                                    src={song.imageUrl || '/assets/default-song.png'} 
                                                    alt={song.name}
                                                    onError={(e) => {
                                                        e.target.src = '/assets/default-song.png';
                                                    }}
                                                />
                                                {currentSong && currentSong.id === song.id && isPlaying && (
                                                    <div className="now-playing-indicator">🎵 Playing</div>
                                                )}
                                            </div>
                                            <div className="song-info">
                                                <h4 className="song-name">{song.name}</h4>
                                                <p className="song-artist">{song.artist}</p>
                                                <p className="song-genre">{song.genre}</p>
                                                <p className="song-album">{song.album}</p>
                                                <p className="song-duration">{song.duration}</p>
                                            </div>
                                            <div className="song-actions">
                                                <button 
                                                    className={`play-btn ${currentSong && currentSong.id === song.id ? 'active' : ''}`}
                                                    onClick={() => handlePlaySong(song)}
                                                >
                                                    {getPlayButtonText(song)}
                                                </button>
                                                <button 
                                                    className="add-btn"
                                                    onClick={() => openAddToPlaylistDialog(song)}
                                                >
                                                    ＋ Add to Playlist
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            <p>No songs found matching your search criteria.</p>
                            <p>Try different keywords or filters.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Recommended Songs Section */}
            {!hasSearched && (
                <div className="recommended-section">
                    <h2>Recommended Songs</h2>
                    {recommendedSongs.length > 0 ? (
                        recommendedSongs.map((category, index) => (
                            <div key={index} className="category-section">
                                <h3 className="category-title">{category.title}</h3>
                                <div className="songs-grid">
                                    {category.songs.map(song => (
                                        <div key={song.id} className="song-card">
                                            <div className="song-image">
                                                <img 
                                                    src={song.imageUrl || '/assets/default-song.png'} 
                                                    alt={song.name}
                                                />
                                                {currentSong && currentSong.id === song.id && isPlaying && (
                                                    <div className="now-playing-indicator">🎵 Playing</div>
                                                )}
                                            </div>
                                            <div className="song-info">
                                                <h4 className="song-name">{song.name}</h4>
                                                <p className="song-artist">{song.artist}</p>
                                                <p className="song-genre">{song.genre}</p>
                                                <p className="song-album">{song.album}</p>
                                            </div>
                                            <div className="song-actions">
                                                <button 
                                                    className={`play-btn ${currentSong && currentSong.id === song.id ? 'active' : ''}`}
                                                    onClick={() => handlePlaySong(song)}
                                                >
                                                    {getPlayButtonText(song)}
                                                </button>
                                                <button 
                                                    className="add-btn"
                                                    onClick={() => openAddToPlaylistDialog(song)}
                                                >
                                                    ＋ Add to Playlist
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-results">No recommendations available.</p>
                    )}
                </div>
            )}

            {/* Add to Playlist Dialog */}
            <Dialog open={addToPlaylistDialog.open} onClose={closeAddToPlaylistDialog}>
                <DialogTitle>Add to Playlist</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" gutterBottom>
                        Add "{addToPlaylistDialog.song?.name}" to:
                    </Typography>
                    {playlists.length === 0 ? (
                        <Typography color="textSecondary">No playlists available. Create one first.</Typography>
                    ) : (
                        playlists.map(playlist => (
                            <Box key={playlist.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                                <Typography>{playlist.name}</Typography>
                                <Button 
                                    variant="outlined" 
                                    size="small"
                                    onClick={() => handleAddToPlaylist(playlist.id, addToPlaylistDialog.song)}
                                >
                                    Add
                                </Button>
                            </Box>
                        ))
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeAddToPlaylistDialog}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SongSearch;