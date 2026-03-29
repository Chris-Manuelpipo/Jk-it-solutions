import { Link } from 'react-router-dom';
import { useCMS } from '../../context/CMSContext';
import './Footer.css';

export default function Footer() {
  const { content } = useCMS();
  const { contact, siteConfig, services } = content;

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container footer-grid">
          {/* Brand */}
          <div className="footer-col footer-brand-col">
            <div className="footer-logo">
              <span className="logo-icon"><i className="fas fa-shield-halved" /></span>
              <span className="logo-text">{siteConfig.companyName}</span>
            </div>
            <p className="footer-desc">
              Expert en cybersécurité, vidéosurveillance, IoT et transformation digitale à Yaoundé, Cameroun. Votre sécurité est notre priorité.
            </p>
            <div className="footer-social">
              <a href={contact.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f" /></a>
              <a href={contact.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in" /></a>
              <a href={`https://wa.me/${contact.whatsapp?.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><i className="fab fa-whatsapp" /></a>
            </div>
          </div>

          {/* Navigation */}
          <div className="footer-col">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/"><i className="fas fa-chevron-right" /> Accueil</Link></li>
              <li><Link to="/about"><i className="fas fa-chevron-right" /> À Propos</Link></li>
              <li><Link to="/services"><i className="fas fa-chevron-right" /> Services</Link></li>
              <li><Link to="/formations"><i className="fas fa-chevron-right" /> Formations</Link></li>
              <li><Link to="/contact"><i className="fas fa-chevron-right" /> Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h4 className="footer-heading">Nos Services</h4>
            <ul className="footer-links">
              {services.slice(0, 6).map(s => (
                <li key={s.id}><Link to="/services"><i className="fas fa-chevron-right" /> {s.title}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4 className="footer-heading">Contact</h4>
            <ul className="footer-contact">
              <li><i className="fas fa-map-marker-alt" /><span>{contact.address}</span></li>
              <li><i className="fas fa-phone-alt" /><a href={`tel:${contact.phone}`}>{contact.phone}</a></li>
              <li><i className="fas fa-envelope" /><a href={`mailto:${contact.email}`}>{contact.email}</a></li>
              <li><i className="far fa-clock" /><span>{contact.hours}</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {new Date().getFullYear()} {siteConfig.companyName}. Tous droits réservés.</p>
          <p>Conçu à ENSPY Yaoundé, Cameroun</p>
        </div>
      </div>
    </footer>
  );
}
