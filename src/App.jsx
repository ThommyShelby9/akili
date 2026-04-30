import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Services from './pages/Services'
import Pricing from './pages/Pricing'
import Docs from './pages/Docs'
import './styles/tokens.css'
import './styles/global.css'
import './styles/landing.css'
import './styles/login.css'
import './styles/features.css'
import './styles/pricing.css'
import './styles/docs.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/services" element={<Services />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/docs" element={<Docs />} />
    </Routes>
  )
}
