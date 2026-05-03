import { useEffect, useRef } from 'react'

export default function RevealOnScroll({ children, delay = 0, direction = 'up', className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`
          el.classList.add('reveal-visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.unobserve(el)
  }, [delay])

  return (
    <div ref={ref} className={`reveal-hidden reveal-${direction} ${className}`}>
      {children}
    </div>
  )
}
