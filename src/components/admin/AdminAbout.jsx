import { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { updateAbout } from '../../api/strapiAdmin';
import { createTeamMember, updateTeamMember, deleteTeamMember } from '../../api/strapiAdmin';

const emptyMember = { id: null, strapiId: null, name: '', role: '', image: '', imageFile: null, linkedin: '', facebook: '', whatsapp: '' };

export default function AdminAbout({ onSave }) {
  const { content, refreshContent } = useCMS();
  const [about, setAbout] = useState(JSON.parse(JSON.stringify(content.about)));
  const [team, setTeam] = useState(JSON.parse(JSON.stringify(content.team || [])));
  const [editingMember, setEditingMember] = useState(null);
  const [memberForm, setMemberForm] = useState(emptyMember);
  const [savingAbout, setSavingAbout] = useState(false);

  const handleChange = (field, value) => setAbout(p => ({ ...p, [field]: value }));
  const handleStatChange = (i, field, value) => {
    const stats = about.stats.map((s, idx) => idx === i ? { ...s, [field]: field === 'value' ? Number(value) : value } : s);
    setAbout(p => ({ ...p, stats }));
  };

  const handleSaveAbout = async () => {
    setSavingAbout(true);
    try {
      const payload = {
        title: about.title,
        text: about.text,
        image_url: about.image || '',
        stat_clients: about.stats[0]?.value || 0,
        stat_projects: about.stats[1]?.value || 0,
        stat_years: about.stats[2]?.value || 0,
        stat_experts: about.stats[3]?.value || 0,
      };
      const strapiAbout = content.about;
      if (strapiAbout?.documentId || strapiAbout?.id) {
        await updateAbout(strapiAbout, payload, about.imageFile || null);
      }
      await refreshContent();
      onSave('Section À Propos sauvegardée !');
    } catch (err) {
      onSave('Erreur: ' + err.message);
    } finally {
      setSavingAbout(false);
    }
  };

  const openNewMember = () => { setMemberForm({ ...emptyMember, id: Date.now() }); setEditingMember('new'); };
  const openEditMember = (m) => { setMemberForm({ ...m, imageFile: null }); setEditingMember(m.id); };
  const cancelMemberEdit = () => { setEditingMember(null); setMemberForm(emptyMember); };
  const handleMemberChange = e => setMemberForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleMemberImageUrl = (url) => setMemberForm(p => ({ ...p, image: url, imageFile: null }));
  const handleMemberImageFile = (file) => {
    const url = URL.createObjectURL(file);
    setMemberForm(p => ({ ...p, image: url, imageFile: file }));
  };

  const handleSaveMember = async () => {
    if (!memberForm.name) return;
    setSavingAbout(true);
    try {
      const payload = {
        name: memberForm.name,
        role: memberForm.role,
        image_url: memberForm.image || '',
        linkedin: memberForm.linkedin || '',
        facebook: memberForm.facebook || '',
        whatsapp: memberForm.whatsapp || '',
      };
      if (editingMember === 'new') {
        await createTeamMember(payload, memberForm.imageFile || null);
      } else {
        await updateTeamMember(memberForm, payload, memberForm.imageFile || null);
      }
      await refreshContent();
      const updated = content.team || [];
      setTeam(updated);
      onSave('Membre sauvegardé !');
      cancelMemberEdit();
    } catch (err) {
      onSave('Erreur: ' + err.message);
    } finally {
      setSavingAbout(false);
    }
  };

  const handleDeleteMember = async (m) => {
    if (!confirm('Supprimer ce membre ?')) return;
    try {
      await deleteTeamMember(m);
      await refreshContent();
      setTeam(content.team || []);
      onSave('Membre supprimé.');
    } catch (err) {
      onSave('Erreur: ' + err.message);
    }
  };

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
            <label>Photo</label>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }} className="admin-img-url-wrap">
              <input
                type="url"
                value={memberForm.imageFile ? '' : memberForm.image}
                onChange={e => handleMemberImageUrl(e.target.value)}
                placeholder="Collez une URL (https://...)"
                style={{ flex: 1 }}
              />
              <label className="btn-admin-add" style={{ width: 'auto', margin: 0, cursor: 'pointer' }}>
                <i className="fas fa-upload" /> Uploader
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) handleMemberImageFile(e.target.files[0]); }} />
              </label>
            </div>
            {memberForm.image && (
              <img src={memberForm.image} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: '0.75rem', border: '3px solid var(--primary)' }} />
            )}
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label><i className="fab fa-linkedin" style={{ color: '#0077b5' }} /> LinkedIn</label>
              <input name="linkedin" value={memberForm.linkedin} onChange={handleMemberChange} placeholder="https://linkedin.com/in/..." />
            </div>
            <div className="admin-field">
              <label><i className="fab fa-facebook" style={{ color: '#1877f2' }} /> Facebook</label>
              <input name="facebook" value={memberForm.facebook} onChange={handleMemberChange} placeholder="https://facebook.com/..." />
            </div>
          </div>
          <div className="admin-field">
            <label><i className="fab fa-whatsapp" style={{ color: '#25d366' }} /> WhatsApp</label>
            <input name="whatsapp" value={memberForm.whatsapp} onChange={handleMemberChange} placeholder="+237 6 XX XX XX XX" />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
            <button className="btn-admin-save" onClick={handleSaveMember} disabled={savingAbout}>
              {savingAbout ? <><i className="fas fa-circle-notch fa-spin" /> Enregistrement...</> : <><i className="fas fa-save" /> Sauvegarder</>}
            </button>
            <button onClick={cancelMemberEdit} style={{ padding: '0.65rem 1.25rem', borderRadius: 'var(--radius)', border: '1.5px solid var(--gray-light)', background: 'white', color: 'var(--gray)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: '600', fontSize: '0.88rem' }}>
              Annuler
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="admin-card">
        <div className="admin-card-header">
          <h2><i className="fas fa-circle-info" /> Section À Propos</h2>
          <button className="btn-admin-save" onClick={handleSaveAbout} disabled={savingAbout}>
            {savingAbout ? <><i className="fas fa-circle-notch fa-spin" /> Enregistrement...</> : <><i className="fas fa-save" /> Sauvegarder</>}
          </button>
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
            <label>Image</label>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }} className="admin-img-url-wrap">
              <input
                type="url"
                value={about.imageFile ? '' : about.image}
                onChange={e => setAbout(p => ({ ...p, image: e.target.value, imageFile: null }))}
                placeholder="Collez une URL (https://...)"
                style={{ flex: 1 }}
              />
              <label className="btn-admin-add" style={{ width: 'auto', margin: 0, cursor: 'pointer' }}>
                <i className="fas fa-upload" /> Uploader
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                  if (e.target.files[0]) {
                    const file = e.target.files[0];
                    setAbout(p => ({ ...p, image: URL.createObjectURL(file), imageFile: file }));
                  }
                }} />
              </label>
            </div>
            {about.image && <img src={about.image} alt="" className="img-preview" />}
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2><i className="fas fa-chart-bar" /> Statistiques</h2>
          <button className="btn-admin-save" onClick={handleSaveAbout} disabled={savingAbout}>
            <i className="fas fa-save" /> Sauvegarder
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }} className="admin-stats-grid">
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
                <button className="btn-admin-danger" onClick={() => handleDeleteMember(m)}>
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
