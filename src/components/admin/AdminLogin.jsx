import { useState } from 'react';
import { loginStrapi } from '../../api/strapiAdmin';
import '../../pages/Admin.css';

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginStrapi(username, password);
      onLogin();
    } catch (err) {
      setError('Identifiants incorrects ou serveur Strapi inaccessible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <div className="logo-icon"><i className="fas fa-shield-halved" /></div>
          <h1>JK IT Solutions</h1>
          <p>Panneau d'administration</p>
        </div>

        {error && (
          <div className="admin-login-error">
            <i className="fas fa-exclamation-circle" /> {error}
          </div>
        )}

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="admin-field">
            <label>Email</label>
            <input
              type="email"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="votre@email.com"
              required
              autoFocus
            />
          </div>
          <div className="admin-field">
            <label>Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)', fontSize: '0.85rem'
                }}
              >
                <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
          </div>

          <button type="submit" className="admin-login-submit" disabled={loading}>
            {loading ? <><i className="fas fa-circle-notch fa-spin" /> Connexion...</> : <><i className="fas fa-sign-in-alt" /> Se connecter</>}
          </button>
        </form>

        <div className="admin-login-hint">
          <i className="fas fa-info-circle" /> Utilisez votre email et mot de passe Strapi
        </div>
      </div>
    </div>
  );
}
