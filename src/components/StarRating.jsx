import React from 'react';

/**
 * StarRating – interactive 1–5 star picker
 * Props:
 *   value   {number}  current rating (0 means none selected)
 *   onChange {fn}     called with the new rating number
 */
export default function StarRating({ value, onChange }) {
  return (
    <div className="star-input" role="group" aria-label="Movie rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          title={`${star} star${star > 1 ? 's' : ''}`}
        >
          {star <= value ? '⭐' : '☆'}
        </button>
      ))}
    </div>
  );
}
