import { Link } from 'react-router-dom';
import { useCMS } from '../../context/CMSContext';
import './AboutPreview.css';

const features = [
  { icon: 'fa-certificate', text: 'Experts certifiés en cybersécurité' },
  { icon: 'fa-headset', text: 'Support et assistance 24h/7j' },
  { icon: 'fa-map-location-dot', text: 'Connaissance du contexte africain' },
  { icon: 'fa-shield-halved', text: 'Solutions sur mesure et évolutives' },
];

export default function AboutPreview() {
  const { content } = useCMS();
  const { about } = content;

  return (
    <section className="section-padding about-preview-section">
      <div className="container about-preview-grid">
        {/* Image */}
        <div className="about-image-wrap">
          <img src={about.image} alt="À propos de JK IT Solutions" className="about-main-img" />
          <div className="about-badge-float">
            <i className="fas fa-shield-halved" />
            <div>
              <strong>8+ Années</strong>
              <span>d'expertise</span>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="about-text-wrap">
          <span className="badge">Qui sommes-nous</span>
          <h2>{about.title}</h2>
          <div className="divider" style={{ margin: '1rem 0' }} />
          <p className="about-desc">{about.text}</p>

          <ul className="about-features">
            {features.map((f, i) => (
              <li key={i}>
                <span className="feature-icon"><i className={`fas ${f.icon}`} /></span>
                <span>{f.text}</span>
              </li>
            ))}
          </ul>

          <Link to="/about" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            Découvrir Notre Histoire <i className="fas fa-arrow-right" />
          </Link>
        </div>
      </div>
    </section>
  );
}
