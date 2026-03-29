import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useCMS } from '../../context/CMSContext';

export default function Layout() {
  const [showTop, setShowTop] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useCMS();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner" />
        </div>
      )}
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <button
        className={`back-to-top ${showTop ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Retour en haut"
      >
        <i className="fas fa-chevron-up" />
      </button>
      {isAdmin && (
        <div className="admin-notice">
          <i className="fas fa-circle" style={{ color: '#39d46a', fontSize: '8px' }} />
          Mode Admin
        </div>
      )}
    </>
  );
}
