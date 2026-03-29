import { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

export function AdminContact({ onSave }) {
  const { content, updateContent } = useCMS();
  const [contact, setContact] = useState({ ...content.contact });
  const [config, setConfig] = useState({ ...content.siteConfig });

  const handleContact = (field, value) => setContact(p => ({ ...p, [field]: value }));
  const handleConfig = (field, value) => setConfig(p => ({ ...p, [field]: value }));

  const handleSave = () => {
    updateContent('contact', contact);
    updateContent('siteConfig', config);
    onSave('Informations de contact sauvegardées !');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="admin-card">
        <div className="admin-card-header">
          <h2><i className="fas fa-building" /> Informations de l'Entreprise</h2>
          <button className="btn-admin-save" onClick={handleSave}><i className="fas fa-save" /> Sauvegarder</button>
        </div>
        <div className="admin-form">
          <div className="admin-form-row">
            <div className="admin-field">
              <label>Nom de l'entreprise</label>
              <input value={config.companyName} onChange={e => handleConfig('companyName', e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Slogan</label>
              <input value={config.slogan} onChange={e => handleConfig('slogan', e.target.value)} />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label>Adresse</label>
              <input value={contact.address} onChange={e => handleContact('address', e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Téléphone</label>
              <input value={contact.phone} onChange={e => handleContact('phone', e.target.value)} />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label>Email</label>
              <input type="email" value={contact.email} onChange={e => handleContact('email', e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Horaires</label>
              <input value={contact.hours} onChange={e => handleContact('hours', e.target.value)} />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label>WhatsApp (numéro avec indicatif)</label>
              <input value={contact.whatsapp} onChange={e => handleContact('whatsapp', e.target.value)} placeholder="+237694164668" />
            </div>
            <div className="admin-field">
              <label>Facebook URL</label>
              <input type="url" value={contact.facebook} onChange={e => handleContact('facebook', e.target.value)} />
            </div>
          </div>
          <div className="admin-field">
            <label>LinkedIn URL</label>
            <input type="url" value={contact.linkedin} onChange={e => handleContact('linkedin', e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminTestimonials({ onSave }) {
  const { content, updateContent } = useCMS();
  const [testimonials, setTestimonials] = useState(JSON.parse(JSON.stringify(content.testimonials)));
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const emptyT = { id: Date.now(), name: '', role: '', text: '', avatar: '', rating: 5 };
  const openEdit = t => { setForm({ ...t }); setEditing(t.id); };
  const openNew = () => { setForm(emptyT); setEditing('new'); };
  const cancel = () => { setEditing(null); setForm({}); };
  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSaveItem = () => {
    let updated;
    if (editing === 'new') updated = [...testimonials, { ...form, id: Date.now() }];
    else updated = testimonials.map(t => t.id === editing ? form : t);
    setTestimonials(updated);
    updateContent('testimonials', updated);
    onSave('Témoignage sauvegardé !');
    cancel();
  };
  const handleDelete = id => {
    const updated = testimonials.filter(t => t.id !== id);
    setTestimonials(updated);
    updateContent('testimonials', updated);
    onSave('Témoignage supprimé.');
  };

  if (editing !== null) return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h2><i className="fas fa-pen" /> {editing === 'new' ? 'Nouveau Témoignage' : 'Modifier'}</h2>
        <button onClick={cancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)', fontSize: '1.2rem' }}><i className="fas fa-times" /></button>
      </div>
      <div className="admin-form">
        <div className="admin-form-row">
          <div className="admin-field"><label>Nom *</label><input name="name" value={form.name} onChange={handleChange} /></div>
          <div className="admin-field"><label>Rôle / Entreprise *</label><input name="role" value={form.role} onChange={handleChange} /></div>
        </div>
        <div className="admin-field"><label>Texte du témoignage *</label><textarea name="text" value={form.text} onChange={handleChange} rows={4} /></div>
        <div className="admin-form-row">
          <div className="admin-field">
            <label>Photo (URL)</label>
            <input name="avatar" value={form.avatar} onChange={handleChange} placeholder="https://..." />
            {form.avatar && <img src={form.avatar} alt="" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', marginTop: '0.5rem' }} />}
          </div>
          <div className="admin-field">
            <label>Note (1-5)</label>
            <select name="rating" value={form.rating} onChange={handleChange}>
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} étoile{n > 1 ? 's' : ''}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-admin-save" onClick={handleSaveItem}><i className="fas fa-save" /> Sauvegarder</button>
          <button onClick={cancel} style={{ padding: '0.65rem 1.25rem', borderRadius: 'var(--radius)', border: '1.5px solid var(--gray-light)', background: 'white', color: 'var(--gray)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: '600', fontSize: '0.88rem' }}>Annuler</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h2><i className="fas fa-comments" /> Témoignages ({testimonials.length})</h2>
        <button className="btn-admin-save" onClick={openNew}><i className="fas fa-plus" /> Ajouter</button>
      </div>
      <div className="admin-list">
        {testimonials.map(t => (
          <div key={t.id} className="admin-list-item">
            {t.avatar && <img src={t.avatar} alt="" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />}
            <div className="admin-list-item-info">
              <strong>{t.name}</strong>
              <span>{t.role} · {'⭐'.repeat(t.rating)}</span>
            </div>
            <div className="admin-list-item-actions">
              <button className="btn-admin-save" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }} onClick={() => openEdit(t)}><i className="fas fa-pen" /></button>
              <button className="btn-admin-danger" onClick={() => handleDelete(t.id)}><i className="fas fa-trash" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminContact;
