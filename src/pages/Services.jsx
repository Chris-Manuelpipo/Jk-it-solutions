import { useCMS } from '../context/CMSContext';
import PageHeader from '../components/ui/PageHeader';
import CTABanner from '../components/sections/CTABanner';
import './Services.css';

export default function Services() {
  const { content } = useCMS();
  const { services } = content;

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

          <div className="services-full-grid">
            {services.map((service, i) => (
              <div className="service-full-card" key={service.id} style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="sfc-icon">
                  <i className={`fas ${service.icon}`} />
                </div>
                <div className="sfc-body">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
                <a href="/contact" className="sfc-link">
                  Demander un devis <i className="fas fa-arrow-right" />
                </a>
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
    </>
  );
}
