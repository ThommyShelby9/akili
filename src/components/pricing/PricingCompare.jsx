export default function PricingCompare() {
  return (
    <section className="compare-section">
      <div className="container">
        <div className="eyebrow eyebrow--center">Comparatif</div>
        <h2 className="section-title">Tout ce qui est inclus.</h2>
        <table className="compare-table">
          <thead>
            <tr>
              <th style={{ width: '38%' }}>Fonctionnalité</th>
              <th>Gratuit</th>
              <th className="hl">Pro</th>
              <th>Équipe</th>
            </tr>
          </thead>
          <tbody>
            <tr className="cat"><td colSpan="4">Automatisations</td></tr>
            <tr><td>Automatisations / mois</td><td>5</td><td><strong style={{ color: 'var(--accent)' }}>Illimitées</strong></td><td>Illimitées</td></tr>
            <tr><td>Scripts personnalisés</td><td><span className="no">—</span></td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td></tr>
            <tr><td>Planification cron</td><td><span className="no">—</span></td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td></tr>
            <tr><td>Déclencheurs automatiques</td><td><span className="no">—</span></td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td></tr>

            <tr className="cat"><td colSpan="4">Intégrations</td></tr>
            <tr><td>Scripts de base (fichiers, PDF)</td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td></tr>
            <tr><td>Google Drive & Gmail</td><td><span className="no">—</span></td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td></tr>
            <tr><td>Amazon S3, Notion, Slack</td><td><span className="no">—</span></td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td></tr>
            <tr><td>API REST & webhooks</td><td><span className="no">—</span></td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td></tr>

            <tr className="cat"><td colSpan="4">Visibilité & logs</td></tr>
            <tr><td>Historique d'exécution</td><td>7 jours</td><td>90 jours</td><td>1 an</td></tr>
            <tr><td>Notifications email</td><td><span className="no">—</span></td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td></tr>
            <tr><td>Audit centralisé</td><td><span className="no">—</span></td><td><span className="no">—</span></td><td><span className="yes">✓</span></td></tr>
            <tr><td>Export CSV / JSON</td><td><span className="no">—</span></td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td></tr>

            <tr className="cat"><td colSpan="4">Équipe</td></tr>
            <tr><td>Membres</td><td>1</td><td>1</td><td>Jusqu'à 10</td></tr>
            <tr><td>Rôles & permissions</td><td><span className="no">—</span></td><td><span className="no">—</span></td><td><span className="yes">✓</span></td></tr>
            <tr><td>Tableau de bord partagé</td><td><span className="no">—</span></td><td><span className="no">—</span></td><td><span className="yes">✓</span></td></tr>

            <tr className="cat"><td colSpan="4">Support</td></tr>
            <tr><td>Support communauté</td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td></tr>
            <tr><td>Support prioritaire</td><td><span className="no">—</span></td><td><span className="yes">✓</span></td><td><span className="yes">✓</span></td></tr>
            <tr><td>Support dédié SLA 24h</td><td><span className="no">—</span></td><td><span className="no">—</span></td><td><span className="yes">✓</span></td></tr>
            <tr><td>Onboarding guidé</td><td><span className="no">—</span></td><td><span className="no">—</span></td><td><span className="yes">✓</span></td></tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}
