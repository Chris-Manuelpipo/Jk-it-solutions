import './PageHeader.css';

export default function PageHeader({ title, subtitle, breadcrumb }) {
  return (
    <section className="page-header">
      <div className="page-header-overlay" />
      <div className="container page-header-content">
        <div className="page-header-badge">
          <i className="fas fa-shield-halved" /> JK IT Solutions
        </div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {breadcrumb && (
          <nav className="breadcrumb">
            <span>Accueil</span>
            <i className="fas fa-chevron-right" />
            <span className="active">{breadcrumb}</span>
          </nav>
        )}
      </div>
    </section>
  );
}
