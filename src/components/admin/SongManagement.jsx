import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SongManagement.css";

const SongManagement = () => {
  const [songs, setSongs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("Title"); // Title | Artist | Genre
  const [genreFilter, setGenreFilter] = useState("All");

  useEffect(() => {
    axios
      .get("http://localhost:2057/api/songs")
      .then((res) => {
        setSongs(res.data);
        setFiltered(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch songs from backend.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line
  }, [query, type, genreFilter, songs]);

  function applyFilters() {
    const q = query.trim().toLowerCase();
    let result = songs;

    if (genreFilter !== "All") {
      result = result.filter((s) => (s.genre || "").toLowerCase() === genreFilter.toLowerCase());
    }

    if (q.length > 0) {
      result = result.filter((s) => {
        const title = (s.title || "").toLowerCase();
        const artist = (s.artist || "").toLowerCase();
        const genre = (s.genre || "").toLowerCase();
        if (type === "Title") return title.includes(q);
        if (type === "Artist") return artist.includes(q);
        if (type === "Genre") return genre.includes(q);
        // fallback: search any
        return title.includes(q) || artist.includes(q) || genre.includes(q);
      });
    }

    setFiltered(result);
  }

  function getUniqueGenres() {
    const set = new Set();
    songs.forEach((s) => {
      if (s.genre) set.add(s.genre);
    });
    return ["All", ...Array.from(set)];
  }

  function isSpotifyUrl(url) {
    if (!url) return false;
    return url.includes("open.spotify.com") || url.startsWith("spotify:");
  }

  function getSpotifyEmbedUrl(url) {
    // accepts open.spotify.com/track/{id}?..., spotify:track:{id}
    try {
      if (url.startsWith("spotify:")) {
        const parts = url.split(":");
        const id = parts[2];
        return `https://open.spotify.com/embed/track/${id}`;
      }
      const m = url.match(/open\.spotify\.com\/track\/([a-zA-Z0-9]+)(\?|$)/);
      if (m && m[1]) return `https://open.spotify.com/embed/track/${m[1]}`;
    } catch (_) {}
    return null;
  }

  if (loading) return <p className="loading">Loading songs...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="song-table-wrapper">
      <div className="search-bar">
        <div className="search-left">
          <input
            className="search-input"
            placeholder={`Search by ${type.toLowerCase()}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select value={type} onChange={(e) => setType(e.target.value)} className="type-select">
            <option>Title</option>
            <option>Artist</option>
            <option>Genre</option>
          </select>
        </div>

        <div className="search-right">
          <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)} className="genre-select">
            {getUniqueGenres().map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="song-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Artist</th>
            <th>Genre</th>
            <th>Album</th>
            <th>Play</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                No songs found
              </td>
            </tr>
          ) : (
            filtered.map((song, idx) => (
              <tr key={idx}>
                <td className="img-td">
                  {song.imageUrl ? (
                    <img src={song.imageUrl} alt={song.title} className="album-img" />
                  ) : (
                    <div className="placeholder-img">No Image</div>
                  )}
                </td>
                <td>{song.title}</td>
                <td>{song.artist}</td>
                <td>{song.genre}</td>
                <td>{song.album}</td>
                <td className="play-td">
                  {isSpotifyUrl(song.url) ? (
                    (() => {
                      const embed = getSpotifyEmbedUrl(song.url);
                      if (embed) {
                        return (
                          <iframe
                            title={`spotify-${idx}`}
                            src={embed}
                            width="200"
                            height="80"
                            frameBorder="0"
                            allow="encrypted-media"
                          />
                        );
                      } else {
                        return <a href={song.url} target="_blank" rel="noreferrer">Open</a>;
                      }
                    })()
                  ) : (
                    // assume direct audio file (mp3, wav). If your url is to backend stream, ensure CORS for audio fetch.
                    <audio controls preload="none">
                      <source src={song.url} />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SongManagement;
