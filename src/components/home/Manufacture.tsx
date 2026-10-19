import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useContent } from '../../i18n/context'
import { Bidi } from '../ui/Bidi'
import { Picture } from '../ui/Picture'
import { SectionIntro } from '../ui/SectionIntro'
import styles from './Manufacture.module.css'

gsap.registerPlugin(ScrollTrigger)

export function Manufacture() {
  const { manufacture } = useContent()
  const gridRef = useRef<HTMLUListElement>(null)

  // Scroll reveal, played once. Skipped entirely with reduced motion (everything stays visible).
  useLayoutEffect(() => {
    const grid = gridRef.current
    if (!grid || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cards = Array.from(grid.children) as HTMLElement[]
    const images = cards.map((c) => c.querySelector('[data-reveal-image]'))
    gsap.set(cards, { opacity: 0, y: 48 })
    gsap.set(images, { scale: 1.12 })

    const triggers = ScrollTrigger.batch(cards, {
      start: 'top 85%',
      once: true,
      // Cards that enter together (one row) share a batch and stagger by 0.08s.
      onEnter: (batch) => {
        gsap.to(batch, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.08 })
        gsap.to(
          batch.map((c) => c.querySelector('[data-reveal-image]')),
          { scale: 1, duration: 1.2, ease: 'power3.out', stagger: 0.08 },
        )
      },
    })

    return () => {
      triggers.forEach((t) => t.kill())
      gsap.set([...cards, ...images], { clearProps: 'all' })
    }
  }, [])

  return (
    <section id="manufacture" className={styles.section}>
      <SectionIntro
        label={manufacture.title}
        statement={manufacture.headline}
        paragraphs={[manufacture.intro]}
      />
      <div className="container">
        <ul ref={gridRef} className={styles.grid}>
          {manufacture.items.map((item) => (
            <li key={item.id ?? item.slug} className={styles.card}>
              <div className={styles.imageWrap}>
                <div data-reveal-image className={styles.imageInner}>
                  <Picture
                    group="uses"
                    name={item.slug}
                    cms={item.image}
                    alt={item.title}
                    sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
              </div>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={`${styles.description} role-light`}>
                <Bidi text={item.description} />
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
