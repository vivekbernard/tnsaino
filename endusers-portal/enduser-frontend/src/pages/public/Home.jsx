import React from 'react';
import { Link } from 'react-router-dom';

const styles = {
  hero: { textAlign: 'center', padding: '4rem 2rem' },
  title: { fontSize: '2.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' },
  subtitle: { fontSize: '1.2rem', color: '#64748b', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' },
  actions: { display: 'flex', gap: '1rem', justifyContent: 'center' },
  primaryBtn: { padding: '0.75rem 2rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', textDecoration: 'none' },
  secondaryBtn: { padding: '0.75rem 2rem', backgroundColor: '#fff', color: '#2563eb', border: '2px solid #2563eb', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', textDecoration: 'none' },
  features: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '4rem' },
  card: { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  cardTitle: { fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' },
  cardText: { color: '#64748b', fontSize: '0.9rem' },
};

export default function Home() {
  return (
    <div>
      <div style={styles.hero}>
        <h1 style={styles.title}>Find Your Dream Job</h1>
        <p style={styles.subtitle}>
          Connect with top companies and discover opportunities that match your skills and ambitions.
        </p>
        <div style={styles.actions}>
          <Link to="/jobs" style={styles.primaryBtn}>Browse Jobs</Link>
          <Link to="/register" style={styles.secondaryBtn}>Get Started</Link>
        </div>
      </div>

      <div style={styles.features}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>For Candidates</h3>
          <p style={styles.cardText}>Create your profile, browse open positions, and apply to jobs that match your expertise.</p>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>For Companies</h3>
          <p style={styles.cardText}>Post job openings, review applicants, and find the perfect candidates for your team.</p>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Easy Management</h3>
          <p style={styles.cardText}>Track applications, manage job postings, and streamline your hiring process.</p>
        </div>
      </div>
    </div>
  );
}
