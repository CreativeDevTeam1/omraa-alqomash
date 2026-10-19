import { createImageUrlBuilder } from '@sanity/image-url'
import { SANITY } from '../content/fromSanity'
import type { CmsImage } from '../content/fromSanity'

const builder = createImageUrlBuilder({ projectId: SANITY.projectId, dataset: SANITY.dataset })

/** Widths generated for CMS images (never above the original). */
export const CMS_WIDTHS = [480, 800, 1200, 1800]

const source = (image: CmsImage) => ({
  _type: 'image',
  asset: { _type: 'reference', _ref: image.assetId },
  hotspot: image.hotspot,
  crop: image.crop,
})

/** Size of the image after the editor's crop. */
export const cmsSize = (image: CmsImage) => {
  const { left = 0, right = 0, top = 0, bottom = 0 } = image.crop ?? {}
  return {
    width: Math.round(image.width * (1 - left - right)),
    height: Math.round(image.height * (1 - top - bottom)),
  }
}

/** The Sanity image CDN serves WebP and JPEG (it has no AVIF), so a CMS image has no AVIF source. */
export type CmsFormat = 'webp' | 'jpg'

export const cmsSrcSet = (image: CmsImage, format: CmsFormat) => {
  const max = cmsSize(image).width
  const widths = [...new Set([...CMS_WIDTHS.filter((w) => w < max), Math.min(max, 1800)])]
  return widths
    .map((w) => `${builder.image(source(image)).width(w).format(format).quality(78).url()} ${w}w`)
    .join(', ')
}

/** Fallback <img src>: the Sanity image CDN picks the best format for the browser. */
export const cmsFallbackSrc = (image: CmsImage) =>
  builder
    .image(source(image))
    .width(Math.min(1200, cmsSize(image).width))
    .auto('format')
    .url()

/** Where the editor's focus point is, as a CSS object-position. */
export const cmsObjectPosition = (image: CmsImage) =>
  image.hotspot
    ? `${(image.hotspot.x * 100).toFixed(1)}% ${(image.hotspot.y * 100).toFixed(1)}%`
    : undefined

/** A plain CDN URL for a poster (full image, WebP). */
export const cmsPosterUrl = (image: CmsImage, width: number) =>
  builder
    .image({ _type: 'image', asset: { _type: 'reference', _ref: image.assetId } })
    .width(width)
    .format('webp')
    .quality(80)
    .url()
