import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import Pagination from '../../components/Pagination';
import Spinner from '../../components/Spinner';

const styles = {
  title: { fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
  tab: { padding: '0.5rem 1.25rem', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '0.9rem' },
  activeTab: { padding: '0.5rem 1.25rem', border: '1px solid #2563eb', borderRadius: '6px', backgroundColor: '#2563eb', color: '#fff', cursor: 'pointer', fontSize: '0.9rem' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  th: { padding: '0.75rem 1rem', textAlign: 'left', backgroundColor: '#f8fafc', fontWeight: '600', fontSize: '0.85rem', color: '#475569', borderBottom: '1px solid #e2e8f0' },
  td: { padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem', color: '#334155' },
  deleted: { color: '#dc2626', fontWeight: '500' },
  empty: { textAlign: 'center', padding: '3rem', color: '#6b7280' },
};

const ENTITY_TYPES = ['candidates', 'companies', 'jobs'];

export default function SoftDeletedView() {
  const [activeType, setActiveType] = useState('candidates');
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeleted();
  }, [activeType, page]);

  const fetchDeleted = async () => {
    setLoading(true);
    try {
      const endpoint = activeType === 'candidates' ? '/api/candidatelist'
        : activeType === 'companies' ? '/api/companylist'
        : '/api/joblist';
      const res = await axiosClient.get(`${endpoint}?page=${page}&size=10&includeDeleted=true`);
      const allRecords = res.data.content || [];
      const deletedOnly = allRecords.filter((r) => r.isDeleted);
      setRecords(deletedOnly);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error('Failed to fetch deleted records', err);
    } finally {
      setLoading(false);
    }
  };

  const getColumns = () => {
    switch (activeType) {
      case 'candidates': return ['name', 'email', 'status', 'deletedAt'];
      case 'companies': return ['name', 'corporateWebsite', 'status', 'deletedAt'];
      case 'jobs': return ['title', 'companyName', 'status', 'deletedAt'];
      default: return [];
    }
  };

  return (
    <div>
      <h1 style={styles.title}>Soft-Deleted Records</h1>

      <div style={styles.tabs}>
        {ENTITY_TYPES.map((type) => (
          <button
            key={type}
            style={activeType === type ? styles.activeTab : styles.tab}
            onClick={() => { setActiveType(type); setPage(0); }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner text="Loading deleted records..." />
      ) : records.length === 0 ? (
        <div style={styles.empty}>No soft-deleted {activeType} found.</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              {getColumns().map((col) => (
                <th key={col} style={styles.th}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                {getColumns().map((col) => (
                  <td key={col} style={{ ...styles.td, ...(col === 'deletedAt' ? styles.deleted : {}) }}>
                    {col === 'deletedAt' ? (r[col] ? new Date(r[col]).toLocaleString() : 'N/A') : (r[col] || '-')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
