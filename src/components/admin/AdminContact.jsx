import { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { updateContactInfo, updateSiteConfig } from '../../api/strapiAdmin';
import { createTestimonial, updateTestimonial, deleteTestimonial } from '../../api/strapiAdmin';

export function AdminContact({ onSave }) {
  const { content, refreshContent } = useCMS();
  const [contact, setContact] = useState({ ...content.contact });
  const [config, setConfig] = useState({ ...content.siteConfig });
  const [saving, setSaving] = useState(false);

  const handleContact = (field, value) => setContact(p => ({ ...p, [field]: value }));
  const handleConfig = (field, value) => setConfig(p => ({ ...p, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const contactPayload = { address: contact.address, email: contact.email, phone: contact.phone, whatsapp: contact.whatsapp, hours: contact.hours, facebook: contact.facebook, linkedin: contact.linkedin, tiktok: contact.tiktok || '', instagram: contact.instagram || '' };
      await updateContactInfo(contactPayload);

      const configPayload = { company_name: config.companyName, slogan: config.slogan };
      await updateSiteConfig(configPayload, null);

      await refreshContent();
      onSave('Informations sauvegardées !');
    } catch (err) { onSave('Erreur: ' + err.message); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="admin-card">
        <div className="admin-card-header">
          <h2><i className="fas fa-building" /> Informations de l'Entreprise</h2>
          <button className="btn-admin-save" onClick={handleSave} disabled={saving}>
            {saving ? <><i className="fas fa-circle-notch fa-spin" /> Enregistrement...</> : <><i className="fas fa-save" /> Sauvegarder</>}
          </button>
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
              <label>WhatsApp</label>
              <input value={contact.whatsapp} onChange={e => handleContact('whatsapp', e.target.value)} placeholder="+237694164668" />
            </div>
            <div className="admin-field">
              <label>Facebook URL</label>
              <input type="url" value={contact.facebook} onChange={e => handleContact('facebook', e.target.value)} />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label>LinkedIn URL</label>
              <input type="url" value={contact.linkedin} onChange={e => handleContact('linkedin', e.target.value)} />
            </div>
            <div className="admin-field">
              <label>TikTok URL</label>
              <input type="url" value={contact.tiktok} onChange={e => handleContact('tiktok', e.target.value)} />
            </div>
          </div>
          <div className="admin-field">
            <label>Instagram URL</label>
            <input type="url" value={contact.instagram} onChange={e => handleContact('instagram', e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminTestimonials({ onSave }) {
  const { content, refreshContent } = useCMS();
  const [testimonials, setTestimonials] = useState(JSON.parse(JSON.stringify(content.testimonials)));
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const emptyT = { id: null, strapiId: null, name: '', role: '', text: '', avatar: '', avatarFile: null, rating: 5 };
  const openEdit = t => { setForm({ ...t, avatarFile: null }); setEditing(t.id); };
  const openNew = () => { setForm({ ...emptyT, id: Date.now() }); setEditing('new'); };
  const cancel = () => { setEditing(null); setForm({}); };
  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleAvatarUrl = (url) => setForm(p => ({ ...p, avatar: url, avatarFile: null }));
  const handleAvatarFile = (file) => setForm(p => ({ ...p, avatar: URL.createObjectURL(file), avatarFile: file }));

  const handleSaveItem = async () => {
    if (!form.name || !form.text) return;
    setSaving(true);
    try {
      const payload = { name: form.name, role: form.role, text: form.text, avatar_url: form.avatar || '', rating: Number(form.rating) };
      if (editing === 'new') { await createTestimonial(payload, form.avatarFile || null); }
      else { await updateTestimonial(form, payload, form.avatarFile || null); }
      await refreshContent();
      setTestimonials(content.testimonials);
      onSave('Témoignage sauvegardé !');
      cancel();
    } catch (err) { onSave('Erreur: ' + err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (t) => {
    if (!confirm('Supprimer ce témoignage ?')) return;
    try { await deleteTestimonial(t); await refreshContent(); setTestimonials(content.testimonials); onSave('Témoignage supprimé.'); }
    catch (err) { onSave('Erreur: ' + err.message); }
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
            <label>Photo</label>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
              <input type="url" value={form.avatarFile ? '' : form.avatar} onChange={e => handleAvatarUrl(e.target.value)} placeholder="Collez une URL" style={{ flex: 1 }} />
              <label className="btn-admin-add" style={{ width: 'auto', margin: 0, cursor: 'pointer' }}>
                <i className="fas fa-upload" /> Uploader
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) handleAvatarFile(e.target.files[0]); }} />
              </label>
            </div>
            {form.avatar && <img src={form.avatar} alt="" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', marginTop: '0.5rem' }} />}
          </div>
          <div className="admin-field">
            <label>Note (1-5)</label>
            <select name="rating" value={form.rating} onChange={handleChange}>{[5,4,3,2,1].map(n => <option key={n} value={n}>{n} étoile{n > 1 ? 's' : ''}</option>)}</select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-admin-save" onClick={handleSaveItem} disabled={saving}>
            {saving ? <><i className="fas fa-circle-notch fa-spin" /> Enregistrement...</> : <><i className="fas fa-save" /> Sauvegarder</>}
          </button>
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
              <button className="btn-admin-danger" onClick={() => handleDelete(t)}><i className="fas fa-trash" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminContact;
