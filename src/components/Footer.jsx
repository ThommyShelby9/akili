import { Link } from 'react-router-dom'
import AkiliLogo from './AkiliLogo'

export default function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand">
          <Link to="/" className="logo">
            <AkiliLogo variant="nav" light />
          </Link>
          <p>L'automatisation pour tous. Pensé à Cotonou, pour le monde entier.</p>
        </div>
        <div className="footer-cols">
          <div className="footer-col">
            <div className="footer-col-title">Produit</div>
            <Link to="/services">Services</Link>
            <Link to="/pricing">Tarifs</Link>
            <Link to="/docs">Documentation</Link>
            <Link to="/login">Commencer</Link>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Entreprise</div>
            <Link to="/about">À propos</Link>
            <Link to="/contact">Contact</Link>
            <a href="#">Mentions légales</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Akili.</span>
        <div className="footer-bottom-links">
          <a href="#">Legal</a>
          <a href="#">Privacy</a>
        </div>
      </div>
    </footer>
  )
}
