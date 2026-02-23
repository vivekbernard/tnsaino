import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { confirmSignUp } from 'aws-amplify/auth';
import { useAuth } from '../../context/AuthContext';

const styles = {
  container: { maxWidth: '500px', margin: '2rem auto' },
  card: { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  title: { fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem', textAlign: 'center' },
  field: { marginBottom: '1rem' },
  label: { display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem', fontWeight: '500', color: '#374151' },
  input: { width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' },
  select: { width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' },
  button: { width: '100%', padding: '0.75rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' },
  buttonDisabled: { width: '100%', padding: '0.75rem', backgroundColor: '#93c5fd', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'not-allowed', marginTop: '0.5rem' },
  error: { color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' },
  success: { color: '#166534', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' },
  link: { textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' },
  hint: { fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' },
};

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState('register'); // 'register' | 'confirm'
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'CANDIDATE', name: '' });
  const [confirmCode, setConfirmCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await register({
        username: form.username.trim(),
        password: form.password,
        email: form.email.trim(),
        role: form.role,
        name: form.name.trim(),
      });
      setSuccess('Account created! Check your email for a verification code.');
      setStep('confirm');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await confirmSignUp({ username: form.username.trim(), confirmationCode: confirmCode.trim() });
      setSuccess('Email verified! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Verification failed.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>{step === 'register' ? 'Register' : 'Verify Email'}</h1>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        {step === 'register' ? (
          <form onSubmit={handleRegister}>
            <div style={styles.field}>
              <label style={styles.label}>I am a</label>
              <select style={styles.select} name="role" value={form.role} onChange={handleChange}>
                <option value="CANDIDATE">Candidate</option>
                <option value="COMPANY">Company</option>
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Name</label>
              <input style={styles.input} name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Username</label>
              <input style={styles.input} name="username" value={form.username} onChange={handleChange} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input style={styles.input} type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input style={styles.input} type="password" name="password" value={form.password} onChange={handleChange} required />
              <div style={styles.hint}>Minimum 8 characters with uppercase, lowercase, number, and symbol.</div>
            </div>
            <button type="submit" style={submitting ? styles.buttonDisabled : styles.button} disabled={submitting}>
              {submitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleConfirm}>
            <div style={styles.field}>
              <label style={styles.label}>Verification Code</label>
              <input style={styles.input} type="text" value={confirmCode} onChange={(e) => setConfirmCode(e.target.value)} required />
              <div style={styles.hint}>Enter the 6-digit code sent to {form.email}</div>
            </div>
            <button type="submit" style={submitting ? styles.buttonDisabled : styles.button} disabled={submitting}>
              {submitting ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>
        )}

        <div style={styles.link}>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
