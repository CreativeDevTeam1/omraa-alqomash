import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { getHero, playHeroIntro, setHeroHold, setLoaderOwnsMedia, whenHero } from './heroIntro'
import type { HeroHandle } from './heroIntro'
import { getLenis } from './smoothScroll'

gsap.registerPlugin(CustomEase)

/**
 * Loader: the "Thread + Video" intro (0 – 2.6s, ported from _source/loader-reference, concept 07), then a
 * continuous opening onto the drape video and a cinematic dissolve into the hero while the logo flies
 * into the header. Times are seconds from the start of the loader (the spec's milliseconds / 1000).
 */
const E = {
  base: CustomEase.create('threadBase', '.7,0,.2,1'),
  draw: CustomEase.create('threadDraw', '.6,0,.3,1'),
  pop: CustomEase.create('threadPop', '.2,.8,.2,1'),
  open: CustomEase.create('threadOpen', '.76,0,.24,1'),
  push: CustomEase.create('threadPush', '.22,.7,.2,1'),
  dissolve: CustomEase.create('threadDissolve', '.45,0,.15,1'),
  flight: CustomEase.create('threadFlight', '.65,0,.2,1'),
}

export interface LoaderEls {
  root: HTMLElement
  vid: HTMLElement
  video: HTMLVideoElement
  top: HTMLElement
  bottom: HTMLElement
  svg: SVGSVGElement
  main: SVGPathElement
  stitch: SVGPathElement
  needle: HTMLElement
  logoBg: HTMLElement
  veil: HTMLElement
  logo: HTMLImageElement
  wordmark: HTMLElement
  counterWrap: HTMLElement
  counter: HTMLElement
}

export interface LoaderOptions {
  /** Arabic: the thread is drawn right→left (the SVG is mirrored in CSS; the needle follows). */
  rtl: boolean
  /** Called when the sequence ends: `natural` is false when it was cancelled (e.g. the page unmounted). */
  onDone: (natural: boolean) => void
}

/** The hand-off waits for the hero video and fonts, but never longer than this from the start. */
const HARD_CAP_MS = 6000
/** Hand-off moment (ms 4,700). The hero video starts 250ms earlier. */
const T = 4.7

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))
const pad = (n: number) => String(Math.round(n)).padStart(3, '0')

const headerEl = () => document.querySelector<HTMLElement>('header')
const headerLogoLink = () => headerEl()?.querySelector<HTMLElement>('[data-header-logo]') ?? null

