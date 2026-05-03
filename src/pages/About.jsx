import { Link } from 'react-router-dom'
import { MapPin, Target, Users, Zap } from 'lucide-react'
import Seo from '../components/Seo'
import RevealOnScroll from '../components/RevealOnScroll'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const TEAM = [
  { initials: 'TS', name: 'TheSoulReaper', role: 'Fondateur & Lead Dev' },
  { initials: 'AK', name: 'Akili Team', role: 'Design & Produit' },
]

const VALUES = [
  { Icon: Zap, title: 'Simplicité radicale', desc: 'Si tu dois lire un tutoriel de 30 minutes, on a échoué. Akili doit être compris en 5 secondes.' },
  { Icon: MapPin, title: 'Ancré localement', desc: 'Conçu à Cotonou, pour les réalités africaines. Connexions instables, budgets serrés, besoins concrets.' },
  { Icon: Users, title: 'Pour tous', desc: 'Pas besoin d\'être développeur. Si tu sais décrire ce que tu fais, tu sais utiliser Akili.' },
  { Icon: Target, title: 'Impact mesurable', desc: 'Chaque feature doit prouver qu\'elle fait gagner du temps. Pas de fonctionnalité cosmétique.' },
]

export default function About() {
  return (
    <div className="akili">
      <Seo title="À propos" description="Akili est né à Cotonou d'une conviction : l'automatisation ne devrait pas être réservée aux experts. Découvrez notre mission." />
      <Nav />

      {/* Hero */}
      <section className="about-hero">
        <div className="container">
          <div className="eyebrow eyebrow--center">À propos</div>
          <h1>Né à Cotonou.<br /><span className="c-cyan">Pour le monde.</span></h1>
          <p>Akili est né d'une conviction simple : les outils puissants ne devraient pas être réservés aux experts. L'automatisation, c'est de la liberté retrouvée.</p>
        </div>
      </section>

      {/* Mission */}
      <RevealOnScroll>
      <section className="about-mission">
        <div className="container">
          <div className="about-mission-inner">
            <div className="about-mission-text">
              <h2>Notre mission</h2>
              <p>Démocratiser l'automatisation dans les marchés africains. Donner à chaque freelance, chaque PME, chaque développeur le pouvoir de supprimer les tâches répétitives de sa vie — sans écrire une seule ligne de code.</p>
              <p>Les grandes plateformes SaaS ont ignoré l'Afrique trop longtemps. Akili est la réponse : un outil pensé nativement pour les contraintes locales, avec un pricing juste et un support francophone.</p>
            </div>
            <div className="about-mission-stats">
              <div className="about-stat">
                <div className="about-stat-value">2026</div>
                <div className="about-stat-label">Année de création</div>
              </div>
              <div className="about-stat">
                <div className="about-stat-value">Cotonou</div>
                <div className="about-stat-label">Siège</div>
              </div>
              <div className="about-stat">
                <div className="about-stat-value">12+</div>
                <div className="about-stat-label">Scripts disponibles</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </RevealOnScroll>

      {/* Valeurs */}
      <RevealOnScroll>
      <section className="about-values">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 'var(--s-10)' }}>Ce en quoi on croit</h2>
          <div className="about-values-grid">
            {VALUES.map(({ Icon, title, desc }) => (
              <div className="about-value-card" key={title}>
                <div className="about-value-icon"><Icon size={22} /></div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </RevealOnScroll>

      {/* Équipe */}
      <RevealOnScroll>
      <section className="about-team">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 'var(--s-10)' }}>L'équipe</h2>
          <div className="about-team-grid">
            {TEAM.map(({ initials, name, role }) => (
              <div className="about-team-card" key={name}>
                <div className="about-team-avatar">{initials}</div>
                <strong>{name}</strong>
                <span>{role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      </RevealOnScroll>

      {/* CTA */}
      <RevealOnScroll direction="scale">
      <section className="about-cta">
        <div className="container">
          <h2>Envie de nous rejoindre<br />ou de collaborer ?</h2>
          <div className="cta-row cta-row--center">
            <Link to="/contact" className="btn-primary">Nous contacter <span className="arrow">→</span></Link>
            <Link to="/login" className="btn-ghost">Essayer Akili</Link>
          </div>
        </div>
      </section>
      </RevealOnScroll>

      <Footer />
    </div>
  )
}
