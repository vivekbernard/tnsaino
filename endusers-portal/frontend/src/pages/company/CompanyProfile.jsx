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
  textarea: { width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem', minHeight: '100px', resize: 'vertical' },
  actions: { display: 'flex', gap: '1rem', marginTop: '1.5rem' },
  saveBtn: { padding: '0.6rem 1.5rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  cancelBtn: { padding: '0.6rem 1.5rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  editBtn: { padding: '0.6rem 1.5rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  message: { marginBottom: '1rem', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem' },
  success: { backgroundColor: '#dcfce7', color: '#166534' },
  error: { backgroundColor: '#fee2e2', color: '#991b1b' },
  linkValue: { color: '#2563eb', textDecoration: 'none', fontSize: '0.95rem', padding: '0.6rem 0', display: 'inline-block' },
  logoSection: { gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' },
  logoImg: { width: '100px', height: '100px', objectFit: 'contain', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc', padding: '0.25rem' },
  logoPlaceholder: { width: '100px', height: '100px', borderRadius: '8px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #d1d5db', color: '#9ca3af', fontSize: '0.75rem', textAlign: 'center' },
  uploadBtn: { padding: '0.4rem 1rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' },
  uploadHint: { fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' },
  uploading: { fontSize: '0.85rem', color: '#6b7280' },
};

const fields = [
  { key: 'name', label: 'Company Name', required: true },
  { key: 'corporateWebsite', label: 'Corporate Website', isLink: true },
  { key: 'hrContactName', label: 'HR Contact Name' },
  { key: 'hrContactEmail', label: 'HR Contact Email', type: 'email' },
  { key: 'legalContactName', label: 'Legal Contact Name' },
  { key: 'legalContactEmail', label: 'Legal Contact Email', type: 'email' },
  { key: 'details', label: 'About the Company', fullWidth: true, multiline: true },
];

export default function CompanyProfile() {
  const { user, refreshLinkedEntity } = useAuth();
  const navigate = useNavigate();
  const isNewProfile = !user?.linkedEntityId;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: '', corporateWebsite: '', hrContactName: '', hrContactEmail: '',
    legalContactName: '', legalContactEmail: '', details: '',
  });
  const [profileId, setProfileId] = useState(null);
  const [savedProfile, setSavedProfile] = useState(null);
  const [message, setMessage] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user?.linkedEntityId) {
      fetchProfile();
      fetchLogo();
    } else if (user) {
      setProfileId(crypto.randomUUID());
      setEditing(true);
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await axiosClient.get(`/api/company?id=${user.linkedEntityId}`);
      const p = res.data;
      setSavedProfile(p);
      setProfileId(p.id);
      setForm({
        name: p.name || '',
        corporateWebsite: p.corporateWebsite || '',
        hrContactName: p.hrContactName || '',
        hrContactEmail: p.hrContactEmail || '',
        legalContactName: p.legalContactName || '',
        legalContactEmail: p.legalContactEmail || '',
        details: p.details || '',
      });
    } catch (err) {
      console.error('Failed to fetch company profile', err);
    }
  };

  const fetchLogo = async () => {
    try {
      const res = await axiosClient.get('/api/company/logo/download-url');
      setLogoUrl(res.data.downloadUrl);
    } catch {
      setLogoUrl(null);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const res = await axiosClient.get(`/api/company/logo/upload-url?contentType=${encodeURIComponent(file.type)}`);
      await fetch(res.data.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      setLogoUrl(URL.createObjectURL(file));
      setMessage({ type: 'success', text: 'Logo uploaded successfully!' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to upload logo' });
    }
    setUploading(false);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await axiosClient.put('/api/company', {
        id: profileId,
        userId: user.sub,
        ...form,
        status: savedProfile?.status || 'ACTIVE',
        createdAt: savedProfile?.createdAt || null,
      });
      setMessage({ type: 'success', text: isNewProfile ? 'Company profile created!' : 'Profile updated successfully!' });
      setEditing(false);
      if (isNewProfile) {
        await refreshLinkedEntity();
      } else {
        await fetchProfile();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save profile' });
    }
  };

  const handleCancel = () => {
    if (isNewProfile) {
      navigate('/company/dashboard');
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

  const LogoSection = ({ editable }) => (
    <div style={styles.logoSection}>
      {logoUrl ? (
        <img src={logoUrl} alt="Company Logo" style={styles.logoImg} />
      ) : (
        <div style={styles.logoPlaceholder}>No Logo</div>
      )}
      {editable && (
        <div>
          {uploading ? (
            <span style={styles.uploading}>Uploading...</span>
          ) : (
            <>
              <label style={styles.uploadBtn}>
                {logoUrl ? 'Change Logo' : 'Upload Logo'}
                <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
              </label>
              <div style={styles.uploadHint}>PNG, JPG, SVG up to 5MB</div>
            </>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <h1 style={styles.title}>
        {isNewProfile ? 'Create Company Profile' : editing ? 'Edit Company Profile' : 'Company Profile'}
      </h1>
      <div style={styles.card}>
        {message && (
          <div style={{ ...styles.message, ...(message.type === 'success' ? styles.success : styles.error) }}>
            {message.text}
          </div>
        )}

        {!editing && !isNewProfile && (
          <>
            <div style={styles.grid}>
              <LogoSection editable={false} />
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
            <div style={styles.grid}>
              <LogoSection editable={true} />
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
