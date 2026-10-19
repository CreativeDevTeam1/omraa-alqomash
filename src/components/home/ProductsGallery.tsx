import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import gsap from 'gsap'
import { useContent } from '../../i18n/context'
import { LocalizedLink } from '../../i18n/LocalizedLink'
import { getLenis } from '../../lib/smoothScroll'
import { Picture } from '../ui/Picture'
import styles from './ProductsGallery.module.css'

const REDUCED = '(prefers-reduced-motion: reduce)'
const MOBILE = '(max-width: 767px)'
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
const getReduced = () => window.matchMedia(REDUCED).matches

/** Auto speed in px/s: calm and luxurious, a little slower on phones. */
const SPEED_DESKTOP = 45
const SPEED_MOBILE = 30
/** Scroll velocity adds to the speed: clamped to ±4× the base speed, smoothed over ~0.6s. */
const SCROLL_CLAMP = 4
const SCROLL_COUPLING = 0.18
const SCROLL_TAU = 0.2
/** Pause / resume deceleration (about 0.4s). */
const PAUSE_TAU = 0.13
/** Easing back to the auto speed after a drag (about 0.8s). */
const RESUME_TAU = 0.25
/** Drag inertia (about 0.8s back to the auto speed). */
const INERTIA_TAU = 0.28
const MAX_FLICK = 3000
/** Card image parallax inside its frame, in px. */
const PARALLAX = 12

/** Lucide "pause" and "play" (ISC licence), decorative. */
const Icon = ({ playing }: { playing: boolean }) => (
  <svg
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
    {playing ? (
      <>
        <rect x="14" y="3" width="5" height="18" rx="1" />
        <rect x="5" y="3" width="5" height="18" rx="1" />
      </>
    ) : (
      <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
    )}
  </svg>
)

