import { useState, useEffect, useRef } from 'react';
import { useCMS } from '../context/CMSContext';
import PageHeader from '../components/ui/PageHeader';
import CTABanner from '../components/sections/CTABanner';
import './Services.css';

/* ── lock body scroll ── */
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

const TABS = ['Présentation', 'Ce que nous faisons', 'Avantages', 'Processus'];

/* accent color per icon family */
const accentFor = (icon = '') => {
  if (icon.includes('shield') || icon.includes('lock') || icon.includes('key') || icon.includes('virus') || icon.includes('bug')) return { from: '#1a7a3c', to: '#39d46a', light: 'rgba(26,122,60,0.08)' };
  if (icon.includes('camera') || icon.includes('video') || icon.includes('eye')) return { from: '#1d4ed8', to: '#60a5fa', light: 'rgba(29,78,216,0.08)' };
  if (icon.includes('network') || icon.includes('wifi') || icon.includes('router') || icon.includes('ethernet')) return { from: '#7c3aed', to: '#a78bfa', light: 'rgba(124,58,237,0.08)' };
  if (icon.includes('cloud') || icon.includes('server') || icon.includes('database')) return { from: '#0891b2', to: '#38bdf8', light: 'rgba(8,145,178,0.08)' };
  if (icon.includes('graduation') || icon.includes('book') || icon.includes('chalkboard')) return { from: '#d97706', to: '#fbbf24', light: 'rgba(217,119,6,0.08)' };
  return { from: '#1a7a3c', to: '#39d46a', light: 'rgba(26,122,60,0.08)' };
};

