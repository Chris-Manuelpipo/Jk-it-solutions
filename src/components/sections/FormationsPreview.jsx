import { Link } from 'react-router-dom';
import { useCMS } from '../../context/CMSContext';
import './FormationsPreview.css';

const levelColor = { 'Débutant': '#22c55e', 'Intermédiaire': '#f59e0b', 'Avancé': '#ef4444' };

export default function FormationsPreview() {
  const { content } = useCMS();
  const { formations } = content;
  const preview = formations.slice(0, 3);

  return (
    <section className="section-padding formations-preview-section">
      <div className="container">
        <div className="section-header">
          <span className="badge">Montez en compétences</span>
          <h2>Nos Formations</h2>
          <div className="divider" />
          <p>Des programmes de formation pratiques et adaptés au contexte camerounais, dispensés par des experts certifiés.</p>
        </div>

        <div className="formations-grid">
          {preview.map((f, i) => (
            <div className="formation-card" key={f.id} style={{ animationDelay: `${i * 0.12}s` }}>
              <div className="formation-img-wrap">
                <img src={f.image} alt={f.title} />
                <span className="formation-level" style={{ background: levelColor[f.level] || '#22c55e' }}>
                  {f.level}
                </span>
              </div>
              <div className="formation-body">
                <h3>{f.title}</h3>
                <p>{f.description}</p>
                <div className="formation-meta">
                  <span><i className="far fa-clock" /> {f.duration}</span>
                  <span><i className="far fa-calendar-alt" /> {f.date}</span>
                </div>
                <div className="formation-footer">
                  <span className="formation-price">{f.price}</span>
                  <Link to="/formations" className="btn btn-primary btn-sm">
                    S'inscrire
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link to="/formations" className="btn btn-outline-dark">
            Voir toutes les formations <i className="fas fa-arrow-right" />
          </Link>
        </div>
      </div>
    </section>
  );
}
