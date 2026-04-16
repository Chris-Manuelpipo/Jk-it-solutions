import { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { createService, updateService, deleteService } from '../../api/strapiAdmin';

const emptyService = {
  id: null, strapiId: null,
  icon: 'fa-shield-halved', title: '', description: '', active: true,
  // ── modal detail fields ──
  longDescription: '',
  features: [],       // string[]
  benefits: [],       // { icon, title, desc }[]
  process: [],        // { num, title, desc }[]
  stats: [],          // { value, label }[]
  tags: [],           // string[]
  highlights: [],     // { label, value }[]
};

const ICONS = [
  { name: 'Shield', value: 'fa-shield-halved' }, { name: 'Lock', value: 'fa-lock' },
  { name: 'Key', value: 'fa-key' }, { name: 'User Shield', value: 'fa-user-shield' },
  { name: 'Fingerprint', value: 'fa-fingerprint' }, { name: 'Eye', value: 'fa-eye' },
  { name: 'Bug', value: 'fa-bug' }, { name: 'Skull', value: 'fa-skull-crossbones' },
  { name: 'Virus', value: 'fa-virus' }, { name: 'Server', value: 'fa-server' },
  { name: 'Network', value: 'fa-network-wired' }, { name: 'Wifi', value: 'fa-wifi' },
  { name: 'Router', value: 'fa-router' }, { name: 'Laptop', value: 'fa-laptop-code' },
  { name: 'Desktop', value: 'fa-desktop' }, { name: 'Mobile', value: 'fa-mobile-screen' },
  { name: 'Cloud', value: 'fa-cloud' }, { name: 'Database', value: 'fa-database' },
  { name: 'Code', value: 'fa-code' }, { name: 'Terminal', value: 'fa-terminal' },
  { name: 'Globe', value: 'fa-globe' }, { name: 'Camera', value: 'fa-camera' },
  { name: 'Video', value: 'fa-video' }, { name: 'Satellite', value: 'fa-satellite-dish' },
  { name: 'Gear', value: 'fa-gear' }, { name: 'Wrench', value: 'fa-screwdriver-wrench' },
  { name: 'Graduation', value: 'fa-graduation-cap' }, { name: 'Certificate', value: 'fa-certificate' },
  { name: 'Chart', value: 'fa-chart-line' }, { name: 'Brain', value: 'fa-brain' },
  { name: 'Rocket', value: 'fa-rocket' }, { name: 'Bolt', value: 'fa-bolt' },
  { name: 'Shield File', value: 'fa-file-shield' }, { name: 'Vault', value: 'fa-vault' },
  { name: 'Headset', value: 'fa-headset' }, { name: 'Tower', value: 'fa-tower-broadcast' },
  { name: 'Microchip', value: 'fa-microchip' }, { name: 'Memory', value: 'fa-memory' },
  { name: 'Handshake', value: 'fa-handshake' }, { name: 'Award', value: 'fa-award' },
];

const FORM_TABS = ['Infos de base', 'Présentation & Chips', 'Fonctionnalités', 'Avantages & Processus'];

/* ── reusable string list editor ── */
function StringListEditor({ label, value = [], onChange, placeholder }) {
  const [draft, setDraft] = useState('');
  const add = () => { if (!draft.trim()) return; onChange([...value, draft.trim()]); setDraft(''); };
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));
  return (
    <div className="af-list-editor">
      <label className="af-label">{label}</label>
      <div className="af-list-items">
        {value.length === 0 && <p className="af-list-empty">Aucun élément.</p>}
        {value.map((item, i) => (
          <div key={i} className="af-list-item">
            <span className="af-list-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="af-list-text">{item}</span>
            <button type="button" className="af-remove-btn" onClick={() => remove(i)}>×</button>
          </div>
        ))}
      </div>
      <div className="af-list-add">
        <input type="text" value={draft} onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder} className="af-list-input" />
        <button type="button" className="af-add-btn" onClick={add}><i className="fas fa-plus" /> Ajouter</button>
      </div>
    </div>
  );
}

