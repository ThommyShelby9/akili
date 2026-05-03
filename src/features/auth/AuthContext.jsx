import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const initialized = useRef(false)

  async function loadProfile(userId) {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      setProfile(data || { id: userId, role: 'user', plan: 'free', quota_used: 0, quota_limit: 10 })
    } catch {
      setProfile({ id: userId, role: 'user', plan: 'free', quota_used: 0, quota_limit: 10 })
    }
  }

  useEffect(() => {
    // 1. Charger la session au démarrage
    supabase.auth.getSession().then(({ data: { session } }) => {
      const authUser = session?.user ?? null
      setUser(authUser)

      if (authUser) {
        loadProfile(authUser.id).finally(() => {
          setLoading(false)
          initialized.current = true
        })
      } else {
        setLoading(false)
        initialized.current = true
      }
    }).catch(() => {
      setLoading(false)
      initialized.current = true
    })

    // 2. Écouter les changements (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Ignorer le premier événement si on a déjà initialisé via getSession
      if (!initialized.current) return

      const authUser = session?.user ?? null
      setUser(authUser)

      if (authUser) {
        loadProfile(authUser.id)
      } else {
        setProfile(null)
      }
    })

    // 3. Timeout de sécurité — ne jamais rester bloqué en loading
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false)
        initialized.current = true
      }
    }, 3000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  async function signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName } }
    })
    if (error) throw error
    return data
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    // Mettre à jour immédiatement sans attendre onAuthStateChange
    setUser(data.user)
    loadProfile(data.user.id)
    return data
  }

  async function signInWithOAuth(provider) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin + '/dashboard' }
    })
    if (error) throw error
    return data
  }

  async function resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/login?reset=true'
    })
    if (error) throw error
  }

  async function logout() {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const value = { user, profile, loading, signUp, signIn, signInWithOAuth, resetPassword, logout }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
