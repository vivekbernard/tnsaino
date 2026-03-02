import React from 'react';

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' },
  button: { padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#fff', cursor: 'pointer' },
  disabled: { opacity: 0.5, cursor: 'not-allowed' },
  info: { fontSize: '0.9rem', color: '#6b7280' },
};

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div style={styles.container}>
      <button
        style={{ ...styles.button, ...(page === 0 ? styles.disabled : {}) }}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
      >
        Previous
      </button>
      <span style={styles.info}>
        Page {page + 1} of {totalPages}
      </span>
      <button
        style={{ ...styles.button, ...(page >= totalPages - 1 ? styles.disabled : {}) }}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
      >
        Next
      </button>
    </div>
  );
}
