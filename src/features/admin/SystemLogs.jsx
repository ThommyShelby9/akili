import { useState } from 'react'
import { AlertCircle, CheckCircle, Info, Filter } from 'lucide-react'

const MOCK_LOGS = [
  { id: 1, type: 'error', message: 'backup-drive timeout après 30s', user: 'user_2b1c...', time: '2026-05-03 10:38:14' },
  { id: 2, type: 'success', message: 'facture-pdf exécuté — 1.4s', user: 'user_8a3f...', time: '2026-05-03 10:35:02' },
  { id: 3, type: 'error', message: 'OAuth token refresh échoué (Google Drive)', user: 'user_5e2a...', time: '2026-05-03 10:32:51' },
  { id: 4, type: 'info', message: 'Nouvel utilisateur inscrit — awa.d@freelance.sn', user: 'system', time: '2026-05-03 10:28:00' },
  { id: 5, type: 'success', message: 'email-campagne — 35 emails envoyés', user: 'user_8a3f...', time: '2026-05-03 10:25:33' },
  { id: 6, type: 'error', message: 'Rate limit atteint — user bloqué', user: 'user_9c4d...', time: '2026-05-03 10:20:17' },
  { id: 7, type: 'info', message: 'Upgrade plan: free → pro', user: 'user_3f8b...', time: '2026-05-03 10:15:44' },
  { id: 8, type: 'success', message: 'renommage-lot — 45 fichiers traités', user: 'user_1a7e...', time: '2026-05-03 10:12:09' },
  { id: 9, type: 'error', message: 'SMTP connection failed — notification non envoyée', user: 'system', time: '2026-05-03 10:08:22' },
  { id: 10, type: 'success', message: 'rapport-csv exporté — 142 lignes', user: 'user_6d2c...', time: '2026-05-03 10:05:55' },
]

export default function SystemLogs() {
  const [filter, setFilter] = useState('')

  const filtered = MOCK_LOGS.filter(log => !filter || log.type === filter)

  const icons = {
    error: <AlertCircle size={15} className="log-icon error" />,
    success: <CheckCircle size={15} className="log-icon success" />,
    info: <Info size={15} className="log-icon info" />,
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Logs système</h1>
      </div>

      <div className="admin-filters">
        <div className="admin-log-filters">
          <button className={`admin-log-filter ${!filter ? 'active' : ''}`} onClick={() => setFilter('')}>Tous</button>
          <button className={`admin-log-filter ${filter === 'error' ? 'active' : ''}`} onClick={() => setFilter('error')}>Erreurs</button>
          <button className={`admin-log-filter ${filter === 'success' ? 'active' : ''}`} onClick={() => setFilter('success')}>Succès</button>
          <button className={`admin-log-filter ${filter === 'info' ? 'active' : ''}`} onClick={() => setFilter('info')}>Info</button>
        </div>
      </div>

      <div className="admin-logs-list">
        {filtered.map(log => (
          <div key={log.id} className={`admin-log-item ${log.type}`}>
            {icons[log.type]}
            <div className="admin-log-content">
              <span className="admin-log-message">{log.message}</span>
              <span className="admin-log-meta">{log.user} · {log.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
