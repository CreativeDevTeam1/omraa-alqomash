import manifest from './media-manifest.json'

type MediaKey = keyof typeof manifest

/**
 * URL of a file in public/media. Files are content-hashed by scripts/encode-videos.mjs (the name carries the
 * first 8 hex chars of its SHA-256), so a re-encode is picked up at once even with immutable caching.
 */
export const media = (key: MediaKey): string => manifest[key]
