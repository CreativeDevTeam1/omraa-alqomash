import { useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getLenis } from '../../lib/smoothScroll'
import { useContent } from '../../i18n/context'
import { LocalizedLink } from '../../i18n/LocalizedLink'
import { switchLangPathname } from '../../i18n/paths'
import { Logo } from './Logo'
import styles from './Header.module.css'

export function Header() {
  const c = useContent()
  const { pathname, search, hash } = useLocation()
  // The menu is open only for the location it was opened on, so navigating closes it.
  const here = pathname + hash
  const [openAt, setOpenAt] = useState<string | null>(null)
  const open = openAt === here
  const setOpen = (next: boolean) => setOpenAt(next ? here : null)
  const menuId = useId()
  const navRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const switchTo = c.ui.languageSwitch

  // While the mobile menu is open: lock page scroll, close on Escape, and keep focus inside it.
  useEffect(() => {
    if (!open) return
    const toggle = toggleRef.current
    const focusables = () =>
      [...(navRef.current?.querySelectorAll<HTMLElement>('a[href]') ?? []), toggle].filter(
        (el): el is HTMLElement => !!el,
      )
    focusables()[0]?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenAt(null)
        toggle?.focus()
      } else if (e.key === 'Tab') {
        const items = focusables()
        const first = items[0]
        const last = items[items.length - 1]
        const active = document.activeElement
        if (e.shiftKey && active === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    getLenis()?.stop()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
      getLenis()?.start()
    }
  }, [open])

  // The page you are on: Home is /xx, the others /xx/about and /xx/contact.
  const currentRoute = pathname.split('/')[2] || 'home'
  const isCurrent = (route: string) => currentRoute === route

  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <LocalizedLink
          to={{ route: 'home' }}
          className={styles.logo}
          aria-label={c.brand.name}
          data-header-logo
        >
          <Logo className={styles.logoImg} />
        </LocalizedLink>

        <nav
          ref={navRef}
          data-header-nav
          id={menuId}
          className={`${styles.nav} ${open ? styles.navOpen : ''}`}
          aria-label={c.brand.name}
        >
          <ul className={styles.list}>
            {c.nav.map((item) => (
              <li key={item.label}>
                <LocalizedLink
                  to={item.to}
                  className={styles.link}
                  aria-current={isCurrent(item.to.route) ? 'page' : undefined}
                >
                  {item.label}
                </LocalizedLink>
              </li>
            ))}
          </ul>
          <Link
            className={`${styles.link} ${styles.switch}`}
            to={{ pathname: switchLangPathname(pathname, switchTo.targetLang), search, hash }}
            lang={switchTo.targetLang}
            hrefLang={switchTo.targetLang}
          >
            {switchTo.label}
          </Link>
        </nav>

        <button
          ref={toggleRef}
          data-header-nav
          type="button"
          className={styles.toggle}
          aria-label={open ? c.ui.menuClose : c.ui.menuOpen}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen(!open)}
        >
          <span className={styles.burger} aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
