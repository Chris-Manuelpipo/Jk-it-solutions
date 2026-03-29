import { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import PageHeader from '../components/ui/PageHeader';
import CTABanner from '../components/sections/CTABanner';
import './Formations.css';

const levelColor = { 'Débutant': '#22c55e', 'Intermédiaire': '#f59e0b', 'Avancé': '#ef4444' };

export default function Formations() {
  const { content } = useCMS();
  const { formations } = content;
  const [filter, setFilter] = useState('Tous');
  const levels = ['Tous', 'Débutant', 'Intermédiaire', 'Avancé'];
  const filtered = filter === 'Tous' ? formations : formations.filter(f => f.level === filter);

  return (
    <>
      <PageHeader
        title="Nos Formations"
        subtitle="Des programmes pratiques dispensés par des experts certifiés à Yaoundé"
        breadcrumb="Formations"
      />

      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="badge">Montez en compétences</span>
            <h2>Catalogue de Formations</h2>
            <div className="divider" />
            <p>Chaque formation est conçue pour être applicable immédiatement dans votre contexte professionnel.</p>
          </div>

          {/* Filters */}
          <div className="formation-filters">
            {levels.map(l => (
              <button
                key={l}
                className={`filter-btn ${filter === l ? 'active' : ''}`}
                onClick={() => setFilter(l)}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="formations-full-grid">
            {filtered.map((f, i) => (
              <div className="formation-full-card" key={f.id} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="ffc-img">
                  <img src={f.image} alt={f.title} />
                  <span className="ffc-level" style={{ background: levelColor[f.level] || '#22c55e' }}>
                    {f.level}
                  </span>
                </div>
                <div className="ffc-body">
                  <h3>{f.title}</h3>
                  <p>{f.description}</p>
                  <div className="ffc-meta">
                    <span><i className="far fa-clock" /> {f.duration}</span>
                    <span><i className="far fa-calendar-alt" /> {f.date}</span>
                  </div>
                  <div className="ffc-footer">
                    <span className="ffc-price">{f.price}</span>
                    <a
                      href={`https://wa.me/237694164668?text=Bonjour, je souhaite m'inscrire à la formation : ${encodeURIComponent(f.title)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      <i className="fab fa-whatsapp" /> S'inscrire
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="no-results">
              <i className="fas fa-search" />
              <p>Aucune formation dans cette catégorie pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Info strip */}
      <section className="formation-info-strip">
        <div className="container formation-info-grid">
          {[
            { icon: 'fa-map-marker-alt', label: 'Lieu', value: 'Yaoundé, Cameroun' },
            { icon: 'fa-language', label: 'Langue', value: 'Français' },
            { icon: 'fa-certificate', label: 'Certification', value: 'Attestation officielle' },
            { icon: 'fa-headset', label: 'Support', value: 'Suivi post-formation' },
          ].map((item, i) => (
            <div key={i} className="info-strip-item">
              <i className={`fas ${item.icon}`} />
              <div>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTABanner />
    </>
  );
}
