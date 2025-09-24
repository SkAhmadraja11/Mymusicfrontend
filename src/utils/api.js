
import { config } from '../config/config';

const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const response = await fetch(`${config.apiUrl}${endpoint}`, options);
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
};

export const registerUser = (user) => apiRequest('/users/register', 'POST', user);
export const loginUser = (credentials) => apiRequest('/users/login', 'POST', credentials);
export const updateProfile = (id, user) => apiRequest(`/users/${id}`, 'PUT', user);
export const deleteUser = (id) => apiRequest(`/users/${id}`, 'DELETE');
export const getAllUsers = () => apiRequest('/users');
export const getUserById = (id) => apiRequest(`/users/${id}`);
export const addSong = (song) => apiRequest('/songs', 'POST', song);
export const updateSong = (id, song) => apiRequest(`/songs/${id}`, 'PUT', song);
export const deleteSong = (id) => apiRequest(`/songs/${id}`, 'DELETE');
export const searchSongs = (query, type) => apiRequest(`/songs/search?query=${query}&type=${type}`);
export const getSongsByArtist = (artistId) => apiRequest(`/songs/artist/${artistId}`);
export const getRecommendedSongs = (genre) => apiRequest(`/songs/recommend?genre=${genre}`);
export const createPlaylist = (name, userId) => apiRequest(`/playlists?name=${name}&userId=${userId}`, 'POST');
export const addSongToPlaylist = (playlistId, songId) => apiRequest(`/playlists/${playlistId}/songs/${songId}`, 'POST');
export const getUserPlaylists = (userId) => apiRequest(`/playlists/user/${userId}`);
export const deletePlaylist = (id) => apiRequest(`/playlists/${id}`, 'DELETE');
export const addRating = (rating) => apiRequest('/ratings', 'POST', rating);
export const getSongRatings = (songId) => apiRequest(`/ratings/song/${songId}`);
export const getUserRatings = (userId) => apiRequest(`/ratings/user/${userId}`);
