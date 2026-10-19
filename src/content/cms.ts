import { useSyncExternalStore } from 'react'
import { ar } from './ar'
import { channels as staticChannels } from './channels'
import { en } from './en'
import {
  buildSnapshot,
  mergeContent,
  pruneSnapshot,
  QUERY,
  SANITY,
  sameSnapshot,
} from './fromSanity'
import type { CmsChannels, CmsSnapshot } from './fromSanity'
import seededAssets from './seeded-assets.json'
import bundledSnapshot from './snapshot.json'
import type { Content, Lang } from './types'

/**
 * The CMS layer. The site always renders from `snapshot` (the bundled build-time snapshot, or the newest one
 * this browser has already fetched), merged over the static content in en.ts / ar.ts. A live refresh from the
 * Sanity CDN then swaps changed texts in place. If anything goes wrong, nothing changes: the site never
 * depends on Sanity being up.
 */

const CACHE_KEY = 'omraa-cms'
const staticContent: Record<Lang, Content> = { en, ar }

const readCache = (): CmsSnapshot | null => {
  try {
    const cached = JSON.parse(
      window.localStorage.getItem(CACHE_KEY) ?? 'null',
    ) as CmsSnapshot | null
    return cached && cached.content && cached.generatedAt > bundled.generatedAt ? cached : null
  } catch {
    return null
  }
}

const bundled = bundledSnapshot as unknown as CmsSnapshot
/** VITE_CMS_OFF=1 at build time makes a purely static site (no snapshot, no live refresh): the kill switch. */
const OFF = import.meta.env.VITE_CMS_OFF === '1'
const EMPTY: CmsSnapshot = { generatedAt: '', content: { en: {}, ar: {} }, media: {} }
// The newest snapshot wins: a visitor who already fetched a fresher one sees it on the very first paint.
let snapshot: CmsSnapshot = OFF ? EMPTY : (readCache() ?? bundled)

const listeners = new Set<() => void>()
const merged = new Map<Lang, Content>()

const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export const getContent = (lang: Lang): Content => {
  let content = merged.get(lang)
  if (!content) {
    content = mergeContent(staticContent[lang], snapshot.content[lang])
    merged.set(lang, content)
  }
  return content
}

export const getSnapshot = () => snapshot
export const getChannels = (): CmsChannels => ({ ...staticChannels, ...snapshot.channels })

let channelsCache: { source: CmsSnapshot; value: CmsChannels } | null = null
const getChannelsStable = () => {
  if (channelsCache?.source !== snapshot) channelsCache = { source: snapshot, value: getChannels() }
  return channelsCache.value
}

/** Current content for a language (swaps in place when the CMS refresh brings changes). */
export const useCmsContent = (lang: Lang) => useSyncExternalStore(subscribe, () => getContent(lang))
/** Images and videos from the CMS (images swap live; videos are read once per page, see Hero). */
export const useCmsMedia = () => useSyncExternalStore(subscribe, () => snapshot.media)
/** Contact channels (phone, WhatsApp, email, social links). */
export const useChannels = () => useSyncExternalStore(subscribe, getChannelsStable)

/** The local optimised file for an asset that was seeded from the site (e.g. "products/lycra"), if any. */
export const seededKey = (assetId: string | undefined): string | undefined =>
  assetId ? (seededAssets as Record<string, string>)[assetId] : undefined

// ---------------------------------------------------------------------------------------------------

const TIMEOUT_MS = 4000

/** One fetch from the Sanity CDN API; swaps the content if it changed. Silent on any failure. */
export async function refreshFromSanity(): Promise<void> {
  try {
    const url =
      `https://${SANITY.projectId}.apicdn.sanity.io/v${SANITY.apiVersion}/data/query/${SANITY.dataset}` +
      `?perspective=published&query=${encodeURIComponent(QUERY)}`
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS)
    const response = await fetch(url, { signal: controller.signal })
    window.clearTimeout(timer)
    if (!response.ok) return
    const { result } = (await response.json()) as { result?: unknown }
    if (!result || typeof result !== 'object') return
    const full = buildSnapshot(result)
    // Never replace good content with an empty answer.
    if (!full.content.en.hero || !full.content.en.products) return
    const next = pruneSnapshot(full, staticContent, staticChannels)
    if (sameSnapshot(snapshot, next)) return
    snapshot = next
    merged.clear()
    try {
      window.localStorage.setItem(CACHE_KEY, JSON.stringify(next))
    } catch {
      /* private mode / quota: the swap still happens for this visit */
    }
    listeners.forEach((cb) => cb())
  } catch {
    /* offline, blocked or timed out: keep the snapshot */
  }
}

/** The live refresh waits this long after the page has loaded, so it never competes with the first paint,
 *  the largest content or the loading screen. */
const REFRESH_DELAY_MS = 3500

/** Starts the live refresh once the page is interactive and settled. */
export function startLiveRefresh() {
  if (OFF || import.meta.env.VITE_CMS_NOREFRESH === '1') return
  const run = () => {
    window.setTimeout(() => {
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => void })
        .requestIdleCallback
      if (idle) idle(() => void refreshFromSanity())
      else void refreshFromSanity()
    }, REFRESH_DELAY_MS)
  }
  if (document.readyState === 'complete') run()
  else window.addEventListener('load', run, { once: true })
}
