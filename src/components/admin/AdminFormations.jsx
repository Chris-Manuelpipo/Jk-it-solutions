import { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { createFormation, updateFormation, deleteFormation } from '../../api/strapiAdmin';
import ImageUrlField from './ImageUrlField';

const emptyFormation = {
  id: null, strapiId: null,
  title: '', description: '', duration: '', price: '', date: '',
  image: '', imageFile: null, level: 'Débutant',
  // ── new fields for the modal ──
  objectives: [],       // string[]
  program: [],          // string[]
  prerequisites: [],    // string[]
  maxParticipants: 15,
  nextSession: '',
  instructor: {
    name: '', role: '', bio: '', avatar: '',
  },
};

const levelColor = { 'Débutant': '#22c55e', 'Intermédiaire': '#f59e0b', 'Avancé': '#ef4444' };

/* helper: edit a string array field (objectives, program, prerequisites) */
function ListEditor({ label, value = [], onChange, placeholder = 'Ajouter un élément...' }) {
  const [draft, setDraft] = useState('');

  const add = () => {
    if (!draft.trim()) return;
    onChange([...value, draft.trim()]);
    setDraft('');
  };
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));
  const move = (i, dir) => {
    const arr = [...value];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    onChange(arr);
  };

  return (
    <div className="af-list-editor">
      <label className="af-label">{label}</label>
      <div className="af-list-items">
        {value.map((item, i) => (
          <div key={i} className="af-list-item">
            <span className="af-list-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="af-list-text">{item}</span>
            <div className="af-list-actions">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} title="Monter">↑</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} title="Descendre">↓</button>
              <button type="button" className="af-remove-btn" onClick={() => remove(i)} title="Supprimer">×</button>
            </div>
          </div>
        ))}
        {value.length === 0 && <p className="af-list-empty">Aucun élément. Ajoutez-en un ci-dessous.</p>}
      </div>
      <div className="af-list-add">
        <input
          type="text"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="af-list-input"
        />
        <button type="button" className="af-add-btn" onClick={add}>
          <i className="fas fa-plus" /> Ajouter
        </button>
      </div>
    </div>
  );
}

/* ─── SECTION TABS inside the form ─── */
const FORM_TABS = ['Infos de base', 'Contenu pédagogique', 'Formateur'];

