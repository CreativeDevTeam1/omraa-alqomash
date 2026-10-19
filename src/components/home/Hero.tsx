import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { useContent } from '../../i18n/context'
import { doesLoaderOwnMedia, isHeroHeld, registerHero } from '../../lib/heroIntro'
import { loaderState } from '../../lib/loaderState'
import { customVideo, posterFor } from '../../lib/cmsMedia'
import { VideoSources } from '../ui/VideoSources'
import styles from './Hero.module.css'

gsap.registerPlugin(CustomEase)
const EASE_LETTER = CustomEase.create('heroLetter', '.2,.7,.2,1')
const EASE_RULE = CustomEase.create('heroRule', '.6,0,.2,1')

const REDUCED = '(prefers-reduced-motion: reduce)'
const MOBILE = '(max-width: 768px)'

export function Hero() {
  const { lang, hero } = useContent()
  const isAr = lang === 'ar'

  const sectionRef = useRef<HTMLElement>(null)
  const videoWrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const ruleRef = useRef<HTMLSpanElement>(null)
  const lineRef = useRef<HTMLParagraphElement>(null)

  const [reduced] = useState(() => window.matchMedia(REDUCED).matches)
  const [mobile] = useState(() => window.matchMedia(MOBILE).matches)
  // While the loading screen is pending it starts the video itself, at the right moment.
  const [held] = useState(() => loaderState.pending)
  // Narrow screens get the smaller poster (the inline script in index.html preloads the same one).
  const posterSrc = posterFor('heroVideo', mobile)
  // CMS video (only once the client has replaced the seeded one); read once, so a late refresh never restarts it.
  const [custom] = useState(() => customVideo('heroVideo'))
  const introPlayed = useRef(false)
  const shownTitle = useRef(hero.title)

  // A late CMS text swap re-renders the title units after the intro has played: show them at once, with no animation
  // (and without replaying the intro).
  useLayoutEffect(() => {
    if (shownTitle.current === hero.title) return
    shownTitle.current = hero.title
    if (!introPlayed.current) return
    titleRef.current?.querySelectorAll<HTMLElement>('[data-unit]').forEach((unit) => {
      unit.style.opacity = '1'
    })
  }, [hero.title])

  // Pause the video while the hero is off-screen.
  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section || reduced) return
    video.muted = true
    let inView = false
    const sync = () => {
      if (inView && !isHeroHeld() && document.visibilityState === 'visible') {
        if (video.paused) video.play().catch(() => {})
      } else if (!inView) video.pause()
    }
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      sync()
    })
    io.observe(section)
    // A play() made while the tab was hidden is refused: retry when it comes back.
    document.addEventListener('visibilitychange', sync)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [reduced])

  // Intro animation. Exposed through playHeroIntro(); plays by itself once fonts are ready,
  // unless the loading screen is pending (it calls playHeroIntro() at the right moment).
  useEffect(() => {
    if (reduced) return
    const title = titleRef.current
    if (!title) return

    let tl: gsap.core.Timeline | null = null
    let cancelled = false

    const play = () => {
      introPlayed.current = true
      tl?.kill()
      const units = title.querySelectorAll('[data-unit]')
      tl = gsap.timeline()
      // The loader animates the video wrapper itself during its hand-off.
      if (!doesLoaderOwnMedia()) {
        tl.fromTo(
          videoWrapRef.current,
          { scale: 1.08 },
          { scale: 1, duration: 2.2, ease: 'power2.out' },
          0,
        )
      }
      tl.fromTo(
        units,
        { opacity: 0, filter: 'blur(10px)', y: '0.25em' },
        {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 1.1,
          // Arabic reveals word by word, so a slightly slower stagger reads the same.
          stagger: isAr ? 0.18 : 0.05,
          ease: EASE_LETTER,
          clearProps: 'filter,transform',
        },
        0.5,
      )
      tl.fromTo(ruleRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: EASE_RULE }, 1.5)
      tl.fromTo(
        lineRef.current,
        { opacity: 0, y: 10 },
        { opacity: 0.85, y: 0, duration: 1, ease: 'power2.out' },
        1.8,
      )
    }

    registerHero({ play, wrap: videoWrapRef.current, video: videoRef.current })
    if (!loaderState.pending) {
      document.fonts.ready.then(() => {
        if (!cancelled) play()
      })
    }

    return () => {
      cancelled = true
      tl?.kill()
      registerHero(null)
    }
  }, [reduced, isAr])

  // EN: split into letters (each word kept whole so wrapping happens between words).
  // AR: split into words only — splitting Arabic letters breaks the joins.
  const words = hero.title.split(' ')
  const renderTitle = () =>
    words.map((word, i) => (
      <Fragment key={i}>
        {i > 0 && ' '}
        <span className={styles.word} aria-hidden="true">
          {isAr ? (
            <span data-unit className={styles.unit}>
              {word}
            </span>
          ) : (
            Array.from(word).map((ch, j) => (
              <span key={j} data-unit className={styles.unit}>
                {ch}
              </span>
            ))
          )}
        </span>
      </Fragment>
    ))

  return (
    <section ref={sectionRef} className={styles.hero}>
      <div ref={videoWrapRef} className={styles.media} aria-hidden="true">
        {reduced ? (
          <img
            className={styles.video}
            src={posterSrc}
            alt=""
            width={1600}
            height={900}
            fetchPriority="high"
          />
        ) : (
          <video
            ref={videoRef}
            className={styles.video}
            poster={posterSrc}
            autoPlay={!held}
            muted
            loop
            playsInline
            preload={mobile ? 'metadata' : 'auto'}
            aria-hidden="true"
            tabIndex={-1}
          >
            <VideoSources name="hero-fabric" custom={custom} />
          </video>
        )}
      </div>

      <div className={styles.content}>
        <h1
          ref={titleRef}
          className={`${styles.title} ${isAr ? styles.titleAr : styles.titleEn}`}
          aria-label={hero.title}
        >
          {renderTitle()}
        </h1>
        <span ref={ruleRef} className={styles.rule} aria-hidden="true" />
        <p ref={lineRef} className={`${styles.line} ${isAr ? styles.lineAr : styles.lineEn}`}>
          {hero.descriptor}
        </p>
      </div>
    </section>
  )
}
