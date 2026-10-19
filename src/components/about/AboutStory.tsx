import { useLayoutEffect, useRef } from 'react'
import { useCmsMedia } from '../../content/cms'
import { useContent } from '../../i18n/context'
import { revealText } from '../../lib/splitReveal'
import { prefersReducedMotion, useScrollReveal } from '../../lib/useScrollReveal'
import { Picture } from '../ui/Picture'
import styles from './AboutStory.module.css'

export function AboutStory() {
  const { lang, about } = useContent()
  const media = useCmsMedia()
  const scope = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLParagraphElement>(null)
  useScrollReveal(scope)

  // Paragraph labels follow the PDF: [0] is the opening sentence (intro), then P1–P6.
  const [, p1, p2, p3, p4, p5] = about.paragraphs

  useLayoutEffect(() => {
    const el = quoteRef.current
    if (!el || prefersReducedMotion()) return
    return revealText(el, lang === 'ar')
  }, [lang])

  return (
    <div ref={scope}>
      <section className={styles.story}>
        <div className={`container ${styles.grid}`}>
          <figure className={styles.figure}>
            <Picture
              group="photos"
              name="weave-macro"
              cms={media.aboutStory}
              alt=""
              sizes="(min-width: 1024px) 480px, 100vw"
            />
          </figure>
          <div className={styles.copy} data-reveal>
            <p>{p1}</p>
            <p>{p2}</p>
            <p>{p5}</p>
          </div>
        </div>
      </section>

      <section className={styles.quoteBand}>
        <div className="container">
          <p className={styles.quoteIntro} data-reveal>
            {p3}
          </p>
          <p ref={quoteRef} className={`${styles.quote} role-display`}>
            {p4}
          </p>
        </div>
      </section>
    </div>
  )
}
