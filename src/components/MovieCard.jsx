import React from 'react';

/**
 * MovieCard – displays a single movie entry
 * Props:
 *   movie        {object}   the movie data
 *   onRemove     {fn}       called with movie.id to delete
 *   onToggle     {fn}       called with movie.id to toggle watched
 */
export default function MovieCard({ movie, onRemove, onToggle }) {
  // Build star string for display
  const stars = '⭐'.repeat(movie.rating) + '☆'.repeat(5 - movie.rating);

  return (
    <div className={`movie-card ${movie.watched ? 'watched' : ''}`}>
      {/* Status indicator dot */}
      <div className="movie-status-dot" title={movie.watched ? 'Watched' : 'Unwatched'} />

      {/* Info */}
      <div className="movie-info">
        <div className="movie-title">{movie.title}</div>
        <div className="movie-meta">
          {movie.genre && <span className="movie-genre">{movie.genre}</span>}
          {movie.rating > 0 && (
            <span className="movie-rating" title={`${movie.rating}/5 stars`}>
              {stars}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="movie-actions">
        <button
          className="btn-icon watch"
          onClick={() => onToggle(movie.id)}
          title={movie.watched ? 'Mark as unwatched' : 'Mark as watched'}
        >
          {movie.watched ? '↩ Unwatch' : '✓ Watch'}
        </button>
        <button
          className="btn-icon remove"
          onClick={() => onRemove(movie.id)}
          title="Remove from list"
        >
          ✕ Remove
        </button>
      </div>
    </div>
  );
}
