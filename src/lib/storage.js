/**
 * Helpers localStorage — pattern stale-while-revalidate
 */

const PREFIX = 'akili_'

/**
 * Lit une valeur depuis le cache localStorage
 * @returns {object|null} { data, timestamp } ou null si expiré/absent
 */
export function getCache(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (!raw) return null

    const { data, timestamp } = JSON.parse(raw)
    return { data, timestamp }
  } catch {
    return null
  }
}

/**
 * Écrit une valeur dans le cache localStorage
 */
export function setCache(key, data) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify({
      data,
      timestamp: Date.now(),
    }))
  } catch {
    // localStorage full — silently fail
  }
}

/**
 * Supprime une entrée du cache
 */
export function clearCache(key) {
  localStorage.removeItem(PREFIX + key)
}

/**
 * Vérifie si le cache est encore frais
 * @param {string} key
 * @param {number} maxAgeMs — durée de fraîcheur en millisecondes
 */
export function isFresh(key, maxAgeMs) {
  const cached = getCache(key)
  if (!cached) return false
  return (Date.now() - cached.timestamp) < maxAgeMs
}

/**
 * Pattern stale-while-revalidate
 * Retourne les données du cache immédiatement (si disponibles),
 * puis appelle fetchFn en background et met à jour le cache.
 *
 * @param {string} key — clé cache
 * @param {function} fetchFn — fonction async qui retourne les données fraîches
 * @param {number} maxAgeMs — durée avant revalidation (ms)
 * @param {function} onUpdate — callback quand les données fraîches arrivent
 */
export async function staleWhileRevalidate(key, fetchFn, maxAgeMs, onUpdate) {
  const cached = getCache(key)

  // Retourner le cache si frais
  if (cached && isFresh(key, maxAgeMs)) {
    return cached.data
  }

  // Si cache existe mais stale, retourner stale + revalidate en background
  if (cached) {
    fetchFn().then(freshData => {
      setCache(key, freshData)
      if (onUpdate) onUpdate(freshData)
    }).catch(() => {})
    return cached.data
  }

  // Pas de cache — fetch obligatoire
  const freshData = await fetchFn()
  setCache(key, freshData)
  return freshData
}
