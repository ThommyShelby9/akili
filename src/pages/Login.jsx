import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Seo from '../components/Seo'
import AkiliLogo from '../components/AkiliLogo'
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
          <AkiliLogo variant="auth" light />
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
          <Link to="/">← Retour à l'accueil</Link>
        </div>
      </main>
    </div>
  )
}
