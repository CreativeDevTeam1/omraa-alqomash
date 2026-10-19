import { useRef } from 'react'
import { useCmsMedia } from '../../content/cms'
import { useContent } from '../../i18n/context'
import { useScrollReveal } from '../../lib/useScrollReveal'
import { Picture } from '../ui/Picture'
import styles from './VisionMission.module.css'

interface BlockProps {
  title: string
  headline: string
  body: string[]
  divided?: boolean
}

function Block({ title, headline, body, divided }: BlockProps) {
  return (
    <div className={`${styles.block} ${divided ? styles.divided : ''}`} data-reveal>
      <h2 className={`${styles.heading} role-light`}>{title}</h2>
      <p className={`${styles.statement} role-display`}>{headline}</p>
      {body.map((text) => (
        <p key={text} className={styles.text}>
          {text}
        </p>
      ))}
    </div>
  )
}

export function VisionMission() {
  const { vision, mission } = useContent()
  const media = useCmsMedia()
  const scope = useRef<HTMLElement>(null)
  useScrollReveal(scope)

  return (
    <section ref={scope} id="vision" className={styles.section}>
      <div className={styles.image}>
        <Picture
          group="photos"
          name="swatch-fan"
          cms={media.aboutVision}
          alt=""
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>
      <div className={styles.content}>
        <Block title={vision.title} headline={vision.headline} body={vision.body} />
        <Block title={mission.title} headline={mission.headline} body={mission.body} divided />
      </div>
    </section>
  )
}
