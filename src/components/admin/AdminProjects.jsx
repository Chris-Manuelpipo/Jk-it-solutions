import { useState } from 'react';
import { useCMS } from '../../context/CMSContext';

const CATEGORIES = ['Cybersécurité', 'Vidéosurveillance', 'IoT', 'Audit', 'Formation', 'Réseau', 'Autre'];
const STATUSES = ['En cours', 'Terminé', 'En pause', 'Planifié'];

const emptyProject = {
    id: null,
    title: '',
    description: '',
    category: 'Cybersécurité',
    client: '',
    progress: 50,
    status: 'En cours',
    image: '',
    startDate: '',
    endDate: '',
};

export default function AdminProjects({ onSave }) {
    const { content, updateContent } = useCMS();
    const [projects, setProjects] = useState(JSON.parse(JSON.stringify(content.projects || [])));
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyProject);

    const openNew = () => { setForm({ ...emptyProject, id: Date.now() }); setEditing('new'); };
    const openEdit = (p) => { setForm({ ...p }); setEditing(p.id); };
    const cancelEdit = () => { setEditing(null); setForm(emptyProject); };

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: name === 'progress' ? Number(value) : value }));
    };

    const handleSave = () => {
        if (!form.title) return;
        let updated;
        if (editing === 'new') {
            updated = [...projects, form];
        } else {
            updated = projects.map(p => p.id === editing ? form : p);
        }
        setProjects(updated);
        updateContent('projects', updated);
        onSave('Projet sauvegardé !');
        cancelEdit();
    };

    const handleDelete = (id) => {
        const updated = projects.filter(p => p.id !== id);
        setProjects(updated);
        updateContent('projects', updated);
        onSave('Projet supprimé.');
    };

    // ---- PROGRESS COLOR ----
    const progressColor = (val) => {
        if (val >= 100) return '#22c55e';
        if (val >= 60) return '#3b82f6';
        if (val >= 30) return '#f59e0b';
        return '#ef4444';
    };

    // ---- EDIT FORM ----
    if (editing !== null) {
        return (
            <div className="admin-card">
                <div className="admin-card-header">
                    <h2>
                        <i className="fas fa-diagram-project" />
                        {' '}{editing === 'new' ? 'Nouveau Projet' : 'Modifier le Projet'}
                    </h2>
                    <button onClick={cancelEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)', fontSize: '1.2rem' }}>
                        <i className="fas fa-times" />
                    </button>
                </div>

                <div className="admin-form">
                    <div className="admin-form-row">
                        <div className="admin-field">
                            <label>Titre du projet *</label>
                            <input name="title" value={form.title} onChange={handleChange} placeholder="Ex: Sécurisation Infrastructure MTN" />
                        </div>
                        <div className="admin-field">
                            <label>Client / Organisation</label>
                            <input name="client" value={form.client} onChange={handleChange} placeholder="Ex: MTN Cameroun" />
                        </div>
                    </div>

                    <div className="admin-field">
                        <label>Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Décrivez le projet..." />
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-field">
                            <label>Catégorie</label>
                            <select name="category" value={form.category} onChange={handleChange}>
                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="admin-field">
                            <label>Statut</label>
                            <select name="status" value={form.status} onChange={handleChange}>
                                {STATUSES.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* PROGRESS SLIDER */}
                    <div className="admin-field">
                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>Avancement du projet</span>
                            <strong style={{ fontSize: '1.1rem', color: progressColor(form.progress) }}>
                                {form.progress}%
                            </strong>
                        </label>
                        <input
                            type="range"
                            name="progress"
                            min={0}
                            max={100}
                            step={5}
                            value={form.progress}
                            onChange={handleChange}
                            style={{ width: '100%', accentColor: progressColor(form.progress), height: '6px', cursor: 'pointer' }}
                        />
                        {/* Visual mini bar */}
                        <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '999px', marginTop: '0.5rem', overflow: 'hidden' }}>
                            <div style={{
                                height: '100%',
                                width: `${form.progress}%`,
                                background: progressColor(form.progress),
                                borderRadius: '999px',
                                transition: 'width 0.3s ease, background 0.3s ease'
                            }} />
                        </div>
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-field">
                            <label>Date de début</label>
                            <input name="startDate" value={form.startDate} onChange={handleChange} placeholder="Ex: Janv. 2026" />
                        </div>
                        <div className="admin-field">
                            <label>Date de fin prévue</label>
                            <input name="endDate" value={form.endDate} onChange={handleChange} placeholder="Ex: Juin 2026" />
                        </div>
                    </div>

                    <div className="admin-field">
                        <label>Image (URL)</label>
                        <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
                    </div>
                    {form.image && (
                        <img src={form.image} alt="" className="img-preview" style={{ maxHeight: 150, borderRadius: 'var(--radius)', marginBottom: '0.5rem' }} />
                    )}

                    <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
                        <button className="btn-admin-save" onClick={handleSave}>
                            <i className="fas fa-save" /> Sauvegarder
                        </button>
                        <button onClick={cancelEdit} style={{
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

    // ---- LIST VIEW ----
    return (
        <div className="admin-card">
            <div className="admin-card-header">
                <h2><i className="fas fa-diagram-project" /> Projets ({projects.length})</h2>
                <button className="btn-admin-save" onClick={openNew}>
                    <i className="fas fa-plus" /> Ajouter
                </button>
            </div>

            <div className="admin-list">
                {projects.map(p => (
                    <div key={p.id} className="admin-list-item">
                        {p.image && <img src={p.image} alt="" className="admin-list-item-img" />}
                        <div className="admin-list-item-info" style={{ flex: 1 }}>
                            <strong>{p.title}</strong>
                            <span>
                                <span style={{
                                    background: '#e0e7ff', color: '#1e40af',
                                    padding: '0.15rem 0.5rem', borderRadius: '50px',
                                    fontSize: '0.7rem', marginRight: '0.5rem', fontWeight: 600,
                                }}>{p.category}</span>
                                {p.client} · {p.startDate} → {p.endDate}
                            </span>
                            {/* Mini progress bar */}
                            <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%', borderRadius: '999px',
                                        width: `${p.progress}%`,
                                        background: progressColor(p.progress),
                                        transition: 'width 0.6s ease',
                                    }} />
                                </div>
                                <span style={{ fontSize: '0.78rem', fontWeight: '700', color: progressColor(p.progress), minWidth: '36px' }}>
                                    {p.progress}%
                                </span>
                                <span style={{
                                    fontSize: '0.68rem', fontWeight: '700', padding: '0.15rem 0.5rem',
                                    borderRadius: '50px', background: p.status === 'Terminé' ? '#dcfce7' : '#fef9c3',
                                    color: p.status === 'Terminé' ? '#16a34a' : '#92400e',
                                }}>
                                    {p.status}
                                </span>
                            </div>
                        </div>
                        <div className="admin-list-item-actions">
                            <button className="btn-admin-save" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }} onClick={() => openEdit(p)}>
                                <i className="fas fa-pen" />
                            </button>
                            <button className="btn-admin-danger" onClick={() => handleDelete(p.id)}>
                                <i className="fas fa-trash" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {projects.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray)' }}>
                    <i className="fas fa-diagram-project" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem', opacity: 0.3 }} />
                    Aucun projet. Cliquez sur "Ajouter" pour créer le premier.
                </div>
            )}
        </div>
    );
}
