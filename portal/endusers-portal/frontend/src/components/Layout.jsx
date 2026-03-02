import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f8fafc' },
  main: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
};

export default function Layout() {
  return (
    <div style={styles.container}>
      <Navbar />
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
