import { useState, useEffect } from 'react'
import { Search, Ban, CheckCircle, Eye, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterPlan, setFilterPlan] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)

  async function loadUsers() {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    setUsers(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadUsers()

    const channel = supabase
      .channel('admin-users-list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        loadUsers()
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  const [confirmDelete, setConfirmDelete] = useState(null)

  async function toggleSuspend(userId, currentRole) {
    const newRole = currentRole === 'suspended' ? 'user' : 'suspended'
    await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
  }

  async function deleteUser(userId) {
    // Supprimer le profil (cascade supprime executions, notifications, etc.)
    await supabase.from('profiles').delete().eq('id', userId)
    setUsers(users.filter(u => u.id !== userId))
    setConfirmDelete(null)
    setSelectedUser(null)
  }

  const filtered = users.filter(u => {
    const matchSearch = !search || (u.full_name || '').toLowerCase().includes(search.toLowerCase()) || u.id.includes(search)
    const matchPlan = !filterPlan || u.plan === filterPlan
    return matchSearch && matchPlan
  })

  if (loading) {
    return (
      <div className="admin-page">
        <h1>Utilisateurs</h1>
        <div className="admin-activity-list">
          {[...Array(5)].map((_, i) => <div key={i} className="admin-activity-item skeleton"><div className="skeleton-line w100"></div></div>)}
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Utilisateurs</h1>
        <span className="admin-count">{filtered.length} utilisateur{filtered.length > 1 ? 's' : ''}</span>
      </div>

      <div className="admin-filters">
        <div className="admin-search">
          <Search size={16} />
          <input type="text" placeholder="Rechercher par nom..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select value={filterPlan} onChange={e => setFilterPlan(e.target.value)}>
          <option value="">Tous les plans</option>
          <option value="free">Gratuit</option>
          <option value="pro">Pro</option>
          <option value="team">Équipe</option>
        </select>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Plan</th>
              <th>Quota</th>
              <th>Rôle</th>
              <th>Inscrit le</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id} className={user.role === 'suspended' ? 'suspended' : ''}>
                <td>
                  <div className="admin-user-cell">
                    <div className="admin-user-avatar">
                      {(user.full_name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <strong>{user.full_name || 'Sans nom'}</strong>
                      <span>{user.id.slice(0, 8)}...</span>
                    </div>
                  </div>
                </td>
                <td><span className={`admin-plan-badge ${user.plan}`}>{user.plan}</span></td>
                <td><span className="admin-quota">{user.quota_used}/{user.quota_limit}</span></td>
                <td><span className={`admin-status ${user.role === 'suspended' ? 'suspended' : 'active'}`}>
                  {user.role === 'admin' ? 'Admin' : user.role === 'suspended' ? 'Suspendu' : 'Actif'}
                </span></td>
                <td className="admin-date">{new Date(user.created_at).toLocaleDateString('fr-FR')}</td>
                <td>
                  <div className="admin-actions">
                    <button onClick={() => setSelectedUser(user)} title="Voir détails"><Eye size={15} /></button>
                    {user.role !== 'admin' && (
                      <>
                        <button onClick={() => toggleSuspend(user.id, user.role)} title={user.role === 'suspended' ? 'Réactiver' : 'Suspendre'}>
                          {user.role === 'suspended' ? <CheckCircle size={15} /> : <Ban size={15} />}
                        </button>
                        <button onClick={() => setConfirmDelete(user)} title="Supprimer" className="admin-action-danger">
                          <Trash2 size={15} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-3)', padding: 'var(--s-8)' }}>Aucun utilisateur trouvé</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal détails */}
      {selectedUser && (
        <div className="admin-modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setSelectedUser(null)}>✕</button>
            <div className="admin-modal-header">
              <div className="admin-user-avatar large">
                {(selectedUser.full_name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <h3>{selectedUser.full_name || 'Sans nom'}</h3>
              <span>{selectedUser.id}</span>
            </div>
            <div className="admin-modal-details">
              <div className="admin-modal-row"><span>Plan</span><span className={`admin-plan-badge ${selectedUser.plan}`}>{selectedUser.plan}</span></div>
              <div className="admin-modal-row"><span>Rôle</span><span>{selectedUser.role}</span></div>
              <div className="admin-modal-row"><span>Quota</span><span>{selectedUser.quota_used}/{selectedUser.quota_limit}</span></div>
              <div className="admin-modal-row"><span>Secteur</span><span>{selectedUser.sector || '—'}</span></div>
              <div className="admin-modal-row"><span>Métier</span><span>{selectedUser.job_role || '—'}</span></div>
              <div className="admin-modal-row"><span>Onboarding</span><span>{selectedUser.onboarding_completed ? 'Complété' : 'Non complété'}</span></div>
              <div className="admin-modal-row"><span>Inscrit le</span><span>{new Date(selectedUser.created_at).toLocaleString('fr-FR')}</span></div>
            </div>
            {selectedUser.role !== 'admin' && (
              <div className="admin-modal-actions">
                <button className="admin-modal-suspend" onClick={() => { toggleSuspend(selectedUser.id, selectedUser.role); setSelectedUser(null) }}>
                  {selectedUser.role === 'suspended' ? <><CheckCircle size={14} /> Réactiver</> : <><Ban size={14} /> Suspendre</>}
                </button>
                <button className="admin-modal-delete" onClick={() => { setSelectedUser(null); setConfirmDelete(selectedUser) }}>
                  <Trash2 size={14} /> Supprimer
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal confirmation suppression */}
      {confirmDelete && (
        <div className="admin-modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="admin-modal admin-modal-danger" onClick={e => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setConfirmDelete(null)}>✕</button>
            <div className="admin-delete-confirm">
              <div className="admin-delete-icon"><Trash2 size={28} /></div>
              <h3>Supprimer ce compte ?</h3>
              <p>Tu es sur le point de supprimer le compte de <strong>{confirmDelete.full_name || confirmDelete.id}</strong>. Cette action est irréversible. Toutes ses données seront effacées.</p>
              <div className="admin-delete-actions">
                <button className="admin-delete-cancel" onClick={() => setConfirmDelete(null)}>Annuler</button>
                <button className="admin-delete-final" onClick={() => deleteUser(confirmDelete.id)}>Supprimer définitivement</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
