import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './features/auth/AuthContext'
import ProtectedRoute from './features/auth/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Services from './pages/Services'
import Pricing from './pages/Pricing'
import Docs from './pages/Docs'
import Contact from './pages/Contact'
import Onboarding from './features/onboarding/Onboarding'
import DashboardLayout from './features/dashboard/DashboardLayout'
import Dashboard from './features/dashboard/Dashboard'
import ScriptLibrary from './features/scripts/ScriptLibrary'
import ScriptDetail from './features/scripts/ScriptDetail'
import ExecutionLogs from './features/logs/ExecutionLogs'
import Settings from './features/account/Settings'
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

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Pages publiques */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/services" element={<Services />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/contact" element={<Contact />} />

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
      </Routes>
    </AuthProvider>
  )
}

