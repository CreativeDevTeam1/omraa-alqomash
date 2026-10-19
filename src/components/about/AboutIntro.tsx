import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCmsMedia } from '../../content/cms'
import { useContent } from '../../i18n/context'
import { prefersReducedMotion, useScrollReveal } from '../../lib/useScrollReveal'
import { Picture } from '../ui/Picture'
import styles from './AboutIntro.module.css'

gsap.registerPlugin(ScrollTrigger)

export function AboutIntro() {
  const { about } = useContent()
  const media = useCmsMedia()
  const scope = useRef<HTMLElement>(null)
  const bandImage = useRef<HTMLDivElement>(null)
  useScrollReveal(scope)

  // The band image settles from 1.12 to 1, scrubbed with the scroll.
  useLayoutEffect(() => {
    const el = bandImage.current
    if (!el || prefersReducedMotion()) return
    const tween = gsap.fromTo(
      el,
      { scale: 1.12 },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 30%', scrub: true },
      },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
      gsap.set(el, { clearProps: 'transform' })
    }
  }, [])

  return (
    <>
      <section ref={scope} className={styles.intro}>
        <div className={`container ${styles.row}`}>
          <h1 className={styles.title} data-reveal>
            {about.title}
          </h1>
          <p className={`${styles.lead} role-display`} data-reveal>
            {about.paragraphs[0]}
          </p>
        </div>
      </section>
      <div className={styles.band}>
        <div ref={bandImage} className={styles.bandInner}>
          <Picture
            group="photos"
            name="still-life"
            cms={media.aboutIntro}
            alt=""
            sizes="100vw"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </div>
    </>
  )
}
