import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';

const styles = {
  title: { fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' },
  card: { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  field: { marginBottom: '1rem' },
  fullWidth: { gridColumn: '1 / -1' },
  label: { display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem', fontWeight: '500', color: '#374151' },
  input: { width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' },
  textarea: { width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem', minHeight: '80px', resize: 'vertical' },
  actions: { display: 'flex', gap: '1rem', marginTop: '1.5rem' },
  saveBtn: { padding: '0.6rem 1.5rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  cancelBtn: { padding: '0.6rem 1.5rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  message: { marginBottom: '1rem', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem' },
  success: { backgroundColor: '#dcfce7', color: '#166534' },
  error: { backgroundColor: '#fee2e2', color: '#991b1b' },
};

export default function EditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', photoUrl: '', portfolioUrl: '', githubUrl: '', linkedinUrl: '',
    currentCompany: '', currentTitle: '', workingSince: '', license: '', patents: '', certifications: '',
  });
  const [profileId, setProfileId] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user?.linkedEntityId) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await axiosClient.get(`/api/candidate?id=${user.linkedEntityId}`);
      const p = res.data;
      setProfileId(p.id);
      setForm({
        name: p.name || '', email: p.email || '', phone: p.phone || '',
        photoUrl: p.photoUrl || '', portfolioUrl: p.portfolioUrl || '',
        githubUrl: p.githubUrl || '', linkedinUrl: p.linkedinUrl || '',
        currentCompany: p.currentCompany || '', currentTitle: p.currentTitle || '',
        workingSince: p.workingSince || '', license: p.license || '',
        patents: p.patents || '', certifications: p.certifications || '',
      });
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await axiosClient.put('/api/candidate', {
        id: profileId, userId: user.id, ...form, status: 'ACTIVE',
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    }
  };

  return (
    <div>
      <h1 style={styles.title}>Edit Profile</h1>
      <div style={styles.card}>
        {message && (
          <div style={{ ...styles.message, ...(message.type === 'success' ? styles.success : styles.error) }}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>
            <div style={styles.field}>
              <label style={styles.label}>Name *</label>
              <input style={styles.input} name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email *</label>
              <input style={styles.input} type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Phone</label>
              <input style={styles.input} name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Photo URL</label>
              <input style={styles.input} name="photoUrl" value={form.photoUrl} onChange={handleChange} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Current Title</label>
              <input style={styles.input} name="currentTitle" value={form.currentTitle} onChange={handleChange} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Current Company</label>
              <input style={styles.input} name="currentCompany" value={form.currentCompany} onChange={handleChange} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Working Since</label>
              <input style={styles.input} type="date" name="workingSince" value={form.workingSince} onChange={handleChange} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Portfolio URL</label>
              <input style={styles.input} name="portfolioUrl" value={form.portfolioUrl} onChange={handleChange} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>GitHub URL</label>
              <input style={styles.input} name="githubUrl" value={form.githubUrl} onChange={handleChange} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>LinkedIn URL</label>
              <input style={styles.input} name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} />
            </div>
            <div style={{ ...styles.field, ...styles.fullWidth }}>
              <label style={styles.label}>Certifications</label>
              <textarea style={styles.textarea} name="certifications" value={form.certifications} onChange={handleChange} />
            </div>
            <div style={{ ...styles.field, ...styles.fullWidth }}>
              <label style={styles.label}>License</label>
              <textarea style={styles.textarea} name="license" value={form.license} onChange={handleChange} />
            </div>
            <div style={{ ...styles.field, ...styles.fullWidth }}>
              <label style={styles.label}>Patents</label>
              <textarea style={styles.textarea} name="patents" value={form.patents} onChange={handleChange} />
            </div>
          </div>
          <div style={styles.actions}>
            <button type="submit" style={styles.saveBtn}>Save Changes</button>
            <button type="button" style={styles.cancelBtn} onClick={() => navigate('/candidate/dashboard')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
