import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileCode, Clock, Settings, LogOut } from 'lucide-react'
import AkiliLogo from '../../components/AkiliLogo'
import { useAuth } from '../auth/AuthContext'

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Accueil', end: true },
  { to: '/dashboard/scripts', icon: FileCode, label: 'Scripts' },
  { to: '/dashboard/logs', icon: Clock, label: 'Logs' },
  { to: '/dashboard/settings', icon: Settings, label: 'Paramètres' },
]

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-sidebar-top">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <AkiliLogo variant="nav" light />
          </Link>
        </div>

        <nav className="dash-nav">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `dash-nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="dash-sidebar-bottom">
          <div className="dash-user">
            <div className="dash-user-avatar">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="dash-user-info">
              <span className="dash-user-name">{user?.user_metadata?.full_name || 'Utilisateur'}</span>
              <span className="dash-user-plan">Plan gratuit</span>
            </div>
          </div>
          <button className="dash-logout" onClick={handleLogout}>
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="dash-main">
        <Outlet />
      </main>
    </div>
  )
}
