import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const close = () => setMenuOpen(false)
  const isActive = (path) => location.pathname === path ? 'active' : undefined

  return (
    <>
      <div className="nav-wrap">
        <nav className="nav">
          <Link to="/" className="logo">
            <img src="/2.png" alt="Akili" className="logo-img" />
          </Link>
          <div className="nav-links">
            <Link to="/#fonctionnalites">Tarification</Link>
            <Link to="/services" className={isActive('/services')}>Services</Link>
            <Link to="/docs" className={isActive('/docs')}>Docs</Link>
            <Link to="/#integrations">Intégrations</Link>
            <Link to="/pricing" className={isActive('/pricing')}>Tarifs</Link>
            <Link to="/login" className="nav-cta">Commencer →</Link>
          </div>
          <button
            className={`nav-burger${menuOpen ? ' active' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Ouvrir le menu"
          >
            <span></span><span></span><span></span>
          </button>
        </nav>
      </div>

      <div className={`nav-mobile${menuOpen ? ' open' : ''}`} role="dialog" aria-label="Navigation">
        <button className="nav-mobile-close" onClick={close} aria-label="Fermer">✕</button>
        <Link to="/#fonctionnalites" onClick={close}>Tarification</Link>
        <Link to="/services" className={isActive('/services')} onClick={close}>Services</Link>
        <Link to="/docs" className={isActive('/docs')} onClick={close}>Docs</Link>
        <Link to="/#integrations" onClick={close}>Intégrations</Link>
        <Link to="/pricing" className={isActive('/pricing')} onClick={close}>Tarifs</Link>
        <Link to="/login" className="nav-cta btn-primary" onClick={close}>Commencer →</Link>
      </div>
    </>
  )
}
