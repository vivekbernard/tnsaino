import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import Pagination from '../../components/Pagination';

const styles = {
  title: { fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  th: { padding: '0.75rem 1rem', textAlign: 'left', backgroundColor: '#f8fafc', fontWeight: '600', fontSize: '0.85rem', color: '#475569', borderBottom: '1px solid #e2e8f0' },
  td: { padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem', color: '#334155' },
  badge: { padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '500' },
  active: { backgroundColor: '#dcfce7', color: '#166534' },
  disabled: { backgroundColor: '#fee2e2', color: '#991b1b' },
  actionBtn: { padding: '0.3rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '0.8rem', marginRight: '0.5rem' },
  dangerBtn: { padding: '0.3rem 0.75rem', border: '1px solid #fca5a5', borderRadius: '4px', backgroundColor: '#fef2f2', cursor: 'pointer', fontSize: '0.8rem', color: '#991b1b' },
  empty: { textAlign: 'center', padding: '3rem', color: '#6b7280' },
};

export default function AllCompanies() {
  const [companies, setCompanies] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => { fetchCompanies(); }, [page]);

  const fetchCompanies = async () => {
    try {
      const res = await axiosClient.get(`/api/companylist?page=${page}&size=10`);
      setCompanies(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error('Failed to fetch companies', err);
    }
  };

  const handleDisable = async (id) => {
    try {
      await axiosClient.put(`/api/company/disable?id=${id}`);
      fetchCompanies();
    } catch (err) {
      console.error('Failed to disable company', err);
    }
  };

  const handleEnable = async (id) => {
    try {
      await axiosClient.put(`/api/company/enable?id=${id}`);
      fetchCompanies();
    } catch (err) {
      console.error('Failed to enable company', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to soft-delete this company?')) return;
    try {
      await axiosClient.delete(`/api/company?id=${id}`);
      fetchCompanies();
    } catch (err) {
      console.error('Failed to delete company', err);
    }
  };

  return (
    <div>
      <h1 style={styles.title}>All Companies</h1>
      {companies.length === 0 ? (
        <div style={styles.empty}>No companies found.</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Website</th>
              <th style={styles.th}>HR Contact</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c.id}>
                <td style={styles.td}>{c.name}</td>
                <td style={styles.td}>{c.corporateWebsite || '-'}</td>
                <td style={styles.td}>{c.hrContactName || '-'}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, ...(c.status === 'ACTIVE' ? styles.active : styles.disabled) }}>
                    {c.status}
                  </span>
                </td>
                <td style={styles.td}>
                  {c.status === 'ACTIVE' ? (
                    <button style={styles.actionBtn} onClick={() => handleDisable(c.id)}>Disable</button>
                  ) : (
                    <button style={styles.actionBtn} onClick={() => handleEnable(c.id)}>Enable</button>
                  )}
                  <button style={styles.dangerBtn} onClick={() => handleDelete(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
