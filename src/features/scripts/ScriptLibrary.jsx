import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, FileCode, Receipt, Mail, BarChart2, Cloud, FolderOpen } from 'lucide-react'
import { api } from '../../lib/api'
import { staleWhileRevalidate } from '../../lib/storage'

const CATEGORIES = [
  { id: null, label: 'Tous', icon: FileCode },
  { id: 'facturation', label: 'Facturation', icon: Receipt },
  { id: 'fichiers', label: 'Fichiers', icon: FolderOpen },
  { id: 'emails', label: 'Emails', icon: Mail },
  { id: 'rapports', label: 'Rapports', icon: BarChart2 },
  { id: 'stockage', label: 'Stockage', icon: Cloud },
]

export default function ScriptLibrary() {
  const [scripts, setScripts] = useState(null)
  const [category, setCategory] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    staleWhileRevalidate(
      `scripts_${category || 'all'}`,
      () => api.scripts.list(category).then(r => r.data),
      30 * 60 * 1000, // 30 min
      (fresh) => setScripts(fresh)
    ).then(data => {
      setScripts(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [category])

  const filtered = scripts?.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  ) || []

  return (
    <div className="script-library">
      <div className="script-library-header">
        <h2>Bibliothèque de scripts</h2>
        <p>Choisis un script et automatise en un clic.</p>
      </div>

      {/* Filters */}
      <div className="script-filters">
        <div className="script-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Rechercher un script..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="script-categories">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id || 'all'}
              className={`script-cat-btn ${category === cat.id ? 'active' : ''}`}
              onClick={() => setCategory(cat.id)}
            >
              <cat.icon size={14} />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="script-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="script-card skeleton">
              <div className="skeleton-line w60"></div>
              <div className="skeleton-line w100"></div>
              <div className="skeleton-line w80"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="script-grid">
          {filtered.map(script => (
            <Link to={`/dashboard/scripts/${script.slug}`} key={script.slug} className="script-card">
              <div className="script-card-top">
                <span className="script-card-cat">{script.category}</span>
              </div>
              <h3>{script.name}</h3>
              <p>{script.description}</p>
              <span className="script-card-action">Configurer →</span>
            </Link>
          ))}
          {filtered.length === 0 && (
            <div className="script-empty">Aucun script trouvé.</div>
          )}
        </div>
      )}
    </div>
  )
}
