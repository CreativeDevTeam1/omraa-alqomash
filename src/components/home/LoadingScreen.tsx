import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { getContent } from '../../content/cms'
import { useContent } from '../../i18n/context'
import { loaderState, markLoaderSeen } from '../../lib/loaderState'
import { runLoader } from '../../lib/loaderSequence'
import { customVideo, posterFor } from '../../lib/cmsMedia'
import { VideoSources } from '../ui/VideoSources'
import styles from './LoadingScreen.module.css'

/** Loader 07 "Thread + Video": a terracotta thread is drawn, the screen opens along it, the hero rises. */
export function LoadingScreen() {
  const { lang } = useContent()
  const rtl = lang === 'ar'
  // Decided once, at the first render.
  const [active] = useState(() => loaderState.pending)
  const [visible, setVisible] = useState(active)
  const [fading, setFading] = useState(() => loaderState.reducedFade)
  const [posterSrc] = useState(() =>
    posterFor('loaderVideo', window.matchMedia('(max-width: 768px)').matches),
  )

  const rootRef = useRef<HTMLDivElement>(null)
  const vidRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const mainRef = useRef<SVGPathElement>(null)
  const stitchRef = useRef<SVGPathElement>(null)
  const needleRef = useRef<HTMLDivElement>(null)
  const logoBgRef = useRef<HTMLDivElement>(null)
  const veilRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)
  const wordmarkRef = useRef<HTMLParagraphElement>(null)
  const counterWrapRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)

  // Cover the page in the very first paint (the inline script in index.html added html.loader-on).
  useLayoutEffect(() => {
    if (active) document.documentElement.classList.add('loader-mounted')
  }, [active])

  useEffect(() => {
    if (!active) return
    const els = {
      root: rootRef.current,
      vid: vidRef.current,
      video: videoRef.current,
      top: topRef.current,
      bottom: bottomRef.current,
      svg: svgRef.current,
      main: mainRef.current,
      stitch: stitchRef.current,
      needle: needleRef.current,
      logoBg: logoBgRef.current,
      veil: veilRef.current,
      logo: logoRef.current,
      wordmark: wordmarkRef.current,
      counterWrap: counterWrapRef.current,
      counter: counterRef.current,
    }
    if (Object.values(els).some((el) => !el)) return

    return runLoader(els as Parameters<typeof runLoader>[0], {
      rtl,
      onDone: (natural) => {
        document.documentElement.classList.remove('loader-on', 'loader-mounted')
        if (natural) {
          markLoaderSeen()
          setVisible(false)
        }
      },
    })
    // The sequence runs once per mount; the language cannot change while it plays.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  if (fading) {
    // Reduced motion: no sequence, the hero simply fades in over 300ms.
    return (
      <div
        className={styles.reducedFade}
        aria-hidden="true"
        role="presentation"
        onAnimationEnd={() => {
          markLoaderSeen()
          setFading(false)
        }}
      />
    )
  }

  if (!visible) return null

  const columns = [0, 1, 2, 3, 4]
  return (
    <div ref={rootRef} className={styles.loader} aria-hidden="true" role="presentation">
      <div ref={vidRef} className={styles.vid}>
        <video
          ref={videoRef}
          className={styles.videoEl}
          poster={posterSrc}
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          tabIndex={-1}
        >
          <VideoSources name="drape-closeup" custom={customVideo('loaderVideo')} />
        </video>
      </div>

      <div ref={topRef} className={`${styles.half} ${styles.top}`}>
        <div className={styles.cols}>
          {columns.map((c) => (
            <span key={c} />
          ))}
        </div>
      </div>
      <div ref={bottomRef} className={`${styles.half} ${styles.bottom}`}>
        <div className={styles.cols}>
          {columns.map((c) => (
            <span key={c} />
          ))}
        </div>
      </div>

      <svg
        ref={svgRef}
        className={`${styles.thread} ${rtl ? styles.threadRtl : ''}`}
        viewBox="0 0 1000 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          ref={stitchRef}
          className={styles.stitch}
          d="M-10 112 C 140 40, 260 170, 400 104 S 640 40, 780 110 S 940 150, 1010 92"
        />
        <path
          ref={mainRef}
          className={styles.main}
          d="M-10 100 C 140 30, 260 160, 400 94 S 640 30, 780 100 S 940 140, 1010 82"
        />
      </svg>
      <div ref={needleRef} className={styles.needle} />

      <div className={styles.center}>
        <div className={styles.logoWrap}>
          <div ref={veilRef} className={styles.veil} />
          <div ref={logoBgRef} className={styles.logoBg} />
          <img
            ref={logoRef}
            className={styles.logo}
            src="/omraa-logo.svg"
            width={556}
            height={280}
            alt=""
          />
        </div>
        <p ref={wordmarkRef} className={styles.wordmark} dir="ltr" lang="en">
          {getContent('en').brand.name}
        </p>
      </div>

      <div ref={counterWrapRef} className={styles.counterWrap}>
        <div className={styles.counterText} dir="ltr">
          <span ref={counterRef}>000</span>
          <small className={styles.percent}>%</small>
        </div>
      </div>
    </div>
  )
}
