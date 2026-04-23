import { useState, useEffect } from 'react';
import { useCMS } from '../context/CMSContext';
import { getStrapiToken, clearStrapiAuth } from '../api/strapiAdmin';
import AdminLogin from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';
import './Admin.css';

export default function Admin() {
  const { setIsAdmin, content, loading } = useCMS();

  const [loggedIn, setLoggedIn] = useState(() => !!getStrapiToken());

  useEffect(() => {
    setIsAdmin(loggedIn);
    return () => setIsAdmin(false);
  }, [loggedIn, setIsAdmin]);

  const handleLogin = () => setLoggedIn(true);

  const handleLogout = () => {
    clearStrapiAuth();
    setLoggedIn(false);
  };

  // Si pas connecté → login
  if (!loggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // Chargement CMS
  if (loading) {
    return <div style={{ padding: 20 }}>Chargement admin...</div>;
  }

  // Dashboard avec données CMS
  return (
    <AdminDashboard
      onLogout={handleLogout}
      content={content}
    />
  );
}