export default function AdminFormations({ onSave }) {
  const { content, refreshContent } = useCMS();
  const [formations, setFormations] = useState([]);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(emptyFormation);
  const [saving, setSaving]         = useState(false);
  const [formTab, setFormTab]       = useState(0);

  useEffect(() => {
    setFormations(JSON.parse(JSON.stringify(content.formations || [])));
  }, [content]);

  const openNew  = () => { setForm({ ...emptyFormation, id: Date.now() }); setEditing('new'); setFormTab(0); };
  const openEdit = (f) => {
    setForm({
      ...emptyFormation,
      ...f,
      objectives:   f.objectives   || [],
      program:      f.program      || [],
      prerequisites: f.prerequisites || [],
      instructor:   { name: '', role: '', bio: '', avatar: '', ...(f.instructor || {}) },
      imageFile: null,
    });
    setEditing(f.id);
    setFormTab(0);
  };
  const cancelEdit   = () => { setEditing(null); setForm(emptyFormation); };
  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleInstructorChange = e => setForm(p => ({ ...p, instructor: { ...p.instructor, [e.target.name]: e.target.value } }));

  const handleImageUrl  = (url)  => setForm(p => ({ ...p, image: url, imageFile: null }));
  const handleImageFile = (file) => setForm(p => ({ ...p, image: URL.createObjectURL(file), imageFile: file }));

  const handleSave = async () => {
    if (!form.title || !form.description) return;
    setSaving(true);
    try {
      const payload = {
        title:           form.title,
        description:     form.description,
        duration:        form.duration,
        price:           form.price,
        date:            form.date,
        level:           form.level,
        image_url:       form.image || '',
        maxParticipants: Number(form.maxParticipants) || 15,
        nextSession:     form.nextSession,
        objectives:      form.objectives,
        program:         form.program,
        prerequisites:   form.prerequisites,
        instructor:      form.instructor,
      };
      if (editing === 'new') {
        await createFormation(payload, form.imageFile || null);
      } else {
        await updateFormation(form, payload, form.imageFile || null);
      }
      await refreshContent();
      setFormations(content.formations);
      onSave('Formation sauvegardée !');
      cancelEdit();
    } catch (err) {
      onSave('Erreur: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (f) => {
    if (!confirm('Supprimer cette formation ?')) return;
    try {
      await deleteFormation(f);
      await refreshContent();
      setFormations(content.formations);
      onSave('Formation supprimée.');
    } catch (err) {
      onSave('Erreur: ' + err.message);
    }
  };

  /* ─────────────────────────────────────────────────
     EDIT FORM
  ───────────────────────────────────────────────── */
  if (editing !== null) {
    return (
      <div className="admin-card">
        <div className="admin-card-header">
          <h2>
            <i className="fas fa-pen" />
            {editing === 'new' ? 'Nouvelle Formation' : 'Modifier la Formation'}
          </h2>
          <button onClick={cancelEdit} className="af-icon-btn">
            <i className="fas fa-times" />
          </button>
        </div>

        {/* ── Form Tabs ── */}
        <div className="af-form-tabs">
          {FORM_TABS.map((tab, i) => (
            <button
              key={tab}
              type="button"
              className={`af-form-tab ${formTab === i ? 'active' : ''}`}
              onClick={() => setFormTab(i)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="admin-form" style={{ paddingTop: '1.25rem' }}>

          {/* ─── TAB 0 : Infos de base ─── */}
          {formTab === 0 && (
            <>
              <div className="admin-form-row">
                <div className="admin-field">
                  <label>Titre *</label>
                  <input name="title" value={form.title} onChange={handleChange} placeholder="Ex: Cybersécurité Avancée" />
                </div>
                <div className="admin-field">
                  <label>Niveau</label>
                  <select name="level" value={form.level} onChange={handleChange}>
                    <option>Débutant</option>
                    <option>Intermédiaire</option>
                    <option>Avancé</option>
                  </select>
                </div>
              </div>

              <div className="admin-field">
                <label>Description *</label>
                <textarea
                  name="description" value={form.description} onChange={handleChange}
                  rows={4}
                  placeholder="Description complète de la formation (affichée dans la modale)..."
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-field">
                  <label>Durée</label>
                  <input name="duration" value={form.duration} onChange={handleChange} placeholder="Ex: 3 jours" />
                </div>
                <div className="admin-field">
                  <label>Prix (FCFA)</label>
                  <input name="price" value={form.price} onChange={handleChange} placeholder="Ex: 120 000 FCFA" />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-field">
                  <label>Date de la session</label>
                  <input name="date" value={form.date} onChange={handleChange} placeholder="Ex: 15 Avril 2026" />
                </div>
                <div className="admin-field">
                  <label>Prochaine session (label)</label>
                  <input name="nextSession" value={form.nextSession} onChange={handleChange} placeholder="Ex: 15 Avr." />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-field">
                  <label>Places max</label>
                  <input name="maxParticipants" type="number" min={1} value={form.maxParticipants} onChange={handleChange} placeholder="15" />
                </div>
                <ImageUrlField
                  label="Image"
                  value={form.image}
                  onChange={handleImageUrl}
                  onFileChange={handleImageFile}
                />
              </div>

              {form.image && (
                <img
                  src={form.image} alt="" className="img-preview"
                  style={{ maxHeight: 160, borderRadius: 'var(--radius)', objectFit: 'cover', width: '100%' }}
                />
              )}
            </>
          )}

          {/* ─── TAB 1 : Contenu pédagogique ─── */}
          {formTab === 1 && (
            <>
              <ListEditor
                label="Programme détaillé (onglet « Programme »)"
                value={form.program}
                onChange={v => setForm(p => ({ ...p, program: v }))}
                placeholder="Ex: Introduction à la sécurité réseau..."
              />
              <ListEditor
                label="Objectifs pédagogiques (onglet « Objectifs »)"
                value={form.objectives}
                onChange={v => setForm(p => ({ ...p, objectives: v }))}
                placeholder="Ex: Savoir configurer un pare-feu..."
              />
              <ListEditor
                label="Prérequis (onglet « Prérequis »)"
                value={form.prerequisites}
                onChange={v => setForm(p => ({ ...p, prerequisites: v }))}
                placeholder="Ex: Connaissances de base en réseau..."
              />
            </>
          )}

          {/* ─── TAB 2 : Formateur ─── */}
          {formTab === 2 && (
            <>
              <div className="admin-form-row">
                <div className="admin-field">
                  <label>Nom du formateur</label>
                  <input name="name" value={form.instructor.name} onChange={handleInstructorChange} placeholder="Ex: Jean-Kévin Mvondo" />
                </div>
                <div className="admin-field">
                  <label>Poste / Titre</label>
                  <input name="role" value={form.instructor.role} onChange={handleInstructorChange} placeholder="Ex: Consultant Senior Cybersécurité" />
                </div>
              </div>
              <div className="admin-field">
                <label>Biographie du formateur</label>
                <textarea
                  name="bio" value={form.instructor.bio} onChange={handleInstructorChange}
                  rows={4}
                  placeholder="Expérience, certifications, domaines d'expertise..."
                />
              </div>
              <div className="admin-field">
                <label>Photo du formateur (URL)</label>
                <input name="avatar" value={form.instructor.avatar} onChange={handleInstructorChange} placeholder="https://..." />
              </div>
              {form.instructor.avatar && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'var(--light)', borderRadius: 'var(--radius)' }}>
                  <img src={form.instructor.avatar} alt="" style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover' }} />
                  <span style={{ fontSize: '0.82rem', color: 'var(--gray)' }}>Aperçu de la photo du formateur</span>
                </div>
              )}
            </>
          )}

          {/* ── Nav + Save ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--gray-light)', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {formTab > 0 && (
                <button type="button" onClick={() => setFormTab(t => t - 1)}
                  style={{ padding: '0.6rem 1rem', borderRadius: 'var(--radius)', border: '1.5px solid var(--gray-light)', background: 'white', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.85rem', color: 'var(--dark)' }}>
                  ← Précédent
                </button>
              )}
              {formTab < FORM_TABS.length - 1 && (
                <button type="button" onClick={() => setFormTab(t => t + 1)}
                  style={{ padding: '0.6rem 1rem', borderRadius: 'var(--radius)', border: '1.5px solid var(--primary)', background: 'rgba(26,122,60,0.06)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.85rem', color: 'var(--primary)' }}>
                  Suivant →
                </button>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={cancelEdit}
                style={{ padding: '0.65rem 1.25rem', borderRadius: 'var(--radius)', border: '1.5px solid var(--gray-light)', background: 'white', color: 'var(--gray)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: '600', fontSize: '0.88rem' }}>
                Annuler
              </button>
              <button className="btn-admin-save" onClick={handleSave} disabled={saving}>
                {saving
                  ? <><i className="fas fa-circle-notch fa-spin" /> Enregistrement...</>
                  : <><i className="fas fa-save" /> Sauvegarder</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────
     LIST VIEW
  ───────────────────────────────────────────────── */
  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h2><i className="fas fa-chalkboard-user" /> Formations ({formations.length})</h2>
        <button className="btn-admin-save" onClick={openNew}><i className="fas fa-plus" /> Ajouter</button>
      </div>

      <div className="admin-list">
        {formations.map(f => (
          <div key={f.id} className="admin-list-item">
            {f.image && <img src={f.image} alt="" className="admin-list-item-img" />}
            <div className="admin-list-item-info">
              <strong>{f.title}</strong>
              <span>
                <span style={{ background: levelColor[f.level], color: 'white', padding: '0.15rem 0.5rem', borderRadius: '50px', fontSize: '0.7rem', marginRight: '0.5rem' }}>
                  {f.level}
                </span>
                {f.duration} · {f.price} · {f.date}
              </span>
              {/* Progress indicators for modal content */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem', flexWrap: 'wrap' }}>
                {['program', 'objectives', 'prerequisites'].map(key => (
                  <span key={key} style={{
                    fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '50px',
                    background: (f[key]?.length > 0) ? 'rgba(26,122,60,0.1)' : '#f4f4f4',
                    color: (f[key]?.length > 0) ? 'var(--primary)' : '#aaa',
                    border: `1px solid ${(f[key]?.length > 0) ? 'rgba(26,122,60,0.2)' : '#eee'}`,
                  }}>
                    <i className={`fas ${(f[key]?.length > 0) ? 'fa-check' : 'fa-minus'}`} style={{ fontSize: '0.55rem', marginRight: 3 }} />
                    {{ program: 'Programme', objectives: 'Objectifs', prerequisites: 'Prérequis' }[key]}
                    {f[key]?.length > 0 && ` (${f[key].length})`}
                  </span>
                ))}
                <span style={{
                  fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '50px',
                  background: f.instructor?.name ? 'rgba(26,122,60,0.1)' : '#f4f4f4',
                  color: f.instructor?.name ? 'var(--primary)' : '#aaa',
                  border: `1px solid ${f.instructor?.name ? 'rgba(26,122,60,0.2)' : '#eee'}`,
                }}>
                  <i className={`fas ${f.instructor?.name ? 'fa-check' : 'fa-minus'}`} style={{ fontSize: '0.55rem', marginRight: 3 }} />
                  Formateur
                </span>
              </div>
            </div>
            <div className="admin-list-item-actions">
              <button className="btn-admin-save" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }} onClick={() => openEdit(f)}>
                <i className="fas fa-pen" />
              </button>
              <button className="btn-admin-danger" onClick={() => handleDelete(f)}>
                <i className="fas fa-trash" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {formations.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray)' }}>
          <i className="fas fa-inbox" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem', opacity: 0.3 }} />
          Aucune formation. Cliquez sur "Ajouter" pour créer la première.
        </div>
      )}
    </div>
  );
}