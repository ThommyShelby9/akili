import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand">
          <Link to="/" className="logo">
            <img src="/2.png" alt="Akili" className="logo-img" />
          </Link>
          <p>L'automatisation pour tous. Pensé à Cotonou, pour le monde entier.</p>
        </div>
        <div className="footer-cols">
          <div className="footer-col">
            <div className="footer-col-title">Produit</div>
            <Link to="/services">Services</Link>
            <Link to="/pricing">Tarifs</Link>
            <a href="#">Changelog</a>
            <a href="#">Docs</a>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Entreprise</div>
            <a href="#">À propos</a>
            <a href="#">Blog</a>
            <a href="#">Carrières</a>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Légal</div>
            <a href="#">Mentions légales</a>
            <a href="#">Confidentialité</a>
            <a href="#">CGU</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="made">
          <span className="flag"><i></i><i></i><i></i></span>
          Made in Cotonou · 2026
        </div>
        <div className="social">
          <a href="#">Twitter</a>
          <a href="#">GitHub</a>
          <a href="#">contact@akili.dev</a>
        </div>
      </div>
    </footer>
  )
}
