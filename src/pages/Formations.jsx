import { useState, useEffect, useRef } from 'react';
import { useCMS } from '../context/CMSContext';
import PageHeader from '../components/ui/PageHeader';
import CTABanner from '../components/sections/CTABanner';
import './Formations.css';

const levelColor = { 'Débutant': '#22c55e', 'Intermédiaire': '#f59e0b', 'Avancé': '#ef4444' };
const levelBg    = { 'Débutant': 'rgba(34,197,94,0.08)', 'Intermédiaire': 'rgba(245,158,11,0.08)', 'Avancé': 'rgba(239,68,68,0.08)' };

/* ─── tiny hook: lock body scroll while modal open ─── */
function useLockBodyScroll(active) {
  useEffect(() => {
    if (active) {
      const y = window.scrollY;
      document.body.style.cssText = `overflow:hidden;position:fixed;top:-${y}px;width:100%`;
    } else {
      const y = Math.abs(parseInt(document.body.style.top || '0', 10));
      document.body.style.cssText = '';
      window.scrollTo(0, y);
    }
    return () => { document.body.style.cssText = ''; };
  }, [active]);
}

/* ─── Tab names ─── */
const TABS = ['Programme', 'Objectifs', 'Prérequis', 'Formateur'];

export default function Formations() {
  const { content, loading } = useCMS();
  const { formations } = content;
  const [filter, setFilter]         = useState('Tous');
  const [selected, setSelected]     = useState(null);
  const [activeTab, setActiveTab]   = useState(0);
  const [imgLoaded, setImgLoaded]   = useState(false);
  const overlayRef = useRef(null);

  const levels   = ['Tous', 'Débutant', 'Intermédiaire', 'Avancé'];
  const filtered = filter === 'Tous' ? formations : formations.filter(f => f.level === filter);

  useLockBodyScroll(!!selected);

  const openModal = (f) => { setSelected(f); setActiveTab(0); setImgLoaded(false); };
  const closeModal = () => setSelected(null);

  /* close on overlay click */
  const handleOverlayClick = (e) => { if (e.target === overlayRef.current) closeModal(); };

  /* close on Escape */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* ---- tab content ---- */
  const getTabContent = (f) => {
    switch (activeTab) {
      case 0: return (
        <div className="fm-tab-body">
          <p className="fm-long-desc">{f.description}</p>
          {f.program?.length > 0 && (
            <div className="fm-program-list">
              {f.program.map((step, i) => (
                <div key={i} className="fm-program-item">
                  <div className="fm-prog-num">{String(i + 1).padStart(2, '0')}</div>
                  <div className="fm-prog-text">{step}</div>
                </div>
              ))}
            </div>
          )}
          {!f.program?.length && (
            <div className="fm-placeholder-list">
              {['Fondamentaux théoriques et cadre conceptuel', 'Ateliers pratiques sur environnement réel', 'Études de cas et mise en situation professionnelle', 'Évaluation des acquis et remise de certificat'].map((item, i) => (
                <div key={i} className="fm-program-item">
                  <div className="fm-prog-num">{String(i + 1).padStart(2, '0')}</div>
                  <div className="fm-prog-text">{item}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
      case 1: return (
        <div className="fm-tab-body">
          <p className="fm-section-intro">À l'issue de cette formation, vous serez capable de :</p>
          <ul className="fm-objectives-list">
            {(f.objectives?.length ? f.objectives : [
              'Maîtriser les concepts fondamentaux du domaine',
              'Mettre en œuvre les bonnes pratiques en environnement professionnel',
              'Identifier et répondre aux problématiques courantes',
              'Obtenir votre certification reconnue dans le secteur',
              'Intégrer ces compétences dans votre organisation',
            ]).map((obj, i) => (
              <li key={i} className="fm-obj-item">
                <span className="fm-obj-check"><i className="fas fa-check" /></span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
          <div className="fm-cert-banner">
            <i className="fas fa-certificate" />
            <div>
              <strong>Certificat de réussite inclus</strong>
              <span>Délivré après évaluation finale — reconnu par JK IT Solutions</span>
            </div>
          </div>
        </div>
      );
      case 2: return (
        <div className="fm-tab-body">
          <p className="fm-section-intro">Avant de vous inscrire, assurez-vous de réunir les conditions suivantes :</p>
          {(f.prerequisites?.length ? f.prerequisites : [
            'Notions de base en informatique (utilisation d\'un PC)',
            'Intérêt pour le domaine de la cybersécurité / IT',
            'Aucun prérequis technique avancé pour le niveau Débutant',
          ]).map((req, i) => (
            <div key={i} className="fm-prereq-item">
              <i className="fas fa-circle-dot" />
              <span>{req}</span>
            </div>
          ))}
          <div className="fm-info-note">
            <i className="fas fa-info-circle" />
            <span>Des doutes ? Contactez-nous avant de vous inscrire — nous évaluerons votre profil gratuitement.</span>
          </div>
        </div>
      );
      case 3: return (
        <div className="fm-tab-body">
          <div className="fm-instructor-card">
            <div className="fm-instructor-avatar">
              {f.instructor?.avatar
                ? <img src={f.instructor.avatar} alt={f.instructor?.name} />
                : <i className="fas fa-user-tie" />}
            </div>
            <div className="fm-instructor-info">
              <h4>{f.instructor?.name || 'Expert JK IT Solutions'}</h4>
              <span className="fm-instructor-role">{f.instructor?.role || 'Formateur certifié & Consultant Senior'}</span>
              <p className="fm-instructor-bio">
                {f.instructor?.bio || 'Professionnel certifié avec plus de 8 ans d\'expérience terrain en cybersécurité, réseaux et infrastructure IT. Intervenant régulier dans des entreprises et administrations en Afrique centrale. Ses formations allient rigueur académique et pragmatisme opérationnel.'}
              </p>
              <div className="fm-instructor-badges">
                <span><i className="fas fa-medal" /> Certifié CISCO</span>
                <span><i className="fas fa-medal" /> Certifié CEH</span>
                <span><i className="fas fa-medal" /> Expert Réseau</span>
              </div>
            </div>
          </div>
        </div>
      );
      default: return null;
    }
  };

  /* ---- skeleton ---- */
  const SkeletonCard = () => (
    <div className="formation-card-v2 skeleton">
      <div className="f-card-image skeleton-box" />
      <div className="f-card-content">
        <div className="skeleton-line title" />
        <div className="skeleton-line" />
        <div className="skeleton-line" style={{ width: '60%' }} />
        <div className="f-card-footer">
          <div className="skeleton-line price" />
          <div className="skeleton-line btn" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader
        title="Nos Formations"
        subtitle="Des programmes pratiques dispensés par des experts certifiés"
        breadcrumb="Formations"
      />

      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="badge">Montez en compétences</span>
            <h2>Catalogue de Formations</h2>
            <div className="divider" />
          </div>

          {/* Filtres */}
          <div className="formation-filters">
            {levels.map(l => (
              <button key={l} className={`filter-btn ${filter === l ? 'active' : ''}`} onClick={() => setFilter(l)}>
                {l}
              </button>
            ))}
          </div>

          {/* Grid — unchanged layout */}
          <div className="formations-full-grid">
            {loading
              ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : filtered.map((f) => (
                <div
                  key={f.id}
                  className="formation-card-v2"
                  onClick={() => openModal(f)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="f-card-image">
                    <img src={f.image} alt={f.title} />
                    <div className="f-level-tag" style={{ backgroundColor: levelColor[f.level] }}>{f.level}</div>
                  </div>
                  <div className="f-card-content">
                    <div className="f-card-main">
                      <h3>{f.title}</h3>
                      <p className="f-short-desc">{f.description.substring(0, 95)}...</p>
                      <div className="f-specs">
                        <div className="spec-item"><i className="far fa-clock" /> {f.duration}</div>
                        <div className="spec-item"><i className="far fa-calendar-alt" /> {f.nextSession || 'Bientôt'}</div>
                      </div>
                    </div>
                    <div className="f-card-footer">
                      <div className="f-price-box">
                        <span className="price-amount">{f.price}</span>
                      </div>
                      <div className="f-actions">
                        <button
                          className="btn-details"
                          onClick={e => { e.stopPropagation(); openModal(f); }}
                          title="Voir les détails"
                        >
                          <i className="fas fa-plus" />
                        </button>
                        <a
                          href={`https://wa.me/237690000000?text=Inscription:${encodeURIComponent(f.title)}`}
                          target="_blank" rel="noreferrer"
                          className="btn-register"
                          onClick={e => e.stopPropagation()}
                        >
                          S'inscrire
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          MODALE PREMIUM 90%
      ══════════════════════════════════════════════ */}
      {selected && (
        <div className="fm-overlay" ref={overlayRef} onClick={handleOverlayClick} role="dialog" aria-modal="true">
          <div className="fm-modal">

            {/* ── Left Panel: Visual + Quick Info ── */}
            <div className="fm-left">
              <div className="fm-hero-img">
                <img
                  src={selected.image}
                  alt={selected.title}
                  className={imgLoaded ? 'loaded' : ''}
                  onLoad={() => setImgLoaded(true)}
                />
                <div className="fm-hero-gradient" />
                <div className="fm-hero-badge" style={{ background: levelColor[selected.level], boxShadow: `0 4px 16px ${levelColor[selected.level]}55` }}>
                  {selected.level}
                </div>
              </div>

              {/* Quick stats */}
              <div className="fm-quick-stats">
                <div className="fm-qs-item">
                  <i className="far fa-clock" />
                  <div>
                    <span className="fm-qs-label">Durée</span>
                    <strong>{selected.duration || '—'}</strong>
                  </div>
                </div>
                <div className="fm-qs-divider" />
                <div className="fm-qs-item">
                  <i className="far fa-calendar-alt" />
                  <div>
                    <span className="fm-qs-label">Prochaine session</span>
                    <strong>{selected.date || selected.nextSession || 'À confirmer'}</strong>
                  </div>
                </div>
                <div className="fm-qs-divider" />
                <div className="fm-qs-item">
                  <i className="fas fa-users" />
                  <div>
                    <span className="fm-qs-label">Places max</span>
                    <strong>{selected.maxParticipants || '15'}</strong>
                  </div>
                </div>
              </div>

              {/* Price + CTA */}
              <div className="fm-price-cta">
                <div className="fm-price-display">
                  <span className="fm-price-label">Tarif</span>
                  <span className="fm-price-value">{selected.price}</span>
                </div>
                <a
                  href={`https://wa.me/237690000000?text=Bonjour, je souhaite m'inscrire à la formation : ${encodeURIComponent(selected.title)}`}
                  target="_blank" rel="noreferrer"
                  className="fm-cta-primary"
                >
                  <i className="fab fa-whatsapp" />
                  Réserver ma place
                </a>
                <button className="fm-cta-secondary" onClick={closeModal}>
                  Fermer
                </button>
              </div>

              {/* Share / Social */}
              <div className="fm-share-row">
                <span>Partager :</span>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer"><i className="fab fa-facebook-f" /></a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer"><i className="fab fa-linkedin-in" /></a>
                <a href={`https://wa.me/?text=${encodeURIComponent(selected.title + ' — ' + window.location.href)}`} target="_blank" rel="noreferrer"><i className="fab fa-whatsapp" /></a>
              </div>
            </div>

            {/* ── Right Panel: Tabs content ── */}
            <div className="fm-right">
              {/* Header */}
              <div className="fm-right-header">
                <div>
                  <div className="fm-breadcrumb">Formations <i className="fas fa-chevron-right" /> {selected.level}</div>
                  <h2 className="fm-modal-title">{selected.title}</h2>
                </div>
                <button className="fm-close-btn" onClick={closeModal} aria-label="Fermer">
                  <i className="fas fa-xmark" />
                </button>
              </div>

              {/* Highlight chips */}
              <div className="fm-chips">
                <div className="fm-chip"><i className="fas fa-certificate" /> Certificat inclus</div>
                <div className="fm-chip"><i className="fas fa-laptop" /> Pratique 70%</div>
                <div className="fm-chip"><i className="fas fa-location-dot" /> Yaoundé</div>
                <div className="fm-chip fm-chip-level" style={{ background: levelBg[selected.level], color: levelColor[selected.level], border: `1px solid ${levelColor[selected.level]}33` }}>
                  <i className="fas fa-signal" /> {selected.level}
                </div>
              </div>

              {/* Tabs */}
              <div className="fm-tabs">
                {TABS.map((tab, i) => (
                  <button
                    key={tab}
                    className={`fm-tab ${activeTab === i ? 'active' : ''}`}
                    onClick={() => setActiveTab(i)}
                  >
                    {tab}
                    {activeTab === i && <span className="fm-tab-underline" />}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="fm-tab-content">
                {getTabContent(selected)}
              </div>
            </div>
          </div>
        </div>
      )}

      <CTABanner />
    </>
  );
}