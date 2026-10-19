import { cmsFallbackSrc, cmsObjectPosition, cmsSize, cmsSrcSet } from '../../lib/cmsImage'
import { fallbackSrc, imageInfo, srcSet } from '../../lib/images'
import type { ImageGroup } from '../../lib/images'
import { seededKey } from '../../content/cms'
import type { CmsImage } from '../../content/fromSanity'

interface Props {
  /** The local optimised image (public/images): used when there is no CMS image, or the CMS image is the seeded one. */
  group?: ImageGroup
  name?: string
  /** The image from the CMS. Once the client replaces the seeded image, it is served from the Sanity image CDN. */
  cms?: CmsImage
  alt: string
  /** CSS `sizes` value — describe the rendered width, not the source. */
  sizes: string
  className?: string
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
  /** Extra attributes for the <img> (e.g. a data-* hook). */
  imgProps?: Record<`data-${string}`, string>
}

/** The local file for a seeded CMS asset ("products/lycra" → group + name). */
const localOf = (cms: CmsImage | undefined, group?: ImageGroup, name?: string) => {
  const key = seededKey(cms?.assetId)
  if (key && key.includes('/') && !key.startsWith('video:') && !key.startsWith('poster:')) {
    const [g, n] = key.split('/')
    return { group: g as ImageGroup, name: n }
  }
  return group && name && (!cms || key) ? { group, name } : null
}

/** AVIF → WebP → JPG with responsive widths and intrinsic dimensions (no layout shift). */
export function Picture({
  group,
  name,
  cms,
  alt,
  sizes,
  className,
  loading = 'lazy',
  fetchPriority,
  imgProps,
}: Props) {
  const local = localOf(cms, group, name)
  if (local) {
    const { width, height } = imageInfo(local.group, local.name)
    return (
      <picture>
        <source type="image/avif" srcSet={srcSet(local.group, local.name, 'avif')} sizes={sizes} />
        <source type="image/webp" srcSet={srcSet(local.group, local.name, 'webp')} sizes={sizes} />
        <img
          className={className}
          src={fallbackSrc(local.group, local.name)}
          srcSet={srcSet(local.group, local.name, 'jpg')}
          sizes={sizes}
          width={width}
          height={height}
          alt={alt}
          loading={loading}
          decoding="async"
          fetchPriority={fetchPriority}
          {...imgProps}
        />
      </picture>
    )
  }
  if (!cms) return null
  const { width, height } = cmsSize(cms)
  return (
    <picture>
      <source type="image/webp" srcSet={cmsSrcSet(cms, 'webp')} sizes={sizes} />
      <img
        className={className}
        src={cmsFallbackSrc(cms)}
        srcSet={cmsSrcSet(cms, 'jpg')}
        sizes={sizes}
        width={width}
        height={height}
        alt={alt}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        style={{ objectPosition: cmsObjectPosition(cms) }}
        {...imgProps}
      />
    </picture>
  )
}
