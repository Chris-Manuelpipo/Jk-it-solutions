import { useState, useEffect } from 'react';
import { useCMS } from '../context/CMSContext';
import { getStrapiToken, clearStrapiAuth } from '../api/strapiAdmin';
import AdminLogin from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';
import './Admin.css';

export default async function Admin() {
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
  const res = await fetch(
  `${STRAPI_URL}/api/formations?populate=*`,
  { headers: { Authorization: `Bearer ${token}` } }
);
  const formations = data.map(f => ({
  id:              f.id,
  title:           f.attributes.title,
  description:     f.attributes.description,
  image:           f.attributes.image?.data?.attributes?.url,
  level:           f.attributes.level,
  duration:        f.attributes.duration,
  date:            f.attributes.date,
  price:           f.attributes.price,
  prerequisites:   f.attributes.prerequisites,
  instructor:      f.attributes.instructor,
  maxParticipants: f.attributes.maxParticipants,
  // if using repeatable component:
  objectives:      f.attributes.objectives?.map(o => o.text) ?? [],
  program:         f.attributes.program?.map(p => p.text)    ?? [],
}));

  if (!loggedIn) return <AdminLogin onLogin={handleLogin} />;
  return <AdminDashboard onLogout={handleLogout} />;
  
}
