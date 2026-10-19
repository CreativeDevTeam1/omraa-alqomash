import { useRef } from 'react'
import { useContent } from '../../i18n/context'
import { useScrollReveal } from '../../lib/useScrollReveal'
import styles from './AboutHighlights.module.css'

/** At-a-glance strip: the four short highlight phrases (edited in the CMS About page). */
export function AboutHighlights() {
  const { about } = useContent()
  const scope = useRef<HTMLElement>(null)
  useScrollReveal(scope)
  return (
    <section ref={scope} className={styles.strip}>
      <ul className={`container ${styles.list}`} data-reveal>
        {about.highlights.map((h) => (
          <li key={h} className={`${styles.item} role-light`}>
            {h}
          </li>
        ))}
      </ul>
    </section>
  )
}
