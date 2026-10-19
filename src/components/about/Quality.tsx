import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useContent } from '../../i18n/context'
import { prefersReducedMotion, useScrollReveal } from '../../lib/useScrollReveal'
import { Bidi } from '../ui/Bidi'
import styles from './Quality.module.css'

gsap.registerPlugin(ScrollTrigger)

export function Quality() {
  const { about } = useContent()
  const scope = useRef<HTMLElement>(null)
  const isoRef = useRef<HTMLParagraphElement>(null)
  useScrollReveal(scope)

  // "ISO 9001" fades in while its letter-spacing tightens from 4% to the final spacing.
  useLayoutEffect(() => {
    const el = isoRef.current
    if (!el || prefersReducedMotion()) return
    // Lock the final width first: the tracking animation must not reflow the row it sits in.
    const finalWidth = el.getBoundingClientRect().width
    el.style.inlineSize = `${finalWidth}px`
    gsap.set(el, { opacity: 0, letterSpacing: '0.04em' })
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () =>
        gsap.to(el, {
          opacity: 1,
          letterSpacing: '0em',
          duration: 1.6,
          ease: 'power3.out',
          onComplete: () => {
            el.style.inlineSize = ''
          },
        }),
    })
    return () => {
      trigger.kill()
      gsap.set(el, { clearProps: 'opacity,letterSpacing' })
      el.style.inlineSize = ''
    }
  }, [])

  return (
    <section ref={scope} id="quality" className={styles.quality}>
      <div className={`container ${styles.row}`}>
        {/* Decorative typography taken from the paragraph beside it: always Latin, always LTR. */}
        <p ref={isoRef} className={styles.iso} dir="ltr" lang="en" aria-hidden="true">
          {about.isoLabel}
        </p>
        <p className={styles.text} data-reveal>
          <Bidi text={about.paragraphs[6]} />
        </p>
      </div>
    </section>
  )
}
