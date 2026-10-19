import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null
let teardown: (() => void) | null = null

export const getLenis = () => lenis

/** Starts Lenis and drives it from the GSAP ticker so ScrollTrigger stays in sync. No-op with reduced motion. */
export const startSmoothScroll = () => {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const instance = new Lenis({ lerp: 0.1, smoothWheel: true })
  const onTick = (time: number) => instance.raf(time * 1000)
  instance.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(onTick)
  gsap.ticker.lagSmoothing(0)
  lenis = instance
  teardown = () => {
    gsap.ticker.remove(onTick)
    instance.destroy()
    lenis = null
  }
}

export const stopSmoothScroll = () => {
  teardown?.()
  teardown = null
}
