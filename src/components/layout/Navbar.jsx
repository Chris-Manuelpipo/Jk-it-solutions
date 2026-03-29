import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCMS } from '../../context/CMSContext';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { content } = useCMS();
  const { contact, siteConfig } = content;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/about', label: 'À Propos' },
    { to: '/services', label: 'Services' },
    { to: '/formations', label: 'Formations' },
    { to: '/projects', label: 'Projets' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Topbar */}
      <div className="topbar">
        <div className="container topbar-inner">
          <div className="topbar-left">
            <span><i className="fas fa-map-marker-alt" /> {contact.address}</span>
            <span><i className="fas fa-envelope-open" /> {contact.email}</span>
          </div>
          <div className="topbar-right">
            <span><i className="fas fa-phone-alt" /> {contact.phone}</span>
            <span><i className="far fa-clock" /> {contact.hours}</span>
            <div className="topbar-social">
              <a href={contact.facebook} target="_blank" rel="noreferrer"><i className="fab fa-facebook-f" /></a>
              <a href={contact.linkedin} target="_blank" rel="noreferrer"><i className="fab fa-linkedin-in" /></a>
              <a href={`https://wa.me/${contact.whatsapp?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"><i className="fab fa-whatsapp" /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-inner">
          <Link to="/" className="navbar-logo">
            <span className="logo-icon"><i className="fas fa-shield-halved" /></span>
            <div>
              <span className="logo-text">{siteConfig.companyName}</span>
              <span className="logo-slogan">{siteConfig.slogan}</span>
            </div>
          </Link>

          <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
            {navLinks.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
            <a
              href={`https://wa.me/${contact.whatsapp?.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary btn-sm navbar-cta"
            >
              <i className="fas fa-headset" /> Devis Gratuit
            </a>
          </div>

          <button
            className={`navbar-burger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>
    </>
  );
}
