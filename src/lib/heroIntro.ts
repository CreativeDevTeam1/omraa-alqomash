/** What the loading screen needs from the Hero. */
export interface HeroHandle {
  /** Plays the text intro (title → rule → line). Includes the video settle unless the loader owns it. */
  play: () => void
  /** The video wrapper the loader animates during the hand-off. */
  wrap: HTMLElement | null
  video: HTMLVideoElement | null
}

let hero: HeroHandle | null = null

/** True while the loading screen owns the hero video (it must not autoplay or start the intro by itself). */
let held = false
/** True while the loader animates the hero video wrapper (the hero skips its own settle). */
let loaderOwnsMedia = false

const waiting = new Set<(h: HeroHandle) => void>()

export const registerHero = (handle: HeroHandle | null) => {
  hero = handle
  if (handle) {
    waiting.forEach((cb) => cb(handle))
    waiting.clear()
  }
}

/** Calls back as soon as the Hero is registered (immediately if it already is). Returns an unsubscribe. */
export const whenHero = (cb: (h: HeroHandle) => void) => {
  if (hero) cb(hero)
  else waiting.add(cb)
  return () => {
    waiting.delete(cb)
  }
}
export const getHero = () => hero

export const setHeroHold = (value: boolean) => {
  held = value
}
export const isHeroHeld = () => held

export const setLoaderOwnsMedia = (value: boolean) => {
  loaderOwnsMedia = value
}
export const doesLoaderOwnMedia = () => loaderOwnsMedia

/** Plays the Hero intro animation. Safe to call repeatedly. */
export const playHeroIntro = () => hero?.play()
