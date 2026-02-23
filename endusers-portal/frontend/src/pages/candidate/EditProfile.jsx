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
  value: { fontSize: '0.95rem', color: '#1e293b', padding: '0.6rem 0' },
  valueEmpty: { fontSize: '0.9rem', color: '#9ca3af', fontStyle: 'italic', padding: '0.6rem 0' },
  input: { width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' },
  textarea: { width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem', minHeight: '80px', resize: 'vertical' },
  actions: { display: 'flex', gap: '1rem', marginTop: '1.5rem' },
  saveBtn: { padding: '0.6rem 1.5rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  cancelBtn: { padding: '0.6rem 1.5rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  editBtn: { padding: '0.6rem 1.5rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  message: { marginBottom: '1rem', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem' },
  success: { backgroundColor: '#dcfce7', color: '#166534' },
  error: { backgroundColor: '#fee2e2', color: '#991b1b' },
  linkValue: { color: '#2563eb', textDecoration: 'none', fontSize: '0.95rem', padding: '0.6rem 0', display: 'inline-block' },
  photoSection: { gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' },
  photoImg: { width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #d1d5db' },
  photoPlaceholder: { width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #d1d5db', color: '#9ca3af', fontSize: '0.8rem' },
  uploadBtn: { padding: '0.4rem 1rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' },
  uploading: { fontSize: '0.85rem', color: '#6b7280' },
};

const fields = [
  { key: 'name', label: 'Name', required: true },
  { key: 'email', label: 'Email', type: 'email', required: true },
  { key: 'phone', label: 'Phone' },
  { key: 'currentTitle', label: 'Current Title' },
  { key: 'currentCompany', label: 'Current Company' },
  { key: 'workingSince', label: 'Working Since', type: 'date' },
  { key: 'portfolioUrl', label: 'Portfolio URL', isLink: true },
  { key: 'githubUrl', label: 'GitHub URL', isLink: true },
  { key: 'linkedinUrl', label: 'LinkedIn URL', isLink: true },
  { key: 'certifications', label: 'Certifications', fullWidth: true, multiline: true },
  { key: 'license', label: 'License', fullWidth: true, multiline: true },
  { key: 'patents', label: 'Patents', fullWidth: true, multiline: true },
];

export default function EditProfile() {
  const { user, refreshLinkedEntity } = useAuth();
  const navigate = useNavigate();
  const isNewProfile = !user?.linkedEntityId;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', portfolioUrl: '', githubUrl: '', linkedinUrl: '',
    currentCompany: '', currentTitle: '', workingSince: '', license: '', patents: '', certifications: '',
  });
  const [profileId, setProfileId] = useState(null);
  const [message, setMessage] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user?.linkedEntityId) {
      fetchProfile();
      fetchPhoto();
    } else if (user) {
      setForm((prev) => ({ ...prev, email: user.email || '' }));
      setProfileId(crypto.randomUUID());
      setEditing(true);
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await axiosClient.get(`/api/candidate?id=${user.linkedEntityId}`);
      const p = res.data;
      setProfileId(p.id);
      setForm({
        name: p.name || '', email: p.email || '', phone: p.phone || '',
        portfolioUrl: p.portfolioUrl || '',
        githubUrl: p.githubUrl || '', linkedinUrl: p.linkedinUrl || '',
        currentCompany: p.currentCompany || '', currentTitle: p.currentTitle || '',
        workingSince: p.workingSince || '', license: p.license || '',
        patents: p.patents || '', certifications: p.certifications || '',
      });
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  };

  const fetchPhoto = async () => {
    try {
      const res = await axiosClient.get('/api/candidate/photo/download-url');
      setPhotoUrl(res.data.downloadUrl);
    } catch {
      setPhotoUrl(null);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const res = await axiosClient.get(`/api/candidate/photo/upload-url?contentType=${encodeURIComponent(file.type)}`);
      await fetch(res.data.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      setPhotoUrl(URL.createObjectURL(file));
      setMessage({ type: 'success', text: 'Photo uploaded successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to upload photo' });
    }
    setUploading(false);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await axiosClient.put('/api/candidate', {
        id: profileId, userId: user.sub, ...form, status: 'ACTIVE',
      });
      setMessage({ type: 'success', text: isNewProfile ? 'Profile created successfully!' : 'Profile updated successfully!' });
      setEditing(false);
      if (isNewProfile) {
        await refreshLinkedEntity();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save profile' });
    }
  };

  const handleCancel = () => {
    if (isNewProfile) {
      navigate('/candidate/dashboard');
    } else {
      fetchProfile();
      setEditing(false);
      setMessage(null);
    }
  };

  const renderViewValue = (field) => {
    const val = form[field.key];
    if (!val) return <div style={styles.valueEmpty}>Not provided</div>;
    if (field.isLink) {
      return <a href={val} target="_blank" rel="noopener noreferrer" style={styles.linkValue}>{val}</a>;
    }
    if (field.multiline) {
      return <div style={{ ...styles.value, whiteSpace: 'pre-wrap' }}>{val}</div>;
    }
    return <div style={styles.value}>{val}</div>;
  };

  const PhotoSection = ({ editable }) => (
    <div style={styles.photoSection}>
      {photoUrl ? (
        <img src={photoUrl} alt="Profile" style={styles.photoImg} />
      ) : (
        <div style={styles.photoPlaceholder}>No Photo</div>
      )}
      {editable && (
        <div>
          {uploading ? (
            <span style={styles.uploading}>Uploading...</span>
          ) : (
            <label style={styles.uploadBtn}>
              {photoUrl ? 'Change Photo' : 'Upload Photo'}
              <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
            </label>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <h1 style={styles.title}>
        {isNewProfile ? 'Create Your Profile' : editing ? 'Edit Profile' : 'My Profile'}
      </h1>
      <div style={styles.card}>
        {message && (
          <div style={{ ...styles.message, ...(message.type === 'success' ? styles.success : styles.error) }}>
            {message.text}
          </div>
        )}

        {!editing && !isNewProfile && (
          <>
            <PhotoSection editable={false} />
            <div style={styles.grid}>
              {fields.map((f) => (
                <div key={f.key} style={{ ...styles.field, ...(f.fullWidth ? styles.fullWidth : {}) }}>
                  <label style={styles.label}>{f.label}</label>
                  {renderViewValue(f)}
                </div>
              ))}
            </div>
            <div style={styles.actions}>
              <button style={styles.editBtn} onClick={() => setEditing(true)}>Edit Profile</button>
            </div>
          </>
        )}

        {editing && (
          <form onSubmit={handleSubmit}>
            <PhotoSection editable={true} />
            <div style={styles.grid}>
              {fields.map((f) => (
                <div key={f.key} style={{ ...styles.field, ...(f.fullWidth ? styles.fullWidth : {}) }}>
                  <label style={styles.label}>{f.label}{f.required ? ' *' : ''}</label>
                  {f.multiline ? (
                    <textarea style={styles.textarea} name={f.key} value={form[f.key]} onChange={handleChange} />
                  ) : (
                    <input style={styles.input} type={f.type || 'text'} name={f.key} value={form[f.key]} onChange={handleChange} required={f.required} />
                  )}
                </div>
              ))}
            </div>
            <div style={styles.actions}>
              <button type="submit" style={styles.saveBtn}>{isNewProfile ? 'Create Profile' : 'Save Changes'}</button>
              <button type="button" style={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
