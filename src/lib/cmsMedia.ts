import { getSnapshot, seededKey } from '../content/cms'
import type { CmsVideo } from '../content/fromSanity'
import { cmsPosterUrl } from './cmsImage'
import { media } from '../media'

type Kind = 'heroVideo' | 'loaderVideo'
const LOCAL = { heroVideo: 'hero-fabric', loaderVideo: 'drape-closeup' } as const

/** The CMS video, but only once the client has replaced the seeded one (until then the local, optimised files play). */
export const customVideo = (kind: Kind): CmsVideo | null => {
  const video = getSnapshot().media[kind]
  return video && !seededKey(video.fileAssetId) ? video : null
}

/** Poster for the hero / loader video: the local hashed WebP, or the CMS poster once it was replaced. */
export const posterFor = (kind: Kind, small: boolean): string => {
  const poster = getSnapshot().media[kind]?.poster
  if (poster && !seededKey(poster.assetId)) return cmsPosterUrl(poster, small ? 800 : 1600)
  const stem = LOCAL[kind]
  return media(`${stem}-poster.webp`)
}
