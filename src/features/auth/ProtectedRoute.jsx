import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  // Pas connecté
  if (!user) {
    if (requiredRole === 'admin') {
      return <Navigate to="/admin/login" replace />
    }
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Rôle requis — vérifier le profil
  if (requiredRole) {
    if (!profile) {
      return (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
        </div>
      )
    }
    if (profile.role !== requiredRole) {
      if (requiredRole === 'admin') {
        return <Navigate to="/admin/login" replace />
      }
      return <Navigate to="/dashboard" replace />
    }
  }

  return children
}
