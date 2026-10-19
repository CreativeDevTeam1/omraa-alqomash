import { useChannels } from '../../content/cms'
import { useContent } from '../../i18n/context'
import { LocalizedLink } from '../../i18n/LocalizedLink'
import { Bidi } from '../ui/Bidi'
import { socialIcons } from '../ui/socialIcons'
import { Logo } from './Logo'
import styles from './Footer.module.css'

export function Footer() {
  const { footer, brand } = useContent()
  const channels = useChannels()
  // WhatsApp, Instagram, Facebook: same links and labels as before, shown as icons.
  const socials = [
    { key: 'whatsapp', href: channels.whatsapp.href, label: footer.contact.whatsapp },
    { key: 'instagram', href: channels.instagram.href, label: footer.contact.instagram },
    { key: 'facebook', href: channels.facebook.href, label: footer.contact.facebook },
  ] as const

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <LocalizedLink to={{ route: 'home' }} className={styles.logoLink}>
            <Logo className={styles.logo} />
          </LocalizedLink>
          <p className={styles.descriptor}>{footer.descriptor}</p>
          <ul className={styles.highlights}>
            {footer.highlights.map((h) => (
              <li key={h}>
                <Bidi text={h} />
              </li>
            ))}
          </ul>
        </div>

        {footer.columns.map((col) => (
          <nav key={col.title} className={styles.col} aria-labelledby={`footer-${col.title}`}>
            <h2 id={`footer-${col.title}`} className={`${styles.colTitle} role-light`}>
              {col.title}
            </h2>
            <ul>
              {col.links.map((link) => (
                <li key={link.label}>
                  <LocalizedLink to={link.to} className={styles.link}>
                    {link.label}
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className={styles.col}>
          <h2 className={`${styles.colTitle} role-light`}>{footer.contact.title}</h2>
          <ul>
            <li>
              <a className={`${styles.link} ${styles.iconLink}`} href={channels.phone.href}>
                {/* Lucide "phone" (ISC licence), decorative */}
                <svg
                  className={styles.icon}
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
                </svg>
                <bdi dir="ltr">{footer.contact.phone}</bdi>
              </a>
            </li>
            <li>{footer.contact.location}</li>
            <li>
              <a className={`${styles.link} ltr`} href={channels.email.href} dir="ltr">
                {channels.email.display}
              </a>
            </li>
            <li>
              <ul className={styles.social}>
                {socials.map((social) => (
                  <li key={social.key}>
                    <a
                      className={`${styles.link} ${styles.socialLink}`}
                      href={social.href}
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path d={socialIcons[social.key]} />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>{footer.copyright}</p>
        <p lang="ar" className={styles.tagline}>
          {brand.tagline}
        </p>
      </div>
    </footer>
  )
}
