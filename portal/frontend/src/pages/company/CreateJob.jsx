import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';

const styles = {
  title: { fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' },
  card: { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  field: { marginBottom: '1rem' },
  label: { display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem', fontWeight: '500', color: '#374151' },
  input: { width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' },
  textarea: { width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem', minHeight: '120px', resize: 'vertical' },
  actions: { display: 'flex', gap: '1rem', marginTop: '1.5rem' },
  submitBtn: { padding: '0.6rem 1.5rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  cancelBtn: { padding: '0.6rem 1.5rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  message: { marginBottom: '1rem', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem' },
  success: { backgroundColor: '#dcfce7', color: '#166534' },
  error: { backgroundColor: '#fee2e2', color: '#991b1b' },
};

export default function CreateJob() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', jobDescription: '', requiredProfessionalExperience: '', requiredEducationalExperience: '',
  });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await axiosClient.put('/api/job', {
        id: crypto.randomUUID(),
        companyId: user.linkedEntityId,
        ...form,
        status: 'OPEN',
      });
      setMessage({ type: 'success', text: 'Job posted successfully!' });
      setTimeout(() => navigate('/company/jobs'), 1500);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to post job' });
    }
  };

  return (
    <div>
      <h1 style={styles.title}>Post New Job</h1>
      <div style={styles.card}>
        {message && (
          <div style={{ ...styles.message, ...(message.type === 'success' ? styles.success : styles.error) }}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Job Title *</label>
            <input style={styles.input} name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Job Description</label>
            <textarea style={styles.textarea} name="jobDescription" value={form.jobDescription} onChange={handleChange} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Required Professional Experience</label>
            <textarea style={styles.textarea} name="requiredProfessionalExperience" value={form.requiredProfessionalExperience} onChange={handleChange} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Required Educational Experience</label>
            <textarea style={styles.textarea} name="requiredEducationalExperience" value={form.requiredEducationalExperience} onChange={handleChange} />
          </div>
          <div style={styles.actions}>
            <button type="submit" style={styles.submitBtn}>Post Job</button>
            <button type="button" style={styles.cancelBtn} onClick={() => navigate('/company/jobs')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
