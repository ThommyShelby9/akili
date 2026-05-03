import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Play } from 'lucide-react'
import { api } from '../../lib/api'

export default function ScriptDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [script, setScript] = useState(null)
  const [params, setParams] = useState({})
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.scripts.get(slug)
      .then(res => {
        setScript(res.data)
        // Initialiser les params avec les defaults
        const schema = res.data.params_schema
        if (schema?.properties) {
          const defaults = {}
          Object.entries(schema.properties).forEach(([key, val]) => {
            if (val.default !== undefined) defaults[key] = val.default
          })
          setParams(defaults)
        }
      })
      .catch(() => setError('Script introuvable'))
      .finally(() => setLoading(false))
  }, [slug])

  function updateParam(key, value) {
    setParams(p => ({ ...p, [key]: value }))
  }

  async function handleRun() {
    setRunning(true)
    setError('')
    setResult(null)
    try {
      const res = await api.scripts.run(slug, params)
      setResult(res.data)
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'exécution')
    } finally {
      setRunning(false)
    }
  }

  function isValid() {
    if (!script?.params_schema?.required) return true
    return script.params_schema.required.every(key => params[key])
  }

  if (loading) {
    return <div className="script-detail"><div className="loading-spinner"></div></div>
  }

  if (!script) {
    return (
      <div className="script-detail">
        <p className="script-error">Script introuvable.</p>
        <button onClick={() => navigate('/dashboard/scripts')}>← Retour</button>
      </div>
    )
  }

  const schema = script.params_schema || {}
  const properties = schema.properties || {}
  const required = schema.required || []

  return (
    <div className="script-detail">
      <button className="script-back" onClick={() => navigate('/dashboard/scripts')}>
        <ArrowLeft size={16} /> Bibliothèque
      </button>

      <div className="script-detail-header">
        <div>
          <span className="script-detail-cat">{script.category}</span>
          <h2>{script.name}</h2>
          <p>{script.description}</p>
        </div>
      </div>

      {/* Formulaire dynamique */}
      <div className="script-params">
        <h3>Paramètres</h3>
        {Object.entries(properties).map(([key, prop]) => (
          <div className="script-param-field" key={key}>
            <label>
              {prop.label || key}
              {required.includes(key) && <span className="required">*</span>}
            </label>
            {prop.type === 'boolean' ? (
              <label className="script-param-toggle">
                <input
                  type="checkbox"
                  checked={!!params[key]}
                  onChange={e => updateParam(key, e.target.checked)}
                />
                <span>{params[key] ? 'Oui' : 'Non'}</span>
              </label>
            ) : prop.type === 'number' ? (
              <input
                type="number"
                value={params[key] ?? ''}
                onChange={e => updateParam(key, Number(e.target.value))}
                placeholder={prop.default?.toString() || ''}
              />
            ) : (
              <input
                type="text"
                value={params[key] ?? ''}
                onChange={e => updateParam(key, e.target.value)}
                placeholder={prop.default || ''}
              />
            )}
          </div>
        ))}
      </div>

      {/* Bouton exécuter */}
      <button
        className="script-run-btn"
        onClick={handleRun}
        disabled={running || !isValid()}
      >
        {running ? (
          <><span className="onboarding-spinner"></span> Exécution...</>
        ) : (
          <><Play size={16} /> Lancer le script</>
        )}
      </button>

      {/* Résultat */}
      {result && (
        <div className="script-result success">
          <div className="script-result-header">
            <span className="script-result-icon">✓</span>
            <strong>Terminé avec succès</strong>
            <span className="script-result-duration">{(result.duration_ms / 1000).toFixed(1)}s</span>
          </div>

          {/* Message principal */}
          {result.result?.message && (
            <div className="script-result-message">{result.result.message}</div>
          )}

          {/* Détails structurés */}
          <div className="script-result-details">
            {Object.entries(result.result || {}).filter(([key]) => key !== 'message').map(([key, value]) => (
              <div key={key} className="script-result-detail-row">
                <span className="script-result-detail-key">{key.replace(/_/g, ' ')}</span>
                <span className="script-result-detail-value">
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="script-result error">
          <div className="script-result-header">
            <span className="script-result-icon">✗</span>
            <strong>Erreur</strong>
          </div>
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}
