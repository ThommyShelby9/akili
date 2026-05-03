import { useState } from 'react'
import { Mail, MapPin, MessageCircle, HelpCircle, Send } from 'lucide-react'
import Seo from '../components/Seo'
import RevealOnScroll from '../components/RevealOnScroll'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { api } from '../lib/api'

const FAQ_ITEMS = [
  { q: 'Akili est-il gratuit ?', a: 'Oui, le plan gratuit inclut 10 exécutions par jour. Suffisant pour tester et automatiser tes premières tâches.' },
  { q: 'Dois-je savoir coder ?', a: 'Non. Akili est conçu pour les non-techniciens. Tu décris ce que tu veux, Akili s\'en charge.' },
  { q: 'Mes données sont-elles sécurisées ?', a: 'Oui. Chiffrement HTTPS, tokens sécurisés, conformité RGPD. Tes données restent les tiennes.' },
  { q: 'Combien de temps pour configurer ?', a: 'Moins de 5 minutes pour ta première automatisation grâce à notre onboarding guidé.' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await api.contact(form)
      if (res.error) {
        setError(res.error.message)
      } else {
        setSuccess(true)
        setForm({ name: '', email: '', subject: '', message: '' })
      }
    } catch (err) {
      setError('Erreur de connexion. Réessaie plus tard.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="akili">
      <Seo title="Contact" description="Une question sur Akili ? Contacte notre équipe à Cotonou. Réponse sous 24h." />
      <Nav />

      {/* HERO */}
      <section className="contact-hero">
        <div className="container">
          <div className="eyebrow eyebrow--center">Contact</div>
          <h1>Une question ?<br /><span className="c-cyan">On est là.</span></h1>
          <p>Notre équipe à Cotonou te répond sous 24h. Pas de chatbot, de vraies personnes.</p>
        </div>
      </section>

      {/* CONTENT */}
      <RevealOnScroll>
      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">

            {/* FORMULAIRE */}
            <div className="contact-form-wrap">
              {success ? (
                <div className="contact-success">
                  <div className="contact-success-icon">✓</div>
                  <h3>Message envoyé !</h3>
                  <p>On te répond sous 24h. Vérifie tes emails.</p>
                  <button className="btn-ghost" onClick={() => setSuccess(false)}>Envoyer un autre message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <h3>Envoie-nous un message</h3>

                  {error && <div className="form-error">{error}</div>}

                  <div className="field">
                    <label htmlFor="c-name">Nom</label>
                    <div className="input-wrap">
                      <input
                        id="c-name"
                        name="name"
                        type="text"
                        placeholder="Ton nom"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="c-email">Email</label>
                    <div className="input-wrap">
                      <input
                        id="c-email"
                        name="email"
                        type="email"
                        placeholder="toi@exemple.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="c-subject">Sujet</label>
                    <div className="input-wrap">
                      <input
                        id="c-subject"
                        name="subject"
                        type="text"
                        placeholder="De quoi s'agit-il ?"
                        value={form.subject}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="c-message">Message</label>
                    <div className="input-wrap">
                      <textarea
                        id="c-message"
                        name="message"
                        placeholder="Dis-nous tout..."
                        rows={5}
                        value={form.message}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <button className="submit" type="submit" disabled={loading}>
                    {loading ? 'Envoi...' : 'Envoyer le message'}
                    {!loading && <Send size={16} />}
                  </button>
                </form>
              )}
            </div>

            {/* SIDEBAR INFO */}
            <aside className="contact-info">
              <div className="contact-info-card">
                <Mail size={20} />
                <div>
                  <strong>Email</strong>
                  <a href="mailto:contact@akili.dev">contact@akili.dev</a>
                </div>
              </div>

              <div className="contact-info-card">
                <MapPin size={20} />
                <div>
                  <strong>Localisation</strong>
                  <span>Cotonou, Bénin</span>
                </div>
              </div>

              <div className="contact-info-card">
                <MessageCircle size={20} />
                <div>
                  <strong>Réseaux</strong>
                  <span>Twitter · GitHub</span>
                </div>
              </div>

              <div className="contact-info-card">
                <HelpCircle size={20} />
                <div>
                  <strong>Support</strong>
                  <span>Réponse sous 24h</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
      </RevealOnScroll>

      {/* FAQ RAPIDE */}
      <RevealOnScroll>
      <section className="contact-faq">
        <div className="container">
          <h2 className="section-title">Questions fréquentes</h2>
          <div className="contact-faq-grid">
            {FAQ_ITEMS.map((item, i) => (
              <div className="contact-faq-item" key={i}>
                <h4>{item.q}</h4>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </RevealOnScroll>

      <Footer />
    </div>
  )
}
