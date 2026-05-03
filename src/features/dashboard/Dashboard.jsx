import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Zap, Clock, TrendingUp, Play, FileCode, ArrowRight, Activity, CheckCircle, XCircle } from 'lucide-react'
import { api } from '../../lib/api'
import { useAuth } from '../auth/AuthContext'
import { staleWhileRevalidate } from '../../lib/storage'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const userName = user?.user_metadata?.full_name || 'Utilisateur'

  useEffect(() => {
    staleWhileRevalidate(
      'stats',
      () => api.stats().then(r => r.data),
      2 * 60 * 1000,
      (fresh) => setStats(fresh)
    ).then(data => {
      setStats(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="dash-page">
        <div className="dash-welcome skeleton"><div className="skeleton-line w60"></div></div>
        <div className="dash-stats-grid">
          {[...Array(4)].map((_, i) => <div key={i} className="dash-stat-card skeleton"><div className="skeleton-line w60"></div><div className="skeleton-line w40"></div></div>)}
        </div>
      </div>
    )
  }

  const quotaPercent = stats ? Math.round((stats.quota_used / stats.quota_limit) * 100) : 0

  return (
    <div className="dash-page">
      {/* Welcome */}
      <div className="dash-welcome">
        <div>
          <h1>Bonjour, {userName}</h1>
          <p>Voici un aperçu de tes automatisations.</p>
        </div>
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
          <div className="dash-stat-value">{stats?.successful_executions || 0}</div>
          <div className="dash-stat-label">Scripts réussis</div>
        </div>
        <div className="dash-stat-card quota-card">
          <div className="dash-stat-icon"><Activity size={20} /></div>
          <div className="dash-stat-value">{stats?.quota_used || 0}<span className="dash-stat-max">/{stats?.quota_limit || 10}</span></div>
          <div className="dash-stat-label">Quota du jour</div>
          <div className="dash-quota-bar">
            <div className="dash-quota-fill" style={{ width: `${quotaPercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* Quick scripts */}
      <div className="dash-section">
        <div className="dash-section-header">
          <h3><FileCode size={16} /> Scripts rapides</h3>
          <Link to="/dashboard/scripts" className="dash-section-link">Voir la bibliothèque <ArrowRight size={12} /></Link>
        </div>
        <div className="dash-quick-scripts">
          <Link to="/dashboard/scripts/facture-pdf" className="dash-quick-script-card">
            <div className="dash-quick-script-icon"><FileCode size={18} /></div>
            <div>
              <strong>Facture PDF</strong>
              <span>Facturation</span>
            </div>
          </Link>
          <Link to="/dashboard/scripts/renommage-lot" className="dash-quick-script-card">
            <div className="dash-quick-script-icon"><FileCode size={18} /></div>
            <div>
              <strong>Renommage lot</strong>
              <span>Fichiers</span>
            </div>
          </Link>
          <Link to="/dashboard/scripts/rapport-csv" className="dash-quick-script-card">
            <div className="dash-quick-script-icon"><FileCode size={18} /></div>
            <div>
              <strong>Rapport CSV</strong>
              <span>Rapports</span>
            </div>
          </Link>
          <Link to="/dashboard/scripts/backup-drive" className="dash-quick-script-card">
            <div className="dash-quick-script-icon"><FileCode size={18} /></div>
            <div>
              <strong>Backup Drive</strong>
              <span>Stockage</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent executions */}
      <div className="dash-section">
        <div className="dash-section-header">
          <h3><Activity size={16} /> Activité récente</h3>
          <Link to="/dashboard/logs" className="dash-section-link">Voir tout <ArrowRight size={12} /></Link>
        </div>

        {stats?.recent_executions?.length > 0 ? (
          <div className="dash-recent-list">
            {stats.recent_executions.map(exec => (
              <div key={exec.id} className="dash-recent-item">
                {exec.status === 'success'
                  ? <CheckCircle size={16} className="dash-recent-icon success" />
                  : <XCircle size={16} className="dash-recent-icon error" />
                }
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
            <FileCode size={32} className="dash-empty-icon" />
            <p>Aucune exécution encore.</p>
            <Link to="/dashboard/scripts" className="dash-empty-link">Lance ton premier script →</Link>
          </div>
        )}
      </div>
    </div>
  )
}
