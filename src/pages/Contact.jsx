import { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import PageHeader from '../components/ui/PageHeader';
import './Contact.css';

export default function Contact() {
  const { content } = useCMS();
  const { contact } = content;
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    const msg = `Bonjour JK IT Solutions,%0A%0ANom: ${form.name}%0AEmail: ${form.email}%0ATéléphone: ${form.phone}%0ASujet: ${form.subject}%0A%0AMessage:%0A${form.message}`;
    window.open(`https://wa.me/${contact.whatsapp?.replace(/\D/g,'')}?text=${msg}`, '_blank');
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <>
      <PageHeader
        title="Contactez-Nous"
        subtitle="Notre équipe est disponible pour répondre à toutes vos questions"
        breadcrumb="Contact"
      />

      <section className="section-padding">
        <div className="container contact-layout">
          {/* Info */}
          <div className="contact-info">
            <h2>Parlons de Votre Projet</h2>
            <p>Que ce soit pour un audit de sécurité, une installation de vidéosurveillance ou une formation, nous sommes là pour vous accompagner.</p>

            <div className="contact-cards">
              <div className="contact-card">
                <div className="contact-card-icon"><i className="fas fa-map-marker-alt" /></div>
                <div>
                  <strong>Adresse</strong>
                  <span>{contact.address}</span>
                </div>
              </div>
              <div className="contact-card">
                <div className="contact-card-icon"><i className="fas fa-phone-alt" /></div>
                <div>
                  <strong>Téléphone</strong>
                  <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                </div>
              </div>
              <div className="contact-card">
                <div className="contact-card-icon"><i className="fas fa-envelope" /></div>
                <div>
                  <strong>Email</strong>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </div>
              </div>
              <div className="contact-card">
                <div className="contact-card-icon"><i className="far fa-clock" /></div>
                <div>
                  <strong>Horaires</strong>
                  <span>{contact.hours}</span>
                </div>
              </div>
            </div>

            <div className="contact-social">
              <a href={contact.facebook} target="_blank" rel="noreferrer" className="social-btn">
                <i className="fab fa-facebook-f" /> Facebook
              </a>
              <a href={contact.linkedin} target="_blank" rel="noreferrer" className="social-btn">
                <i className="fab fa-linkedin-in" /> LinkedIn
              </a>
              <a href={`https://wa.me/${contact.whatsapp?.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="social-btn whatsapp">
                <i className="fab fa-whatsapp" /> WhatsApp
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="contact-form-wrap">
            <h3>Envoyez-nous un message</h3>
            {sent && (
              <div className="form-success">
                <i className="fas fa-check-circle" /> Message envoyé via WhatsApp !
              </div>
            )}
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Nom complet *</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Votre nom" required />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="votre@email.com" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Téléphone</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+237 6XX XXX XXX" />
                </div>
                <div className="form-group">
                  <label>Sujet *</label>
                  <select name="subject" value={form.subject} onChange={handleChange} required>
                    <option value="">Sélectionner un sujet</option>
                    <option>Audit de sécurité</option>
                    <option>Vidéosurveillance</option>
                    <option>Formation</option>
                    <option>Consultation IoT</option>
                    <option>Autre</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Message *</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Décrivez votre besoin..." required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <i className="fab fa-whatsapp" /> Envoyer via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Map embed placeholder */}
      <div className="map-section">
        <iframe
          title="Localisation JK IT Solutions Yaoundé"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127620.57490285716!2d11.4623546!3d3.8480325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcf7a309a7977%3A0x7f14a3b5bdbb1fd3!2sYaound%C3%A9%2C%20Cameroun!5e0!3m2!1sfr!2sfr!4v1711000000000!5m2!1sfr!2sfr"
          width="100%"
          height="400"
          style={{ border: 0, display: 'block' }}
          allowFullScreen
          loading="lazy"
        />
      </div>
    </>
  );
}
