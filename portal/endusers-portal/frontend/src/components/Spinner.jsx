import React, { useEffect } from 'react';

const spinnerKeyframes = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// Add keyframes to document
if (!document.querySelector('style[data-spinner]')) {
  const styleSheet = document.createElement('style');
  styleSheet.setAttribute('data-spinner', 'true');
  styleSheet.textContent = spinnerKeyframes;
  document.head.appendChild(styleSheet);
}

const styles = {
  container: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    minHeight: '200px', gap: '1rem',
  },
  spinner: {
    width: '40px', height: '40px', border: '4px solid #e5e7eb',
    borderTop: '4px solid #2563eb', borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  text: {
    fontSize: '1rem', color: '#6b7280', fontWeight: '500',
  },
};

export default function Spinner({ text = 'Loading...' }) {
  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <span style={styles.text}>{text}</span>
    </div>
  );
}
