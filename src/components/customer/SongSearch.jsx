import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';

const SongSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [searchResults, setSearchResults] = useState([]);
    const [recommendedSongs, setRecommendedSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

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
                    imageUrl: "/assets/song1.jpg",
                    year: 2020
                },
                { 
                    id: 2, 
                    name: "Flowers", 
                    artist: "Miley Cyrus", 
                    genre: "Pop", 
                    album: "Endless Summer Vacation",
                    imageUrl: "/assets/song2.jpg",
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
            imageUrl: "/assets/song1.jpg",
            year: 2020,
            type: "song"
        },
        { 
            id: 2, 
            name: "Shape of You", 
            artist: "Ed Sheeran", 
            genre: "Pop", 
            album: "÷",
            imageUrl: "/assets/song2.jpg",
            year: 2017,
            type: "song"
        },
        { 
            id: 3, 
            name: "Bohemian Rhapsody", 
            artist: "Queen", 
            genre: "Rock", 
            album: "A Night at the Opera",
            imageUrl: "/assets/song3.jpg",
            year: 1975,
            type: "song"
        },
        { 
            id: 4, 
            name: "Sweet Child O' Mine", 
            artist: "Guns N' Roses", 
            genre: "Rock", 
            album: "Appetite for Destruction",
            imageUrl: "/assets/song4.jpg",
            year: 1987,
            type: "song"
        },
        { 
            id: 5, 
            name: "Flowers", 
            artist: "Miley Cyrus", 
            genre: "Pop", 
            album: "Endless Summer Vacation",
            imageUrl: "/assets/song5.jpg",
            year: 2023,
            type: "song"
        },
        { 
            id: 6, 
            name: "Anti-Hero", 
            artist: "Taylor Swift", 
            genre: "Pop", 
            album: "Midnights",
            imageUrl: "/assets/song6.jpg",
            year: 2022,
            type: "song"
        },
        { 
            id: 7, 
            name: "Save Your Tears", 
            artist: "The Weeknd", 
            genre: "Pop", 
            album: "After Hours",
            imageUrl: "/assets/song7.jpg",
            year: 2020,
            type: "song"
        },
        { 
            id: 8, 
            name: "Levitating", 
            artist: "Dua Lipa", 
            genre: "Pop", 
            album: "Future Nostalgia",
            imageUrl: "/assets/song8.jpg",
            year: 2020,
            type: "song"
        },
        { 
            id: 9, 
            name: "As It Was", 
            artist: "Harry Styles", 
            genre: "Pop", 
            album: "Harry's House",
            imageUrl: "/assets/song9.jpg",
            year: 2022,
            type: "song"
        },
        { 
            id: 10, 
            name: "Stay", 
            artist: "The Kid LAROI, Justin Bieber", 
            genre: "Pop", 
            album: "F*CK LOVE 3+",
            imageUrl: "/assets/song10.jpg",
            year: 2021,
            type: "song"
        }
    ];

    // Search function that filters songs based on criteria
    const performSearch = () => {
        setLoading(true);
        
        let filteredSongs = [...allSongs];

        // Filter by search term
        if (searchTerm.trim() !== '') {
            filteredSongs = filteredSongs.filter(song =>
                song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                song.album.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by genre
        if (selectedGenre !== 'all') {
            filteredSongs = filteredSongs.filter(song =>
                song.genre.toLowerCase() === selectedGenre.toLowerCase()
            );
        }

        // Filter by type (though all are songs in this example)
        if (selectedType !== 'all') {
            filteredSongs = filteredSongs.filter(song =>
                song.type === selectedType
            );
        }

        // Categorize the search results
        const categorizedResults = categorizeSongs(filteredSongs);
        setSearchResults(categorizedResults);
        setHasSearched(true);
        setLoading(false);
    };

    // Categorize songs for display
    const categorizeSongs = (songs) => {
        if (songs.length === 0) return [];

        const categories = {};
        
        songs.forEach(song => {
            let category = '';
            
            // Determine category based on search criteria
            if (selectedGenre !== 'all') {
                category = `${selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1)} Results`;
            } else if (searchTerm.trim() !== '') {
                category = `Search Results for "${searchTerm}"`;
            } else {
                // Group by genre if no specific search
                category = `${song.genre.charAt(0).toUpperCase() + song.genre.slice(1)} Songs`;
            }
            
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(song);
        });
        
        // Convert to array format for rendering
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

    const handlePlaySong = (song) => {
        console.log('Playing song:', song);
        // Implement your play functionality here
    };

    const handleAddToPlaylist = (song) => {
        console.log('Adding to playlist:', song);
        // Implement add to playlist functionality here
    };

    // Load recommended songs on component mount
    useEffect(() => {
        setRecommendedSongs(mockRecommendedSongs);
    }, []);

    return (
        <div className="song-search-page">
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

            {/* Search Results Section - Only show when searched */}
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
                                            </div>
                                            <div className="song-info">
                                                <h4 className="song-name">{song.name}</h4>
                                                <p className="song-artist">{song.artist}</p>
                                                <p className="song-genre">{song.genre}</p>
                                                <p className="song-album">{song.album}</p>
                                                <p className="song-year">{song.year}</p>
                                            </div>
                                            <div className="song-actions">
                                                <button 
                                                    className="play-btn"
                                                    onClick={() => handlePlaySong(song)}
                                                >
                                                    ▶ Play
                                                </button>
                                                <button 
                                                    className="add-btn"
                                                    onClick={() => handleAddToPlaylist(song)}
                                                >
                                                    ＋ Add
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

            {/* Recommended Songs Section - Only show when NOT searched */}
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
                                            </div>
                                            <div className="song-info">
                                                <h4 className="song-name">{song.name}</h4>
                                                <p className="song-artist">{song.artist}</p>
                                                <p className="song-genre">{song.genre}</p>
                                                <p className="song-album">{song.album}</p>
                                            </div>
                                            <div className="song-actions">
                                                <button 
                                                    className="play-btn"
                                                    onClick={() => handlePlaySong(song)}
                                                >
                                                    ▶ Play
                                                </button>
                                                <button 
                                                    className="add-btn"
                                                    onClick={() => handleAddToPlaylist(song)}
                                                >
                                                    ＋ Add
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
            
        </div>
    );
};

export default SongSearch;