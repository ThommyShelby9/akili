import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, Activity, AlertTriangle, LogOut, ArrowLeft } from 'lucide-react'
import AkiliLogo from '../../components/AkiliLogo'
import { useAuth } from '../auth/AuthContext'

const NAV_ITEMS = [
  { to: '/admin', icon: LayoutDashboard, label: 'Vue globale', end: true },
  { to: '/admin/users', icon: Users, label: 'Utilisateurs' },
  { to: '/admin/logs', icon: Activity, label: 'Logs système' },
  { to: '/admin/alerts', icon: AlertTriangle, label: 'Alertes' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <AkiliLogo variant="nav" light />
          </Link>
          <span className="admin-badge">Admin</span>
        </div>

        <nav className="admin-nav">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <Link to="/dashboard" className="admin-back">
            <ArrowLeft size={14} /> Retour au dashboard
          </Link>
          <button className="admin-logout" onClick={handleLogout}>
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
