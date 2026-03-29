import { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

const emptyService = { id: null, icon: 'fa-shield-halved', title: '', description: '' };

export default function AdminServices({ onSave }) {
  const { content, updateContent } = useCMS();
  const [services, setServices] = useState(JSON.parse(JSON.stringify(content.services)));
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyService);

  const openEdit = (s) => { setForm({ ...s }); setEditing(s.id); };
  const openNew = () => { setForm({ ...emptyService, id: Date.now() }); setEditing('new'); };
  const cancelEdit = () => { setEditing(null); setForm(emptyService); };
  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = () => {
    let updated;
    if (editing === 'new') updated = [...services, form];
    else updated = services.map(s => s.id === editing ? form : s);
    setServices(updated);
    updateContent('services', updated);
    onSave('Service sauvegardé !');
    cancelEdit();
  };

  const handleDelete = (id) => {
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    updateContent('services', updated);
    onSave('Service supprimé.');
  };

  if (editing !== null) {
    return (
      <div className="admin-card">
        <div className="admin-card-header">
          <h2><i className="fas fa-pen" /> {editing === 'new' ? 'Nouveau Service' : 'Modifier le Service'}</h2>
          <button onClick={cancelEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)', fontSize: '1.2rem' }}>
            <i className="fas fa-times" />
          </button>
        </div>
        <div className="admin-form">
          <div className="admin-form-row">
            <div className="admin-field">
              <label>Titre *</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="Ex: Tests d'intrusion" />
            </div>
            <div className="admin-field">
              <label>Icône FontAwesome</label>
              <input name="icon" value={form.icon} onChange={handleChange} placeholder="fa-shield-halved" />
              <small style={{ color: 'var(--gray)', fontSize: '0.72rem' }}>
                Cherchez sur <a href="https://fontawesome.com/icons" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>fontawesome.com/icons</a> → copiez la classe (ex: fa-lock)
              </small>
            </div>
          </div>
          <div className="admin-field">
            <label>Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Description du service..." />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-admin-save" onClick={handleSave}><i className="fas fa-save" /> Sauvegarder</button>
            <button onClick={cancelEdit} style={{ padding: '0.65rem 1.25rem', borderRadius: 'var(--radius)', border: '1.5px solid var(--gray-light)', background: 'white', color: 'var(--gray)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: '600', fontSize: '0.88rem' }}>Annuler</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h2><i className="fas fa-gears" /> Services ({services.length})</h2>
        <button className="btn-admin-save" onClick={openNew}><i className="fas fa-plus" /> Ajouter</button>
      </div>
      <div className="admin-list">
        {services.map(s => (
          <div key={s.id} className="admin-list-item">
            <div style={{ width: 44, height: 44, background: 'var(--light-2)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '1.1rem', flexShrink: 0 }}>
              <i className={`fas ${s.icon}`} />
            </div>
            <div className="admin-list-item-info">
              <strong>{s.title}</strong>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '400px', display: 'block' }}>{s.description}</span>
            </div>
            <div className="admin-list-item-actions">
              <button className="btn-admin-save" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }} onClick={() => openEdit(s)}><i className="fas fa-pen" /></button>
              <button className="btn-admin-danger" onClick={() => handleDelete(s.id)}><i className="fas fa-trash" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
