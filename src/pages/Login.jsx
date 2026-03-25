import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { setSession } from '../utils/storage';
import { findUserByCredentials } from '../utils/usersApi';
import '../styles/auth.css';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // ─── Form state ───────────────────────────────────────────────────────────
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Show success message if redirected from registration
  const justRegistered = location.state?.registered;

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }

  // ─── Submit ───────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();

    if (isSubmitting) return;

    const { identifier, password } = form;

    // Basic required-field validation
    if (!identifier.trim()) {
      setError('Please enter your email or username.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    let user = null;

    try {
      // Look up the user in JSON Server
      user = await findUserByCredentials(identifier, password);
    } catch {
      setError('Unable to connect to server. Please make sure the API server is running.');
      setIsSubmitting(false);
      return;
    }

    if (!user) {
      setError('Invalid credentials. Check your email/username and password.');
      setIsSubmitting(false);
      return;
    }

    // Save session and go to dashboard
    setSession(user);
    setIsSubmitting(false);
    navigate('/dashboard');
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Header */}
        <div className="auth-header">
          <Link to="/" className="auth-back">← Back to home</Link>
          <div className="auth-logo">
            <span className="auth-icon">🎬</span>
            <span className="brand-movie">Movie</span>
            <span className="brand-mate">Mate</span>
          </div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your watchlist</p>
        </div>

        {/* Card */}
        <div className="auth-card">
          {/* Success banner after registration */}
          {justRegistered && (
            <p
              className="error-msg"
              style={{
                background: 'rgba(91,232,154,0.10)',
                border: '1px solid rgba(91,232,154,0.3)',
                color: 'var(--green)',
                marginBottom: '16px',
              }}
            >
              ✓ Account created successfully! Please sign in.
            </p>
          )}

          {error && <p className="error-msg" style={{ marginBottom: '16px' }}>{error}</p>}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="identifier">Email or Username</label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                placeholder="jane@example.com or janedoe"
                value={form.identifier}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn-primary auth-submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In →'}
            </button>
          </form>
        </div>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
