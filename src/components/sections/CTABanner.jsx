import { Link } from 'react-router-dom';
import './CTABanner.css';

export default function CTABanner() {
  return (
    <section className="cta-banner">
      <div className="cta-overlay" />
      <div className="container cta-content">
        <div className="cta-text">
          <h2>Prêt à Sécuriser Votre Infrastructure ?</h2>
          <p>Contactez-nous pour un audit gratuit de votre sécurité informatique. Nos experts vous accompagnent de A à Z.</p>
        </div>
        <div className="cta-actions">
          <Link to="/contact" className="btn btn-primary">
            <i className="fas fa-paper-plane" /> Demander un Devis
          </Link>
          <a href="tel:+237694164668" className="btn btn-outline">
            <i className="fas fa-phone-alt" /> Appeler Maintenant
          </a>
        </div>
      </div>
    </section>
  );
}
