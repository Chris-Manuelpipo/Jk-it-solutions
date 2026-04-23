import { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { createService, updateService, deleteService } from '../../api/strapiAdmin';

const emptyService = {
  id: null, strapiId: null,
  icon: 'fa-shield-halved', title: '', description: '', active: true,
  longDescription: '',
  features: [],
  benefits: [],
  process: [],
  stats: [],
  tags: [],
  highlights: [],
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

const FORM_TABS = [
  { label: 'Infos de base', icon: 'fa-circle-info' },
  { label: 'Présentation & Chips', icon: 'fa-layer-group' },
  { label: 'Fonctionnalités', icon: 'fa-list-check' },
  { label: 'Avantages & Processus', icon: 'fa-sitemap' },
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

/* ── String list editor ── */
function StringListEditor({ label, hint, value = [], onChange, placeholder }) {
  const [draft, setDraft] = useState('');
  const add = () => { if (!draft.trim()) return; onChange([...value, draft.trim()]); setDraft(''); };
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--dark)', marginBottom: '0.2rem' }}>{label}</div>
      {hint && <div style={{ fontSize: '0.71rem', color: '#94a3b8', marginBottom: '0.6rem' }}>{hint}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.6rem' }}>
        {value.length === 0 && (
          <div style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: 8, border: '1.5px dashed #cbd5e1', fontSize: '0.78rem', color: '#94a3b8', textAlign: 'center' }}>
            Aucun élément. Ajoutez-en ci-dessous.
          </div>
        )}
        {value.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: 'white', borderRadius: 8, border: '1.5px solid var(--gray-light)' }}>
            <span style={{ minWidth: 22, height: 22, borderRadius: 6, background: 'rgba(26,122,60,0.1)', color: 'var(--primary)', fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{String(i + 1).padStart(2, '0')}</span>
            <span style={{ flex: 1, fontSize: '0.82rem', color: 'var(--dark)' }}>{item}</span>
            <button type="button" onClick={() => remove(i)} style={{ background: '#fee2e2', border: 'none', color: '#dc2626', width: 22, height: 22, borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input type="text" value={draft} onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder}
          style={{ flex: 1, padding: '0.55rem 0.75rem', border: '1.5px solid var(--gray-light)', borderRadius: 8, fontSize: '0.83rem', fontFamily: 'var(--font-body)', outline: 'none' }} />
        <button type="button" onClick={add} style={{ padding: '0.55rem 1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}>
          <i className="fas fa-plus" /> Ajouter
        </button>
      </div>
    </div>
  );
}

/* ── Key-value pair editor ── */
function PairListEditor({ label, hint, value = [], onChange, keyPlaceholder = 'Label', valPlaceholder = 'Valeur' }) {
  const [dKey, setDKey] = useState('');
  const [dVal, setDVal] = useState('');
  const add = () => {
    if (!dKey.trim() || !dVal.trim()) return;
    onChange([...value, { label: dKey.trim(), value: dVal.trim() }]);
    setDKey(''); setDVal('');
  };
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--dark)', marginBottom: '0.2rem' }}>{label}</div>
      {hint && <div style={{ fontSize: '0.71rem', color: '#94a3b8', marginBottom: '0.6rem' }}>{hint}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.6rem' }}>
        {value.length === 0 && (
          <div style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: 8, border: '1.5px dashed #cbd5e1', fontSize: '0.78rem', color: '#94a3b8', textAlign: 'center' }}>
            Aucun élément. Ajoutez-en ci-dessous.
          </div>
        )}
        {value.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: 'white', borderRadius: 8, border: '1.5px solid var(--gray-light)' }}>
            <span style={{ minWidth: 22, height: 22, borderRadius: 6, background: 'rgba(59,130,246,0.1)', color: '#3b82f6', fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{String(i + 1).padStart(2, '0')}</span>
            <span style={{ flex: 1, fontSize: '0.82rem', color: 'var(--dark)' }}><strong style={{ color: 'var(--primary)' }}>{item.label}</strong> · {item.value}</span>
            <button type="button" onClick={() => remove(i)} style={{ background: '#fee2e2', border: 'none', color: '#dc2626', width: 22, height: 22, borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <input type="text" value={dKey} onChange={e => setDKey(e.target.value)} placeholder={keyPlaceholder}
          style={{ flex: '1 1 120px', padding: '0.55rem 0.75rem', border: '1.5px solid var(--gray-light)', borderRadius: 8, fontSize: '0.83rem', fontFamily: 'var(--font-body)', outline: 'none' }} />
        <input type="text" value={dVal} onChange={e => setDVal(e.target.value)} placeholder={valPlaceholder}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          style={{ flex: '1 1 120px', padding: '0.55rem 0.75rem', border: '1.5px solid var(--gray-light)', borderRadius: 8, fontSize: '0.83rem', fontFamily: 'var(--font-body)', outline: 'none' }} />
        <button type="button" onClick={add} style={{ padding: '0.55rem 1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}>
          <i className="fas fa-plus" /> Ajouter
        </button>
      </div>
    </div>
  );
}

/* ── Benefit card editor ── */
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
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--dark)', marginBottom: '0.2rem' }}>Avantages</div>
      <div style={{ fontSize: '0.71rem', color: '#94a3b8', marginBottom: '0.6rem' }}>Affichés dans l'onglet « Avantages » de la modale service.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.6rem' }}>
        {value.length === 0 && (
          <div style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: 8, border: '1.5px dashed #cbd5e1', fontSize: '0.78rem', color: '#94a3b8', textAlign: 'center' }}>
            Aucun avantage. Les avantages par défaut seront utilisés.
          </div>
        )}
        {value.map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.75rem', background: 'white', borderRadius: 8, border: '1.5px solid var(--gray-light)' }}>
            <div style={{ width: 30, height: 30, borderRadius: 7, background: 'rgba(26,122,60,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className={`fas ${b.icon}`} style={{ color: 'var(--primary)', fontSize: '0.8rem' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--dark)' }}>{b.title}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--gray)' }}>{b.desc}</div>
            </div>
            <button type="button" onClick={() => remove(i)} style={{ background: '#fee2e2', border: 'none', color: '#dc2626', width: 22, height: 22, borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
          </div>
        ))}
      </div>
      <div style={{ background: '#f8fafc', borderRadius: 10, padding: '0.75rem', border: '1.5px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.15rem' }}>Nouvel avantage</div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input type="text" value={draft.icon} onChange={e => setDraft(p => ({ ...p, icon: e.target.value }))}
            placeholder="Icône (ex: fa-star)" style={{ flex: '0 0 140px', padding: '0.5rem 0.65rem', border: '1.5px solid #cbd5e1', borderRadius: 7, fontSize: '0.8rem', fontFamily: 'var(--font-body)', outline: 'none', background: 'white' }} />
          <input type="text" value={draft.title} onChange={e => setDraft(p => ({ ...p, title: e.target.value }))}
            placeholder="Titre de l'avantage *" style={{ flex: '1 1 150px', padding: '0.5rem 0.65rem', border: '1.5px solid #cbd5e1', borderRadius: 7, fontSize: '0.8rem', fontFamily: 'var(--font-body)', outline: 'none', background: 'white' }} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input type="text" value={draft.desc} onChange={e => setDraft(p => ({ ...p, desc: e.target.value }))}
            placeholder="Description courte..." onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
            style={{ flex: 1, padding: '0.5rem 0.65rem', border: '1.5px solid #cbd5e1', borderRadius: 7, fontSize: '0.8rem', fontFamily: 'var(--font-body)', outline: 'none', background: 'white' }} />
          <button type="button" onClick={add} style={{ padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 7, cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}>
            <i className="fas fa-plus" /> Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Process step editor ── */
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
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--dark)', marginBottom: '0.2rem' }}>Étapes du processus</div>
      <div style={{ fontSize: '0.71rem', color: '#94a3b8', marginBottom: '0.6rem' }}>Affichées dans l'onglet « Processus » de la modale service.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.6rem' }}>
        {value.length === 0 && (
          <div style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: 8, border: '1.5px dashed #cbd5e1', fontSize: '0.78rem', color: '#94a3b8', textAlign: 'center' }}>
            Aucune étape. Les étapes par défaut seront utilisées.
          </div>
        )}
        {value.map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.75rem', background: 'white', borderRadius: 8, border: '1.5px solid var(--gray-light)' }}>
            <div style={{ width: 30, height: 30, borderRadius: 7, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontWeight: 800, fontSize: '0.72rem', color: '#3b82f6' }}>{step.num}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--dark)' }}>{step.title}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--gray)' }}>{step.desc}</div>
            </div>
            <button type="button" onClick={() => remove(i)} style={{ background: '#fee2e2', border: 'none', color: '#dc2626', width: 22, height: 22, borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
          </div>
        ))}
      </div>
      <div style={{ background: '#f8fafc', borderRadius: 10, padding: '0.75rem', border: '1.5px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.15rem' }}>Nouvelle étape</div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input type="text" value={draft.num} onChange={e => setDraft(p => ({ ...p, num: e.target.value }))}
            placeholder="N° (ex: 01)" style={{ flex: '0 0 80px', padding: '0.5rem 0.65rem', border: '1.5px solid #cbd5e1', borderRadius: 7, fontSize: '0.8rem', fontFamily: 'var(--font-body)', outline: 'none', background: 'white' }} />
          <input type="text" value={draft.title} onChange={e => setDraft(p => ({ ...p, title: e.target.value }))}
            placeholder="Titre de l'étape *" style={{ flex: '1 1 150px', padding: '0.5rem 0.65rem', border: '1.5px solid #cbd5e1', borderRadius: 7, fontSize: '0.8rem', fontFamily: 'var(--font-body)', outline: 'none', background: 'white' }} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input type="text" value={draft.desc} onChange={e => setDraft(p => ({ ...p, desc: e.target.value }))}
            placeholder="Description de l'étape..." onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
            style={{ flex: 1, padding: '0.5rem 0.65rem', border: '1.5px solid #cbd5e1', borderRadius: 7, fontSize: '0.8rem', fontFamily: 'var(--font-body)', outline: 'none', background: 'white' }} />
          <button type="button" onClick={add} style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 7, cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}>
            <i className="fas fa-plus" /> Ajouter
          </button>
        </div>
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
    const tabColors = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b'];
    const activeColor = tabColors[formTab];

    return (
      <div className="admin-card">
        {/* Header */}
        <div className="admin-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(26,122,60,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fas fa-pen" style={{ color: 'var(--primary)', fontSize: '0.9rem' }} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1rem' }}>{editing === 'new' ? 'Nouveau Service' : 'Modifier le Service'}</h2>
              <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--gray)' }}>Remplissez les 4 onglets pour un service complet</p>
            </div>
          </div>
          <button onClick={cancelEdit} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', color: '#64748b', width: 34, height: 34, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
            <i className="fas fa-times" />
          </button>
        </div>

        {/* Progress stepper */}
        <div style={{ padding: '0 1.5rem', borderBottom: '1px solid var(--gray-light)' }}>
          <div style={{ display: 'flex', gap: '0', overflowX: 'auto', paddingBottom: '0' }}>
            {FORM_TABS.map((tab, i) => {
              const isActive = formTab === i;
              const isDone = formTab > i;
              const color = tabColors[i];
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setFormTab(i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.85rem 1rem',
                    border: 'none',
                    borderBottom: isActive ? `3px solid ${color}` : '3px solid transparent',
                    background: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.8rem',
                    color: isActive ? color : (isDone ? '#64748b' : '#94a3b8'),
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isDone ? `${color}20` : isActive ? `${color}15` : '#f1f5f9',
                    fontSize: '0.65rem',
                  }}>
                    {isDone
                      ? <i className="fas fa-check" style={{ color }} />
                      : <i className={`fas ${tab.icon}`} style={{ color: isActive ? color : '#94a3b8' }} />
                    }
                  </div>
                  <span className="hide-mobile">{tab.label}</span>
                  <span style={{ display: 'none' }} className="show-mobile">{i + 1}</span>
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
                icon="fa-circle-info"
                color="#3b82f6"
                title="Identité du service"
                hint="Ces informations apparaissent sur la carte du service sur le site."
              />
              <div className="admin-form-row">
                <Field label="Titre du service" required hint="Court et percutant (ex: Tests d'intrusion)">
                  <input name="title" value={form.title} onChange={handleChange} placeholder="Ex: Tests d'intrusion" />
                </Field>

                {/* Icon picker */}
                <div className="admin-field" style={{ position: 'relative' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--dark)' }}>Icône du service</span>
                    <span style={{ fontWeight: 400, fontSize: '0.71rem', color: '#94a3b8' }}>Visible sur la carte et dans la modale</span>
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(26,122,60,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1.5px solid rgba(26,122,60,0.2)' }}>
                      <i className={`fas ${form.icon}`} style={{ color: 'var(--primary)', fontSize: '1.1rem' }} />
                    </div>
                    <input name="icon" value={form.icon} onChange={handleChange} placeholder="fa-shield-halved" style={{ flex: 1 }} />
                    <button type="button" onClick={() => setShowIconPicker(!showIconPicker)}
                      style={{ padding: '0.55rem 0.85rem', background: showIconPicker ? 'var(--primary)' : 'var(--light-2)', color: showIconPicker ? 'white' : 'var(--primary)', border: `1.5px solid var(--primary)`, borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap', fontFamily: 'var(--font-body)' }}>
                      <i className="fas fa-icons" /> <span className="hide-mobile">Choisir</span>
                    </button>
                  </div>
                  <small style={{ color: '#94a3b8', fontSize: '0.7rem', marginTop: '0.3rem', display: 'block' }}>
                    Trouvez d'autres icônes sur <a href="https://fontawesome.com/icons" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>fontawesome.com</a>
                  </small>
                  {showIconPicker && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1.5px solid var(--gray-light)', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 100, overflow: 'hidden', display: 'flex', flexDirection: 'column', marginTop: '0.35rem' }}>
                      <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--gray-light)', background: '#f8fafc' }}>
                        <input type="text" placeholder="Rechercher une icône..." value={iconSearch} onChange={e => setIconSearch(e.target.value)}
                          style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1.5px solid #cbd5e1', borderRadius: 8, fontSize: '0.83rem', fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div style={{ overflowY: 'auto', maxHeight: '220px', padding: '0.75rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.4rem' }}>
                          {ICONS.filter(ic => ic.name.toLowerCase().includes(iconSearch.toLowerCase()) || ic.value.toLowerCase().includes(iconSearch.toLowerCase())).map(ic => (
                            <button key={ic.value} type="button"
                              onClick={() => { setForm(p => ({ ...p, icon: ic.value })); setShowIconPicker(false); setIconSearch(''); }}
                              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', padding: '0.5rem', border: form.icon === ic.value ? '2px solid var(--primary)' : '1.5px solid var(--gray-light)', borderRadius: 8, background: form.icon === ic.value ? 'rgba(26,122,60,0.06)' : 'white', cursor: 'pointer', fontSize: '0.65rem', transition: 'all 0.1s' }}>
                              <i className={`fas ${ic.value}`} style={{ fontSize: '1.1rem', color: form.icon === ic.value ? 'var(--primary)' : '#475569' }} />
                              <span style={{ color: '#64748b', textAlign: 'center', lineHeight: 1.2, wordBreak: 'break-word' }}>{ic.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ height: '1px', background: '#f1f5f9', margin: '0.5rem 0 1.25rem' }} />

              <SectionHeader
                icon="fa-align-left"
                color="#8b5cf6"
                title="Description courte (carte)"
                hint="Résumé visible sur la carte du service — 2 à 3 phrases max."
              />
              <Field label="Description courte" required>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                  placeholder="Résumé bref du service visible sur la carte du site..." />
              </Field>
            </>
          )}

          {/* ── TAB 1: Présentation & Chips ── */}
          {formTab === 1 && (
            <>
              <SectionHeader
                icon="fa-align-center"
                color="#8b5cf6"
                title="Description longue"
                hint="Affichée dans l'onglet « Présentation » de la modale service. Soyez détaillé."
              />
              <Field label="Description détaillée">
                <textarea name="longDescription" value={form.longDescription} onChange={handleChange} rows={6}
                  placeholder="Description complète et détaillée du service, visible lorsque le client ouvre la modale..." />
              </Field>

              <div style={{ height: '1px', background: '#f1f5f9', margin: '0.25rem 0 1.25rem' }} />

              <SectionHeader
                icon="fa-layer-group"
                color="#3b82f6"
                title="Infos clés & Statistiques"
                hint="Chiffres et indicateurs mis en avant dans la modale (panneau latéral ou bas de présentation)."
              />
              <PairListEditor
                label="Infos clés (label → valeur)"
                hint='Ex : "Délai moyen" → "5 à 10 jours"'
                value={form.highlights}
                onChange={v => setForm(p => ({ ...p, highlights: v }))}
                keyPlaceholder="Ex: Délai moyen"
                valPlaceholder="Ex: 5 à 10 jours"
              />
              <PairListEditor
                label="Statistiques (valeur → label)"
                hint='Ex : "100%" → "Sur mesure"'
                value={form.stats}
                onChange={v => setForm(p => ({ ...p, stats: v }))}
                keyPlaceholder="Valeur (ex: 100%)"
                valPlaceholder="Label (ex: Sur mesure)"
              />

              <div style={{ height: '1px', background: '#f1f5f9', margin: '0.25rem 0 1.25rem' }} />

              <SectionHeader
                icon="fa-tags"
                color="#22c55e"
                title="Tags / Chips"
                hint='Petites étiquettes affichées dans la modale. Ex : "Certifié", "Sur mesure", "Yaoundé".'
              />
              <StringListEditor
                label="Tags"
                value={form.tags}
                onChange={v => setForm(p => ({ ...p, tags: v }))}
                placeholder='Ex: Certifié ISO 27001'
              />
            </>
          )}

          {/* ── TAB 2: Fonctionnalités ── */}
          {formTab === 2 && (
            <>
              <SectionHeader>
                icon="fa-list-check"
                color="#22c55e"
                title="Fonctionnalités & Prestations"
                hint='Affichées dans l\'onglet "Ce que nous faisons" de la modale. Soyez précis et concret.'
              </SectionHeader>
              <StringListEditor
                label="Liste des fonctionnalités"
                hint="Chaque ligne correspond à une fonctionnalité ou prestation du service."
                value={form.features}
                onChange={v => setForm(p => ({ ...p, features: v }))}
                placeholder="Ex: Analyse complète de votre environnement réseau..."
              />
            </>
          )}

          {/* ── TAB 3: Avantages & Processus ── */}
          {formTab === 3 && (
            <>
              <SectionHeader>
                icon="fa-medal"
                color="#f59e0b"
                title="Avantages concurrentiels"
                hint='Affichés dans l\'onglet "Avantages" de la modale. Montrez ce qui vous différencie.'
              </SectionHeader>
              <BenefitEditor value={form.benefits} onChange={v => setForm(p => ({ ...p, benefits: v }))} />

              <div style={{ height: '1px', background: '#f1f5f9', margin: '0.25rem 0 1.25rem' }} />

              <SectionHeader>
                icon="fa-sitemap"
                color="#3b82f6"
                title="Étapes du processus"
                hint='Affichées dans l\'onglet "Processus" de la modale. Décrivez comment vous travaillez.'
              </SectionHeader>
              <ProcessEditor value={form.process} onChange={v => setForm(p => ({ ...p, process: v }))} />
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
                  style={{ padding: '0.6rem 1rem', borderRadius: 'var(--radius)', border: `1.5px solid ${tabColors[formTab + 1]}`, background: `${tabColors[formTab + 1]}0c`, cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.85rem', color: tabColors[formTab + 1], display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  Suivant <i className="fas fa-arrow-right" style={{ fontSize: '0.75rem' }} />
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
                <div style={{ marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {Array(6).fill(0).map((_, i) => (
                      <div key={i} style={{ width: 8, height: 8, borderRadius: 2, background: i < done ? 'var(--primary)' : 'var(--gray-light)' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--gray)' }}>{done}/6 champs renseignés</span>
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