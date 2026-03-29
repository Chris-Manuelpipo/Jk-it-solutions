import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <section className="notfound-section">
      <div className="notfound-bg" />
      <div className="container notfound-content">
        <div className="notfound-code">404</div>
        <h1>Page Introuvable</h1>
        <p>La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">
            <i className="fas fa-home" /> Retour à l'accueil
          </Link>
          <Link to="/contact" className="btn btn-outline-dark">
            <i className="fas fa-headset" /> Nous contacter
          </Link>
        </div>
      </div>
    </section>
  );
}
