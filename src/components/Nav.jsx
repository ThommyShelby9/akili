import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Mail, Phone, X } from 'lucide-react'
import AkiliLogo from './AkiliLogo'

const NAV_ITEMS = [
  { to: '/services', label: 'Services', desc: 'Scripts & automatisations' },
  { to: '/pricing',  label: 'Tarifs',   desc: 'Plans & abonnements' },
  { to: '/docs',     label: 'Docs',     desc: 'Guides & ressources' },
  { to: '/about',    label: 'À propos', desc: 'Notre mission' },
  { to: '/contact',  label: 'Contact',  desc: 'Parlons de ton projet' },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const close = () => setMenuOpen(false)
  const isActive = (path) => location.pathname === path

  return (
    <>
      <div className="nav-wrap">
        <nav className="nav">
          <Link to="/" className="logo">
            <AkiliLogo variant="nav" light />
          </Link>
          <div className="nav-links">
            {NAV_ITEMS.map(item => (
              <Link key={item.to} to={item.to} className={isActive(item.to) ? 'active' : undefined}>
                {item.label}
              </Link>
            ))}
            <Link to="/login" className="nav-cta">Commencer →</Link>
          </div>
          <button
            className={`nav-burger${menuOpen ? ' active' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
          >
            <span></span><span></span><span></span>
          </button>
        </nav>
      </div>

      <div
        className={`nav-mobile-backdrop${menuOpen ? ' open' : ''}`}
        onClick={close}
        aria-hidden="true"
      />

      <aside
        className={`nav-mobile${menuOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation principale"
      >
        <header className="nav-mobile-header">
          <Link to="/" className="nav-mobile-logo" onClick={close}>
            <AkiliLogo variant="nav" light />
          </Link>
          <button className="nav-mobile-close" onClick={close} aria-label="Fermer">
            <X size={22} />
          </button>
        </header>

        <nav className="nav-mobile-list">
          {NAV_ITEMS.map((item, i) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={close}
              className={`nav-mobile-item${isActive(item.to) ? ' active' : ''}`}
              style={{ '--i': i }}
            >
              <div>
                <span className="nav-mobile-item-label">{item.label}</span>
                <span className="nav-mobile-item-desc">{item.desc}</span>
              </div>
              <ArrowRight size={18} className="nav-mobile-item-arrow" />
            </Link>
          ))}
        </nav>

        <div className="nav-mobile-cta">
          <Link to="/login" className="nav-mobile-cta-btn" onClick={close}>
            Commencer maintenant
            <ArrowRight size={16} />
          </Link>
        </div>

        <footer className="nav-mobile-footer">
          <a href="mailto:contact@akili.dev" className="nav-mobile-footer-link">
            <Mail size={14} /> contact@akili.dev
          </a>
          <a href="tel:+22900000000" className="nav-mobile-footer-link">
            <Phone size={14} /> Cotonou, Bénin
          </a>
        </footer>
      </aside>
    </>
  )
}
