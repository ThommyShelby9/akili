import { useState, useEffect } from 'react'
import { api } from '../../lib/api'

export default function ExecutionLogs() {
  const [executions, setExecutions] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState({ status: '', script_id: '' })
  const [detail, setDetail] = useState(null)

  useEffect(() => {
    setLoading(true)
    const params = { page, per_page: 20, ...filter }
    Object.keys(params).forEach(k => !params[k] && delete params[k])
    api.executions.list(params)
      .then(res => setExecutions(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page, filter])

  async function showDetail(id) {
    const res = await api.executions.get(id)
    setDetail(res.data)
  }

  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <h1>Historique des exécutions</h1>
      </div>

      {/* Filters */}
      <div className="logs-filters">
        <select
          value={filter.status}
          onChange={e => { setFilter(f => ({ ...f, status: e.target.value })); setPage(1) }}
        >
          <option value="">Tous les statuts</option>
          <option value="success">Succès</option>
          <option value="error">Erreur</option>
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="logs-list">
          {[...Array(5)].map((_, i) => <div key={i} className="logs-item skeleton"><div className="skeleton-line w100"></div></div>)}
        </div>
      ) : (
        <>
          <div className="logs-list">
            {executions.map(exec => (
              <button key={exec.id} className="logs-item" onClick={() => showDetail(exec.id)}>
                <div className={`logs-status ${exec.status}`}></div>
                <div className="logs-info">
                  <span className="logs-name">{exec.scripts?.name || exec.script_id}</span>
                  <span className="logs-time">{new Date(exec.created_at).toLocaleString('fr-FR')}</span>
                </div>
                <span className="logs-duration">{exec.duration_ms}ms</span>
                <span className="logs-arrow">→</span>
              </button>
            ))}
            {executions.length === 0 && <div className="dash-empty"><p>Aucune exécution trouvée.</p></div>}
          </div>

          {/* Pagination */}
          <div className="logs-pagination">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Précédent</button>
            <span>Page {page}</span>
            <button disabled={executions.length < 20} onClick={() => setPage(p => p + 1)}>Suivant →</button>
          </div>
        </>
      )}

      {/* Detail modal */}
      {detail && (
        <div className="logs-detail-overlay" onClick={() => setDetail(null)}>
          <div className="logs-detail" onClick={e => e.stopPropagation()}>
            <button className="logs-detail-close" onClick={() => setDetail(null)}>✕</button>
            <h3>{detail.scripts?.name || 'Script'}</h3>
            <div className={`logs-detail-status ${detail.status}`}>{detail.status}</div>
            <div className="logs-detail-meta">
              <span>Durée : {detail.duration_ms}ms</span>
              <span>Date : {new Date(detail.created_at).toLocaleString('fr-FR')}</span>
            </div>
            {detail.params && (
              <div className="logs-detail-section">
                <h4>Paramètres</h4>
                <pre>{JSON.stringify(typeof detail.params === 'string' ? JSON.parse(detail.params) : detail.params, null, 2)}</pre>
              </div>
            )}
            {detail.result && (
              <div className="logs-detail-section">
                <h4>Résultat</h4>
                <pre>{JSON.stringify(typeof detail.result === 'string' ? JSON.parse(detail.result) : detail.result, null, 2)}</pre>
              </div>
            )}
            {detail.error_message && (
              <div className="logs-detail-section error">
                <h4>Erreur</h4>
                <p>{detail.error_message}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
