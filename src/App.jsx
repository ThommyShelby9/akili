import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './features/auth/AuthContext'
import ProtectedRoute from './features/auth/ProtectedRoute'
import PageTransition from './components/PageTransition'
import ScrollToTop from './components/ScrollToTop'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Services from './pages/Services'
import Pricing from './pages/Pricing'
import Docs from './pages/Docs'
import Contact from './pages/Contact'
import About from './pages/About'
import AdminLogin from './pages/AdminLogin'
import Onboarding from './features/onboarding/Onboarding'
import DashboardLayout from './features/dashboard/DashboardLayout'
import Dashboard from './features/dashboard/Dashboard'
import ScriptLibrary from './features/scripts/ScriptLibrary'
import ScriptDetail from './features/scripts/ScriptDetail'
import ExecutionLogs from './features/logs/ExecutionLogs'
import Settings from './features/account/Settings'
import AdminLayout from './features/admin/AdminLayout'
import AdminDashboard from './features/admin/AdminDashboard'
import UserManagement from './features/admin/UserManagement'
import SystemLogs from './features/admin/SystemLogs'
import Alerts from './features/admin/Alerts'
import './styles/tokens.css'
import './styles/global.css'
import './styles/landing.css'
import './styles/login.css'
import './styles/features.css'
import './styles/pricing.css'
import './styles/docs.css'
import './styles/contact.css'
import './styles/onboarding.css'
import './styles/dashboard.css'
import './styles/about.css'
import './styles/admin-login.css'
import './styles/admin.css'

export default function App() {
  const location = useLocation()

  return (
    <AuthProvider>
      <ScrollToTop />
      <PageTransition key={location.pathname}>
      <Routes>
        {/* Pages publiques */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/services" element={<Services />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Onboarding */}
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        } />

        {/* Dashboard (nested routes) */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="scripts" element={<ScriptLibrary />} />
          <Route path="scripts/:slug" element={<ScriptDetail />} />
          <Route path="logs" element={<ExecutionLogs />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Admin (nested routes) */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="logs" element={<SystemLogs />} />
          <Route path="alerts" element={<Alerts />} />
        </Route>
      </Routes>
      </PageTransition>
    </AuthProvider>
  )
}

