import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getLenis } from '../../lib/smoothScroll'

const headerHeight = () => document.querySelector('header')?.offsetHeight ?? 0

/**
 * Scrolls to the #section (offset by the sticky header) or to the top on every navigation.
 * Same-page navigation is smooth through Lenis; arriving from another page jumps, then re-checks
 * once layout has settled (pin spacers, images) so pinned sections land correctly.
 */
export function ScrollManager() {
  const { pathname, hash, key } = useLocation()
  const previousPath = useRef<string | null>(null)

  useEffect(() => {
    const samePage = previousPath.current === pathname
    previousPath.current = pathname

    const go = (immediate: boolean) => {
      const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
      const lenis = getLenis()
      const top = target ? target.getBoundingClientRect().top + window.scrollY - headerHeight() : 0
      if (lenis) lenis.scrollTo(top, { immediate, duration: 1.2 })
      else window.scrollTo(0, top)
    }

    go(!samePage)
    if (samePage) return

    // Re-aim after layout settles, unless the visitor has already started scrolling.
    let interacted = false
    const stop = () => (interacted = true)
    const events = ['wheel', 'touchstart', 'keydown'] as const
    events.forEach((e) => window.addEventListener(e, stop, { passive: true }))
    const settle = () => {
      if (interacted) return
      ScrollTrigger.refresh()
      go(true)
    }
    const raf = requestAnimationFrame(settle)
    const timer = window.setTimeout(settle, 700)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
      events.forEach((e) => window.removeEventListener(e, stop))
    }
  }, [pathname, hash, key])

  return null
}
