import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import '../styles/landing.css';

export default function Landing() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="landing">
      {/* ─── Navigation ─────────────────────────────────────────────────── */}
      <nav className="landing-nav">
        <div className="nav-logo">
          <span className="logo-icon">🎬</span>
          <span className="brand-movie">Movie</span>
          <span className="brand-mate">Mate</span>
        </div>
        <div className="nav-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <Link to="/login"><button className="btn-ghost">Login</button></Link>
          <Link to="/register"><button className="btn-primary">Get Started</button></Link>
        </div>
      </nav>

      {/* ─── Hero ───────────────────────────────────────────────────────── */}
      <section className="landing-hero">
        <div className="hero-content">
          <div className="hero-badge">
            ✦ Your personal cinema tracker
          </div>
          <h1 className="hero-title">
            Track Every<br />
            <span className="accent">Movie</span> You Love
          </h1>
          <p className="hero-subtitle">
            A sleek watchlist app to organize films you want to watch,
            rate what you've seen, and keep your cinema journey on track.
          </p>
          <div className="hero-actions">
            <Link to="/register">
              <button className="btn-primary">Start for free →</button>
            </Link>
            <Link to="/login">
              <button className="btn-ghost">I have an account</button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Stats ──────────────────────────────────────────────────────── */}
      <div className="landing-stats">
        <div className="stat">
          <div className="stat-number">100%</div>
          <div className="stat-label">Free forever</div>
        </div>
        <div className="stat">
          <div className="stat-number">★ 5</div>
          <div className="stat-label">Rating system</div>
        </div>
        <div className="stat">
          <div className="stat-number">∞</div>
          <div className="stat-label">Movies to track</div>
        </div>
      </div>

      {/* ─── Features ───────────────────────────────────────────────────── */}
      <section className="landing-features">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Build Your List</h3>
            <p>Add any movie with genre, rating, and watch status.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Rate Films</h3>
            <p>Give every movie a star rating from 1 to 5.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Filter & Sort</h3>
            <p>Quickly find watched or unwatched movies.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Personal & Private</h3>
            <p>Each account has its own private watchlist.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