export default function Services() {
  const { content } = useCMS();
  const { services } = content;
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const overlayRef = useRef(null);

  useLockBodyScroll(!!selected);

  const openModal  = (s) => { setSelected(s); setActiveTab(0); };
  const closeModal = () => setSelected(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleOverlay = (e) => { if (e.target === overlayRef.current) closeModal(); };

  /* ── tab content ── */
  const renderTab = (s) => {
    const acc = accentFor(s.icon);
    switch (activeTab) {
      case 0: return (
        <div className="sm-tab-body">
          <p className="sm-long-desc">{s.longDescription || s.description}</p>
          {(s.highlights || []).length > 0 && (
            <div className="sm-highlights">
              {s.highlights.map((h, i) => (
                <div key={i} className="sm-highlight-item" style={{ borderLeftColor: acc.from }}>
                  <strong>{h.label}</strong>
                  <span>{h.value}</span>
                </div>
              ))}
            </div>
          )}
          {!(s.highlights?.length) && (
            <div className="sm-highlights">
              {[
                { label: 'Délai moyen', value: '5 à 10 jours ouvrés' },
                { label: 'Disponibilité', value: 'Lundi – Samedi, 8h – 18h' },
                { label: 'Zone d\'intervention', value: 'Yaoundé & toute la région' },
                { label: 'Support après mission', value: '30 jours inclus' },
              ].map((h, i) => (
                <div key={i} className="sm-highlight-item" style={{ borderLeftColor: acc.from }}>
                  <strong>{h.label}</strong>
                  <span>{h.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );

      case 1: return (
        <div className="sm-tab-body">
          <p className="sm-section-intro">Nos prestations dans ce domaine incluent :</p>
          <ul className="sm-features-list">
            {(s.features?.length ? s.features : [
              'Analyse complète de votre environnement et de vos besoins',
              'Conception et déploiement de la solution sur mesure',
              'Tests rigoureux et validation en conditions réelles',
              'Documentation technique détaillée livrée à la fin de la mission',
              'Formation de vos équipes à l\'utilisation de la solution',
              'Support et maintenance post-déploiement inclus',
            ]).map((feat, i) => (
              <li key={i} className="sm-feature-item">
                <span className="sm-feat-dot" style={{ background: `linear-gradient(135deg, ${acc.from}, ${acc.to})` }}>
                  <i className="fas fa-check" />
                </span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      );

      case 2: return (
        <div className="sm-tab-body">
          <div className="sm-benefits-grid">
            {(s.benefits?.length ? s.benefits : [
              { icon: 'fa-shield-halved', title: 'Expertise certifiée', desc: 'Nos ingénieurs sont certifiés par des organismes internationaux reconnus.' },
              { icon: 'fa-handshake', title: 'Sur mesure', desc: 'Chaque solution est adaptée à votre contexte et vos contraintes spécifiques.' },
              { icon: 'fa-clock', title: 'Réactivité', desc: 'Intervention rapide, délais maîtrisés et communication transparente.' },
              { icon: 'fa-award', title: 'Qualité garantie', desc: 'Livrables documentés, testés et validés avant remise au client.' },
            ]).map((b, i) => (
              <div key={i} className="sm-benefit-card" style={{ '--acc-light': acc.light, '--acc-from': acc.from }}>
                <div className="sm-benefit-icon" style={{ background: acc.light, color: acc.from }}>
                  <i className={`fas ${b.icon || 'fa-star'}`} />
                </div>
                <h4>{b.title}</h4>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      );

      case 3: return (
        <div className="sm-tab-body">
          <p className="sm-section-intro">Notre méthodologie d'intervention en 4 étapes :</p>
          <div className="sm-process-steps">
            {(s.process?.length ? s.process : [
              { num: '01', title: 'Prise de contact & Audit', desc: 'Échange initial pour comprendre vos besoins, votre environnement et définir le périmètre de la mission.' },
              { num: '02', title: 'Proposition & Validation', desc: 'Élaboration d\'une proposition technique et commerciale détaillée, validée avec vous avant tout démarrage.' },
              { num: '03', title: 'Réalisation', desc: 'Exécution de la mission par nos experts avec points d\'avancement réguliers et transparence totale.' },
              { num: '04', title: 'Livraison & Support', desc: 'Remise des livrables, formation si nécessaire et accompagnement post-mission de 30 jours.' },
            ]).map((step, i) => (
              <div key={i} className="sm-process-item">
                <div className="sm-process-num" style={{ background: `linear-gradient(135deg, ${acc.from}, ${acc.to})` }}>
                  {step.num}
                </div>
                <div className="sm-process-content">
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
                {i < 3 && <div className="sm-process-connector" />}
              </div>
            ))}
          </div>
        </div>
      );

      default: return null;
    }
  };

  const acc = selected ? accentFor(selected.icon) : null;

  return (
    <>
      <PageHeader
        title="Nos Services"
        subtitle="Des solutions complètes en cybersécurité, réseau, IoT et intégration système"
        breadcrumb="Services"
      />

      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="badge">Notre expertise</span>
            <h2>Ce Que Nous Proposons</h2>
            <div className="divider" />
            <p>12 domaines d'expertise pour couvrir l'ensemble de vos besoins en sécurité et infrastructure IT.</p>
          </div>

          {/* Grid — card layout unchanged */}
          <div className="services-full-grid">
            {services.map((service, i) => (
              <div
                className="service-full-card"
                key={service.id}
                style={{ animationDelay: `${i * 0.06}s`, cursor: 'pointer' }}
                onClick={() => openModal(service)}
              >
                <div className="sfc-icon">
                  <i className={`fas ${service.icon}`} />
                </div>
                <div className="sfc-body">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
                <span className="sfc-link">
                  Voir les détails <i className="fas fa-arrow-right" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="section-padding services-why-section">
        <div className="container">
          <div className="section-header">
            <span className="badge">Pourquoi nous choisir</span>
            <h2>Notre Approche</h2>
            <div className="divider" />
          </div>
          <div className="approach-grid">
            {[
              { num: '01', title: 'Audit & Analyse', desc: 'Nous commençons par comprendre votre environnement, vos risques et vos objectifs.' },
              { num: '02', title: 'Conception Sur Mesure', desc: 'Chaque solution est conçue spécifiquement pour votre contexte et vos contraintes.' },
              { num: '03', title: 'Implémentation', desc: 'Déploiement rigoureux avec tests complets et documentation détaillée.' },
              { num: '04', title: 'Suivi & Support', desc: 'Accompagnement continu et support réactif après la mise en production.' },
            ].map((step, i) => (
              <div key={i} className="approach-step">
                <div className="step-num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />

      {/* ══════════════════════════════════════════
          MODALE PREMIUM 90%
      ══════════════════════════════════════════ */}
      {selected && acc && (
        <div className="sm-overlay" ref={overlayRef} onClick={handleOverlay} role="dialog" aria-modal="true">
          <div className="sm-modal">

            {/* ── LEFT PANEL ── */}
            <div className="sm-left" style={{ background: `linear-gradient(160deg, #0b1623 0%, #0f2236 60%, #0d1f13 100%)` }}>

              {/* Icon hero */}
              <div className="sm-icon-hero">
                <div className="sm-icon-glow" style={{ background: `radial-gradient(circle, ${acc.from}33 0%, transparent 70%)` }} />
                <div className="sm-icon-ring" style={{ borderColor: `${acc.from}44` }}>
                  <div className="sm-icon-inner" style={{ background: `linear-gradient(135deg, ${acc.from}22, ${acc.to}11)`, boxShadow: `0 0 40px ${acc.from}33` }}>
                    <i className={`fas ${selected.icon}`} style={{ color: acc.to, filter: `drop-shadow(0 0 12px ${acc.from}88)` }} />
                  </div>
                </div>
              </div>

              {/* Service title */}
              <div className="sm-left-title">
                <h3>{selected.title}</h3>
                <p>{selected.description}</p>
              </div>

              {/* Stats row */}
              <div className="sm-stats">
                {(selected.stats || [
                  { value: '100%', label: 'Sur mesure' },
                  { value: '30j', label: 'Support inclus' },
                  { value: '8+', label: 'Ans d\'expertise' },
                ]).map((stat, i) => (
                  <div key={i} className="sm-stat">
                    <strong style={{ color: acc.to }}>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="sm-tags">
                {(selected.tags || ['Professionnel', 'Certifié', 'Yaoundé', 'Sur mesure']).map((tag, i) => (
                  <span key={i} className="sm-tag" style={{ borderColor: `${acc.from}55`, color: acc.to, background: `${acc.from}11` }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="sm-left-cta">
                <a
                  href={`/contact?service=${encodeURIComponent(selected.title)}`}
                  className="sm-cta-primary"
                  style={{ background: `linear-gradient(135deg, ${acc.from}, ${acc.to})`, boxShadow: `0 6px 24px ${acc.from}55` }}
                  onClick={e => e.stopPropagation()}
                >
                  <i className="fas fa-paper-plane" />
                  Demander un devis
                </a>
                <a
                  href={`https://wa.me/237690000000?text=Bonjour, je souhaite en savoir plus sur votre service : ${encodeURIComponent(selected.title)}`}
                  target="_blank" rel="noreferrer"
                  className="sm-cta-secondary"
                  onClick={e => e.stopPropagation()}
                >
                  <i className="fab fa-whatsapp" />
                  Discuter sur WhatsApp
                </a>
              </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="sm-right">
              {/* Header */}
              <div className="sm-right-header">
                <div>
                  <div className="sm-breadcrumb">
                    Services <i className="fas fa-chevron-right" /> {selected.title}
                  </div>
                  <h2 className="sm-modal-title">{selected.title}</h2>
                </div>
                <button className="sm-close-btn" onClick={closeModal} aria-label="Fermer">
                  <i className="fas fa-xmark" />
                </button>
              </div>

              {/* Tabs */}
              <div className="sm-tabs">
                {TABS.map((tab, i) => (
                  <button
                    key={tab}
                    className={`sm-tab ${activeTab === i ? 'active' : ''}`}
                    onClick={() => setActiveTab(i)}
                    style={activeTab === i ? { color: acc.from } : {}}
                  >
                    {tab}
                    {activeTab === i && (
                      <span className="sm-tab-bar" style={{ background: acc.from }} />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="sm-tab-content">
                {renderTab(selected)}
              </div>

              {/* Footer */}
              <div className="sm-right-footer">
                <div className="sm-footer-note">
                  <i className="fas fa-circle-info" />
                  <span>Besoin d'une solution personnalisée ? Notre équipe est disponible pour un audit gratuit.</span>
                </div>
                <div className="sm-footer-actions">
                  <button className="sm-footer-close" onClick={closeModal}>Fermer</button>
                  <a
                    href="/contact"
                    className="sm-footer-cta"
                    style={{ background: `linear-gradient(135deg, ${acc.from}, ${acc.to})` }}
                    onClick={e => e.stopPropagation()}
                  >
                    <i className="fas fa-arrow-right" /> Nous contacter
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}