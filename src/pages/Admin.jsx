import { useState, useEffect } from 'react';
import { useCMS } from '../context/CMSContext';
import { getStrapiToken, clearStrapiAuth } from '../api/strapiAdmin';
import AdminLogin from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';
import './Admin.css';

export default function Admin() {
  const { setIsAdmin } = useCMS();
  const [loggedIn, setLoggedIn] = useState(() => !!getStrapiToken());

  useEffect(() => {
    setIsAdmin(loggedIn);
    return () => setIsAdmin(false);
  }, [loggedIn, setIsAdmin]);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    clearStrapiAuth();
    setLoggedIn(false);
  };

  if (!loggedIn) return <AdminLogin onLogin={handleLogin} />;
  return <AdminDashboard onLogout={handleLogout} />;
}
