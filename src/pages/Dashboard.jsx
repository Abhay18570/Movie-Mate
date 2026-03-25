import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  getSession,
  clearSession,
  getMovies,
  addMovie,
  removeMovie,
  toggleWatched,
} from '../utils/storage';
import MovieCard from '../components/MovieCard';
import StarRating from '../components/StarRating';
import '../styles/dashboard.css';

// Available genres for the dropdown
const GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery',
  'Romance', 'Sci-Fi', 'Thriller', 'Western', 'Other',
];

const FILTERS = ['All', 'Watched', 'Unwatched'];

export default function Dashboard() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // ─── Session ─────────────────────────────────────────────────────────────
  const user = getSession(); // guaranteed to exist (protected route)

  // ─── Movie list state ─────────────────────────────────────────────────────
  const [movies, setMovies] = useState(() => getMovies(user.id));
  const [filter, setFilter] = useState('All');

  // ─── Add-movie form state ─────────────────────────────────────────────────
  const [form, setForm] = useState({
    title: '',
    genre: '',
    rating: 0,
    watched: false,
  });
  const [formError, setFormError] = useState('');

  // ─── Handlers ─────────────────────────────────────────────────────────────

  function handleFormChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setFormError('');
  }

  function handleAddMovie(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setFormError('Movie title is required.');
      return;
    }

    // Persist and update local state
    const newMovie = addMovie(user.id, {
      title: form.title.trim(),
      genre: form.genre,
      rating: form.rating,
      watched: form.watched,
    });

    setMovies((prev) => [...prev, newMovie]);

    // Reset form
    setForm({ title: '', genre: '', rating: 0, watched: false });
  }

  function handleRemove(movieId) {
    removeMovie(user.id, movieId);
    setMovies((prev) => prev.filter((m) => m.id !== movieId));
  }

  function handleToggle(movieId) {
    toggleWatched(user.id, movieId);
    setMovies((prev) =>
      prev.map((m) => (m.id === movieId ? { ...m, watched: !m.watched } : m))
    );
  }

  function handleLogout() {
    clearSession();
    navigate('/');
  }

  // ─── Derived stats & filtered list ───────────────────────────────────────
  const watchedCount = movies.filter((m) => m.watched).length;
  const unwatchedCount = movies.length - watchedCount;

  const filteredMovies = useMemo(() => {
    if (filter === 'Watched') return movies.filter((m) => m.watched);
    if (filter === 'Unwatched') return movies.filter((m) => !m.watched);
    return movies;
  }, [movies, filter]);

  return (
    <div className="dashboard">
      {/* ─── Top bar ────────────────────────────────────────────────────── */}
      <header className="dash-topbar">
        <div className="topbar-logo">
          <span className="topbar-icon">🎬</span>
          <span className="brand-movie">Movie</span>
          <span className="brand-mate">Mate</span>
        </div>
        <div className="topbar-right">
          <span className="welcome-text">
            Hey, <strong>{user.username}</strong> 👋
          </span>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>

      {/* ─── Main content ───────────────────────────────────────────────── */}
      <main className="dash-content">
        <h1 className="dash-title">
          Your <span>Watchlist</span>
        </h1>
        <p className="dash-intro">
          {movies.length === 0
            ? 'Add your first movie to get started!'
            : `${movies.length} movie${movies.length > 1 ? 's' : ''} tracked · ${watchedCount} watched`}
        </p>

        {/* ─── Stats row ──────────────────────────────────────────────── */}
        <div className="dash-stats">
          <div className="stat-card">
            <div className="stat-card-icon">🎬</div>
            <div className="stat-card-info">
              <div className="stat-card-number">{movies.length}</div>
              <div className="stat-card-label">Total Movies</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon">✅</div>
            <div className="stat-card-info">
              <div className="stat-card-number">{watchedCount}</div>
              <div className="stat-card-label">Watched</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon">🍿</div>
            <div className="stat-card-info">
              <div className="stat-card-number">{unwatchedCount}</div>
              <div className="stat-card-label">To Watch</div>
            </div>
          </div>
        </div>

        {/* ─── Grid: add form + list ───────────────────────────────────── */}
        <div className="dash-grid">

          {/* ─── Add Movie Form ────────────────────────────────────────── */}
          <aside className="add-movie-card">
            <h2>＋ Add Movie</h2>

            {formError && (
              <p className="error-msg" style={{ marginBottom: '14px' }}>
                {formError}
              </p>
            )}

            <form className="add-form" onSubmit={handleAddMovie}>
              {/* Title */}
              <div className="form-group">
                <label htmlFor="title">Movie Title *</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g. Inception"
                  value={form.title}
                  onChange={handleFormChange}
                />
              </div>

              {/* Genre */}
              <div className="form-group">
                <label htmlFor="genre">Genre</label>
                <select
                  id="genre"
                  name="genre"
                  value={form.genre}
                  onChange={handleFormChange}
                >
                  <option value="">Select genre…</option>
                  {GENRES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div className="form-group">
                <label>Rating</label>
                <StarRating
                  value={form.rating}
                  onChange={(val) => setForm((prev) => ({ ...prev, rating: val }))}
                />
              </div>

              {/* Status */}
              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                <input
                  id="watched"
                  name="watched"
                  type="checkbox"
                  style={{ width: 'auto', accentColor: 'var(--accent)' }}
                  checked={form.watched}
                  onChange={handleFormChange}
                />
                <label htmlFor="watched" style={{ textTransform: 'none', fontSize: '0.9rem', letterSpacing: 'normal', color: 'var(--text)' }}>
                  Already watched
                </label>
              </div>

              <button type="submit" className="btn-primary">
                Add to Watchlist
              </button>
            </form>
          </aside>

          {/* ─── Movie List ────────────────────────────────────────────── */}
          <section className="watchlist-section">
            <div className="watchlist-header">
              <h2>
                {filter === 'All' ? 'All Movies' : filter} ({filteredMovies.length})
              </h2>

              {/* Filter tabs */}
              <div className="filter-tabs" role="tablist">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    role="tab"
                    aria-selected={filter === f}
                    className={`filter-tab ${filter === f ? 'active' : ''}`}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Empty state */}
            {filteredMovies.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎞️</div>
                <h3>
                  {filter === 'All'
                    ? 'No movies yet'
                    : `No ${filter.toLowerCase()} movies`}
                </h3>
                <p>
                  {filter === 'All'
                    ? 'Add your first movie using the form on the left.'
                    : `You have no ${filter.toLowerCase()} movies in your list.`}
                </p>
              </div>
            ) : (
              <div className="movies-list">
                {filteredMovies.map((movie, index) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onRemove={handleRemove}
                    onToggle={handleToggle}
                    style={{ animationDelay: `${index * 0.04}s` }}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
