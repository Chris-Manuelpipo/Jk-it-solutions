import { useCMS } from '../context/CMSContext';
import PageHeader from '../components/ui/PageHeader';
import CTABanner from '../components/sections/CTABanner';
import './About.css';

const values = [
  { icon: 'fa-lightbulb', title: 'Innovation', desc: 'Nous intégrons les dernières technologies pour vous offrir des solutions avant-gardistes.' },
  { icon: 'fa-star', title: 'Excellence', desc: 'La qualité est au cœur de chaque mission que nous accomplissons.' },
  { icon: 'fa-handshake', title: 'Intégrité', desc: 'Transparence, honnêteté et respect dans toutes nos relations professionnelles.' },
  { icon: 'fa-users', title: 'Collaboration', desc: 'Nous travaillons en étroite collaboration avec nos clients pour atteindre leurs objectifs.' },
];

export default function About() {
  const { content } = useCMS();
  const { about, team } = content;

  return (
    <>
      <PageHeader
        title="À Propos De Nous"
        subtitle="Découvrez l'histoire, la mission et les valeurs de JK IT Solutions"
        breadcrumb="À Propos"
      />

      {/* Mission */}
      <section className="section-padding">
        <div className="container about-grid">
          <div className="about-img-col">
            <img src={about.image} alt="JK IT Solutions" className="about-full-img" />
          </div>
          <div className="about-info-col">
            <span className="badge">Notre Histoire</span>
            <h2>{about.title}</h2>
            <div className="divider" style={{ margin: '1rem 0' }} />
            <p>{about.text}</p>
            <p style={{ marginTop: '1rem', color: 'var(--gray)' }}>
              Basés à Yaoundé, nous servons des clients dans tout le Cameroun et en Afrique centrale. Notre connaissance
              du contexte local couplée à notre expertise internationale nous permet de proposer des solutions
              réellement adaptées aux réalités africaines.
            </p>
            <div className="about-stats-row">
              {about.stats.map((s, i) => (
                <div key={i} className="about-stat">
                  <strong>{s.value}+</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding values-section">
        <div className="container">
          <div className="section-header">
            <span className="badge">Ce qui nous guide</span>
            <h2>Nos Valeurs</h2>
            <div className="divider" />
          </div>
          <div className="values-grid">
            {values.map((v, i) => (
              <div key={i} className="value-card">
                <div className="value-icon"><i className={`fas ${v.icon}`} /></div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="badge">L'équipe</span>
            <h2>Notre Équipe d'Experts</h2>
            <div className="divider" />
            <p>Des professionnels certifiés et passionnés par la cybersécurité et les nouvelles technologies.</p>
          </div>
          <div className="team-grid">
            {team.map((member) => (
              <div key={member.id} className="team-card">
                <div className="team-img-wrap">
                  <img src={member.image} alt={member.name} />
                  <div className="team-overlay">
                    <a href={member.linkedin} target="_blank" rel="noreferrer"><i className="fab fa-linkedin-in" /></a>
                    <a href={member.twitter} target="_blank" rel="noreferrer"><i className="fab fa-twitter" /></a>
                  </div>
                </div>
                <div className="team-info">
                  <h4>{member.name}</h4>
                  <span>{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
