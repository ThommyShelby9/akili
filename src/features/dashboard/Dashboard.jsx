import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Zap, Clock, TrendingUp, Play } from 'lucide-react'
import { api } from '../../lib/api'
import { staleWhileRevalidate } from '../../lib/storage'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    staleWhileRevalidate(
      'stats',
      () => api.stats().then(r => r.data),
      2 * 60 * 1000, // 2 min
      (fresh) => setStats(fresh)
    ).then(data => {
      setStats(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="dash-page">
        <div className="dash-stats-grid">
          {[...Array(3)].map((_, i) => <div key={i} className="dash-stat-card skeleton"><div className="skeleton-line w60"></div><div className="skeleton-line w40"></div></div>)}
        </div>
      </div>
    )
  }

  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <h1>Dashboard</h1>
        <Link to="/dashboard/scripts" className="dash-quick-action">
          <Play size={14} /> Lancer un script
        </Link>
      </div>

      {/* Stats */}
      <div className="dash-stats-grid">
        <div className="dash-stat-card">
          <div className="dash-stat-icon"><Zap size={20} /></div>
          <div className="dash-stat-value">{stats?.total_executions || 0}</div>
          <div className="dash-stat-label">Tâches exécutées</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-icon"><Clock size={20} /></div>
          <div className="dash-stat-value">{stats?.hours_saved || 0}h</div>
          <div className="dash-stat-label">Heures économisées</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-icon"><TrendingUp size={20} /></div>
          <div className="dash-stat-value">{stats?.quota_used || 0}/{stats?.quota_limit || 10}</div>
          <div className="dash-stat-label">Quota du jour</div>
        </div>
      </div>

      {/* Recent executions */}
      <div className="dash-section">
        <div className="dash-section-header">
          <h3>Exécutions récentes</h3>
          <Link to="/dashboard/logs" className="dash-section-link">Voir tout →</Link>
        </div>

        {stats?.recent_executions?.length > 0 ? (
          <div className="dash-recent-list">
            {stats.recent_executions.map(exec => (
              <div key={exec.id} className="dash-recent-item">
                <div className={`dash-recent-status ${exec.status}`}></div>
                <div className="dash-recent-info">
                  <span className="dash-recent-name">{exec.scripts?.name || 'Script'}</span>
                  <span className="dash-recent-time">{new Date(exec.created_at).toLocaleString('fr-FR')}</span>
                </div>
                <span className="dash-recent-duration">{exec.duration_ms}ms</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="dash-empty">
            <p>Aucune exécution encore. <Link to="/dashboard/scripts">Lance ton premier script →</Link></p>
          </div>
        )}
      </div>
    </div>
  )
}
