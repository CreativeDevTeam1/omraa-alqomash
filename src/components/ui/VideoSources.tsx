import type { CmsVideo } from '../../content/fromSanity'
import { media } from '../../media'

interface Props {
  /** File stem, e.g. "hero-fabric" (hero-fabric.mp4 / .webm in the media manifest) */
  name: 'hero-fabric' | 'drape-closeup'
  /** A video the client uploaded in the CMS (MP4): replaces the local files */
  custom?: CmsVideo | null
}

/** The delivered 848x464 video (never upscaled): MP4 (H.264, the client's own stream) first, WebM as the alternative. */
export function VideoSources({ name, custom }: Props) {
  if (custom) return <source src={custom.fileUrl} type="video/mp4" />
  return (
    <>
      <source src={media(`${name}.mp4`)} type="video/mp4" />
      <source src={media(`${name}.webm`)} type="video/webm" />
    </>
  )
}