export function ProductsGallery() {
  const { products, lang, ui } = useContent()
  const reduced = useSyncExternalStore(subscribeReduced, getReduced)
  // User pause (WCAG 2.2.2). The engine reads it from a ref.
  const [userPaused, setUserPaused] = useState(false)
  const userPausedRef = useRef(false)
  useEffect(() => {
    userPausedRef.current = userPaused
  }, [userPaused])

  // Any number of products (3 to 30): the row repeats until it is always wider than the screen plus one set.
  const count = products.items.length
  // With an odd count the repeating unit is two sets, so the tilt / stagger alternation never breaks at the seam.
  const perSet = count % 2 === 0 ? count : count * 2
  const signature = products.items.map((p) => p.id ?? p.slug).join('|')
  const copies = reduced ? 1 : Math.min(8, Math.max(2, Math.ceil(2600 / (perSet * 308)) + 1))

  const stageRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)

  /*
    The automatic carousel. One GSAP-ticker callback moves the track with a transform, wrapped over exactly
    one set width (the second set is a duplicate), so there is never a seam. Layout is measured once
    (resize / fonts / language change) and cached; nothing is read from the DOM inside the tick.
    `lang` rebuilds it (the page keys <main> by language, so this also runs fresh after a switch).
  */
  useLayoutEffect(() => {
    if (reduced) return
    const stage = stageRef.current
    const track = trackRef.current
    if (!stage || !track) return

    const root = document.documentElement
    const rtl = root.dir === 'rtl'
    // EN: cards travel right→left (x decreases); AR: left→right (x increases).
    const dir = rtl ? 1 : -1
    const items = Array.from(track.children) as HTMLElement[]
    const half = perSet
    const images = items.map((li) => li.querySelector<HTMLElement>('[data-parallax]'))
    const mobileMq = window.matchMedia(MOBILE)

    let setWidth = 0
    let trackWidth = 0
    let vw = 0
    let centers: number[] = []
    let base = SPEED_DESKTOP
    const measure = () => {
      vw = stage.clientWidth
      trackWidth = track.offsetWidth
      setWidth = Math.abs(items[half].offsetLeft - items[0].offsetLeft)
      centers = items.map((li) => li.offsetLeft + li.offsetWidth / 2)
      base = mobileMq.matches ? SPEED_MOBILE : SPEED_DESKTOP
    }
    measure()

    const wrap = rtl ? gsap.utils.wrap(0, 1) : gsap.utils.wrap(-1, 0)
    // x is kept in [-setWidth, 0) (EN) or [0, setWidth) (AR).
    const wrapX = (x: number) => (setWidth > 0 ? wrap(x / setWidth) * setWidth : 0)

    const s = {
      x: 0,
      pf: 1, // pause factor: 1 = full speed, 0 = stopped (smoothed)
      boost: 0, // smoothed scroll-velocity contribution, px/s (positive = along the travel direction)
      drag: 0, // inertia velocity from a release, px/s (signed screen direction)
      nudge: 0, // pending keyboard-focus shift, px
      slow: false, // easing back after a drag (slower than a hover pause)
      hover: false,
      focus: false,
      dragging: false,
      onscreen: false,
    }
    let lastPointerX = 0
    let lastPointerT = 0
    let flick = 0

    const paint = () => {
      track.style.transform = `translate3d(${s.x.toFixed(2)}px,0,0)`
      const origin = (rtl ? vw - trackWidth : 0) + s.x - vw / 2
      for (let i = 0; i < items.length; i++) {
        const img = images[i]
        if (!img) continue
        const rel = (origin + centers[i]) / (vw / 2 + 200)
        if (rel > 1.4 || rel < -1.4) continue
        img.style.transform = `translate3d(${(-rel * PARALLAX).toFixed(2)}px,0,0) scale(1.1)`
      }
    }

    const tick = (_time: number, deltaMs: number) => {
      if (!s.onscreen || document.hidden || setWidth <= 0) return
      const dt = Math.min(deltaMs, 100) / 1000

      const wantPause = s.hover || s.focus || userPausedRef.current || s.dragging
      if (s.pf > 0.98) s.slow = false
      const tau = s.slow ? RESUME_TAU : PAUSE_TAU
      s.pf += ((wantPause ? 0 : 1) - s.pf) * (1 - Math.exp(-dt / tau))

      // Scroll-velocity coupling (Lenis): scrolling down speeds the row up along its direction,
      // scrolling up briefly reverses it.
      const lenis = getLenis()
      const sv = lenis ? lenis.velocity * 60 * SCROLL_COUPLING : 0
      const target = Math.max(-SCROLL_CLAMP * base, Math.min(SCROLL_CLAMP * base, sv))
      s.boost += (target - s.boost) * (1 - Math.exp(-dt / SCROLL_TAU))

      if (!s.dragging) {
        s.x += dir * (base + s.boost) * s.pf * dt + s.drag * dt
        s.drag *= Math.exp(-dt / INERTIA_TAU)
        if (Math.abs(s.drag) < 1) s.drag = 0
      }
      if (s.nudge !== 0) {
        const step = s.nudge * (1 - Math.exp(-dt / 0.12))
        s.x += step
        s.nudge -= step
        if (Math.abs(s.nudge) < 0.1) s.nudge = 0
      }
      s.x = wrapX(s.x)
      paint()
    }

    // ---------- Drag / swipe (pointer events; touch-action: pan-y keeps vertical scrolling) ----------
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      s.dragging = true
      s.drag = 0
      s.pf = 0
      flick = 0
      lastPointerX = e.clientX
      lastPointerT = performance.now()
      stage.setPointerCapture(e.pointerId)
      stage.classList.add(styles.dragging)
    }
    const onMove = (e: PointerEvent) => {
      if (!s.dragging) return
      const now = performance.now()
      const dx = e.clientX - lastPointerX
      const dtMs = Math.max(1, now - lastPointerT)
      s.x = wrapX(s.x + dx)
      flick = flick * 0.6 + (dx / dtMs) * 1000 * 0.4
      lastPointerX = e.clientX
      lastPointerT = now
      paint()
    }
    const onUp = (e: PointerEvent) => {
      if (!s.dragging) return
      s.dragging = false
      s.slow = true
      // A pause before releasing means no inertia.
      const idle = performance.now() - lastPointerT
      s.drag = idle > 90 ? 0 : Math.max(-MAX_FLICK, Math.min(MAX_FLICK, flick))
      if (stage.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId)
      stage.classList.remove(styles.dragging)
    }

    // ---------- Pause on hover / keyboard focus ----------
    const onOver = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && (e.target as Element).closest('li')) s.hover = true
    }
    const onOut = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const to = e.relatedTarget as Element | null
      if (!to || !to.closest || !to.closest('li')) s.hover = false
    }
    const onFocusIn = (e: FocusEvent) => {
      s.focus = true
      const li = (e.target as Element).closest('li')
      if (!li) return
      // Bring the focused card into view (one measurement, in the event handler, not in the tick).
      const r = li.getBoundingClientRect()
      const sr = stage.getBoundingClientRect()
      if (r.left < sr.left + 16 || r.right > sr.right - 16) {
        s.nudge = sr.left + sr.width / 2 - (r.left + r.width / 2)
      }
    }
    const onFocusOut = (e: FocusEvent) => {
      const to = e.relatedTarget as Element | null
      if (!to || !stage.contains(to)) s.focus = false
    }

    stage.addEventListener('pointerdown', onDown)
    stage.addEventListener('pointermove', onMove)
    stage.addEventListener('pointerup', onUp)
    stage.addEventListener('pointercancel', onUp)
    stage.addEventListener('pointerover', onOver)
    stage.addEventListener('pointerout', onOut)
    stage.addEventListener('focusin', onFocusIn)
    stage.addEventListener('focusout', onFocusOut)

    // Offscreen: no work at all.
    const io = new IntersectionObserver(
      ([entry]) => {
        s.onscreen = entry.isIntersecting
      },
      { rootMargin: '80px 0px' },
    )
    io.observe(stage)

    // Re-measure on resize, when the web fonts arrive and (through the remount) on language change.
    const ro = new ResizeObserver(() => {
      measure()
      s.x = wrapX(s.x)
      paint()
    })
    ro.observe(stage)
    let cancelled = false
    void document.fonts.ready.then(() => {
      if (cancelled) return
      measure()
      s.x = wrapX(s.x)
      paint()
    })

    paint()
    gsap.ticker.add(tick)
    root.dataset.carouselTickers = String(Number(root.dataset.carouselTickers ?? 0) + 1)

    return () => {
      cancelled = true
      gsap.ticker.remove(tick)
      root.dataset.carouselTickers = String(
        Math.max(0, Number(root.dataset.carouselTickers ?? 1) - 1),
      )
      io.disconnect()
      ro.disconnect()
      stage.removeEventListener('pointerdown', onDown)
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerup', onUp)
      stage.removeEventListener('pointercancel', onUp)
      stage.removeEventListener('pointerover', onOver)
      stage.removeEventListener('pointerout', onOut)
      stage.removeEventListener('focusin', onFocusIn)
      stage.removeEventListener('focusout', onFocusOut)
      stage.classList.remove(styles.dragging)
      track.style.transform = ''
      images.forEach((img) => img && (img.style.transform = ''))
    }
    // The loop is rebuilt when the language, the number of products or their order changes.
  }, [reduced, lang, perSet, signature])

  const renderCards = () =>
    Array.from({ length: copies * perSet }, (_, g) => {
      const item = products.items[g % count]
      const duplicate = g >= count
      const i = g
      return (
        <li
          key={`${g}-${item.id ?? item.slug}`}
          className={`${styles.item} ${i % 2 === 0 ? styles.odd : styles.even}`}
          tabIndex={duplicate ? undefined : 0}
          aria-hidden={duplicate ? true : undefined}
          inert={duplicate ? true : undefined}
        >
          <article className={styles.card}>
            <div className={styles.imageWrap}>
              <Picture
                group="products"
                name={item.slug}
                cms={item.image}
                alt={duplicate ? '' : item.name}
                sizes="min(350px, max(260px, 24vw))"
                loading={!duplicate && g < 3 ? 'eager' : 'lazy'}
                imgProps={{ 'data-parallax': '' }}
              />
            </div>
            <div className={styles.text}>
              <h3 className={styles.name}>{item.name}</h3>
              <p className={`${styles.description} role-light`}>{item.description}</p>
            </div>
          </article>
        </li>
      )
    })

  return (
    <section id="products" className={styles.section}>
      <div className={`container ${styles.header}`}>
        <p className={`${styles.label} role-light`}>{products.title}</p>
        <p className={`${styles.listIntro} role-light`}>{products.listIntro}</p>
      </div>
      {/* The statement is shown as the large background title below (aria-hidden); this keeps it for screen readers. */}
      <h2 className="visually-hidden">{products.headline}</h2>

      <div
        ref={stageRef}
        className={`${styles.stage} ${reduced ? styles.scroller : styles.marquee}`}
      >
        <div className={`${styles.bg} role-display`} aria-hidden="true">
          {products.headline}
        </div>
        <div className={styles.viewport}>
          <ul ref={trackRef} className={styles.track}>
            {renderCards()}
          </ul>
        </div>
      </div>

      {!reduced && (
        <div className={`container ${styles.controls}`}>
          <button
            type="button"
            className={styles.pause}
            aria-label={userPaused ? ui.carouselPlay : ui.carouselPause}
            onClick={() => setUserPaused((p) => !p)}
          >
            <Icon playing={!userPaused} />
          </button>
        </div>
      )}

      <div className={`container ${styles.after}`}>
        <p className={styles.note}>{products.note}</p>
        <div className={styles.ctas}>
          <LocalizedLink to={{ route: 'contact' }} className={styles.primary}>
            {products.cta.catalogue}
          </LocalizedLink>
          <LocalizedLink to={{ route: 'contact' }} className={styles.textLink}>
            {products.cta.samples}
          </LocalizedLink>
          <LocalizedLink to={{ route: 'contact' }} className={styles.textLink}>
            {products.cta.quote}
          </LocalizedLink>
        </div>
      </div>
    </section>
  )
}
