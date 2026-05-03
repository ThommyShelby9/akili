import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Seo from '../components/Seo'
import { useAuth } from '../features/auth/AuthContext'

export default function Login() {
  const [activeTab, setActiveTab] = useState('login')
  const [showPwd, setShowPwd] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [confirmEmail, setConfirmEmail] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const { signUp, signIn, signInWithOAuth, resetPassword } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (activeTab === 'login') {
        await signIn(email, password)
        navigate(from, { replace: true })
      } else {
        await signUp(email, password, fullName)
        setConfirmEmail(true)
      }
    } catch (err) {
      setError(err.message === 'Invalid login credentials'
        ? 'Email ou mot de passe incorrect'
        : err.message === 'User already registered'
        ? 'Cet email est déjà utilisé'
        : err.message || 'Une erreur est survenue'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleOAuth(provider) {
    try {
      await signInWithOAuth(provider)
    } catch (err) {
      setError(err.message || 'Erreur de connexion OAuth')
    }
  }

  async function handleReset() {
    if (!email) {
      setError('Entre ton email pour réinitialiser')
      return
    }
    setError('')
    setLoading(true)
    try {
      await resetPassword(email)
      setResetSent(true)
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'envoi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-shell" data-screen-label="Login">
      <Seo title="Connexion" noindex />

      {/* CANVAS DE MARQUE (gauche) */}
      <aside className="brand-side">
        <div className="brand-top">
          <img src="/2.png" alt="Akili" className="logo-img" />
        </div>
        <div className="brand-art" aria-hidden="true">
          <span className="blk p span2"></span>
          <span className="blk k"></span>
          <span className="blk b row2"></span>
          <span className="blk k"></span>
          <span className="blk y"></span>
          <span className="blk k"></span>
          <span className="blk y"></span>
          <span className="blk p"></span>
          <span className="blk k span2"></span>
          <span className="blk b"></span>
          <span className="blk k span3"></span>
          <span className="blk p"></span>
          <span className="blk y"></span>
        </div>
        <div className="brand-claim">
          <div className="eyebrow">Bienvenue</div>
          <h2>L'automatisation,<br />sans le mode <em><span>d'emploi</span></em>.</h2>
          <p>Reprends le contrôle de tes heures. Akili exécute. Tu décides.</p>
        </div>
        <div className="brand-foot">
          <span className="pulse-dot"><i></i> Tous les services opérationnels</span>
          <span>v0.1 · cotonou</span>
        </div>
      </aside>

      {/* FORMULAIRE (droite) */}
      <main className="form-side">
        <div className="form-top">
          {activeTab === 'login'
            ? <>Pas de compte ? &nbsp;<button className="link-btn" onClick={() => setActiveTab('signup')}>Créer un compte →</button></>
            : <>Déjà un compte ? &nbsp;<button className="link-btn" onClick={() => setActiveTab('login')}>Se connecter →</button></>
          }
        </div>

        <div className="form-wrap">
          <h1>{activeTab === 'login' ? 'Bon retour.' : 'Crée ton compte.'}</h1>
          <p>{activeTab === 'login'
            ? 'Connecte-toi pour reprendre tes automatisations là où tu les avais laissées.'
            : 'Commence à automatiser tes tâches en quelques minutes.'
          }</p>

          <div className="tabs">
            <button className={activeTab === 'login' ? 'active' : ''} onClick={() => { setActiveTab('login'); setError('') }}>Connexion</button>
            <button className={activeTab === 'signup' ? 'active' : ''} onClick={() => { setActiveTab('signup'); setError('') }}>Inscription</button>
          </div>

          <div className="oauth">
            <button type="button" onClick={() => handleOAuth('google')}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button type="button" onClick={() => handleOAuth('github')}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.69-3.87-1.54-3.87-1.54-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.16-1.18 3.16-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.15 0 1.55-.01 2.8-.01 3.18 0 .31.21.67.8.56C20.21 21.39 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z" />
              </svg>
              GitHub
            </button>
          </div>

          <div className="divider">ou avec ton email</div>

          {error && <div className="form-error">{error}</div>}
          {resetSent && <div className="form-success">Email de réinitialisation envoyé ! Vérifie ta boîte.</div>}
          {confirmEmail && (
            <div className="form-success">
              Compte créé ! Vérifie ta boîte email pour confirmer ton adresse, puis connecte-toi.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {activeTab === 'signup' && (
              <div className="field">
                <label htmlFor="fullname">Nom complet</label>
                <div className="input-wrap">
                  <span className="icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M20 21a8 8 0 0 0-16 0" />
                    </svg>
                  </span>
                  <input
                    id="fullname"
                    type="text"
                    placeholder="Ton nom"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="field">
              <label htmlFor="email">Email</label>
              <div className="input-wrap">
                <span className="icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="toi@akili.dev"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="pwd">
                Mot de passe
                {activeTab === 'login' && (
                  <button type="button" className="link-btn" onClick={handleReset}>oublié ?</button>
                )}
              </label>
              <div className="input-wrap">
                <span className="icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="11" width="16" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                </span>
                <input
                  id="pwd"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button className="toggle-pwd" type="button" onClick={() => setShowPwd(p => !p)}>
                  {showPwd ? 'MASQUER' : 'AFFICHER'}
                </button>
              </div>
            </div>

            {activeTab === 'login' && (
              <div className="row">
                <label className="check">
                  <input type="checkbox" defaultChecked />
                  <span className="box"></span>
                  Garder ma session active
                </label>
              </div>
            )}

            <button className="submit" type="submit" disabled={loading}>
              {loading
                ? 'Chargement...'
                : activeTab === 'login' ? 'Entrer dans Akili' : 'Créer mon compte'
              }
              {!loading && <span className="arrow">→</span>}
            </button>

            <p className="legal">
              En continuant, tu acceptes nos <a href="#">conditions</a> et notre <a href="#">politique de confidentialité</a>.
            </p>
          </form>
        </div>

        <div className="form-foot">
          <span>FR · Français</span>
          <Link to="/">← Retour à l'accueil</Link>
        </div>
      </main>
    </div>
  )
}
