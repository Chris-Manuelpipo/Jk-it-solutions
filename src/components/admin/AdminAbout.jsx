import { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

const emptyMember = { id: null, name: '', role: '', image: '', linkedin: '#', twitter: '#' };

export default function AdminAbout({ onSave }) {
  const { content, updateContent } = useCMS();
  const [about, setAbout] = useState(JSON.parse(JSON.stringify(content.about)));
  const [team, setTeam] = useState(JSON.parse(JSON.stringify(content.team || [])));
  const [editingMember, setEditingMember] = useState(null); // null | 'new' | id
  const [memberForm, setMemberForm] = useState(emptyMember);

  // ---- ABOUT ----
  const handleChange = (field, value) => setAbout(p => ({ ...p, [field]: value }));
  const handleStatChange = (i, field, value) => {
    const stats = about.stats.map((s, idx) => idx === i ? { ...s, [field]: field === 'value' ? Number(value) : value } : s);
    setAbout(p => ({ ...p, stats }));
  };
  const handleSaveAbout = () => { updateContent('about', about); onSave('Section À Propos sauvegardée !'); };

  // ---- TEAM ----
  const openNewMember = () => { setMemberForm({ ...emptyMember, id: Date.now() }); setEditingMember('new'); };
  const openEditMember = (m) => { setMemberForm({ ...m }); setEditingMember(m.id); };
  const cancelMemberEdit = () => { setEditingMember(null); setMemberForm(emptyMember); };
  const handleMemberChange = e => setMemberForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSaveMember = () => {
    if (!memberForm.name) return;
    let updated;
    if (editingMember === 'new') {
      updated = [...team, memberForm];
    } else {
      updated = team.map(m => m.id === editingMember ? memberForm : m);
    }
    setTeam(updated);
    updateContent('team', updated);
    onSave('Membre sauvegardé !');
    cancelMemberEdit();
  };

  const handleDeleteMember = (id) => {
    const updated = team.filter(m => m.id !== id);
    setTeam(updated);
    updateContent('team', updated);
    onSave('Membre supprimé.');
  };

  // ---- MEMBER FORM ----
  if (editingMember !== null) {
    return (
      <div className="admin-card">
        <div className="admin-card-header">
          <h2><i className="fas fa-user-pen" /> {editingMember === 'new' ? 'Nouveau Membre' : 'Modifier le Membre'}</h2>
          <button onClick={cancelMemberEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)', fontSize: '1.2rem' }}>
            <i className="fas fa-times" />
          </button>
        </div>
        <div className="admin-form">
          <div className="admin-form-row">
            <div className="admin-field">
              <label>Nom complet *</label>
              <input name="name" value={memberForm.name} onChange={handleMemberChange} placeholder="Ex: Jean-Kevin Nguetsop" />
            </div>
            <div className="admin-field">
              <label>Rôle / Poste</label>
              <input name="role" value={memberForm.role} onChange={handleMemberChange} placeholder="Ex: Fondateur & CEO" />
            </div>
          </div>
          <div className="admin-field">
            <label>Photo (URL)</label>
            <input name="image" value={memberForm.image} onChange={handleMemberChange} placeholder="https://..." />
          </div>
          {memberForm.image && (
            <img
              src={memberForm.image} alt=""
              style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: '0.75rem', border: '3px solid var(--primary)' }}
            />
          )}
          <div className="admin-form-row">
            <div className="admin-field">
              <label><i className="fab fa-linkedin" style={{ color: '#0077b5' }} /> LinkedIn (URL)</label>
              <input name="linkedin" value={memberForm.linkedin} onChange={handleMemberChange} placeholder="https://linkedin.com/in/..." />
            </div>
            <div className="admin-field">
              <label><i className="fab fa-twitter" style={{ color: '#1da1f2' }} /> Twitter (URL)</label>
              <input name="twitter" value={memberForm.twitter} onChange={handleMemberChange} placeholder="https://twitter.com/..." />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
            <button className="btn-admin-save" onClick={handleSaveMember}>
              <i className="fas fa-save" /> Sauvegarder
            </button>
            <button onClick={cancelMemberEdit} style={{
              padding: '0.65rem 1.25rem', borderRadius: 'var(--radius)',
              border: '1.5px solid var(--gray-light)', background: 'white',
              color: 'var(--gray)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: '600', fontSize: '0.88rem'
            }}>
              Annuler
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- MAIN VIEW ----
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* About text */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2><i className="fas fa-circle-info" /> Section À Propos</h2>
          <button className="btn-admin-save" onClick={handleSaveAbout}><i className="fas fa-save" /> Sauvegarder</button>
        </div>
        <div className="admin-form">
          <div className="admin-field">
            <label>Titre</label>
            <input value={about.title} onChange={e => handleChange('title', e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Texte de présentation</label>
            <textarea value={about.text} onChange={e => handleChange('text', e.target.value)} rows={5} />
          </div>
          <div className="admin-field">
            <label>Image (URL)</label>
            <input type="url" value={about.image} onChange={e => handleChange('image', e.target.value)} placeholder="https://..." />
            {about.image && <img src={about.image} alt="" className="img-preview" />}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2><i className="fas fa-chart-bar" /> Statistiques</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {about.stats.map((stat, i) => (
            <div key={i} style={{ background: 'var(--light)', borderRadius: 'var(--radius)', padding: '1rem' }}>
              <div className="admin-field" style={{ marginBottom: '0.5rem' }}>
                <label>Label</label>
                <input value={stat.label} onChange={e => handleStatChange(i, 'label', e.target.value)} />
              </div>
              <div className="admin-field">
                <label>Valeur (nombre)</label>
                <input type="number" value={stat.value} onChange={e => handleStatChange(i, 'value', e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team members */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2><i className="fas fa-users" /> Équipe ({team.length})</h2>
          <button className="btn-admin-save" onClick={openNewMember}>
            <i className="fas fa-plus" /> Ajouter
          </button>
        </div>

        <div className="admin-list">
          {team.map(m => (
            <div key={m.id} className="admin-list-item">
              {m.image
                ? <img src={m.image} alt="" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid var(--primary)' }} />
                : <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--light-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className="fas fa-user" style={{ color: 'var(--primary)', fontSize: '1.2rem' }} />
                </div>
              }
              <div className="admin-list-item-info">
                <strong>{m.name}</strong>
                <span>{m.role}</span>
              </div>
              <div className="admin-list-item-actions">
                <button className="btn-admin-save" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }} onClick={() => openEditMember(m)}>
                  <i className="fas fa-pen" />
                </button>
                <button className="btn-admin-danger" onClick={() => handleDeleteMember(m.id)}>
                  <i className="fas fa-trash" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {team.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray)' }}>
            <i className="fas fa-users" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem', opacity: 0.3 }} />
            Aucun membre. Cliquez sur "Ajouter" pour créer le premier.
          </div>
        )}
      </div>
    </div>
  );
}
