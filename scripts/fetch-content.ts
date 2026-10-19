// Build-time snapshot of the CMS content (src/content/snapshot.json), run before `vite build`.
// The site renders from this file, so first paint, SEO and the loader are exactly as without a CMS.
// If Sanity cannot be reached (or answers with something unexpected) the last committed snapshot is kept:
// this script NEVER fails the build.
import fs from 'node:fs'
import { channels } from '../src/content/channels.ts'
import { ar } from '../src/content/ar.ts'
import { en } from '../src/content/en.ts'
import {
  buildSnapshot,
  pruneSnapshot,
  QUERY,
  SANITY,
  sameSnapshot,
} from '../src/content/fromSanity.ts'
import type { CmsSnapshot } from '../src/content/fromSanity.ts'

const FILE = new URL('../src/content/snapshot.json', import.meta.url)
const EMPTY: CmsSnapshot = { generatedAt: '', content: { en: {}, ar: {} }, media: {} }

const read = (): CmsSnapshot => {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8')) as CmsSnapshot
  } catch {
    return EMPTY
  }
}

async function main() {
  const previous = read()
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify(EMPTY, null, 2) + '\n')
  try {
    const url =
      `https://${SANITY.projectId}.apicdn.sanity.io/v${SANITY.apiVersion}/data/query/${SANITY.dataset}` +
      `?perspective=published&query=${encodeURIComponent(QUERY)}`
    const response = await fetch(url, { signal: AbortSignal.timeout(10_000) })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const { result } = (await response.json()) as { result?: unknown }
    if (!result || typeof result !== 'object') throw new Error('empty result')
    const full = buildSnapshot(result)
    if (!full.content.en.hero || !full.content.en.products)
      throw new Error('no content documents yet')
    // Only what differs from en.ts / ar.ts is kept: the snapshot ships in the JS bundle, so it stays tiny.
    const next = pruneSnapshot(full, { en, ar }, channels)
    if (sameSnapshot(previous, next)) {
      console.log('[cms] snapshot is up to date')
      return
    }
    fs.writeFileSync(FILE, JSON.stringify(next, null, 2) + '\n')
    console.log('[cms] snapshot updated from Sanity')
  } catch (error) {
    console.warn(
      `[cms] Sanity not reachable (${(error as Error).message}); using the committed snapshot`,
    )
  }
}

main().catch((error) => console.warn('[cms] snapshot step skipped:', error))
