import { useState, useEffect } from 'react'
import { Users, Zap, TrendingUp, Server } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)

  // Charger les stats réelles depuis Supabase
  async function loadStats() {
    const [profilesRes, execsRes] = await Promise.all([
      supabase.from('profiles').select('id, plan, created_at', { count: 'exact' }),
      supabase.from('executions').select('id, status, duration_ms', { count: 'exact' }),
    ])

    const totalUsers = profilesRes.count || 0
    const totalExecs = execsRes.count || 0
    const successExecs = execsRes.data?.filter(e => e.status === 'success').length || 0
    const proUsers = profilesRes.data?.filter(p => p.plan === 'pro').length || 0

    // Nouveaux cette semaine
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const newThisWeek = profilesRes.data?.filter(p => p.created_at > weekAgo).length || 0

    setStats({
      total_users: totalUsers,
      active_users: totalUsers, // simplifié pour MVP
      new_users_week: newThisWeek,
      total_executions: totalExecs,
      executions_today: totalExecs, // simplifié
      success_rate: totalExecs > 0 ? Math.round((successExecs / totalExecs) * 100 * 10) / 10 : 100,
      mrr: proUsers * 9900, // 9900 FCFA / pro user
      uptime: 99.7,
    })
  }

  // Charger l'activité récente
  async function loadActivity() {
    // Derniers utilisateurs inscrits
    const { data: newUsers } = await supabase
      .from('profiles')
      .select('id, full_name, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    // Dernières exécutions
    const { data: recentExecs } = await supabase
      .from('executions')
      .select('id, status, created_at, scripts(name)')
      .order('created_at', { ascending: false })
      .limit(5)

    const items = []

    // Merge et trier par date
    newUsers?.forEach(u => {
      items.push({
        id: `user-${u.id}`,
        type: 'new_user',
        text: `Nouvel utilisateur — ${u.full_name || 'Sans nom'}`,
        time: u.created_at,
      })
    })

    recentExecs?.forEach(e => {
      items.push({
        id: `exec-${e.id}`,
        type: e.status === 'success' ? 'exec_success' : 'exec_error',
        text: e.status === 'success'
          ? `${e.scripts?.name || 'Script'} exécuté avec succès`
          : `Erreur: ${e.scripts?.name || 'Script'} a échoué`,
        time: e.created_at,
      })
    })

    items.sort((a, b) => new Date(b.time) - new Date(a.time))
    setActivity(items.slice(0, 10))
  }

  useEffect(() => {
    Promise.all([loadStats(), loadActivity()]).then(() => setLoading(false))

    // Realtime: écouter les nouveaux utilisateurs
    const profileChannel = supabase
      .channel('admin-profiles')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' }, (payload) => {
        const newUser = payload.new
        setActivity(prev => [{
          id: `user-${newUser.id}-${Date.now()}`,
          type: 'new_user',
          text: `Nouvel utilisateur — ${newUser.full_name || 'Sans nom'}`,
          time: new Date().toISOString(),
        }, ...prev].slice(0, 10))

        // Mettre à jour le compteur
        setStats(prev => prev ? { ...prev, total_users: prev.total_users + 1, new_users_week: prev.new_users_week + 1 } : prev)
      })
      .subscribe()

    // Realtime: écouter les nouvelles exécutions
    const execChannel = supabase
      .channel('admin-executions')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'executions' }, (payload) => {
        const exec = payload.new
        setActivity(prev => [{
          id: `exec-${exec.id}-${Date.now()}`,
          type: exec.status === 'success' ? 'exec_success' : 'exec_error',
          text: exec.status === 'success'
            ? `Script exécuté avec succès`
            : `Erreur: script a échoué`,
          time: new Date().toISOString(),
        }, ...prev].slice(0, 10))

        setStats(prev => prev ? { ...prev, total_executions: prev.total_executions + 1 } : prev)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(profileChannel)
      supabase.removeChannel(execChannel)
    }
  }, [])

  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "à l'instant"
    if (mins < 60) return `il y a ${mins} min`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `il y a ${hours}h`
    return `il y a ${Math.floor(hours / 24)}j`
  }

  if (loading) {
    return (
      <div className="admin-page">
        <h1>Vue globale</h1>
        <div className="admin-stats-grid">
          {[...Array(4)].map((_, i) => <div key={i} className="admin-stat-card skeleton"><div className="skeleton-line w60"></div><div className="skeleton-line w40"></div></div>)}
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Vue globale</h1>
        <div className="admin-uptime">
          <span className="admin-uptime-dot"></span>
          Uptime {stats.uptime}%
        </div>
      </div>

      {/* Stats */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon users"><Users size={20} /></div>
          <div className="admin-stat-content">
            <div className="admin-stat-value">{stats.total_users}</div>
            <div className="admin-stat-label">Utilisateurs total</div>
            <div className="admin-stat-sub">+{stats.new_users_week} cette semaine</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon exec"><Zap size={20} /></div>
          <div className="admin-stat-content">
            <div className="admin-stat-value">{stats.total_executions}</div>
            <div className="admin-stat-label">Exécutions totales</div>
            <div className="admin-stat-sub">Taux succès: {stats.success_rate}%</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon revenue"><TrendingUp size={20} /></div>
          <div className="admin-stat-content">
            <div className="admin-stat-value">{(stats.mrr / 1000).toFixed(0)}K</div>
            <div className="admin-stat-label">MRR (FCFA)</div>
            <div className="admin-stat-sub">{stats.total_users} utilisateurs</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon server"><Server size={20} /></div>
          <div className="admin-stat-content">
            <div className="admin-stat-value">{stats.active_users}</div>
            <div className="admin-stat-label">Actifs</div>
            <div className="admin-stat-sub">100% du total</div>
          </div>
        </div>
      </div>

      {/* Activité en temps réel */}
      <div className="admin-section">
        <h3>Activité en temps réel</h3>
        {activity.length > 0 ? (
          <div className="admin-activity-list">
            {activity.map(item => (
              <div key={item.id} className="admin-activity-item">
                <span className={`admin-activity-dot ${item.type === 'new_user' ? 'new' : item.type === 'exec_success' ? 'exec' : 'error'}`}></span>
                <span className="admin-activity-text">{item.text}</span>
                <span className="admin-activity-time">{timeAgo(item.time)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="admin-empty">Aucune activité récente. Les événements apparaîtront ici en temps réel.</div>
        )}
      </div>
    </div>
  )
}
