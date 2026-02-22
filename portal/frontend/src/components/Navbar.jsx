import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', backgroundColor: '#1e293b', color: '#fff' },
  brand: { fontSize: '1.25rem', fontWeight: 'bold', color: '#fff', textDecoration: 'none' },
  links: { display: 'flex', gap: '1.5rem', alignItems: 'center' },
  link: { color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem' },
  button: { padding: '0.4rem 1rem', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' },
};

export default function Navbar() {
  const { isAuthenticated, role, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>Jobs Portal</Link>
      <div style={styles.links}>
        <Link to="/jobs" style={styles.link}>Browse Jobs</Link>

        {!isAuthenticated && (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}

        {isAuthenticated && role === 'CANDIDATE' && (
          <>
            <Link to="/candidate/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/candidate/applications" style={styles.link}>My Applications</Link>
          </>
        )}

        {isAuthenticated && role === 'COMPANY' && (
          <>
            <Link to="/company/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/company/jobs" style={styles.link}>Manage Jobs</Link>
            <Link to="/company/jobs/create" style={styles.link}>Post Job</Link>
          </>
        )}

        {isAuthenticated && role === 'ADMIN' && (
          <>
            <Link to="/admin/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/admin/candidates" style={styles.link}>Candidates</Link>
            <Link to="/admin/companies" style={styles.link}>Companies</Link>
            <Link to="/admin/jobs" style={styles.link}>Jobs</Link>
            <Link to="/admin/deleted" style={styles.link}>Deleted</Link>
          </>
        )}

        {isAuthenticated && (
          <>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{user?.username} ({role})</span>
            <button onClick={handleLogout} style={styles.button}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
