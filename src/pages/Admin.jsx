import { useState, useEffect } from 'react';
import { useCMS } from '../context/CMSContext';
import AdminLogin from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';
import './Admin.css';

// Simple admin auth (à remplacer par Strapi Users & Permissions en production)
const ADMIN_CREDENTIALS = { username: 'admin', password: 'jkits2025' };

export default function Admin() {
  const { setIsAdmin } = useCMS();
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem('jkits_admin') === 'true');

  useEffect(() => {
    setIsAdmin(loggedIn);
    return () => setIsAdmin(false);
  }, [loggedIn, setIsAdmin]);

  const handleLogin = (username, password) => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      sessionStorage.setItem('jkits_admin', 'true');
      setLoggedIn(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    sessionStorage.removeItem('jkits_admin');
    setLoggedIn(false);
  };

  if (!loggedIn) return <AdminLogin onLogin={handleLogin} />;
  return <AdminDashboard onLogout={handleLogout} />;
}
