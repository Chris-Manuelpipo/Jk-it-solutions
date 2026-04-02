import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCMS } from '../../context/CMSContext';
import AdminHero from './AdminHero';
import AdminServices from './AdminServices';
import AdminFormations from './AdminFormations';
import AdminAbout from './AdminAbout';
import AdminContact from './AdminContact';
import AdminTestimonials from './AdminTestimonials';
import AdminProjects from './AdminProjects';
import AdminPacks from './AdminPacks';
import '../../pages/Admin.css';

const tabs = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: 'fa-gauge' },
  { id: 'hero', label: 'Carousel Hero', icon: 'fa-images' },
  { id: 'about', label: 'À Propos', icon: 'fa-circle-info' },
  { id: 'services', label: 'Services', icon: 'fa-gears' },
  { id: 'formations', label: 'Formations', icon: 'fa-chalkboard-user' },
  { id: 'projects', label: 'Projets', icon: 'fa-diagram-project' },
  { id: 'packs', label: 'Packs & Offres', icon: 'fa-tags' },
  { id: 'testimonials', label: 'Témoignages', icon: 'fa-comments' },
  { id: 'contact', label: 'Contact', icon: 'fa-phone' },
];

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [toast, setToast] = useState('');
  const { content } = useCMS();

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo"><i className="fas fa-shield-halved" /></div>
          <div>
            <h2>JK IT Solutions</h2>
            <span>Back-Office Admin</span>
          </div>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-section">Navigation</div>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={`fas ${tab.icon}`} />
              {tab.label}
            </button>
          ))}

          <div className="admin-nav-section" style={{ marginTop: '1rem' }}>Accès Rapide</div>
          <Link to="/" target="_blank" className="admin-nav-item" style={{ textDecoration: 'none' }}>
            <i className="fas fa-external-link-alt" /> Voir le site
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={onLogout}>
            <i className="fas fa-sign-out-alt" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <header className="admin-topbar">
          <h1><i className={`fas ${currentTab?.icon}`} style={{ color: 'var(--primary)', marginRight: '0.5rem' }} />{currentTab?.label}</h1>
          <div className="admin-topbar-actions">
            <Link to="/" target="_blank" className="btn-admin-save" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <i className="fas fa-eye" /> Voir le site
            </Link>
          </div>
        </header>

        <main className="admin-content">
          {activeTab === 'overview' && <Overview content={content} setActiveTab={setActiveTab} />}
          {activeTab === 'hero' && <AdminHero onSave={showToast} />}
          {activeTab === 'about' && <AdminAbout onSave={showToast} />}
          {activeTab === 'services' && <AdminServices onSave={showToast} />}
          {activeTab === 'formations' && <AdminFormations onSave={showToast} />}
          {activeTab === 'projects' && <AdminProjects onSave={showToast} />}
          {activeTab === 'packs' && <AdminPacks onSave={showToast} />}
          {activeTab === 'testimonials' && <AdminTestimonials onSave={showToast} />}
          {activeTab === 'contact' && <AdminContact onSave={showToast} />}
        </main>
      </div>

      {toast && (
        <div className="admin-toast">
          <i className="fas fa-check-circle" /> {toast}
        </div>
      )}
    </div>
  );
}

function Overview({ content, setActiveTab }) {
  const stats = [
    { label: 'Slides Hero', value: content.hero.slides.length, icon: 'fa-images', color: '#3b82f6', tab: 'hero' },
    { label: 'Services', value: content.services.length, icon: 'fa-gears', color: '#8b5cf6', tab: 'services' },
    { label: 'Formations', value: content.formations.length, icon: 'fa-chalkboard-user', color: '#f59e0b', tab: 'formations' },
    { label: 'Projets', value: (content.projects || []).length, icon: 'fa-diagram-project', color: '#0891b2', tab: 'projects' },
    { label: 'Packs & Offres', value: (content.packs || []).length, icon: 'fa-tags', color: '#7c3aed', tab: 'packs' },
    { label: 'Témoignages', value: content.testimonials.length, icon: 'fa-comments', color: '#22c55e', tab: 'testimonials' },
  ];

  return (
    <div>
      <div className="admin-stats-overview">
        {stats.map((s, i) => (
          <div
            key={i}
            className="admin-stat-card"
            style={{ cursor: 'pointer' }}
            onClick={() => setActiveTab(s.tab)}
          >
            <div className="admin-stat-icon" style={{ background: s.color + '22', color: s.color }}>
              <i className={`fas ${s.icon}`} />
            </div>
            <div>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2><i className="fas fa-bolt" /> Actions Rapides</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {[
            { icon: 'fa-images', label: 'Modifier le Carousel', tab: 'hero', color: '#3b82f6' },
            { icon: 'fa-chalkboard-user', label: 'Gérer les Formations', tab: 'formations', color: '#f59e0b' },
            { icon: 'fa-gears', label: 'Gérer les Services', tab: 'services', color: '#8b5cf6' },
            { icon: 'fa-diagram-project', label: 'Gérer les Projets', tab: 'projects', color: '#0891b2' },
            { icon: 'fa-tags', label: 'Packs & Offres', tab: 'packs', color: '#7c3aed' },
            { icon: 'fa-circle-info', label: 'Modifier À Propos', tab: 'about', color: '#22c55e' },
            { icon: 'fa-comments', label: 'Témoignages', tab: 'testimonials', color: '#ef4444' },
            { icon: 'fa-phone', label: 'Infos Contact', tab: 'contact', color: '#06b6d4' },
          ].map((a, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(a.tab)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '1rem', borderRadius: 'var(--radius)', border: '1.5px solid var(--gray-light)',
                background: 'white', cursor: 'pointer', transition: 'var(--transition)',
                fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: '600', color: 'var(--dark)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.color = a.color; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-light)'; e.currentTarget.style.color = 'var(--dark)'; }}
            >
              <i className={`fas ${a.icon}`} style={{ color: a.color, fontSize: '1.1rem', width: '20px' }} />
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
