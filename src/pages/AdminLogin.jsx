import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Seo from '../components/Seo'
import AkiliLogo from '../components/AkiliLogo'
import { supabase } from '../lib/supabase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // 1. Connexion
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) throw authError

      // 2. Vérifier le rôle
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single()

      if (profileData?.role !== 'admin') {
        await supabase.auth.signOut()
        setError('Accès refusé. Ce compte n\'a pas les droits administrateur.')
        setLoading(false)
        return
      }

      // 3. Rediriger
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(
        err.message === 'Invalid login credentials'
          ? 'Identifiants incorrects'
          : err.message || 'Erreur de connexion'
      )
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <Seo title="Admin — Connexion" noindex />

      <div className="admin-login-card">
        <div className="admin-login-header">
          <AkiliLogo variant="auth" light />
          <div className="admin-login-badge">Administration</div>
        </div>

        <h1>Espace Administrateur</h1>
        <p>Connectez-vous avec un compte administrateur.</p>

        {error && <div className="admin-login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="admin-login-field">
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              placeholder="admin@akili.dev"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="admin-login-field">
            <label htmlFor="admin-pwd">Mot de passe</label>
            <input
              id="admin-pwd"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="admin-login-submit" type="submit" disabled={loading}>
            {loading ? 'Vérification...' : 'Accéder à l\'administration'}
          </button>
        </form>

        <a href="/login" className="admin-login-back">← Connexion utilisateur</a>
      </div>
    </div>
  )
}
