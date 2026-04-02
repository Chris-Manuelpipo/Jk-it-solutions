import { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { createPack, updatePack, deletePack } from '../../api/strapiAdmin';

const MAX_PACKS = 3;
const emptyPack = { id: null, strapiId: null, title: '', badge: '', featured: false, items: [''], originalPrice: 0, promoPrice: 0, currency: 'FCFA', expiresAt: '', cta: 'Commander ce pack', active: true };

function formatPrice(n) { return Number(n).toLocaleString('fr-FR'); }

export default function AdminPacks({ onSave }) {
    const { content, refreshContent } = useCMS();
    const [packs, setPacks] = useState(JSON.parse(JSON.stringify(content.packs || [])));
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyPack);
    const [saving, setSaving] = useState(false);

    const openNew = () => {
        if (packs.length >= MAX_PACKS) { onSave(`Maximum ${MAX_PACKS} packs.`); return; }
        setForm({ ...emptyPack, id: Date.now() });
        setEditing('new');
    };
    const openEdit = (p) => { setForm(JSON.parse(JSON.stringify(p))); setEditing(p.id); };
    const cancelEdit = () => { setEditing(null); setForm(emptyPack); };
    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };
    const handleItemChange = (i, val) => {
        const items = [...form.items];
        items[i] = val;
        setForm(p => ({ ...p, items }));
    };
    const addItem = () => setForm(p => ({ ...p, items: [...p.items, ''] }));
    const removeItem = (i) => setForm(p => ({ ...p, items: p.items.filter((_, idx) => idx !== i) }));

    const handleSave = async () => {
        if (!form.title) return;
        setSaving(true);
        try {
            const payload = {
                title: form.title, badge: form.badge, featured: form.featured,
                items: form.items.filter(i => i.trim()),
                original_price: Number(form.originalPrice), promo_price: Number(form.promoPrice),
                currency: form.currency, expires_at: form.expiresAt || null, cta: form.cta, active: form.active,
            };
            if (editing === 'new') { await createPack(payload); }
            else { await updatePack(form, payload); }
            await refreshContent();
            setPacks(content.packs);
            onSave('Pack sauvegardé !');
            cancelEdit();
        } catch (err) { onSave('Erreur: ' + err.message); }
        finally { setSaving(false); }
    };

    const handleDelete = async (p) => {
        if (!confirm('Supprimer ce pack ?')) return;
        try { await deletePack(p); await refreshContent(); setPacks(content.packs); onSave('Pack supprimé.'); }
        catch (err) { onSave('Erreur: ' + err.message); }
    };

    const toggleActive = async (p) => {
        try {
            await updatePack(p, { active: !p.active });
            await refreshContent();
            setPacks(content.packs);
        } catch (err) { onSave('Erreur: ' + err.message); }
    };

    const discount = (orig, promo) => orig > promo ? Math.round((1 - promo / orig) * 100) : 0;

    if (editing !== null) {
        return (
            <div className="admin-card">
                <div className="admin-card-header">
                    <h2><i className="fas fa-tags" /> {editing === 'new' ? 'Nouveau Pack' : 'Modifier le Pack'}</h2>
                    <button onClick={cancelEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)', fontSize: '1.2rem' }}><i className="fas fa-times" /></button>
                </div>
                <div className="admin-form">
                    <div className="admin-form-row">
                        <div className="admin-field">
                            <label>Titre du pack *</label>
                            <input name="title" value={form.title} onChange={handleChange} placeholder="Ex: Pack Sécurité Pro" />
                        </div>
                        <div className="admin-field">
                            <label>Badge</label>
                            <input name="badge" value={form.badge} onChange={handleChange} placeholder="Ex: 🔥 Best-seller" />
                        </div>
                    </div>
                    <div className="admin-form-row">
                        <div className="admin-field">
                            <label>Prix original</label>
                            <input name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange} />
                        </div>
                        <div className="admin-field">
                            <label>Prix promotionnel</label>
                            <input name="promoPrice" type="number" value={form.promoPrice} onChange={handleChange} />
                        </div>
                        <div className="admin-field">
                            <label>Devise</label>
                            <input name="currency" value={form.currency} onChange={handleChange} />
                        </div>
                    </div>
                    {form.originalPrice > 0 && form.promoPrice > 0 && (
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--light)', borderRadius: 'var(--radius)', fontSize: '0.88rem', flexWrap: 'wrap' }}>
                            <span style={{ textDecoration: 'line-through', color: 'var(--gray)' }}>{formatPrice(form.originalPrice)} {form.currency}</span>
                            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>{formatPrice(form.promoPrice)} {form.currency}</span>
                            {discount(form.originalPrice, form.promoPrice) > 0 && <span style={{ background: '#fee2e2', color: '#dc2626', padding: '0.2rem 0.6rem', borderRadius: '50px', fontWeight: 700 }}>−{discount(form.originalPrice, form.promoPrice)}%</span>}
                        </div>
                    )}
                    <div className="admin-form-row">
                        <div className="admin-field">
                            <label>Date d'expiration</label>
                            <input name="expiresAt" type="date" value={form.expiresAt} onChange={handleChange} />
                        </div>
                        <div className="admin-field">
                            <label>Texte du bouton CTA</label>
                            <input name="cta" value={form.cta} onChange={handleChange} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}>
                            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} /> ⭐ Mis en avant
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}>
                            <input type="checkbox" name="active" checked={form.active} onChange={handleChange} /> Visible
                        </label>
                    </div>
                    <div className="admin-field">
                        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Éléments inclus</span>
                            <button type="button" onClick={addItem} style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50px', padding: '0.2rem 0.7rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>+ Ajouter</button>
                        </label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                            {form.items.map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>✓</span>
                                    <input value={item} onChange={e => handleItemChange(i, e.target.value)} placeholder={`Élément ${i + 1}`} style={{ flex: 1 }} />
                                    {form.items.length > 1 && <button type="button" onClick={() => removeItem(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><i className="fas fa-times" /></button>}
                                </div>
                            ))}
                        </div>
                    </div>
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
                <h2><i className="fas fa-tags" /> Packs & Offres ({packs.length}/{MAX_PACKS})</h2>
                <button className="btn-admin-save" onClick={openNew} disabled={packs.length >= MAX_PACKS}><i className="fas fa-plus" /> Ajouter</button>
            </div>
            <div className="admin-list">
                {packs.map(p => {
                    const disc = discount(p.originalPrice, p.promoPrice);
                    return (
                        <div key={p.id} className="admin-list-item" style={{ opacity: p.active ? 1 : 0.55 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius)', background: p.featured ? '#e0e7ff' : 'var(--light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <i className="fas fa-tags" style={{ color: p.featured ? '#4f46e5' : 'var(--gray)', fontSize: '1.1rem' }} />
                            </div>
                            <div className="admin-list-item-info" style={{ flex: 1 }}>
                                <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{p.title}{p.featured && <span style={{ background: '#e0e7ff', color: '#4f46e5', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '50px', fontWeight: 700 }}>⭐</span>}{!p.active && <span style={{ background: '#f1f5f9', color: '#94a3b8', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '50px', fontWeight: 700 }}>Masqué</span>}</strong>
                                <span style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                    <span style={{ textDecoration: 'line-through', color: 'var(--gray)', fontSize: '0.8rem' }}>{formatPrice(p.originalPrice)}</span>
                                    <strong style={{ color: 'var(--primary)' }}>{formatPrice(p.promoPrice)} {p.currency}</strong>
                                    {disc > 0 && <span style={{ background: '#fee2e2', color: '#dc2626', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '50px', fontWeight: 700 }}>−{disc}%</span>}
                                    {p.expiresAt && <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}><i className="fas fa-clock" /> {p.expiresAt}</span>}
                                </span>
                            </div>
                            <div className="admin-list-item-actions">
                                <button onClick={() => toggleActive(p)} title={p.active ? 'Masquer' : 'Afficher'} style={{ padding: '0.45rem 0.7rem', fontSize: '0.8rem', borderRadius: 'var(--radius)', border: '1.5px solid var(--gray-light)', background: 'white', cursor: 'pointer', color: p.active ? '#22c55e' : 'var(--gray)' }}><i className={`fas ${p.active ? 'fa-eye' : 'fa-eye-slash'}`} /></button>
                                <button className="btn-admin-save" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }} onClick={() => openEdit(p)}><i className="fas fa-pen" /></button>
                                <button className="btn-admin-danger" onClick={() => handleDelete(p)}><i className="fas fa-trash" /></button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
