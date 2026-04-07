import { useState } from 'react';
import ImagePickerModal from './ImagePickerModal';

export default function ImageUrlField({ label, value, onChange, preview = true }) {
  const [showPicker, setShowPicker] = useState(false);

  const handleSelect = (url) => {
    onChange(url);
  };

  return (
    <div className="admin-field">
      {label && <label>{label}</label>}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }} className="admin-img-url-wrap">
        <input
          type="url"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Collez une URL d'image"
          style={{ flex: 1 }}
        />
        <button
          type="button"
          onClick={() => setShowPicker(true)}
          title="Choisir une image gratuite"
          style={{
            padding: '0.5rem 0.75rem',
            background: 'var(--light-2)',
            color: 'var(--primary)',
            border: '1.5px solid var(--primary)',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            whiteSpace: 'nowrap'
          }}
        >
          <i className="fas fa-images" />
          <span className="hide-mobile">Galerie</span>
        </button>
        <label className="btn-admin-add" style={{ width: 'auto', margin: 0, cursor: 'pointer', padding: '0.5rem 0.75rem' }}>
          <i className="fas fa-upload" />
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => {
              if (e.target.files[0]) {
                onChange(URL.createObjectURL(e.target.files[0]));
              }
            }}
          />
        </label>
      </div>
      {preview && value && (
        <img src={value} alt="" className="img-preview" style={{ maxHeight: 150, borderRadius: 'var(--radius)' }} />
      )}
      
      <ImagePickerModal
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={handleSelect}
      />
    </div>
  );
}
