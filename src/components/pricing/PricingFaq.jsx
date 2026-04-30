import { useState } from 'react'

const FAQ_ITEMS = [
  {
    q: "Ai-je besoin d'une carte bancaire pour démarrer ?",
    a: "Non. Le plan Gratuit ne demande aucune information de paiement. Tu t'inscris avec ton email et c'est tout. Tu passes au Pro uniquement si tu en as besoin.",
  },
  {
    q: "Puis-je annuler à tout moment ?",
    a: "Oui, sans frais ni préavis. Ton accès reste actif jusqu'à la fin de la période en cours, puis tu passes automatiquement au plan Gratuit. Tes données restent accessibles.",
  },
  {
    q: "Les prix sont-ils en FCFA ou en dollars ?",
    a: "Nos prix sont affichés en FCFA (Franc CFA). Nous acceptons aussi le paiement en euros (€) et en dollars ($) pour les utilisateurs hors zone franc CFA.",
  },
  {
    q: "Que se passe-t-il si je dépasse mon quota mensuel ?",
    a: "On te prévient avant d'atteindre la limite. Tu peux choisir de passer au plan supérieur ou d'attendre le prochain mois. On ne coupe jamais sans te prévenir.",
  },
  {
    q: "Y a-t-il une remise pour les ONG ou étudiants ?",
    a: "Oui. Contacte-nous à contact@akili.dev avec une preuve de statut. Nous offrons 50% de réduction pour les associations à but non lucratif et les étudiants en formation.",
  },
  {
    q: "L'essai Pro de 14 jours est-il vraiment gratuit ?",
    a: "Complètement. Aucune carte bancaire requise, aucun engagement. À la fin des 14 jours, tu choisis de continuer au tarif Pro ou de rester sur le plan Gratuit.",
  },
]

export default function PricingFaq() {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <section className="faq-section">
      <div className="container">
        <div className="eyebrow eyebrow--center">Questions fréquentes</div>
        <h2 className="section-title">On a les réponses.</h2>
        <div className="faq-list">
          {FAQ_ITEMS.map((item, i) => (
            <div className="faq-item" key={i}>
              <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {item.q}
                <span className={`faq-icon${openFaq === i ? ' open' : ''}`}>+</span>
              </div>
              {openFaq === i && <div className="faq-a">{item.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
