import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Spinner from '../../components/Spinner';

const styles = {
  title: { fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' },
  card: { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  field: { marginBottom: '1rem' },
  fullWidth: { gridColumn: '1 / -1' },
  label: { display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' },
  value: { fontSize: '0.95rem', color: '#1e293b', padding: '0.4rem 0' },
  valueEmpty: { fontSize: '0.9rem', color: '#9ca3af', fontStyle: 'italic', padding: '0.4rem 0' },
  linkValue: { color: '#2563eb', textDecoration: 'none', fontSize: '0.95rem', padding: '0.4rem 0', display: 'inline-block' },
  badge: { padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '500' },
  active: { backgroundColor: '#dcfce7', color: '#166534' },
  disabled: { backgroundColor: '#fee2e2', color: '#991b1b' },
  backBtn: { padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', marginBottom: '1.5rem' },
  photoSection: { gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' },
  photoImg: { width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #d1d5db' },
  photoPlaceholder: { width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #d1d5db', color: '#9ca3af', fontSize: '0.8rem' },
  section: { marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' },
  sectionTitle: { fontSize: '1rem', fontWeight: '600', color: '#475569', marginBottom: '1rem' },
  metaRow: { display: 'flex', gap: '2rem', flexWrap: 'wrap' },
  metaItem: { fontSize: '0.8rem', color: '#6b7280' },
};

const fields = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'currentTitle', label: 'Current Title' },
  { key: 'currentCompany', label: 'Current Company' },
  { key: 'workingSince', label: 'Working Since' },
  { key: 'portfolioUrl', label: 'Portfolio URL', isLink: true },
  { key: 'githubUrl', label: 'GitHub URL', isLink: true },
  { key: 'linkedinUrl', label: 'LinkedIn URL', isLink: true },
  { key: 'certifications', label: 'Certifications', fullWidth: true, multiline: true },
  { key: 'license', label: 'License', fullWidth: true, multiline: true },
  { key: 'patents', label: 'Patents', fullWidth: true, multiline: true },
];

export default function CandidateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidate();
  }, [id]);

  const fetchCandidate = async () => {
    try {
      const res = await axiosClient.get(`/api/candidate?id=${id}`);
      setCandidate(res.data);
      if (res.data.userId) {
        fetchPhoto(res.data.userId);
      }
    } catch (err) {
      console.error('Failed to fetch candidate', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPhoto = async (userId) => {
    try {
      const res = await axiosClient.get(`/api/candidate/photo/download-url?userId=${userId}`);
      setPhotoUrl(res.data.downloadUrl);
    } catch {
      setPhotoUrl(null);
    }
  };

  const renderValue = (field) => {
    const val = candidate[field.key];
    if (!val) return <div style={styles.valueEmpty}>Not provided</div>;
    if (field.isLink) {
      return <a href={val} target="_blank" rel="noopener noreferrer" style={styles.linkValue}>{val}</a>;
    }
    if (field.multiline) {
      return <div style={{ ...styles.value, whiteSpace: 'pre-wrap' }}>{val}</div>;
    }
    return <div style={styles.value}>{val}</div>;
  };

  if (loading) return <Spinner text="Loading candidate..." />;
  if (!candidate) return <div style={{ padding: '2rem', textAlign: 'center', color: '#991b1b' }}>Candidate not found.</div>;

  return (
    <div>
      <button style={styles.backBtn} onClick={() => navigate('/candidates')}>&larr; Back to All Candidates</button>
      <h1 style={styles.title}>Candidate Details</h1>
      <div style={styles.card}>
        <div style={styles.photoSection}>
          {photoUrl ? (
            <img src={photoUrl} alt="Profile" style={styles.photoImg} />
          ) : (
            <div style={styles.photoPlaceholder}>No Photo</div>
          )}
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>{candidate.name}</div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '0.25rem' }}>{candidate.email}</div>
            <div style={{ marginTop: '0.5rem' }}>
              <span style={{ ...styles.badge, ...(candidate.status === 'ACTIVE' ? styles.active : styles.disabled) }}>
                {candidate.status}
              </span>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Profile Information</h2>
          <div style={styles.grid}>
            {fields.map((f) => (
              <div key={f.key} style={{ ...styles.field, ...(f.fullWidth ? styles.fullWidth : {}) }}>
                <label style={styles.label}>{f.label}</label>
                {renderValue(f)}
              </div>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Metadata</h2>
          <div style={styles.metaRow}>
            <div style={styles.metaItem}>User ID: {candidate.userId || 'N/A'}</div>
            <div style={styles.metaItem}>Candidate ID: {candidate.id}</div>
            <div style={styles.metaItem}>Created: {candidate.createdAt || 'N/A'}</div>
            <div style={styles.metaItem}>Updated: {candidate.updatedAt || 'N/A'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
