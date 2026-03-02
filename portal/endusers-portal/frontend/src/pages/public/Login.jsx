import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const styles = {
  container: { maxWidth: '400px', margin: '2rem auto' },
  card: { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  title: { fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem', textAlign: 'center' },
  field: { marginBottom: '1rem' },
  label: { display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem', fontWeight: '500', color: '#374151' },
  input: { width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' },
  button: { width: '100%', padding: '0.75rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' },
  buttonDisabled: { width: '100%', padding: '0.75rem', backgroundColor: '#93c5fd', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'not-allowed', marginTop: '0.5rem' },
  error: { color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' },
  link: { textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' },
};

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated && role) {
    const dest = role === 'COMPANY' ? '/company/dashboard'
      : role === 'CANDIDATE' ? '/candidate/dashboard'
      : '/';
    navigate(dest, { replace: true });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setError('');
    setSubmitting(true);
    try {
      await login(username.trim(), password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Login</h1>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input style={styles.input} type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" style={submitting ? styles.buttonDisabled : styles.button} disabled={submitting}>
            {submitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div style={styles.link}>
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}
