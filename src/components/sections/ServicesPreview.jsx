import { Link } from 'react-router-dom';
import { useCMS } from '../../context/CMSContext';
import './ServicesPreview.css';

export default function ServicesPreview() {
  const { content } = useCMS();
  const { services } = content;
  const preview = services.slice(0, 6);

  return (
    <section className="section-padding services-preview-section">
      <div className="container">
        <div className="section-header">
          <span className="badge">Ce que nous faisons</span>
          <h2>Nos Services</h2>
          <div className="divider" />
          <p>Des solutions de cybersécurité et d'infrastructure IT complètes, adaptées à vos besoins et au contexte camerounais.</p>
        </div>

        <div className="services-grid">
          {preview.map((service, i) => (
            <div
              className="service-card"
              key={service.id}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="service-icon-wrap">
                <i className={`fas ${service.icon}`} />
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <div className="service-card-footer">
                <Link to="/services" className="service-link">
                  En savoir plus <i className="fas fa-arrow-right" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link to="/services" className="btn btn-outline-dark">
            Voir tous nos services <i className="fas fa-arrow-right" />
          </Link>
        </div>
      </div>
    </section>
  );
}
