import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { checkDuplicateUser, createUser } from '../utils/usersApi';
import '../styles/auth.css';

export default function Register() {
  const navigate = useNavigate();

  // ─── Form state ───────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generic change handler for all inputs
  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(''); // clear error on any change
    setSuccess('');
  }

  // ─── Validation ───────────────────────────────────────────────────────────
  function validate() {
    const { fullName, email, username, password, confirmPassword } = form;

    if (!fullName.trim()) return 'Full name is required.';
    if (!email.trim()) return 'Email is required.';

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address.';

    if (!username.trim()) return 'Username is required.';
    if (username.trim().length < 3) return 'Username must be at least 3 characters.';
    if (!password) return 'Password is required.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';

    return null; // no errors
  }

  // ─── Submit ───────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();

    if (isSubmitting) return;

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      username: form.username.trim().toLowerCase(),
      password: form.password,
    };

    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const duplicates = await checkDuplicateUser(payload.email, payload.username);

      if (duplicates.emailExists) {
        setError('An account with this email already exists.');
        return;
      }

      if (duplicates.usernameExists) {
        setError('This username is already taken.');
        return;
      }

      await createUser(payload);

      setSuccess('Account created successfully! Redirecting to sign in...');
      setForm({
        fullName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
      });

      setTimeout(() => {
        navigate('/login', { state: { registered: true } });
      }, 900);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Registration failed. Please check if the API server is running.'
      );
    } finally {
      setIsSubmitting(false);
    }
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
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Start tracking your movies today</p>
        </div>

        {/* Card */}
        <div className="auth-card">
          {error && <p className="error-msg" style={{ marginBottom: '16px' }}>{error}</p>}
          {success && (
            <p className="success-msg" style={{ marginBottom: '16px' }}>
              {success}
            </p>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* Full name + email row */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Jane Doe"
                  value={form.fullName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="janedoe"
                  value={form.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="jane@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn-primary auth-submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
