import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Scroll motion for a section (play once; nothing happens with reduced motion):
 *  [data-reveal]   fades up 48px
 *  [data-zoom]     settles from scale 1.12 to 1
 *  [data-parallax] drifts ~40px against the scroll (desktop only)
 */
export function useScrollReveal(scope: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = scope.current
    if (!root || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.set(el, { opacity: 0, y: 48 })
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }),
        })
      })

      root.querySelectorAll<HTMLElement>('[data-zoom]').forEach((el) => {
        gsap.set(el, { scale: 1.12 })
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () => gsap.to(el, { scale: 1, duration: 1.4, ease: 'power3.out' }),
        })
      })

      gsap.matchMedia().add('(min-width: 1024px)', () => {
        root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
          gsap.fromTo(
            el,
            { y: 20 },
            {
              y: -20,
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        })
      })
    }, root)

    return () => ctx.revert()
  }, [scope])
}
