import { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { createService, updateService, deleteService } from '../../api/strapiAdmin';

const emptyService = { id: null, strapiId: null, icon: 'fa-shield-halved', title: '', description: '', active: true };

const ICONS = [
  { name: 'Shield', value: 'fa-shield-halved' },
  { name: 'Shield Check', value: 'fa-shield-check' },
  { name: 'Shield Virus', value: 'fa-shield-virus' },
  { name: 'Shield Dog', value: 'fa-shield-dog' },
  { name: 'Lock', value: 'fa-lock' },
  { name: 'Lock Open', value: 'fa-lock-open' },
  { name: 'Key', value: 'fa-key' },
  { name: 'Key Skeleton', value: 'fa-keySkeleton' },
  { name: 'User Shield', value: 'fa-user-shield' },
  { name: 'User Lock', value: 'fa-user-lock' },
  { name: 'User Secret', value: 'fa-user-secret' },
  { name: 'Fingerprint', value: 'fa-fingerprint' },
  { name: 'Eye', value: 'fa-eye' },
  { name: 'Eye Slash', value: 'fa-eye-slash' },
  { name: 'Eye Low Vision', value: 'fa-eye-low-vision' },
  { name: 'Bug', value: 'fa-bug' },
  { name: 'Bug Slash', value: 'fa-bug-slash' },
  { name: 'Skull Crossbones', value: 'fa-skull-crossbones' },
  { name: 'Virus', value: 'fa-virus' },
  { name: 'Server', value: 'fa-server' },
  { name: 'Server Rack', value: 'fa-server' },
  { name: 'Network Wired', value: 'fa-network-wired' },
  { name: 'Ethernet', value: 'fa-ethernet' },
  { name: 'Wifi', value: 'fa-wifi' },
  { name: 'Wifi Strong', value: 'fa-wifi' },
  { name: 'Wifi Weak', value: 'fa-wifi' },
  { name: 'Bluetooth', value: 'fa-bluetooth' },
  { name: 'Hotspot', value: 'fa-hotspot' },
  { name: 'Laptop', value: 'fa-laptop' },
  { name: 'Laptop Code', value: 'fa-laptop-code' },
  { name: 'Laptop File', value: 'fa-laptop-file' },
  { name: 'Desktop', value: 'fa-desktop' },
  { name: 'Desktop Arrow Down', value: 'fa-desktop-arrow-down' },
  { name: 'Mobile', value: 'fa-mobile-screen' },
  { name: 'Mobile Button', value: 'fa-mobile-screen-button' },
  { name: 'Tablet', value: 'fa-tablet-screen-button' },
  { name: 'Cloud', value: 'fa-cloud' },
  { name: 'Cloud Arrow Up', value: 'fa-cloud-arrow-up' },
  { name: 'Cloud Arrow Down', value: 'fa-cloud-arrow-down' },
  { name: 'Cloud Sun', value: 'fa-cloud-sun' },
  { name: 'Cloud Bolt', value: 'fa-cloud-bolt' },
  { name: 'Database', value: 'fa-database' },
  { name: 'Database Lock', value: 'fa-database-lock' },
  { name: 'Hard Drives', value: 'fa-hard-drives' },
  { name: 'Memory', value: 'fa-memory' },
  { name: 'Microchip', value: 'fa-microchip' },
  { name: 'Cpu', value: 'fa-microchip' },
  { name: 'Code', value: 'fa-code' },
  { name: 'Code Branch', value: 'fa-code-branch' },
  { name: 'Code Commit', value: 'fa-code-commit' },
  { name: 'Code Merge', value: 'fa-code-merge' },
  { name: 'Code Pull Request', value: 'fa-code-pull-request' },
  { name: 'Terminal', value: 'fa-terminal' },
  { name: 'Terminal Cross', value: 'fa-terminal' },
  { name: 'File Code', value: 'fa-file-code' },
  { name: 'File Lines', value: 'fa-file-lines' },
  { name: 'File', value: 'fa-file' },
  { name: 'File Shield', value: 'fa-file-shield' },
  { name: 'File Lock', value: 'fa-file-shield' },
  { name: 'Globe', value: 'fa-globe' },
  { name: 'Globe Africa', value: 'fa-earth-africa' },
  { name: 'Globe Americas', value: 'fa-earth-americas' },
  { name: 'Globe Asia', value: 'fa-earth-asia' },
  { name: 'Earth Europe', value: 'fa-earth-europe' },
  { name: 'Link', value: 'fa-link' },
  { name: 'Link Slash', value: 'fa-link-slash' },
  { name: 'Share Nodes', value: 'fa-share-nodes' },
  { name: 'Share', value: 'fa-share' },
  { name: 'Broadcast Tower', value: 'fa-tower-broadcast' },
  { name: 'Satellite Dish', value: 'fa-satellite-dish' },
  { name: 'Signal', value: 'fa-signal' },
  { name: 'Signal Good', value: 'fa-signal-bars-strong' },
  { name: 'Signal Weak', value: 'fa-signal-bars-weak' },
  { name: 'Satellite', value: 'fa-satellite' },
  { name: 'Phone', value: 'fa-phone' },
  { name: 'Phone Flip', value: 'fa-phone-flip' },
  { name: 'Phone Volume', value: 'fa-phone-volume' },
  { name: 'Video', value: 'fa-video' },
  { name: 'Video Slash', value: 'fa-video-slash' },
  { name: 'Camera', value: 'fa-camera' },
  { name: 'Camera Slash', value: 'fa-camera-slash' },
  { name: 'Video Camera', value: 'fa-video' },
  { name: 'Film', value: 'fa-film' },
  { name: 'Tv', value: 'fa-tv' },
  { name: 'Monitor', value: 'fa-display' },
  { name: 'Projector', value: 'fa-projector' },
  { name: 'Gear', value: 'fa-gear' },
  { name: 'Gears', value: 'fa-gears' },
  { name: 'Wrench', value: 'fa-wrench' },
  { name: 'Wrench Simple', value: 'fa-wrench-simple' },
  { name: 'Screwdriver Wrench', value: 'fa-screwdriver-wrench' },
  { name: 'Hammer', value: 'fa-hammer' },
  { name: 'Tools', value: 'fa-screwdriver-wrench' },
  { name: 'Toolbox', value: 'fa-toolbox' },
  { name: 'Computer', value: 'fa-computer' },
  { name: 'Computer Mouse', value: 'fa-computer-mouse' },
  { name: 'Keyboard', value: 'fa-keyboard' },
  { name: 'Print', value: 'fa-print' },
  { name: 'Router', value: 'fa-router' },
  { name: 'Bandwidth', value: 'fa-bars-staggered' },
  { name: 'Chart Line', value: 'fa-chart-line' },
  { name: 'Chart Bar', value: 'fa-chart-bar' },
  { name: 'Chart Pie', value: 'fa-chart-pie' },
  { name: 'Chart Simple', value: 'fa-chart-simple' },
  { name: 'Graduation Cap', value: 'fa-graduation-cap' },
  { name: 'Book', value: 'fa-book' },
  { name: 'Book Open', value: 'fa-book-open' },
  { name: 'Book Skull', value: 'fa-book-skull' },
  { name: 'Chalkboard', value: 'fa-chalkboard-user' },
  { name: 'Chalkboard Teacher', value: 'fa-chalkboard-teacher' },
  { name: 'Certificate', value: 'fa-certificate' },
  { name: 'Award', value: 'fa-award' },
  { name: 'Trophy', value: 'fa-trophy' },
  { name: 'Medal', value: 'fa-medal' },
  { name: 'Ribbon', value: 'fa-ribbon' },
  { name: 'Scroll', value: 'fa-scroll' },
  { name: 'Diploma', value: 'fa-certificate' },
  { name: 'User Graduate', value: 'fa-user-graduate' },
  { name: 'People Group', value: 'fa-people-group' },
  { name: 'Users', value: 'fa-users' },
  { name: 'User', value: 'fa-user' },
  { name: 'User Plus', value: 'fa-user-plus' },
  { name: 'User Minus', value: 'fa-user-minus' },
  { name: 'User Check', value: 'fa-user-check' },
  { name: 'User Xmark', value: 'fa-user-xmark' },
  { name: 'Headset', value: 'fa-headset' },
  { name: 'Headphones', value: 'fa-headphones' },
  { name: 'Microphone', value: 'fa-microphone' },
  { name: 'Microphone Slash', value: 'fa-microphone-slash' },
  { name: 'Envelope', value: 'fa-envelope' },
  { name: 'Envelope Open', value: 'fa-envelope-open' },
  { name: 'Envelope Circle Check', value: 'fa-envelope-circle-check' },
  { name: 'Message', value: 'fa-comment' },
  { name: 'Message Sms', value: 'fa-comment-sms' },
  { name: 'Comments', value: 'fa-comments' },
  { name: 'Bell', value: 'fa-bell' },
  { name: 'Bell Slash', value: 'fa-bell-slash' },
  { name: 'Bell Ring', value: 'fa-bell' },
  { name: 'Inbox', value: 'fa-inbox' },
  { name: 'Clock', value: 'fa-clock' },
  { name: 'Clock Four', value: 'fa-clock-four' },
  { name: 'Stopwatch', value: 'fa-stopwatch' },
  { name: 'Timer', value: 'fa-stopwatch' },
  { name: 'Hourglass', value: 'fa-hourglass' },
  { name: 'Calendar', value: 'fa-calendar' },
  { name: 'Calendar Check', value: 'fa-calendar-check' },
  { name: 'Calendar Days', value: 'fa-calendar-days' },
  { name: 'Calendar Xmark', value: 'fa-calendar-xmark' },
  { name: 'Check', value: 'fa-check' },
  { name: 'Check Circle', value: 'fa-circle-check' },
  { name: 'Check Double', value: 'fa-check-double' },
  { name: 'Check To Slot', value: 'fa-check-to-slot' },
  { name: 'Circle Check', value: 'fa-circle-check' },
  { name: 'Exclamation', value: 'fa-circle-exclamation' },
  { name: 'Exclamation Triangle', value: 'fa-triangle-exclamation' },
  { name: 'Warning', value: 'fa-triangle-exclamation' },
  { name: 'Info', value: 'fa-circle-info' },
  { name: 'Question', value: 'fa-circle-question' },
  { name: 'Xmark', value: 'fa-xmark' },
  { name: 'Xmark Circle', value: 'fa-circle-xmark' },
  { name: 'Xmark Double', value: 'fa-xmark-double' },
  { name: 'Handshake', value: 'fa-handshake' },
  { name: 'Handshake Simple', value: 'fa-handshake-simple' },
  { name: 'Handshake Angle', value: 'fa-handshake-angle' },
  { name: 'Building', value: 'fa-building' },
  { name: 'Building Columns', value: 'fa-building-columns' },
  { name: 'Bank', value: 'fa-bank' },
  { name: 'University', value: 'fa-university' },
  { name: 'Office', value: 'fa-building' },
  { name: 'Briefcase', value: 'fa-briefcase' },
  { name: 'Briefcase Medical', value: 'fa-briefcase-medical' },
  { name: 'House', value: 'fa-house' },
  { name: 'House Medical', value: 'fa-house-medical' },
  { name: 'House User', value: 'fa-house-user' },
  { name: 'Home', value: 'fa-house' },
  { name: 'Warehouse', value: 'fa-warehouse' },
  { name: 'Industry', value: 'fa-industry' },
  { name: 'Factory', value: 'fa-industry' },
  { name: 'Map', value: 'fa-map' },
  { name: 'Map Location', value: 'fa-map-location' },
  { name: 'Map Pin', value: 'fa-map-pin' },
  { name: 'Location', value: 'fa-location-dot' },
  { name: 'Location Arrow', value: 'fa-location-arrow' },
  { name: 'Crosshair', value: 'fa-crosshairs' },
  { name: 'Brain', value: 'fa-brain' },
  { name: 'Brain Circuit', value: 'fa-brain' },
  { name: 'Lightbulb', value: 'fa-lightbulb' },
  { name: 'Lightbulb Slash', value: 'fa-lightbulb' },
  { name: 'Rocket', value: 'fa-rocket' },
  { name: 'Rocket Launch', value: 'fa-rocket' },
  { name: 'Bolt', value: 'fa-bolt' },
  { name: 'Zap', value: 'fa-bolt' },
  { name: 'Flashlight', value: 'fa-flashlight' },
  { name: 'Fire', value: 'fa-fire' },
  { name: 'Fire Burner', value: 'fa-fire-burner' },
  { name: 'Flame', value: 'fa-fire' },
  { name: 'Explosion', value: 'fa-explosion' },
  { name: 'Virus Slash', value: 'fa-virus-slash' },
  { name: 'Shield Halved', value: 'fa-shield-halved' },
  { name: 'Vault', value: 'fa-vault' },
  { name: 'Safe', value: 'fa-vault' },
  { name: 'Id Card', value: 'fa-id-card' },
  { name: 'Id Badge', value: 'fa-id-badge' },
  { name: 'Passport', value: 'fa-passport' },
  { name: 'Address Card', value: 'fa-address-card' },
  { name: 'Badge Check', value: 'fa-badge-check' },
  { name: 'Folder', value: 'fa-folder' },
  { name: 'Folder Open', value: 'fa-folder-open' },
  { name: 'Folder Tree', value: 'fa-folder-tree' },
  { name: 'Folder Plus', value: 'fa-folder-plus' },
  { name: 'Folder Minus', value: 'fa-folder-minus' },
  { name: 'Folder User', value: 'fa-folder-user' },
  { name: 'Download', value: 'fa-download' },
  { name: 'Upload', value: 'fa-upload' },
  { name: 'Share', value: 'fa-share' },
  { name: 'Share All', value: 'fa-share-all' },
  { name: 'Copy', value: 'fa-copy' },
  { name: 'Clipboard', value: 'fa-clipboard' },
  { name: 'Clipboard List', value: 'fa-clipboard-list' },
  { name: 'Clipboard Check', value: 'fa-clipboard-check' },
  { name: 'Clipboard Question', value: 'fa-clipboard-question' },
  { name: 'Paste', value: 'fa-paste' },
  { name: 'Credit Card', value: 'fa-credit-card' },
  { name: 'Credit Card Back', value: 'fa-credit-card' },
  { name: 'Cart Shopping', value: 'fa-cart-shopping' },
  { name: 'Bag Shopping', value: 'fa-bag-shopping' },
  { name: 'Receipt', value: 'fa-receipt' },
  { name: 'Receipt List', value: 'fa-list-timeline' },
  { name: 'Invoice', value: 'fa-file-invoice' },
  { name: 'Invoice Dollar', value: 'fa-file-invoice-dollar' },
  { name: 'Money Bill', value: 'fa-money-bill' },
  { name: 'Money Bill Transfer', value: 'fa-money-bill-transfer' },
  { name: 'Wallet', value: 'fa-wallet' },
  { name: 'Coins', value: 'fa-coins' },
  { name: 'Dollar Sign', value: 'fa-dollar-sign' },
  { name: 'Euro Sign', value: 'fa-euro-sign' },
  { name: 'Tag', value: 'fa-tag' },
  { name: 'Tags', value: 'fa-tags' },
  { name: 'Tag Slash', value: 'fa-tag' },
  { name: 'Ticket', value: 'fa-ticket' },
  { name: 'Ticket Simple', value: 'fa-ticket-simple' },
  { name: 'Flag', value: 'fa-flag' },
  { name: 'Flag Checkered', value: 'fa-flag-checkered' },
  { name: 'Flag Slash', value: 'fa-flag-slash' },
  { name: 'Star', value: 'fa-star' },
  { name: 'Star Half', value: 'fa-star-half' },
  { name: 'Star Half Stroke', value: 'fa-star-half-stroke' },
  { name: 'Heart', value: 'fa-heart' },
  { name: 'Heart Pulse', value: 'fa-heart-pulse' },
  { name: 'Hand', value: 'fa-hand' },
  { name: 'Hand Fist', value: 'fa-hand-fist' },
  { name: 'Hand Point', value: 'fa-hand-point-up' },
  { name: 'Hand Point Down', value: 'fa-hand-point-down' },
  { name: 'Hand Point Left', value: 'fa-hand-point-left' },
  { name: 'Hand Point Right', value: 'fa-hand-point-right' },
  { name: 'Handshake', value: 'fa-handshake' },
  { name: 'Thumbs Up', value: 'fa-thumbs-up' },
  { name: 'Thumbs Down', value: 'fa-thumbs-down' },
  { name: 'Plug', value: 'fa-plug' },
  { name: 'Plug Circle Bolt', value: 'fa-plug-circle-bolt' },
  { name: 'Plug Circle Xmark', value: 'fa-plug-circle-xmark' },
  { name: 'Power Off', value: 'fa-power-off' },
  { name: 'Power', value: 'fa-power-off' },
  { name: 'Plug', value: 'fa-plug' },
  { name: 'Usb', value: 'fa-usb' },
  { name: 'Memory', value: 'fa-memory' },
  { name: 'Address Book', value: 'fa-address-book' },
  { name: 'Contact Book', value: 'fa-address-book' },
  { name: 'Phone Book', value: 'fa-phone-book' },
  { name: 'Block', value: 'fa-ban' },
  { name: 'Ban', value: 'fa-ban' },
  { name: 'Block Bell', value: 'fa-bell-slash' },
  { name: 'Block User', value: 'fa-user-slash' },
  { name: 'Shield Quarter', value: 'fa-shield-quartered' },
  { name: 'Shield Plus', value: 'fa-shield' },
  { name: 'Shield Minus', value: 'fa-shield' },
  { name: 'Shield Cross', value: 'fa-shield' },
  { name: 'Tower Observation', value: 'fa-tower-observation' },
  { name: 'Tower Cell', value: 'fa-tower-cell' },
  { name: 'Tower Broadcast', value: 'fa-tower-broadcast' },
  { name: 'Antenna', value: 'fa-antenna' },
  { name: 'Pager', value: 'fa-pager' },
  { name: 'Fax', value: 'fa-fax' },
  { name: 'Podcast', value: 'fa-podcast' },
  { name: 'Radio', value: 'fa-radio' },
  { name: 'Tower Control', value: 'fa-tower-control' },
  { name: 'Rss', value: 'fa-rss' },
  { name: 'Wifi Strong', value: 'fa-wifi' },
  { name: 'Wifi Weak', value: 'fa-wifi' },
  { name: 'Cart Flatbed', value: 'fa-cart-flatbed' },
  { name: 'Dolly', value: 'fa-dolly' },
  { name: 'Box', value: 'fa-box' },
  { name: 'Box Archive', value: 'fa-box-archive' },
  { name: 'Box Open', value: 'fa-box-open' },
  { name: 'Box Tissue', value: 'fa-box-tissue' },
  { name: 'Package', value: 'fa-package' },
  { name: 'Package Check', value: 'fa-box-check' },
  { name: 'Package Open', value: 'fa-box-open' },
  { name: 'Boxes Stacked', value: 'fa-boxes-stacked' },
  { name: 'Boxes Packing', value: 'fa-boxes-packing' },
  { name: 'Container Storage', value: 'fa-container-storage' },
  { name: 'Cube', value: 'fa-cube' },
  { name: 'Cubes', value: 'fa-cubes' },
  { name: 'Archive', value: 'fa-archive' },
  { name: 'Tray', value: 'fa-tray' },
  { name: 'Tray Full', value: 'fa-tray-full' },
  { name: 'Tray Empty', value: 'fa-tray' },
];

export default function AdminServices({ onSave }) {
  const { content, refreshContent } = useCMS();
  const [services, setServices] = useState(JSON.parse(JSON.stringify(content.services)));
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyService);
  const [saving, setSaving] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconSearch, setIconSearch] = useState('');

  const openEdit = (s) => { setForm({ ...s }); setEditing(s.id); };
  const openNew = () => { setForm({ ...emptyService, id: Date.now() }); setEditing('new'); };
  const cancelEdit = () => { setEditing(null); setForm(emptyService); };
  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (!form.title || !form.description) return;
    setSaving(true);
    try {
      const payload = { title: form.title, description: form.description, icon: form.icon, active: true };
      if (editing === 'new') {
        await createService(payload);
      } else {
        await updateService(form, payload);
      }
      await refreshContent();
      setServices(content.services);
      onSave('Service sauvegardé !');
      cancelEdit();
    } catch (err) {
      onSave('Erreur: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (s) => {
    if (!confirm('Supprimer ce service ?')) return;
    try {
      await deleteService(s);
      await refreshContent();
      setServices(content.services);
      onSave('Service supprimé.');
    } catch (err) {
      onSave('Erreur: ' + err.message);
    }
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
            <div className="admin-field" style={{ position: 'relative' }}>
              <label>Icône</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }} className="admin-icon-row">
                <div className="admin-icon-preview">
                  <i className={`fas ${form.icon}`} />
                </div>
                <input 
                  name="icon" 
                  value={form.icon} 
                  onChange={handleChange} 
                  placeholder="fa-shield-halved"
                  style={{ flex: 1, minWidth: '120px' }}
                />
                <button 
                  type="button"
                  className="admin-icon-picker-btn"
                  onClick={() => setShowIconPicker(!showIconPicker)}
                >
                  <i className="fas fa-icons" /> Choisir
                </button>
              </div>
              <small style={{ color: 'var(--gray)', fontSize: '0.72rem', marginTop: '0.35rem', display: 'block' }}>
                Plus d'icônes sur <a href="https://fontawesome.com/icons" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>fontawesome.com/icons</a>
              </small>
              {showIconPicker && (
                <div className="admin-icon-picker-modal" style={{ 
                  position: 'absolute', 
                  top: '100%', 
                  left: 0, 
                  right: 0, 
                  background: 'white', 
                  border: '1px solid var(--gray-light)', 
                  borderRadius: 'var(--radius)', 
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 100,
                  maxHeight: '300px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  marginTop: '0.25rem'
                }}>
                  <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--gray-light)', position: 'sticky', top: 0, background: 'white' }}>
                    <input
                      type="text"
                      placeholder="Rechercher une icône..."
                      value={iconSearch}
                      onChange={e => setIconSearch(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--gray-light)', borderRadius: 'var(--radius)', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div style={{ overflowY: 'auto', maxHeight: '250px', padding: '0.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(85px, 1fr))', gap: '0.5rem' }} className="admin-icon-picker-grid">
                      {ICONS.filter(icon => 
                        icon.name.toLowerCase().includes(iconSearch.toLowerCase()) || 
                        icon.value.toLowerCase().includes(iconSearch.toLowerCase())
                      ).map(icon => (
                        <button
                          key={icon.value}
                          type="button"
                          onClick={() => {
                            setForm(p => ({ ...p, icon: icon.value }));
                            setShowIconPicker(false);
                            setIconSearch('');
                          }}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.5rem',
                            border: form.icon === icon.value ? '2px solid var(--primary)' : '1px solid var(--gray-light)',
                            borderRadius: 'var(--radius)',
                            background: form.icon === icon.value ? 'var(--light-2)' : 'white',
                            cursor: 'pointer',
                            transition: 'var(--transition)',
                            fontSize: '0.7rem'
                          }}
                        >
                          <i className={`fas ${icon.value}`} style={{ fontSize: '1.1rem', color: 'var(--primary)' }} />
                          <span style={{ color: 'var(--gray)', textAlign: 'center', lineHeight: 1.2, wordBreak: 'break-word' }}>{icon.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="admin-field">
            <label>Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Description du service..." className="admin-textarea" style={{ width: '100%' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }} className="admin-btn-group">
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
        <h2><i className="fas fa-gears" /> Services ({services.length})</h2>
        <button className="btn-admin-save" onClick={openNew}><i className="fas fa-plus" /> Ajouter</button>
      </div>
      <div className="admin-list">
        {services.map(s => (
          <div key={s.id} className="admin-list-item" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div className="admin-service-icon">
              <i className={`fas ${s.icon}`} />
            </div>
            <div className="admin-list-item-info" style={{ flex: 1, minWidth: '150px' }}>
              <strong>{s.title}</strong>
              <span style={{ wordBreak: 'break-word' }}>{s.description}</span>
            </div>
            <div className="admin-list-item-actions" style={{ flexShrink: 0 }}>
              <button className="btn-admin-save" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }} onClick={() => openEdit(s)}><i className="fas fa-pen" /></button>
              <button className="btn-admin-danger" onClick={() => handleDelete(s)}><i className="fas fa-trash" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
