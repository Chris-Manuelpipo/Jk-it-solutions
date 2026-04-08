import { useState, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { createProject, updateProject, deleteProject } from '../../api/strapiAdmin';
import ImageUrlField from './ImageUrlField';

const CATEGORIES = ['Cybersécurité', 'Vidéosurveillance', 'IoT', 'Réseau', 'Formation', 'Autre'];
const STATUSES = ['En cours', 'Terminé', 'En pause'];

const emptyProject = { id: null, strapiId: null, title: '', description: '', category: 'Cybersécurité', client: '', progress: 50, statuse: 'En cours', image: '', imageFile: null, startDate: '', endDate: '' };

export default function AdminProjects({ onSave }) {
    const { content, refreshContent } = useCMS();
    const [projects, setProjects] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyProject);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setProjects(JSON.parse(JSON.stringify(content.projects || [])));
    }, [content]);

    const openNew = () => { setForm({ ...emptyProject, id: Date.now() }); setEditing('new'); };
    const openEdit = (p) => { setForm({ ...p, imageFile: null }); setEditing(p.id); };
    const cancelEdit = () => { setEditing(null); setForm(emptyProject); };
    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: name === 'progress' ? Number(value) : value }));
    };
    const handleImageUrl = (url) => setForm(p => ({ ...p, image: url, imageFile: null }));
    const handleImageFile = (file) => setForm(p => ({ ...p, image: URL.createObjectURL(file), imageFile: file }));

    const handleSave = async () => {
        if (!form.title) return;
        setSaving(true);
        try {
            const payload = { title: form.title, description: form.description, category: form.category, client: form.client, progress: form.progress, statuse: form.statuse, image_url: form.image || '', start_date: form.startDate || null, end_date: form.endDate || null };
            if (editing === 'new') { await createProject(payload, form.imageFile || null); }
            else { await updateProject(form, payload, form.imageFile || null); }
            await refreshContent();
            setProjects(content.projects);
            onSave('Projet sauvegardé !');
            cancelEdit();
        } catch (err) { onSave('Erreur: ' + err.message); }
        finally { setSaving(false); }
    };

    const handleDelete = async (p) => {
        if (!confirm('Supprimer ce projet ?')) return;
        try { await deleteProject(p); await refreshContent(); setProjects(content.projects); onSave('Projet supprimé.'); }
        catch (err) { onSave('Erreur: ' + err.message); }
    };

    const progressColor = (val) => { if (val >= 100) return '#22c55e'; if (val >= 60) return '#3b82f6'; if (val >= 30) return '#f59e0b'; return '#ef4444'; };

    if (editing !== null) {
        return (
            <div className="admin-card">
                <div className="admin-card-header">
                    <h2><i className="fas fa-diagram-project" /> {editing === 'new' ? 'Nouveau Projet' : 'Modifier le Projet'}</h2>
                    <button onClick={cancelEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)', fontSize: '1.2rem' }}><i className="fas fa-times" /></button>
                </div>
                <div className="admin-form">
                    <div className="admin-form-row">
                        <div className="admin-field">
                            <label>Titre du projet *</label>
                            <input name="title" value={form.title} onChange={handleChange} placeholder="Ex: Sécurisation Infrastructure MTN" />
                        </div>
                        <div className="admin-field">
                            <label>Client</label>
                            <input name="client" value={form.client} onChange={handleChange} placeholder="Ex: MTN Cameroun" />
                        </div>
                    </div>
                    <div className="admin-field">
                        <label>Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
                    </div>
                    <div className="admin-form-row">
                        <div className="admin-field">
                            <label>Catégorie</label>
                            <select name="category" value={form.category} onChange={handleChange}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
                        </div>
                        <div className="admin-field">
                            <label>Statut</label>
                            <select name="statuse" value={form.statuse} onChange={handleChange}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select>
                        </div>
                    </div>
                    <div className="admin-field admin-range-progress">
                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <span>Avancement</span>
                            <strong style={{ fontSize: '1.1rem', color: progressColor(form.progress) }}>{form.progress}%</strong>
                        </label>
                        <input type="range" name="progress" min={0} max={100} step={5} value={form.progress} onChange={handleChange} style={{ width: '100%', accentColor: progressColor(form.progress), height: '6px' }} />
                        <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '999px', marginTop: '0.5rem', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${form.progress}%`, background: progressColor(form.progress), borderRadius: '999px', transition: 'width 0.3s' }} />
                        </div>
                    </div>
                    <div className="admin-form-row">
                        <div className="admin-field">
                            <label>Date de début</label>
                            <input name="startDate" value={form.startDate} onChange={handleChange} />
                        </div>
                        <div className="admin-field">
                            <label>Date de fin</label>
                            <input name="endDate" value={form.endDate} onChange={handleChange} />
                        </div>
                    </div>
                    <ImageUrlField
                        label="Image"
                        value={form.image}
                        onChange={handleImageUrl}
                        onFileChange={handleImageFile}
                    />
                    <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
                        <button className="btn-admin-save" onClick={handleSave} disabled={saving}>
                            {saving ? <><i className="fas fa-circle-notch fa-spin" /> Enregistrement...</> : <><i className="fas fa-save" /> Sauvegarder</>}
                        </button>
                        <button onClick={cancelEdit} style={{ padding: '0.65rem 1.25rem', borderRadius: 'var(--radius)', border: '1.5px solid var(--gray-light)', background: 'white', color: 'var(--gray)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: '600', fontSize: '0.88rem' }}>Annuler</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-card">
            <div className="admin-card-header">
                <h2><i className="fas fa-diagram-project" /> Projets ({projects.length})</h2>
                <button className="btn-admin-save" onClick={openNew}><i className="fas fa-plus" /> Ajouter</button>
            </div>
            <div className="admin-list">
                {projects.map(p => (
                    <div key={p.id} className="admin-list-item">
                        {p.image && <img src={p.image} alt="" className="admin-list-item-img" />}
                        <div className="admin-list-item-info" style={{ flex: 1 }}>
                            <strong>{p.title}</strong>
                            <span style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', alignItems: 'center' }}>
                                <span style={{ background: '#e0e7ff', color: '#1e40af', padding: '0.15rem 0.5rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 600 }}>{p.category}</span>
                                <span style={{ color: 'var(--gray)', fontSize: '0.75rem' }}>{p.client}</span>
                            </span>
                            <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: '100px', height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', borderRadius: '999px', width: `${p.progress}%`, background: progressColor(p.progress) }} />
                                </div>
                                <span style={{ fontSize: '0.78rem', fontWeight: '700', color: progressColor(p.progress), minWidth: '36px' }}>{p.progress}%</span>
                                <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '0.15rem 0.5rem', borderRadius: '50px', background: p.status === 'Terminé' ? '#dcfce7' : '#fef9c3', color: p.status === 'Terminé' ? '#16a34a' : '#92400e' }}>{p.status}</span>
                            </div>
                        </div>
                        <div className="admin-list-item-actions">
                            <button className="btn-admin-save" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }} onClick={() => openEdit(p)}><i className="fas fa-pen" /></button>
                            <button className="btn-admin-danger" onClick={() => handleDelete(p)}><i className="fas fa-trash" /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