/** Runs the whole loading sequence. Returns a function that cancels it (and cleans up). */
export function runLoader(els: LoaderEls, opts: LoaderOptions): () => void {
  const { rtl } = opts
  // The Hero registers a moment after the loader starts, so it is picked up lazily.
  let hero: HeroHandle | null = getHero()
  let finished = false
  let clone: HTMLElement | null = null
  const tweens: gsap.core.Animation[] = []
  const track = <U extends gsap.core.Animation>(t: U): U => {
    tweens.push(t)
    return t
  }

  // Scroll is locked while the loader shows (the html.loader-on class also hides overflow).
  window.scrollTo(0, 0)
  getLenis()?.stop()
  document.getElementById('main')?.setAttribute('aria-busy', 'true')
  setLoaderOwnsMedia(true)
  setHeroHold(true)
  document.documentElement.classList.add('loader-on', 'loader-mounted')

  // Hold state of the hero video wrapper while the loader covers it.
  const heroFrom = {
    scale: 1.14,
    filter: 'blur(10px) brightness(0.8)',
    willChange: 'transform, filter',
  }
  const applyHold = () => {
    if (hero?.wrap) gsap.set(hero.wrap, heroFrom)
    try {
      hero?.video?.pause()
      if (hero?.video) hero.video.currentTime = 0
    } catch {
      /* the video may not be ready yet */
    }
  }
  applyHold()
  const stopWaiting = whenHero((h) => {
    hero = h
    applyHold()
  })

  // ---------- Real loading: the hand-off waits for these (capped) ----------
  let ready = false
  const videoReady = new Promise<void>((resolve) => {
    whenHero((h) => {
      const video = h.video
      if (!video || video.readyState >= 4) return resolve()
      video.addEventListener('canplaythrough', () => resolve(), { once: true })
      video.addEventListener('error', () => resolve(), { once: true })
      // Phones may not buffer a paused video: accept "has data" after a while.
      void wait(3500).then(() => video.readyState >= 2 && resolve())
    })
  })
  const assetsReady = Promise.all([videoReady, document.fonts.ready]).then(() => undefined)
  void assetsReady.then(() => {
    ready = true
  })
  const capReached = wait(HARD_CAP_MS).then(() => {
    ready = true
  })

  // ---------- Start state ----------
  const { vid, video, top, bottom, svg, main, stitch, needle, logoBg, veil, logo, wordmark } = els
  const L = main.getTotalLength()
  gsap.set(main, { strokeDasharray: L, strokeDashoffset: L })
  gsap.set(stitch, { clipPath: 'inset(0 100% 0 0)' })
  gsap.set(video, { scale: 1.18 })
  gsap.set(logo, { opacity: 0, y: 10 })
  gsap.set(wordmark, { opacity: 0, letterSpacing: '0.6em' })
  gsap.set(veil, { opacity: 0 })
  // Pre-promote the layers that dissolve (filter pipeline ready before T, so no blank frame at the hand-off).
  gsap.set(vid, { filter: 'blur(0px) brightness(1)', willChange: 'filter, opacity' })
  video.currentTime = 0
  video.play().catch(() => {})

  // The needle rides the path tip (positions measured from the SVG box, so it follows any size).
  const placeNeedle = (p: number) => {
    const pt = main.getPointAtLength(L * p)
    const sr = svg.getBoundingClientRect()
    const lr = els.root.getBoundingClientRect()
    const x = rtl ? 1000 - pt.x : pt.x
    needle.style.left = `${sr.left - lr.left + (x / 1000) * sr.width}px`
    needle.style.top = `${sr.top - lr.top + (pt.y / 200) * sr.height}px`
  }
  placeNeedle(0)

  const tl = track(gsap.timeline())

  // ---------- 0 – 2.6s: unchanged from the Thread + Video intro ----------
  tl.fromTo(
    main,
    { strokeDashoffset: L },
    { strokeDashoffset: 0, duration: 1.9, ease: E.draw, immediateRender: false },
    0.15,
  )
  tl.fromTo(
    stitch,
    { clipPath: 'inset(0 100% 0 0)' },
    { clipPath: 'inset(0 0% 0 0)', duration: 1.9, ease: E.draw, immediateRender: false },
    0.4,
  )
  const np = { p: 0 }
  tl.to(np, { p: 1, duration: 1.9, ease: 'power3.inOut', onUpdate: () => placeNeedle(np.p) }, 0.15)
  tl.to(needle, { opacity: 0, duration: 0.25, ease: E.base }, 0.15 + 1.9)

  const cv = { v: 0 }
  tl.to(
    cv,
    {
      v: 100,
      duration: 2.4,
      ease: 'power3.inOut',
      onUpdate: () => {
        els.counter.textContent = pad(cv.v)
      },
    },
    0.15,
  )
  tl.fromTo(
    logo,
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.8, ease: E.pop, immediateRender: false },
    1.1,
  )
  tl.fromTo(
    wordmark,
    { opacity: 0, letterSpacing: '0.6em' },
    { opacity: 1, letterSpacing: '0.32em', duration: 0.9, ease: E.pop, immediateRender: false },
    1.4,
  )

  // ---------- 2.65: wordmark and counter fade out (the logo stays); 2.9: the thread fades out ----------
  tl.to(wordmark, { opacity: 0, duration: 0.3, ease: E.base }, 2.65)
  tl.to(els.counterWrap, { opacity: 0, duration: 0.3, ease: E.base }, 2.65)
  tl.to(svg, { opacity: 0, duration: 0.3, ease: E.base }, 2.9)

  // ---------- 2.9 → 4.3: the screen opens onto the drape in ONE continuous move ----------
  tl.to(top, { yPercent: -101, duration: 1.4, ease: E.open, immediateRender: false }, 2.9)
  tl.to(bottom, { yPercent: 101, duration: 1.4, ease: E.open, immediateRender: false }, 2.9)
  // 2.9 → 5.2: the drape slowly pushes in.
  tl.fromTo(
    video,
    { scale: 1.18 },
    { scale: 1.04, duration: 2.3, ease: E.push, immediateRender: false },
    2.9,
  )
  // 2.9: behind the logo, the ivory veil keeps it on an approved ground over the video.
  tl.to(veil, { opacity: 1, duration: 0.6, ease: E.base }, 2.9)
  tl.to(logoBg, { opacity: 0, duration: 0.6, ease: E.base }, 2.9)

  // ---------- T − 0.25: hero video starts from 0 (waits here for real loading) ----------
  const startHero = () => {
    setHeroHold(false)
    const hv = hero?.video
    if (hv) {
      hv.currentTime = 0
      hv.play().catch(() => {})
    }
  }
  tl.call(
    () => {
      if (ready) return startHero()
      tl.pause()
      void Promise.race([assetsReady, capReached]).then(() => {
        if (finished) return
        startHero()
        tl.play()
      })
    },
    [],
    T - 0.25,
  )

  // ---------- T → T + 1.5: drape → hero dissolve (push-through) ----------
  tl.to(
    video,
    { scale: 1.22, duration: 1.5, ease: E.dissolve, overwrite: 'auto', immediateRender: false },
    T,
  )
  tl.to(
    vid,
    {
      filter: 'blur(12px) brightness(1.08)',
      opacity: 0,
      duration: 1.5,
      ease: E.dissolve,
      immediateRender: false,
    },
    T,
  )
  tl.to(veil, { opacity: 0, duration: 1.5, ease: E.dissolve }, T)

  // ---------- T → T + 1.9: the hero rises into focus under it ----------
  tl.call(
    () => {
      const wrap = hero?.wrap
      if (!wrap) return
      track(
        gsap.to(wrap, {
          scale: 1,
          filter: 'blur(0px) brightness(1)',
          duration: 1.9,
          ease: E.push,
          onComplete: () => {
            gsap.set(wrap, { clearProps: 'transform,filter,willChange' })
          },
        }),
      )
    },
    [],
    T,
  )

  // ---------- T − 0.1 → T + 1.2: logo flight (FLIP), measured when it starts ----------
  tl.call(
    () => {
      const link = headerLogoLink()
      const target = link?.querySelector('img')
      if (!link || !target) {
        if (link) gsap.set(link, { opacity: 1 })
        return
      }
      const from = logo.getBoundingClientRect()
      const to = target.getBoundingClientRect()
      clone = logo.cloneNode() as HTMLImageElement
      Object.assign(clone.style, {
        position: 'fixed',
        left: `${from.left}px`,
        top: `${from.top}px`,
        width: `${from.width}px`,
        height: `${from.height}px`,
        margin: '0',
        padding: '0',
        zIndex: '200',
        pointerEvents: 'none',
        transformOrigin: '0 0',
        opacity: '1',
        willChange: 'transform',
      })
      document.body.appendChild(clone)
      gsap.set(logo, { opacity: 0 })
      const flying = clone
      track(
        gsap.to(flying, {
          x: to.left - from.left,
          y: to.top - from.top,
          scale: to.width / from.width,
          duration: 1.3,
          ease: E.flight,
          onComplete: () => {
            // Swap in the same frame: the real logo appears as the clone disappears.
            gsap.set(link, { opacity: 1 })
            flying.remove()
            if (clone === flying) clone = null
          },
        }),
      )
    },
    [],
    T - 0.1,
  )

  // ---------- T + 0.3 → T + 1.0: header background, nav and language switch fade in ----------
  tl.to(headerEl(), { opacity: 1, duration: 0.7, ease: E.base }, T + 0.3)

  // ---------- T + 1.0: hero text intro ----------
  tl.call(
    () => {
      setLoaderOwnsMedia(false)
      playHeroIntro()
    },
    [],
    T + 1.0,
  )

  // ---------- T + 1.9: remove the loader, release scroll ----------
  tl.call(() => complete(), [], T + 1.9)

  /** Natural end: remove the loader and unlock scroll. */
  const complete = () => {
    if (finished) return
    finished = true
    // Drop html.loader-on first; inline opacity values are cleared right after, so nothing flashes.
    opts.onDone(true)
    gsap.set([headerEl(), headerLogoLink()], { clearProps: 'opacity' })
    getLenis()?.start()
    document.getElementById('main')?.removeAttribute('aria-busy')
  }

  /** Cancelled (unmounted mid-sequence): stop everything and restore the page. */
  const cancel = () => {
    if (finished) return
    finished = true
    stopWaiting()
    tweens.forEach((t) => t.kill())
    clone?.remove()
    clone = null
    setHeroHold(false)
    setLoaderOwnsMedia(false)
    opts.onDone(false)
    gsap.set([headerEl(), headerLogoLink()], { clearProps: 'opacity' })
    if (hero?.wrap) gsap.set(hero.wrap, { clearProps: 'transform,filter' })
    getLenis()?.start()
    document.getElementById('main')?.removeAttribute('aria-busy')
  }

  return cancel
}
