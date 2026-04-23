import { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { createFormation, updateFormation, deleteFormation } from '../../api/strapiAdmin';
import ImageUrlField from './ImageUrlField';

const emptyFormation = {
  id: null, strapiId: null,
  title: '', description: '', duration: '', price: '', date: '',
  image: '', imageFile: null, level: 'Débutant',
  objectives: [],
  program: [],
  prerequisites: [],
  maxParticipants: 15,
  nextSession: '',
  instructor: {
    name: '', role: '', bio: '', avatar: '',
  },
};

const levelColor = { 'Débutant': '#22c55e', 'Intermédiaire': '#f59e0b', 'Avancé': '#ef4444' };
const levelBg    = { 'Débutant': '#dcfce7', 'Intermédiaire': '#fef9c3', 'Avancé': '#fee2e2' };

const FORM_TABS = [
  { label: 'Infos de base',        icon: 'fa-circle-info',      color: '#3b82f6' },
  { label: 'Contenu pédagogique',  icon: 'fa-book-open',        color: '#8b5cf6' },
  { label: 'Formateur',            icon: 'fa-chalkboard-user',  color: '#f59e0b' },
];

/* ── Section header helper ── */
function SectionHeader({ icon, title, color = 'var(--primary)', hint }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
      padding: '0.875rem 1rem', borderRadius: '10px',
      background: `${color}0f`, border: `1.5px solid ${color}28`,
      marginBottom: '1.25rem',
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 8, flexShrink: 0,
        background: `${color}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <i className={`fas ${icon}`} style={{ color, fontSize: '0.9rem' }} />
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--dark)', lineHeight: 1.3 }}>{title}</div>
        {hint && <div style={{ fontSize: '0.74rem', color: 'var(--gray)', marginTop: '0.2rem', lineHeight: 1.4 }}>{hint}</div>}
      </div>
    </div>
  );
}

/* ── Field wrapper with styled label ── */
function Field({ label, required, hint, children, style }) {
  return (
    <div className="admin-field" style={style}>
      <label style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', marginBottom: '0.4rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, fontSize: '0.8rem', color: 'var(--dark)' }}>
          {label}
          {required && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>*</span>}
        </span>
        {hint && <span style={{ fontWeight: 400, fontSize: '0.71rem', color: '#94a3b8' }}>{hint}</span>}
      </label>
      {children}
    </div>
  );
}

/* ── Info badge ── */
function InfoBadge({ icon, label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.85rem', background: `${color}0c`, border: `1.5px solid ${color}22`, borderRadius: 8 }}>
      <i className={`fas ${icon}`} style={{ color, fontSize: '0.85rem', width: 16, textAlign: 'center' }} />
      <div>
        <div style={{ fontSize: '0.67rem', color: '#94a3b8', lineHeight: 1 }}>{label}</div>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--dark)', marginTop: '0.1rem' }}>{value || '—'}</div>
      </div>
    </div>
  );
}

/* ── List editor with reorder ── */
function ListEditor({ label, hint, icon = 'fa-circle-dot', color = 'var(--primary)', value = [], onChange, placeholder = 'Ajouter un élément...' }) {
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
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--dark)', marginBottom: '0.2rem' }}>{label}</div>
      {hint && <div style={{ fontSize: '0.71rem', color: '#94a3b8', marginBottom: '0.6rem' }}>{hint}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.6rem' }}>
        {value.length === 0 && (
          <div style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: 8, border: '1.5px dashed #cbd5e1', fontSize: '0.78rem', color: '#94a3b8', textAlign: 'center' }}>
            Aucun élément. Ajoutez-en ci-dessous.
          </div>
        )}
        {value.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 0.75rem', background: 'white', borderRadius: 8, border: '1.5px solid var(--gray-light)' }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className={`fas ${icon}`} style={{ color, fontSize: '0.6rem' }} />
            </div>
            <span style={{ flex: 1, fontSize: '0.82rem', color: 'var(--dark)', lineHeight: 1.4 }}>{item}</span>
            <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
                style={{ width: 22, height: 22, border: '1px solid #e2e8f0', borderRadius: 5, background: i === 0 ? '#f8fafc' : 'white', color: i === 0 ? '#cbd5e1' : '#64748b', cursor: i === 0 ? 'default' : 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↑</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1}
                style={{ width: 22, height: 22, border: '1px solid #e2e8f0', borderRadius: 5, background: i === value.length - 1 ? '#f8fafc' : 'white', color: i === value.length - 1 ? '#cbd5e1' : '#64748b', cursor: i === value.length - 1 ? 'default' : 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↓</button>
              <button type="button" onClick={() => remove(i)}
                style={{ width: 22, height: 22, border: 'none', background: '#fee2e2', borderRadius: 5, color: '#dc2626', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input type="text" value={draft} onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder}
          style={{ flex: 1, padding: '0.55rem 0.75rem', border: '1.5px solid var(--gray-light)', borderRadius: 8, fontSize: '0.83rem', fontFamily: 'var(--font-body)', outline: 'none' }} />
        <button type="button" onClick={add}
          style={{ padding: '0.55rem 1rem', background: color, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}>
          <i className="fas fa-plus" /> Ajouter
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function AdminFormations({ onSave }) {
  const { content, refreshContent } = useCMS();
  const [formations, setFormations] = useState([]);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(emptyFormation);
  const [saving, setSaving]         = useState(false);
  const [formTab, setFormTab]       = useState(0);

  useEffect(() => {
    setFormations(JSON.parse(JSON.stringify(content.formations || [])));
  }, [content.formations]);

  const openNew  = () => { setForm({ ...emptyFormation, id: Date.now() }); setEditing('new'); setFormTab(0); };
  const openEdit = (f) => {
    setForm({
      ...emptyFormation, ...f,
      objectives:    f.objectives    || [],
      program:       f.program       || [],
      prerequisites: f.prerequisites || [],
      instructor:    { name: '', role: '', bio: '', avatar: '', ...(f.instructor || {}) },
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
      onSave('Formation supprimée.');
    } catch (err) {
      onSave('Erreur: ' + err.message);
    }
  };

  /* ───────────────────── EDIT FORM ───────────────────── */
  if (editing !== null) {
    return (
      <div className="admin-card">
        {/* Header */}
        <div className="admin-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fas fa-chalkboard-user" style={{ color: '#f59e0b', fontSize: '0.95rem' }} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1rem' }}>{editing === 'new' ? 'Nouvelle Formation' : 'Modifier la Formation'}</h2>
              <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--gray)' }}>Complétez les 3 onglets pour une fiche complète</p>
            </div>
          </div>
          <button onClick={cancelEdit} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', color: '#64748b', width: 34, height: 34, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
            <i className="fas fa-times" />
          </button>
        </div>

        {/* Progress stepper */}
        <div style={{ padding: '0 1.5rem', borderBottom: '1px solid var(--gray-light)' }}>
          <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
            {FORM_TABS.map((tab, i) => {
              const isActive = formTab === i;
              const isDone = formTab > i;
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setFormTab(i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.85rem 1rem',
                    border: 'none',
                    borderBottom: isActive ? `3px solid ${tab.color}` : '3px solid transparent',
                    background: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.8rem',
                    color: isActive ? tab.color : (isDone ? '#64748b' : '#94a3b8'),
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isDone ? `${tab.color}20` : isActive ? `${tab.color}15` : '#f1f5f9',
                    fontSize: '0.65rem',
                  }}>
                    {isDone
                      ? <i className="fas fa-check" style={{ color: tab.color }} />
                      : <i className={`fas ${tab.icon}`} style={{ color: isActive ? tab.color : '#94a3b8' }} />
                    }
                  </div>
                  <span className="hide-mobile">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="admin-form" style={{ paddingTop: '1.5rem' }}>

          {/* ── TAB 0: Infos de base ── */}
          {formTab === 0 && (
            <>
              <SectionHeader
                icon="fa-id-card"
                color="#3b82f6"
                title="Identité de la formation"
                hint="Titre, niveau et description affichés sur la carte et dans la modale."
              />
              <div className="admin-form-row">
                <Field label="Titre de la formation" required hint="Court, accrocheur et descriptif">
                  <input name="title" value={form.title} onChange={handleChange} placeholder="Ex: Cybersécurité Avancée" />
                </Field>

                <div className="admin-field">
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--dark)' }}>Niveau</span>
                    <span style={{ fontWeight: 400, fontSize: '0.71rem', color: '#94a3b8' }}>Prérequis techniques des participants</span>
                  </label>
                  <select name="level" value={form.level} onChange={handleChange}>
                    <option>Débutant</option>
                    <option>Intermédiaire</option>
                    <option>Avancé</option>
                  </select>
                  {form.level && (
                    <div style={{ marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.75rem', background: levelBg[form.level], borderRadius: 50, fontSize: '0.75rem', fontWeight: 700, color: levelColor[form.level] }}>
                      <i className="fas fa-signal" style={{ fontSize: '0.65rem' }} /> {form.level}
                    </div>
                  )}
                </div>
              </div>

              <Field label="Description complète" required hint="Affichée dans la modale — décrivez clairement les bénéfices et le contenu.">
                <textarea name="description" value={form.description} onChange={handleChange} rows={4}
                  placeholder="Description complète de la formation (affichée dans la modale du site)..." />
              </Field>

              <div style={{ height: '1px', background: '#f1f5f9', margin: '0.25rem 0 1.25rem' }} />

              <SectionHeader
                icon="fa-calendar-days"
                color="#8b5cf6"
                title="Logistique & Tarification"
                hint="Détails pratiques affichés sur la carte et dans la modale de la formation."
              />
              <div className="admin-form-row">
                <Field label="Durée" hint='Ex : "3 jours", "16 heures"'>
                  <div style={{ position: 'relative' }}>
                    <i className="fas fa-clock" style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.8rem' }} />
                    <input name="duration" value={form.duration} onChange={handleChange} placeholder="Ex: 3 jours" style={{ paddingLeft: '2rem' }} />
                  </div>
                </Field>
                <Field label="Prix" hint='Ex : "120 000 FCFA" ou "Gratuit"'>
                  <div style={{ position: 'relative' }}>
                    <i className="fas fa-tag" style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.8rem' }} />
                    <input name="price" value={form.price} onChange={handleChange} placeholder="Ex: 120 000 FCFA" style={{ paddingLeft: '2rem' }} />
                  </div>
                </Field>
              </div>
              <div className="admin-form-row">
                <Field label="Date de la session" hint="Date complète affichée dans la modale">
                  <div style={{ position: 'relative' }}>
                    <i className="fas fa-calendar" style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.8rem' }} />
                    <input name="date" value={form.date} onChange={handleChange} placeholder="Ex: 15 Avril 2026" style={{ paddingLeft: '2rem' }} />
                  </div>
                </Field>
                <Field label="Prochaine session (label court)" hint="Affiché sur la carte sous forme condensée">
                  <div style={{ position: 'relative' }}>
                    <i className="fas fa-calendar-check" style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.8rem' }} />
                    <input name="nextSession" value={form.nextSession} onChange={handleChange} placeholder="Ex: 15 Avr." style={{ paddingLeft: '2rem' }} />
                  </div>
                </Field>
              </div>
              <div className="admin-form-row" style={{ alignItems: 'flex-start' }}>
                <Field label="Nombre de places max" hint="Limite de participants par session">
                  <div style={{ position: 'relative' }}>
                    <i className="fas fa-users" style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.8rem' }} />
                    <input name="maxParticipants" type="number" min={1} value={form.maxParticipants} onChange={handleChange} placeholder="15" style={{ paddingLeft: '2rem' }} />
                  </div>
                </Field>
              </div>

              {/* Quick summary badges */}
              {(form.duration || form.price || form.maxParticipants) && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.6rem', padding: '1rem', background: '#f8fafc', borderRadius: 10, border: '1.5px solid #e2e8f0', marginBottom: '1rem' }}>
                  {form.duration && <InfoBadge icon="fa-clock" label="Durée" value={form.duration} color="#8b5cf6" />}
                  {form.price && <InfoBadge icon="fa-tag" label="Prix" value={form.price} color="#22c55e" />}
                  {form.maxParticipants && <InfoBadge icon="fa-users" label="Places max" value={form.maxParticipants} color="#3b82f6" />}
                  {form.level && <InfoBadge icon="fa-signal" label="Niveau" value={form.level} color={levelColor[form.level]} />}
                </div>
              )}

              <div style={{ height: '1px', background: '#f1f5f9', margin: '0.25rem 0 1.25rem' }} />

              <SectionHeader
                icon="fa-image"
                color="#22c55e"
                title="Visuel de la formation"
                hint="Image de couverture affichée sur la carte et en haut de la modale."
              />
              <ImageUrlField
                label="Image de couverture"
                value={form.image}
                onChange={handleImageUrl}
                onFileChange={handleImageFile}
              />
            </>
          )}

          {/* ── TAB 1: Contenu pédagogique ── */}
          {formTab === 1 && (
            <>
              <SectionHeader>
                icon="fa-book-open"
                color="#8b5cf6"
                title="Programme détaillé"
                hint='Affiché dans l\'onglet "Programme" de la modale. Listez chaque module ou journée.'
              </SectionHeader>
              <ListEditor
                label="Modules du programme"
                hint="Un module par ligne. Vous pouvez réordonner avec les flèches ↑ ↓."
                icon="fa-bookmark"
                color="#8b5cf6"
                value={form.program}
                onChange={v => setForm(p => ({ ...p, program: v }))}
                placeholder="Ex: Introduction à la sécurité réseau..."
              />

              <div style={{ height: '1px', background: '#f1f5f9', margin: '0.25rem 0 1.25rem' }} />

              <SectionHeader>
                icon="fa-bullseye"
                color="#22c55e"
                title="Objectifs pédagogiques"
                hint='Affichés dans l\'onglet "Objectifs". Ce que le participant saura faire à la fin.'
              </SectionHeader>
              <ListEditor
                label="Objectifs"
                hint="Commencez chaque objectif par un verbe d'action : Savoir, Comprendre, Être capable de..."
                icon="fa-check-circle"
                color="#22c55e"
                value={form.objectives}
                onChange={v => setForm(p => ({ ...p, objectives: v }))}
                placeholder="Ex: Savoir configurer un pare-feu..."
              />

              <div style={{ height: '1px', background: '#f1f5f9', margin: '0.25rem 0 1.25rem' }} />

              <SectionHeader>
                icon="fa-circle-exclamation"
                color="#f59e0b"
                title="Prérequis"
                hint='Affichés dans l\'onglet "Prérequis". Indiquez ce que le participant doit déjà maîtriser.'
              </SectionHeader>
              <ListEditor
                label="Prérequis"
                hint="Soyez précis pour éviter les inscriptions inadaptées."
                icon="fa-triangle-exclamation"
                color="#f59e0b"
                value={form.prerequisites}
                onChange={v => setForm(p => ({ ...p, prerequisites: v }))}
                placeholder="Ex: Connaissances de base en réseau TCP/IP..."
              />
            </>
          )}

          {/* ── TAB 2: Formateur ── */}
          {formTab === 2 && (
            <>
              <SectionHeader
                icon="fa-chalkboard-user"
                color="#f59e0b"
                title="Profil du formateur"
                hint="Ces informations sont affichées dans la modale pour crédibiliser la formation."
              />

              <div className="admin-form-row">
                <Field label="Nom complet" hint="Prénom et nom du formateur">
                  <div style={{ position: 'relative' }}>
                    <i className="fas fa-user" style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.8rem' }} />
                    <input name="name" value={form.instructor.name} onChange={handleInstructorChange}
                      placeholder="Ex: Jean-Kévin Mvondo" style={{ paddingLeft: '2rem' }} />
                  </div>
                </Field>
                <Field label="Poste / Titre professionnel" hint="Affiché sous le nom du formateur">
                  <div style={{ position: 'relative' }}>
                    <i className="fas fa-briefcase" style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.8rem' }} />
                    <input name="role" value={form.instructor.role} onChange={handleInstructorChange}
                      placeholder="Ex: Consultant Senior Cybersécurité" style={{ paddingLeft: '2rem' }} />
                  </div>
                </Field>
              </div>

              <Field label="Biographie" hint="Expérience, certifications et domaines d'expertise — 3 à 5 phrases.">
                <textarea name="bio" value={form.instructor.bio} onChange={handleInstructorChange} rows={5}
                  placeholder="Expériences professionnelles, certifications obtenues (CISSP, CEH...), domaines d'expertise..." />
              </Field>

              <Field label="Photo du formateur (URL)" hint="URL directe vers une image .jpg ou .png">
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-image" style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.8rem' }} />
                  <input name="avatar" value={form.instructor.avatar} onChange={handleInstructorChange}
                    placeholder="https://..." style={{ paddingLeft: '2rem' }} />
                </div>
              </Field>

              {/* Instructor preview card */}
              {(form.instructor.name || form.instructor.avatar) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', background: 'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(251,191,36,0.04) 100%)', borderRadius: 12, border: '1.5px solid rgba(245,158,11,0.2)', marginTop: '0.25rem' }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    {form.instructor.avatar
                      ? <img src={form.instructor.avatar} alt="" style={{ width: 68, height: 68, borderRadius: 12, objectFit: 'cover', border: '2px solid rgba(245,158,11,0.3)' }} />
                      : <div style={{ width: 68, height: 68, borderRadius: 12, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="fas fa-user" style={{ color: '#f59e0b', fontSize: '1.5rem' }} />
                        </div>
                    }
                    <div style={{ position: 'absolute', bottom: -4, right: -4, width: 18, height: 18, borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
                      <i className="fas fa-check" style={{ color: 'white', fontSize: '0.55rem' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--dark)' }}>{form.instructor.name || 'Formateur'}</div>
                    {form.instructor.role && <div style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 600, marginTop: '0.1rem' }}>{form.instructor.role}</div>}
                    {form.instructor.bio && <div style={{ fontSize: '0.73rem', color: 'var(--gray)', marginTop: '0.35rem', lineHeight: 1.4, maxWidth: 380, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{form.instructor.bio}</div>}
                  </div>
                </div>
              )}

              {!form.instructor.name && (
                <div style={{ padding: '1.25rem', background: '#fffbeb', borderRadius: 10, border: '1.5px solid #fde68a', display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <i className="fas fa-triangle-exclamation" style={{ color: '#f59e0b', fontSize: '1rem', flexShrink: 0 }} />
                  <div style={{ fontSize: '0.78rem', color: '#92400e' }}>
                    <strong>Formateur non renseigné</strong><br />
                    Sans formateur, la section "Formateur" de la modale ne sera pas affichée.
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── Nav + Save ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: '2px solid #f1f5f9', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {formTab > 0 && (
                <button type="button" onClick={() => setFormTab(t => t - 1)}
                  style={{ padding: '0.6rem 1rem', borderRadius: 'var(--radius)', border: '1.5px solid var(--gray-light)', background: 'white', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.85rem', color: 'var(--dark)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <i className="fas fa-arrow-left" style={{ fontSize: '0.75rem' }} /> Précédent
                </button>
              )}
              {formTab < FORM_TABS.length - 1 && (
                <button type="button" onClick={() => setFormTab(t => t + 1)}
                  style={{ padding: '0.6rem 1rem', borderRadius: 'var(--radius)', border: `1.5px solid ${FORM_TABS[formTab + 1].color}`, background: `${FORM_TABS[formTab + 1].color}0c`, cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.85rem', color: FORM_TABS[formTab + 1].color, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  Suivant <i className="fas fa-arrow-right" style={{ fontSize: '0.75rem' }} />
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

  /* ─────────────────────── LIST VIEW ─────────────────────── */
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
                <span style={{ background: levelBg[f.level], color: levelColor[f.level], padding: '0.15rem 0.5rem', borderRadius: '50px', fontSize: '0.7rem', marginRight: '0.5rem', fontWeight: 700 }}>
                  {f.level}
                </span>
                {f.duration} · {f.price} · {f.date}
              </span>
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
                  background: f.instructor?.name ? 'rgba(245,158,11,0.1)' : '#f4f4f4',
                  color: f.instructor?.name ? '#f59e0b' : '#aaa',
                  border: `1px solid ${f.instructor?.name ? 'rgba(245,158,11,0.25)' : '#eee'}`,
                }}>
                  <i className={`fas ${f.instructor?.name ? 'fa-check' : 'fa-minus'}`} style={{ fontSize: '0.55rem', marginRight: 3 }} />
                  Formateur{f.instructor?.name ? ` (${f.instructor.name})` : ''}
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