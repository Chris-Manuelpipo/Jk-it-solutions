import { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

export default function AdminHero({ onSave }) {
  const { content, updateContent } = useCMS();
  const [slides, setSlides] = useState(JSON.parse(JSON.stringify(content.hero.slides)));
  const [activeSlide, setActiveSlide] = useState(0);

  const updateSlide = (idx, field, value) => {
    const updated = slides.map((s, i) => i === idx ? { ...s, [field]: value } : s);
    setSlides(updated);
  };
  const updateCta = (idx, ctaKey, field, value) => {
    const updated = slides.map((s, i) => i === idx ? { ...s, [ctaKey]: { ...s[ctaKey], [field]: value } } : s);
    setSlides(updated);
  };
  const addSlide = () => {
    setSlides([...slides, {
      id: Date.now(), title: 'Nouveau Slide', subtitle: 'Description du slide',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=80',
      cta1: { text: 'En savoir plus', link: '/services' },
      cta2: { text: 'Devis Gratuit', link: '/contact' }
    }]);
    setActiveSlide(slides.length);
  };
  const removeSlide = (idx) => {
    if (slides.length <= 1) return;
    setSlides(slides.filter((_, i) => i !== idx));
    setActiveSlide(Math.max(0, idx - 1));
  };
  const handleSave = () => {
    updateContent('hero', { slides });
    onSave('Carousel Hero sauvegardé avec succès !');
  };

  const slide = slides[activeSlide];

  return (
    <div>
      {/* Slide selector */}
      <div className="admin-card" style={{ marginBottom: '1rem' }}>
        <div className="admin-card-header">
          <h2><i className="fas fa-images" /> Gestion des Slides</h2>
          <button className="btn-admin-save" onClick={handleSave}>
            <i className="fas fa-save" /> Sauvegarder
          </button>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActiveSlide(i)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius)',
                border: '2px solid',
                borderColor: i === activeSlide ? 'var(--primary)' : 'var(--gray-light)',
                background: i === activeSlide ? 'var(--light-2)' : 'white',
                color: i === activeSlide ? 'var(--primary)' : 'var(--gray)',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
              }}
            >
              Slide {i + 1}
            </button>
          ))}
          <button className="btn-admin-add" style={{ width: 'auto', margin: 0 }} onClick={addSlide}>
            <i className="fas fa-plus" /> Ajouter un slide
          </button>
        </div>
      </div>

      {/* Slide editor */}
      {slide && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h2><i className="fas fa-pen" /> Modifier Slide {activeSlide + 1}</h2>
            {slides.length > 1 && (
              <button className="btn-admin-danger" onClick={() => removeSlide(activeSlide)}>
                <i className="fas fa-trash" /> Supprimer ce slide
              </button>
            )}
          </div>

          <div className="admin-form">
            {/* Image */}
            <div className="admin-field">
              <label>Image de fond (URL)</label>
              <div className="img-url-wrap">
                <input
                  type="url"
                  value={slide.image}
                  onChange={e => updateSlide(activeSlide, 'image', e.target.value)}
                  placeholder="https://..."
                />
              </div>
              {slide.image && <img src={slide.image} alt="" className="img-preview" />}
              <small style={{ color: 'var(--gray)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                💡 Utilisez Unsplash, Cloudinary ou uploadez sur Strapi Media Library
              </small>
            </div>

            <div className="admin-field">
              <label>Titre principal</label>
              <textarea
                value={slide.title}
                onChange={e => updateSlide(activeSlide, 'title', e.target.value)}
                rows={2}
              />
            </div>

            <div className="admin-field">
              <label>Sous-titre / Description</label>
              <textarea
                value={slide.subtitle}
                onChange={e => updateSlide(activeSlide, 'subtitle', e.target.value)}
                rows={3}
              />
            </div>

            <div className="admin-form-row">
              <div>
                <label style={{ fontWeight: '600', fontSize: '0.8rem', color: 'var(--dark)', display: 'block', marginBottom: '0.5rem' }}>Bouton 1 (Principal)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div className="admin-field" style={{ flex: 1 }}>
                    <label>Texte</label>
                    <input type="text" value={slide.cta1.text} onChange={e => updateCta(activeSlide, 'cta1', 'text', e.target.value)} />
                  </div>
                  <div className="admin-field" style={{ flex: 1 }}>
                    <label>Lien</label>
                    <input type="text" value={slide.cta1.link} onChange={e => updateCta(activeSlide, 'cta1', 'link', e.target.value)} />
                  </div>
                </div>
              </div>
              <div>
                <label style={{ fontWeight: '600', fontSize: '0.8rem', color: 'var(--dark)', display: 'block', marginBottom: '0.5rem' }}>Bouton 2 (Secondaire)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div className="admin-field" style={{ flex: 1 }}>
                    <label>Texte</label>
                    <input type="text" value={slide.cta2.text} onChange={e => updateCta(activeSlide, 'cta2', 'text', e.target.value)} />
                  </div>
                  <div className="admin-field" style={{ flex: 1 }}>
                    <label>Lien</label>
                    <input type="text" value={slide.cta2.link} onChange={e => updateCta(activeSlide, 'cta2', 'link', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
