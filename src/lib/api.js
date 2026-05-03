import { supabase } from './supabase'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

class ApiError extends Error {
  constructor(error) {
    super(error.message)
    this.code = error.code
  }
}

async function request(endpoint, options = {}) {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  })

  const json = await res.json()

  if (json.error) {
    throw new ApiError(json.error)
  }

  return json
}

export const api = {
  // Health
  health: () => request('/health'),

  // Profile
  profile: {
    get: () => request('/profile'),
    update: (data) => request('/profile', { method: 'PUT', body: JSON.stringify(data) }),
    delete: () => request('/profile', { method: 'DELETE' }),
  },

  // Scripts
  scripts: {
    list: (category) => request(`/scripts${category ? `?category=${category}` : ''}`),
    get: (slug) => request(`/scripts/${slug}`),
    run: (slug, params) => request(`/scripts/${slug}/run`, { method: 'POST', body: JSON.stringify({ params }) }),
  },

  // Executions
  executions: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString()
      return request(`/executions${query ? `?${query}` : ''}`)
    },
    get: (id) => request(`/executions/${id}`),
  },

  // Stats
  stats: () => request('/stats'),

  // Contact (public, pas de token)
  contact: (data) => fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json()),

  // Notifications
  notifications: {
    list: () => request('/notifications'),
    markRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  },
}