/* ── key-value pair editor (highlights, stats) ── */
function PairListEditor({ label, value = [], onChange, keyPlaceholder = 'Label', valPlaceholder = 'Valeur' }) {
  const [dKey, setDKey] = useState('');
  const [dVal, setDVal] = useState('');
  const add = () => {
    if (!dKey.trim() || !dVal.trim()) return;
    onChange([...value, { label: dKey.trim(), value: dVal.trim() }]);
    setDKey(''); setDVal('');
  };
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));
  return (
    <div className="af-list-editor">
      <label className="af-label">{label}</label>
      <div className="af-list-items">
        {value.length === 0 && <p className="af-list-empty">Aucun élément.</p>}
        {value.map((item, i) => (
          <div key={i} className="af-list-item">
            <span className="af-list-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="af-list-text"><strong>{item.label} :</strong> {item.value}</span>
            <button type="button" className="af-remove-btn" onClick={() => remove(i)}>×</button>
          </div>
        ))}
      </div>
      <div className="af-list-add" style={{ flexWrap: 'wrap' }}>
        <input type="text" value={dKey} onChange={e => setDKey(e.target.value)} placeholder={keyPlaceholder} className="af-list-input" style={{ flex: '1 1 120px' }} />
        <input type="text" value={dVal} onChange={e => setDVal(e.target.value)} placeholder={valPlaceholder} className="af-list-input" style={{ flex: '1 1 120px' }} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())} />
        <button type="button" className="af-add-btn" onClick={add}><i className="fas fa-plus" /> Ajouter</button>
      </div>
    </div>
  );
}

/* ── benefit card editor ── */
function BenefitEditor({ value = [], onChange }) {
  const empty = { icon: 'fa-star', title: '', desc: '' };
  const [draft, setDraft] = useState({ ...empty });
  const add = () => {
    if (!draft.title) return;
    onChange([...value, { ...draft }]);
    setDraft({ ...empty });
  };
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));
  return (
    <div className="af-list-editor">
      <label className="af-label">Avantages (onglet « Avantages »)</label>
      <div className="af-list-items">
        {value.length === 0 && <p className="af-list-empty">Aucun avantage. Les avantages par défaut seront utilisés.</p>}
        {value.map((b, i) => (
          <div key={i} className="af-list-item">
            <i className={`fas ${b.icon}`} style={{ color: 'var(--primary)', width: 22, textAlign: 'center', flexShrink: 0 }} />
            <span className="af-list-text"><strong>{b.title}</strong> — {b.desc}</span>
            <button type="button" className="af-remove-btn" onClick={() => remove(i)}>×</button>
          </div>
        ))}
      </div>
      <div className="af-benefit-form">
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input type="text" value={draft.icon} onChange={e => setDraft(p => ({ ...p, icon: e.target.value }))}
            placeholder="fa-star" className="af-list-input" style={{ flex: '0 0 120px' }} />
          <input type="text" value={draft.title} onChange={e => setDraft(p => ({ ...p, title: e.target.value }))}
            placeholder="Titre de l'avantage" className="af-list-input" style={{ flex: '1 1 150px' }} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
          <input type="text" value={draft.desc} onChange={e => setDraft(p => ({ ...p, desc: e.target.value }))}
            placeholder="Description courte..." className="af-list-input" style={{ flex: 1 }}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())} />
          <button type="button" className="af-add-btn" onClick={add}><i className="fas fa-plus" /> Ajouter</button>
        </div>
      </div>
    </div>
  );
}

