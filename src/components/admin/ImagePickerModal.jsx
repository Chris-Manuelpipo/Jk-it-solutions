import { useState, useEffect, useRef } from 'react';
import { FREE_IMAGES, CATEGORIES } from '../../data/freeImages';

export default function ImagePickerModal({ isOpen, onClose, onSelect }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tous');
  const [loadingImage, setLoadingImage] = useState(null);
  const modalRef = useRef(null);

  const filteredImages = FREE_IMAGES.filter(img => {
    const matchesSearch = img.title.toLowerCase().includes(search.toLowerCase()) ||
                          img.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'Tous' || img.category === category;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    if (!isOpen) {
      setSearch('');
      setCategory('Tous');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (url) => {
    onSelect(url);
    onClose();
  };

  return (
    <>
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
        backdropFilter: 'blur(4px)'
      }} />
      <div ref={modalRef} style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: 800,
        maxHeight: '85vh',
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
        zIndex: 1001,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--gray-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <i className="fas fa-images" style={{ color: 'var(--primary)', fontSize: '1.25rem' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Images gratuites</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--gray)', background: 'var(--light)', padding: '0.15rem 0.5rem', borderRadius: '50px' }}>
              {filteredImages.length} images
            </span>
          </div>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--gray)',
            fontSize: '1.2rem',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i className="fas fa-times" />
          </button>
        </div>

        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--gray-light)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          flexShrink: 0
        }}>
          <input
            type="text"
            placeholder="Rechercher une image..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.9rem',
              border: '1.5px solid var(--gray-light)',
              borderRadius: 'var(--radius)',
              fontSize: '0.88rem',
              fontFamily: 'var(--font-body)',
              outline: 'none'
            }}
          />
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '0.35rem 0.75rem',
                  border: '1.5px solid',
                  borderColor: category === cat ? 'var(--primary)' : 'var(--gray-light)',
                  borderRadius: '50px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: category === cat ? 'var(--primary)' : 'white',
                  color: category === cat ? 'white' : 'var(--gray)',
                  transition: 'var(--transition)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem 1.5rem'
        }}>
          {filteredImages.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: 'var(--gray)'
            }}>
              <i className="fas fa-search" style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }} />
              <p>Aucune image trouvée</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '0.75rem'
            }}>
              {filteredImages.map((img, index) => (
                <div
                  key={`${img.url}-${index}`}
                  onClick={() => handleSelect(img.url)}
                  style={{
                    position: 'relative',
                    borderRadius: 'var(--radius)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: '2px solid transparent',
                    transition: 'var(--transition)',
                    background: 'var(--light)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: 100,
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    onError={e => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.background = 'var(--gray-light)';
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    padding: '0.5rem',
                    color: 'white',
                    fontSize: '0.65rem'
                  }}>
                    <div style={{ fontWeight: 600 }}>{img.title}</div>
                    <div style={{ opacity: 0.7, fontSize: '0.6rem' }}>{img.category}</div>
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: '0.35rem',
                    right: '0.35rem',
                    background: 'var(--primary)',
                    color: 'white',
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    opacity: 0,
                    transition: 'var(--transition)'
                  }}
                  className="select-icon"
                  >
                    <i className="fas fa-check" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--gray-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
          background: 'var(--light)'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>
            Source: Unsplash 
          </span>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              background: 'var(--gray-light)',
              color: 'var(--dark)',
              border: 'none',
              borderRadius: 'var(--radius)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Fermer
          </button>
        </div>
      </div>

      <style>{`
        .image-picker-grid > div:hover .select-icon { opacity: 1 !important; }
      `}</style>
    </>
  );
}
