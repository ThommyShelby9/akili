import { useState } from 'react'
import { Bell, Plus, Trash2, Check } from 'lucide-react'

const DEFAULT_ALERTS = [
  { id: 1, name: 'Uptime critique', condition: 'Uptime < 99%', channel: 'email', active: true },
  { id: 2, name: 'Erreurs en masse', condition: '> 5 erreurs en 1h', channel: 'email', active: true },
  { id: 3, name: 'Quota utilisateur', condition: 'User atteint 100% quota', channel: 'email', active: false },
]

export default function Alerts() {
  const [alerts, setAlerts] = useState(DEFAULT_ALERTS)
  const [showAdd, setShowAdd] = useState(false)
  const [newAlert, setNewAlert] = useState({ name: '', condition: '', channel: 'email' })

  function toggleAlert(id) {
    setAlerts(alerts.map(a => a.id === id ? { ...a, active: !a.active } : a))
  }

  function deleteAlert(id) {
    setAlerts(alerts.filter(a => a.id !== id))
  }

  function addAlert() {
    if (!newAlert.name || !newAlert.condition) return
    setAlerts([...alerts, { ...newAlert, id: Date.now(), active: true }])
    setNewAlert({ name: '', condition: '', channel: 'email' })
    setShowAdd(false)
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Alertes</h1>
        <button className="admin-add-btn" onClick={() => setShowAdd(true)}>
          <Plus size={14} /> Nouvelle alerte
        </button>
      </div>

      <div className="admin-alerts-list">
        {alerts.map(alert => (
          <div key={alert.id} className={`admin-alert-card ${alert.active ? 'active' : 'inactive'}`}>
            <div className="admin-alert-left">
              <Bell size={18} className="admin-alert-icon" />
              <div>
                <strong>{alert.name}</strong>
                <span className="admin-alert-condition">{alert.condition}</span>
                <span className="admin-alert-channel">Canal: {alert.channel}</span>
              </div>
            </div>
            <div className="admin-alert-actions">
              <button
                className={`admin-alert-toggle ${alert.active ? 'on' : 'off'}`}
                onClick={() => toggleAlert(alert.id)}
              >
                {alert.active ? 'Active' : 'Inactive'}
              </button>
              <button className="admin-alert-delete" onClick={() => deleteAlert(alert.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {alerts.length === 0 && (
          <div className="admin-empty">Aucune alerte configurée.</div>
        )}
      </div>

      {/* Add modal */}
      {showAdd && (
        <div className="admin-modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setShowAdd(false)}>✕</button>
            <h3>Nouvelle alerte</h3>
            <div className="admin-form">
              <div className="admin-form-field">
                <label>Nom</label>
                <input type="text" value={newAlert.name} onChange={e => setNewAlert({ ...newAlert, name: e.target.value })} placeholder="Ex: Uptime critique" />
              </div>
              <div className="admin-form-field">
                <label>Condition</label>
                <input type="text" value={newAlert.condition} onChange={e => setNewAlert({ ...newAlert, condition: e.target.value })} placeholder="Ex: Uptime < 99%" />
              </div>
              <div className="admin-form-field">
                <label>Canal</label>
                <select value={newAlert.channel} onChange={e => setNewAlert({ ...newAlert, channel: e.target.value })}>
                  <option value="email">Email</option>
                  <option value="slack">Slack</option>
                </select>
              </div>
              <button className="admin-form-submit" onClick={addAlert}>
                <Check size={14} /> Créer l'alerte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
