import { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { createFormation, updateFormation, deleteFormation } from '../../api/strapiAdmin';
import ImageUrlField from './ImageUrlField';

const emptyFormation = { id: null, strapiId: null, title: '', description: '', duration: '', price: '', date: '', image: '', imageFile: null, level: 'Débutant' };
const levelColor = { 'Débutant': '#22c55e', 'Intermédiaire': '#f59e0b', 'Avancé': '#ef4444' };

export default function AdminFormations({ onSave }) {
  const { content, refreshContent } = useCMS();
  const [formations, setFormations] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyFormation);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormations(JSON.parse(JSON.stringify(content.formations || [])));
  }, [content]);

  const openNew = () => { setForm({ ...emptyFormation, id: Date.now() }); setEditing('new'); };
  const openEdit = (f) => { setForm({ ...f, imageFile: null }); setEditing(f.id); };
  const cancelEdit = () => { setEditing(null); setForm(emptyFormation); };
  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleImageUrl = (url) => setForm(p => ({ ...p, image: url, imageFile: null }));
  const handleImageFile = (file) => setForm(p => ({ ...p, image: URL.createObjectURL(file), imageFile: file }));

  const handleSave = async () => {
    if (!form.title || !form.description) return;
    setSaving(true);
    try {
      const payload = {
        title: form.title, description: form.description, duration: form.duration,
        price: form.price, date: form.date, level: form.level, image_url: form.image || '',
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

  if (editing !== null) {
    return (
      <div className="admin-card">
        <div className="admin-card-header">
          <h2><i className="fas fa-pen" /> {editing === 'new' ? 'Nouvelle Formation' : 'Modifier la Formation'}</h2>
          <button onClick={cancelEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)', fontSize: '1.2rem' }}>
            <i className="fas fa-times" />
          </button>
        </div>
        <div className="admin-form">
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
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Description de la formation..." />
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
              <label>Date</label>
              <input name="date" value={form.date} onChange={handleChange} placeholder="Ex: 15 Avril 2026" />
            </div>
            <ImageUrlField
              label="Image"
              value={form.image}
              onChange={handleImageUrl}
            />
          </div>
          {form.image && <img src={form.image} alt="" className="img-preview" style={{ maxHeight: 160, borderRadius: 'var(--radius)' }} />}

          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
            <button className="btn-admin-save" onClick={handleSave} disabled={saving}>
              {saving ? <><i className="fas fa-circle-notch fa-spin" /> Enregistrement...</> : <><i className="fas fa-save" /> Sauvegarder</>}
            </button>
            <button onClick={cancelEdit} style={{ padding: '0.65rem 1.25rem', borderRadius: 'var(--radius)', border: '1.5px solid var(--gray-light)', background: 'white', color: 'var(--gray)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: '600', fontSize: '0.88rem' }}>
              Annuler
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                <span style={{ background: levelColor[f.level], color: 'white', padding: '0.15rem 0.5rem', borderRadius: '50px', fontSize: '0.7rem', marginRight: '0.5rem' }}>{f.level}</span>
                {f.duration} · {f.price} · {f.date}
              </span>
            </div>
            <div className="admin-list-item-actions">
              <button className="btn-admin-save" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }} onClick={() => openEdit(f)}><i className="fas fa-pen" /></button>
              <button className="btn-admin-danger" onClick={() => handleDelete(f)}><i className="fas fa-trash" /></button>
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
