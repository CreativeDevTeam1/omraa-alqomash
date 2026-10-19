import { setHeroHold } from './heroIntro'

const SEEN_KEY = 'omraa-loader-seen'
const HOME_PATH = /^\/(?:(?:en|ar)\/?)?$/

const read = (fn: () => boolean) => {
  try {
    return fn()
  } catch {
    return false
  }
}

const isHomeEntry = HOME_PATH.test(window.location.pathname)
const seen = read(() => window.sessionStorage.getItem(SEEN_KEY) === '1')
const reduced = read(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

/**
 * Decided once, when the app starts: the loader plays only when the visit begins on Home,
 * the first time in this browser session. Mirrors the inline script in index.html.
 */
export const loaderState = {
  /** The full sequence is waiting to run (or running). */
  pending: isHomeEntry && !seen && !reduced,
  /** Reduced motion on a first Home visit: skip the sequence, fade the hero in over 300ms. */
  reducedFade: isHomeEntry && !seen && reduced,
}

if (loaderState.pending) setHeroHold(true)

export const markLoaderSeen = () => {
  loaderState.pending = false
  loaderState.reducedFade = false
  read(() => {
    window.sessionStorage.setItem(SEEN_KEY, '1')
    return true
  })
}