/* ── process step editor ── */
function ProcessEditor({ value = [], onChange }) {
  const empty = { num: '', title: '', desc: '' };
  const [draft, setDraft] = useState({ ...empty });
  const add = () => {
    if (!draft.title) return;
    const num = draft.num || String(value.length + 1).padStart(2, '0');
    onChange([...value, { ...draft, num }]);
    setDraft({ ...empty });
  };
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));
  return (
    <div className="af-list-editor">
      <label className="af-label">Étapes du processus (onglet « Processus »)</label>
      <div className="af-list-items">
        {value.length === 0 && <p className="af-list-empty">Aucune étape. Les étapes par défaut seront utilisées.</p>}
        {value.map((step, i) => (
          <div key={i} className="af-list-item">
            <span className="af-list-num">{step.num}</span>
            <span className="af-list-text"><strong>{step.title}</strong> — {step.desc}</span>
            <button type="button" className="af-remove-btn" onClick={() => remove(i)}>×</button>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
        <input type="text" value={draft.num} onChange={e => setDraft(p => ({ ...p, num: e.target.value }))}
          placeholder="01" className="af-list-input" style={{ flex: '0 0 60px' }} />
        <input type="text" value={draft.title} onChange={e => setDraft(p => ({ ...p, title: e.target.value }))}
          placeholder="Titre de l'étape" className="af-list-input" style={{ flex: '1 1 150px' }} />
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
        <input type="text" value={draft.desc} onChange={e => setDraft(p => ({ ...p, desc: e.target.value }))}
          placeholder="Description de l'étape..." className="af-list-input" style={{ flex: 1 }}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())} />
        <button type="button" className="af-add-btn" onClick={add}><i className="fas fa-plus" /> Ajouter</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function AdminServices({ onSave }) {
  const { content, refreshContent } = useCMS();
  const [services, setServices]       = useState([]);
  const [editing, setEditing]         = useState(null);
  const [form, setForm]               = useState(emptyService);
  const [saving, setSaving]           = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconSearch, setIconSearch]   = useState('');
  const [formTab, setFormTab]         = useState(0);

  useEffect(() => {
    setServices(JSON.parse(JSON.stringify(content.services || [])));
  }, [content]);

  const openEdit = (s) => {
    setForm({
      ...emptyService, ...s,
      features:   s.features   || [],
      benefits:   s.benefits   || [],
      process:    s.process    || [],
      stats:      s.stats      || [],
      tags:       s.tags       || [],
      highlights: s.highlights || [],
    });
    setEditing(s.id); setFormTab(0);
  };
  const openNew    = () => { setForm({ ...emptyService, id: Date.now() }); setEditing('new'); setFormTab(0); };
  const cancelEdit = () => { setEditing(null); setForm(emptyService); };
  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (!form.title || !form.description) return;
    setSaving(true);
    try {
      const payload = {
        title: form.title, description: form.description, icon: form.icon, active: true,
        longDescription: form.longDescription,
        features:   form.features,
        benefits:   form.benefits,
        process:    form.process,
        stats:      form.stats,
        tags:       form.tags,
        highlights: form.highlights,
      };
      if (editing === 'new') {
        await createService(payload);
      } else {
        await updateService(form, payload);
      }
      await refreshContent();
      setServices(content.services);
      onSave('Service sauvegardé !');
      cancelEdit();
    } catch (err) {
      onSave('Erreur: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (s) => {
    if (!confirm('Supprimer ce service ?')) return;
    try {
      await deleteService(s);
      await refreshContent();
      setServices(content.services);
      onSave('Service supprimé.');
    } catch (err) {
      onSave('Erreur: ' + err.message);
    }
  };

  /* ── completeness indicator ── */
  const completeness = (s) => {
    const checks = [
      !!s.longDescription,
      s.features?.length > 0,
      s.benefits?.length > 0,
      s.process?.length > 0,
      s.stats?.length > 0,
      s.tags?.length > 0,
    ];
    return checks.filter(Boolean).length;
  };

  /* ───────────────────── EDIT FORM ───────────────────── */
  if (editing !== null) {
    return (
      <div className="admin-card">
        <div className="admin-card-header">
          <h2><i className="fas fa-pen" /> {editing === 'new' ? 'Nouveau Service' : 'Modifier le Service'}</h2>
          <button onClick={cancelEdit} className="af-icon-btn"><i className="fas fa-times" /></button>
        </div>

        <div className="af-form-tabs">
          {FORM_TABS.map((tab, i) => (
            <button key={tab} type="button" className={`af-form-tab ${formTab === i ? 'active' : ''}`} onClick={() => setFormTab(i)}>
              {tab}
            </button>
          ))}
        </div>

        <div className="admin-form" style={{ paddingTop: '1.25rem' }}>

          {/* ── TAB 0: Infos de base ── */}
          {formTab === 0 && (
            <>
              <div className="admin-form-row">
                <div className="admin-field">
                  <label>Titre *</label>
                  <input name="title" value={form.title} onChange={handleChange} placeholder="Ex: Tests d'intrusion" />
                </div>
                <div className="admin-field" style={{ position: 'relative' }}>
                  <label>Icône</label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div className="admin-icon-preview"><i className={`fas ${form.icon}`} /></div>
                    <input name="icon" value={form.icon} onChange={handleChange} placeholder="fa-shield-halved" style={{ flex: 1, minWidth: '120px' }} />
                    <button type="button" className="admin-icon-picker-btn" onClick={() => setShowIconPicker(!showIconPicker)}>
                      <i className="fas fa-icons" /> Choisir
                    </button>
                  </div>
                  <small style={{ color: 'var(--gray)', fontSize: '0.72rem', marginTop: '0.35rem', display: 'block' }}>
                    Plus sur <a href="https://fontawesome.com/icons" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>fontawesome.com/icons</a>
                  </small>
                  {showIconPicker && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid var(--gray-light)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)', zIndex: 100, maxHeight: '300px', overflow: 'hidden', display: 'flex', flexDirection: 'column', marginTop: '0.25rem' }}>
                      <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--gray-light)', background: 'white' }}>
                        <input type="text" placeholder="Rechercher..." value={iconSearch} onChange={e => setIconSearch(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--gray-light)', borderRadius: 'var(--radius)', fontSize: '0.85rem' }} />
                      </div>
                      <div style={{ overflowY: 'auto', maxHeight: '220px', padding: '0.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.4rem' }}>
                          {ICONS.filter(ic => ic.name.toLowerCase().includes(iconSearch.toLowerCase()) || ic.value.toLowerCase().includes(iconSearch.toLowerCase())).map(ic => (
                            <button key={ic.value} type="button"
                              onClick={() => { setForm(p => ({ ...p, icon: ic.value })); setShowIconPicker(false); setIconSearch(''); }}
                              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', padding: '0.5rem', border: form.icon === ic.value ? '2px solid var(--primary)' : '1px solid var(--gray-light)', borderRadius: 'var(--radius)', background: form.icon === ic.value ? 'var(--light-2)' : 'white', cursor: 'pointer', fontSize: '0.68rem' }}>
                              <i className={`fas ${ic.value}`} style={{ fontSize: '1rem', color: 'var(--primary)' }} />
                              <span style={{ color: 'var(--gray)', textAlign: 'center', lineHeight: 1.2, wordBreak: 'break-word' }}>{ic.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="admin-field">
                <label>Description courte * (affichée sur la card)</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Résumé bref du service visible sur la carte..." />
              </div>
            </>
          )}

          {/* ── TAB 1: Présentation & Chips ── */}
          {formTab === 1 && (
            <>
              <div className="admin-field">
                <label>Description longue (onglet « Présentation » de la modale)</label>
                <textarea name="longDescription" value={form.longDescription} onChange={handleChange} rows={5}
                  placeholder="Description détaillée et complète du service, visible dans la modale..." />
              </div>
              <PairListEditor
                label="Infos clés (onglet Présentation — bloc en bas)"
                value={form.highlights}
                onChange={v => setForm(p => ({ ...p, highlights: v }))}
                keyPlaceholder="Ex: Délai moyen"
                valPlaceholder="Ex: 5 à 10 jours"
              />
              <StringListEditor
                label="Tags / Chips (ex: Certifié, Sur mesure, Yaoundé)"
                value={form.tags}
                onChange={v => setForm(p => ({ ...p, tags: v }))}
                placeholder="Ex: Certifié"
              />
              <PairListEditor
                label="Statistiques (panneau gauche — ex: 100% / Sur mesure)"
                value={form.stats}
                onChange={v => setForm(p => ({ ...p, stats: v }))}
                keyPlaceholder="Valeur (ex: 100%)"
                valPlaceholder="Label (ex: Sur mesure)"
              />
            </>
          )}

          {/* ── TAB 2: Fonctionnalités ── */}
          {formTab === 2 && (
            <StringListEditor
              label="Fonctionnalités / Prestations (onglet « Ce que nous faisons »)"
              value={form.features}
              onChange={v => setForm(p => ({ ...p, features: v }))}
              placeholder="Ex: Analyse complète de votre environnement..."
            />
          )}

          {/* ── TAB 3: Avantages & Processus ── */}
          {formTab === 3 && (
            <>
              <BenefitEditor value={form.benefits} onChange={v => setForm(p => ({ ...p, benefits: v }))} />
              <ProcessEditor value={form.process} onChange={v => setForm(p => ({ ...p, process: v }))} />
            </>
          )}

          {/* Nav + Save */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--gray-light)', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {formTab > 0 && (
                <button type="button" onClick={() => setFormTab(t => t - 1)} style={{ padding: '0.6rem 1rem', borderRadius: 'var(--radius)', border: '1.5px solid var(--gray-light)', background: 'white', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.85rem', color: 'var(--dark)' }}>
                  ← Précédent
                </button>
              )}
              {formTab < FORM_TABS.length - 1 && (
                <button type="button" onClick={() => setFormTab(t => t + 1)} style={{ padding: '0.6rem 1rem', borderRadius: 'var(--radius)', border: '1.5px solid var(--primary)', background: 'rgba(26,122,60,0.06)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.85rem', color: 'var(--primary)' }}>
                  Suivant →
                </button>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={cancelEdit} style={{ padding: '0.65rem 1.25rem', borderRadius: 'var(--radius)', border: '1.5px solid var(--gray-light)', background: 'white', color: 'var(--gray)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: '600', fontSize: '0.88rem' }}>
                Annuler
              </button>
              <button className="btn-admin-save" onClick={handleSave} disabled={saving}>
                {saving ? <><i className="fas fa-circle-notch fa-spin" /> Enregistrement...</> : <><i className="fas fa-save" /> Sauvegarder</>}
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
        <h2><i className="fas fa-gears" /> Services ({services.length})</h2>
        <button className="btn-admin-save" onClick={openNew}><i className="fas fa-plus" /> Ajouter</button>
      </div>
      <div className="admin-list">
        {services.map(s => {
          const done = completeness(s);
          return (
            <div key={s.id} className="admin-list-item" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <div className="admin-service-icon">
                <i className={`fas ${s.icon}`} />
              </div>
              <div className="admin-list-item-info" style={{ flex: 1, minWidth: '150px' }}>
                <strong>{s.title}</strong>
                <span style={{ wordBreak: 'break-word' }}>{s.description}</span>
                {/* completeness badge */}
                <div style={{ marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {Array(6).fill(0).map((_, i) => (
                      <div key={i} style={{ width: 8, height: 8, borderRadius: 2, background: i < done ? 'var(--primary)' : 'var(--gray-light)' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--gray)' }}>
                    {done}/6 champs renseignés
                  </span>
                </div>
              </div>
              <div className="admin-list-item-actions" style={{ flexShrink: 0 }}>
                <button className="btn-admin-save" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }} onClick={() => openEdit(s)}>
                  <i className="fas fa-pen" />
                </button>
                <button className="btn-admin-danger" onClick={() => handleDelete(s)}>
                  <i className="fas fa-trash" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}