import manifest from './image-manifest.json'

export type ImageGroup = 'products' | 'uses' | 'photos'

interface ImageInfo {
  widths: number[]
  width: number
  height: number
}

const info = manifest as Record<string, ImageInfo>

export type ImageFormat = 'avif' | 'webp' | 'jpg'

export const imageInfo = (group: ImageGroup, name: string): ImageInfo => {
  const entry = info[`${group}/${name}`]
  if (!entry) throw new Error(`Unknown image: ${group}/${name} (run npm run images)`)
  return entry
}

export const srcSet = (group: ImageGroup, name: string, format: ImageFormat): string =>
  imageInfo(group, name)
    .widths.map((w) => `/images/${group}/${name}-${w}.${format} ${w}w`)
    .join(', ')

/** Largest generated file — used as the plain <img src> fallback. */
export const fallbackSrc = (group: ImageGroup, name: string): string => {
  const { widths } = imageInfo(group, name)
  return `/images/${group}/${name}-${widths[widths.length - 1]}.jpg`
}
