import { useEffect } from 'react'

const DEFAULTS = {
  siteName: 'Akili',
  titleSuffix: ' — Akili',
  description: 'Automatise tes tâches répétitives sans une ligne de code. Facturation, fichiers, déploiements — Akili s\'en charge.',
  ogImage: '/2.png',
}

export default function Seo({ title, description, noindex = false }) {
  const fullTitle = title ? `${title}${DEFAULTS.titleSuffix}` : `${DEFAULTS.siteName} — L'automatisation pour tous`
  const desc = description || DEFAULTS.description

  useEffect(() => {
    document.title = fullTitle

    setMeta('description', desc)
    setMeta('og:title', fullTitle)
    setMeta('og:description', desc)
    setMeta('og:image', DEFAULTS.ogImage)
    setMeta('og:type', 'website')
    setMeta('og:site_name', DEFAULTS.siteName)
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', fullTitle)
    setMeta('twitter:description', desc)

    if (noindex) {
      setMeta('robots', 'noindex, nofollow')
    } else {
      removeMeta('robots')
    }

    return () => {
      // Cleanup si nécessaire
    }
  }, [fullTitle, desc, noindex])

  return null
}

function setMeta(name, content) {
  const attr = name.startsWith('og:') || name.startsWith('twitter:') ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function removeMeta(name) {
  const el = document.querySelector(`meta[name="${name}"]`)
  if (el) el.remove()
}
