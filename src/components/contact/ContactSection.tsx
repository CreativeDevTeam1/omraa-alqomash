import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { useChannels, useCmsMedia } from '../../content/cms'
import { useContent } from '../../i18n/context'
import { prefersReducedMotion } from '../../lib/useScrollReveal'
import { Picture } from '../ui/Picture'
import styles from './ContactSection.module.css'

interface Detail {
  label: string
  value: string
  href?: string
  external?: boolean
  /** Always left-to-right (numbers, emails, handles). */
  ltr?: boolean
}

/** Lets an email address wrap after the @ instead of mid-word. */
const breakAfterAt = (value: string) =>
  value.includes('@')
    ? value
        .split('@')
        .flatMap((part, i, all) => (i < all.length - 1 ? [part, '@', <wbr key={i} />] : [part]))
    : value

export function ContactSection() {
  const { contact } = useContent()
  const channels = useChannels()
  const media = useCmsMedia()
  const rootRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  const details: Detail[] = [
    {
      label: contact.phone.label,
      value: contact.phone.value,
      href: channels.phone.href,
      ltr: true,
    },
    {
      label: contact.whatsapp.label,
      value: contact.whatsapp.value,
      href: channels.whatsapp.href,
      external: true,
      ltr: true,
    },
    { label: contact.location.label, value: contact.location.value },
    {
      label: contact.email.label,
      value: channels.email.display,
      href: channels.email.href,
      ltr: true,
    },
    {
      label: contact.instagram.label,
      value: channels.instagram.display,
      href: channels.instagram.href,
      external: true,
      ltr: true,
    },
    {
      label: contact.facebook.label,
      value: channels.facebook.display,
      href: channels.facebook.href,
      external: true,
    },
  ]

  // On load: label, statement, intro and grid items fade up in sequence; the image settles.
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const items = root.querySelectorAll('[data-in]')
      gsap.set(items, { opacity: 0, y: 24 })
      gsap.set(imageRef.current, { scale: 1.08 })
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.06,
        delay: 0.2,
      })
      gsap.to(imageRef.current, { scale: 1, duration: 1.6, ease: 'power3.out' })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} id="contact" className={styles.section}>
      <div className={styles.image}>
        <div ref={imageRef} className={styles.imageInner}>
          <Picture
            group="photos"
            name="linen-drape"
            cms={media.contact}
            alt=""
            sizes="(min-width: 1024px) 50vw, 100vw"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </div>

      <div className={styles.text}>
        <p className={`${styles.label} role-light`} data-in>
          {contact.title}
        </p>
        <h1 className={styles.statement} data-in>
          {contact.headline}
        </h1>
        <p className={styles.intro} data-in>
          {contact.intro}
        </p>

        <dl className={styles.grid}>
          {details.map((d) => (
            <div key={d.label} className={styles.item} data-in>
              <dt className={`${styles.term} role-light`}>{d.label}</dt>
              <dd className={styles.value}>
                {d.href ? (
                  <a
                    className={`${styles.link} ${d.ltr ? 'ltr' : ''}`}
                    href={d.href}
                    dir={d.ltr ? 'ltr' : undefined}
                    {...(d.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {breakAfterAt(d.value)}
                  </a>
                ) : (
                  d.value
                )}
              </dd>
            </div>
          ))}
        </dl>

        <div className={styles.inquiries} data-in>
          <h2 className={`${styles.term} role-light`}>{contact.inquiries.label}</h2>
          <p className={styles.inquiriesText}>{contact.inquiries.text}</p>
        </div>
      </div>
    </section>
  )
}
