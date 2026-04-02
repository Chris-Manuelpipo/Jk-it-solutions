import { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { createHeroSlide, updateHeroSlide, deleteHeroSlide } from '../../api/strapiAdmin';

export default function AdminHero({ onSave }) {
  const { content, refreshContent } = useCMS();
  const [slides, setSlides] = useState(JSON.parse(JSON.stringify(content.hero.slides)));
  const [activeSlide, setActiveSlide] = useState(0);
  const [saving, setSaving] = useState(false);

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
      image: '', imageFile: null,
      cta1: { text: 'En savoir plus', link: '/services' },
      cta2: { text: 'Devis Gratuit', link: '/contact' }
    }]);
    setActiveSlide(slides.length);
  };
  const removeSlide = async (idx) => {
    if (slides.length <= 1) return;
    const slideToRemove = slides[idx];
    if (slideToRemove.documentId) {
      try { await deleteHeroSlide(slideToRemove.documentId); } catch {}
    }
    setSlides(slides.filter((_, i) => i !== idx));
    setActiveSlide(Math.max(0, idx - 1));
  };

  const handleImageUrlChange = (idx, url) => {
    const updated = slides.map((s, i) => i === idx ? { ...s, image: url, imageFile: null } : s);
    setSlides(updated);
  };

  const handleImageFileChange = (idx, file) => {
    const url = URL.createObjectURL(file);
    const updated = slides.map((s, i) => i === idx ? { ...s, image: url, imageFile: file } : s);
    setSlides(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const slide of slides) {
        const payload = {
          title: slide.title,
          subtitle: slide.subtitle,
          cta1_text: slide.cta1?.text,
          cta1_link: slide.cta1?.link,
          cta2_text: slide.cta2?.text,
          cta2_link: slide.cta2?.link,
          image_url: slide.image || '',
          order: slides.indexOf(slide),
          active: true,
        };
        if (slide.documentId) {
          await updateHeroSlide(slide.documentId, payload, slide.imageFile || null);
        } else {
          const created = await createHeroSlide(payload, slide.imageFile || null);
          const updated = slides.map(s => s.id === slide.id ? { ...s, documentId: created.documentId } : s);
          setSlides(updated);
        }
      }
      await refreshContent();
      onSave('Carousel Hero sauvegardé avec succès !');
    } catch (err) {
      onSave('Erreur: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const slide = slides[activeSlide];

  return (
    <div>
      {/* Slide selector */}
      <div className="admin-card" style={{ marginBottom: '1rem' }}>
        <div className="admin-card-header">
          <h2><i className="fas fa-images" /> Gestion des Slides</h2>
          <button className="btn-admin-save" onClick={handleSave} disabled={saving}>
            {saving ? <><i className="fas fa-circle-notch fa-spin" /> Enregistrement...</> : <><i className="fas fa-save" /> Sauvegarder</>}
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
              <label>Image de fond</label>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                <input
                  type="url"
                  value={slide.imageFile ? '' : slide.image}
                  onChange={e => handleImageUrlChange(activeSlide, e.target.value)}
                  placeholder="Collez une URL (https://...)"
                  style={{ flex: 1 }}
                />
                <label className="btn-admin-add" style={{ width: 'auto', margin: 0, cursor: 'pointer' }}>
                  <i className="fas fa-upload" /> Uploader
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => {
                      if (e.target.files[0]) handleImageFileChange(activeSlide, e.target.files[0]);
                    }}
                  />
                </label>
              </div>
              {slide.image && <img src={slide.image} alt="" className="img-preview" />}
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
