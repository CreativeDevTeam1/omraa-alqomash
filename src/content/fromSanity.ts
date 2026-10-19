/**
 * Sanity → site content. Pure and dependency-free, so the same code runs in the browser (live refresh),
 * in the build script (scripts/fetch-content.ts) and in the Studio seed check (studio/scripts/seed.ts).
 *
 * The output is a *partial* Content per language: it is merged over the static content in en.ts / ar.ts,
 * so a missing or unreachable CMS can never leave a hole in the site.
 */
import type { Content, Lang } from './types'

export const SANITY = {
  projectId: 'f4el6clm',
  dataset: 'production',
  apiVersion: '2024-01-01',
} as const

/** A Sanity image as the site needs it (the asset id, its dimensions, hotspot and crop). */
export interface CmsImage {
  assetId: string
  width: number
  height: number
  hotspot?: { x: number; y: number; width: number; height: number }
  crop?: { top: number; bottom: number; left: number; right: number }
}

export interface CmsVideo {
  fileUrl: string
  fileAssetId: string
  poster?: CmsImage
}

export interface CmsChannels {
  phone: { display: string; href: string }
  whatsapp: { display: string; href: string }
  email: { display: string; href: string }
  instagram: { display: string; href: string }
  facebook: { display: string; href: string }
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K]
}

export interface CmsSnapshot {
  generatedAt: string
  content: { en: DeepPartial<Content>; ar: DeepPartial<Content> }
  channels?: Partial<CmsChannels>
  media: {
    heroVideo?: CmsVideo
    loaderVideo?: CmsVideo
    aboutIntro?: CmsImage
    aboutStory?: CmsImage
    aboutVision?: CmsImage
    contact?: CmsImage
  }
}

const IMG = `{ "assetId": asset._ref, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, hotspot, crop }`
const VIDEO = `{ "fileUrl": file.asset->url, "fileAssetId": file.asset._ref, "poster": poster${IMG} }`

/** One GROQ query for everything the site shows. Only published documents (the CDN never serves drafts). */
export const QUERY = `{
  "siteSettings": *[_id == "siteSettings"][0],
  "homePage": *[_id == "homePage"][0]{ ..., "heroVideo": heroVideo${VIDEO}, "loaderVideo": loaderVideo${VIDEO} },
  "aboutPage": *[_id == "aboutPage"][0]{ ..., "introImage": introImage${IMG}, "storyImage": storyImage${IMG}, "visionImage": visionImage${IMG} },
  "contactPage": *[_id == "contactPage"][0]{ ..., "image": image${IMG} },
  "interfaceLabels": *[_id == "interfaceLabels"][0],
  "products": *[_type == "product" && visible != false] | order(orderRank) { _id, slug, name, description, "image": image${IMG} },
  "manufactureItems": *[_type == "manufactureItem"] | order(orderRank) { _id, slug, title, description, "image": image${IMG} }
}`

// -------------------------------------------------------------------------------------------------

type Loc = { en?: string; ar?: string } | null | undefined
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Raw = any

const isEmpty = (v: unknown) => v === undefined || v === null || v === ''

/** Sets obj[path] (dotted, numeric segments are array indexes). Empty values are skipped. */
const put = (obj: Record<string, unknown>, path: string, value: unknown) => {
  if (isEmpty(value)) return
  const keys = path.split('.')
  let node = obj as Record<string, unknown>
  for (let i = 0; i < keys.length - 1; i++) {
    const next = /^\d+$/.test(keys[i + 1]) ? [] : {}
    node = (node[keys[i]] ??= next) as Record<string, unknown>
  }
  node[keys[keys.length - 1]] = value
}

/** Phone numbers as Egyptians write them → the links the site uses. */
export const phoneHref = (display: string) => {
  const digits = display.replace(/\D/g, '')
  return `tel:+20${digits.replace(/^0/, '')}`
}
export const whatsappHref = (display: string) =>
  `https://wa.me/20${display.replace(/\D/g, '').replace(/^0/, '')}`

/** Raw GROQ result → what the site needs. Missing documents or fields are simply left out. */
export function buildSnapshot(raw: Raw, generatedAt = new Date().toISOString()): CmsSnapshot {
  const {
    siteSettings: s,
    homePage: h,
    aboutPage: a,
    contactPage: c,
    interfaceLabels: u,
  } = raw ?? {}
  const content = { en: {}, ar: {} } as Record<Lang, Record<string, unknown>>

  // Only what the site needs (no nulls), so the snapshot stays small.
  const image = (v: Raw): CmsImage | undefined =>
    v?.assetId
      ? {
          assetId: v.assetId,
          width: v.width,
          height: v.height,
          ...(v.hotspot
            ? {
                hotspot: {
                  x: v.hotspot.x,
                  y: v.hotspot.y,
                  width: v.hotspot.width,
                  height: v.hotspot.height,
                },
              }
            : {}),
          ...(v.crop
            ? {
                crop: {
                  top: v.crop.top,
                  bottom: v.crop.bottom,
                  left: v.crop.left,
                  right: v.crop.right,
                },
              }
            : {}),
        }
      : undefined
  const video = (v: Raw): CmsVideo | undefined =>
    v?.fileUrl && v.fileAssetId
      ? { fileUrl: v.fileUrl, fileAssetId: v.fileAssetId, poster: image(v.poster) }
      : undefined

  for (const lang of ['en', 'ar'] as const) {
    const to = content[lang]
    const L = (loc: Loc) => loc?.[lang]

    if (s) {
      put(to, 'brand.name', L(s.brandName))
      put(to, 'brand.tagline', L(s.tagline))
      put(to, 'footer.brandName', L(s.brandName))
      put(to, 'footer.descriptor', L(s.descriptor))
      ;(s.highlights ?? []).forEach((x: Loc, i: number) => put(to, `footer.highlights.${i}`, L(x)))
      ;(s.footerColumns ?? []).forEach((col: { title?: Loc; links?: Loc[] }, i: number) => {
        put(to, `footer.columns.${i}.title`, L(col.title))
        ;(col.links ?? []).forEach((x, j) => put(to, `footer.columns.${i}.links.${j}.label`, L(x)))
      })
      put(to, 'footer.contact.title', L(s.footerContactTitle))
      put(to, 'footer.contact.phone', s.phone)
      put(to, 'footer.contact.location', L(s.location))
      put(to, 'footer.contact.instagram', L(s.footerInstagramLabel))
      put(to, 'footer.contact.facebook', L(s.footerFacebookLabel))
      put(to, 'footer.copyright', L(s.copyright))
      put(to, 'contact.phone.value', s.phone)
      put(to, 'contact.whatsapp.value', s.whatsapp)
      put(to, 'contact.location.value', L(s.location))
      if (c) put(to, 'footer.contact.whatsapp', `${L(c.whatsappLabel)}: ${s.whatsapp}`)
    }

    if (h) {
      put(to, 'hero.title', L(h.heroTitle))
      put(to, 'hero.descriptor', L(h.heroDescriptor))
      put(to, 'products.title', L(h.productsTitle))
      put(to, 'products.listIntro', L(h.productsListIntro))
      put(to, 'products.headline', L(h.productsHeadline))
      put(to, 'products.note', L(h.productsNote))
      put(to, 'products.cta.catalogue', L(h.ctaCatalogue))
      put(to, 'products.cta.samples', L(h.ctaSamples))
      put(to, 'products.cta.quote', L(h.ctaQuote))
      put(to, 'manufacture.title', L(h.manufactureTitle))
      put(to, 'manufacture.headline', L(h.manufactureHeadline))
      put(to, 'manufacture.intro', L(h.manufactureIntro))
    }

    if (a) {
      put(to, 'about.title', L(a.title))
      put(to, 'about.paragraphs.0', L(a.lead))
      put(to, 'about.paragraphs.1', L(a.story1))
      put(to, 'about.paragraphs.2', L(a.story2))
      put(to, 'about.paragraphs.3', L(a.partnership))
      put(to, 'about.paragraphs.4', L(a.quote))
      put(to, 'about.paragraphs.5', L(a.story3))
      put(to, 'about.paragraphs.6', L(a.isoText))
      put(to, 'about.isoLabel', a.isoLabel)
      ;(a.highlights ?? []).forEach((x: Loc, i: number) => put(to, `about.highlights.${i}`, L(x)))
      put(to, 'vision.title', L(a.visionTitle))
      put(to, 'vision.headline', L(a.visionHeadline))
      put(to, 'vision.body.0', L(a.visionBody1))
      put(to, 'vision.body.1', L(a.visionBody2))
      put(to, 'mission.title', L(a.missionTitle))
      put(to, 'mission.headline', L(a.missionHeadline))
      put(to, 'mission.body.0', L(a.missionBody1))
    }

    if (c) {
      put(to, 'contact.title', L(c.title))
      put(to, 'contact.headline', L(c.headline))
      put(to, 'contact.intro', L(c.intro))
      put(to, 'contact.phone.label', L(c.phoneLabel))
      put(to, 'contact.whatsapp.label', L(c.whatsappLabel))
      put(to, 'contact.location.label', L(c.locationLabel))
      put(to, 'contact.email.label', L(c.emailLabel))
      put(to, 'contact.instagram.label', L(c.instagramLabel))
      put(to, 'contact.facebook.label', L(c.facebookLabel))
      put(to, 'contact.inquiries.label', L(c.inquiriesLabel))
      put(to, 'contact.inquiries.text', L(c.inquiriesText))
    }

    if (u) {
      put(to, 'nav.0.label', L(u.navHome))
      put(to, 'nav.1.label', L(u.navAbout))
      put(to, 'nav.2.label', L(u.navContact))
      put(to, 'ui.languageSwitch.label', L(u.languageSwitch))
      put(to, 'ui.menuOpen', L(u.menuOpen))
      put(to, 'ui.menuClose', L(u.menuClose))
      put(to, 'ui.skipToContent', L(u.skipToContent))
      put(to, 'ui.notFound', L(u.notFound))
      put(to, 'ui.carouselPause', L(u.carouselPause))
      put(to, 'ui.carouselPlay', L(u.carouselPlay))
    }

    // Ordered, visible products and applications. An empty list keeps the static ones.
    const products = (raw?.products ?? []) as Raw[]
    if (products.length) {
      put(
        to,
        'products.items',
        products.map((p) => ({
          id: p._id,
          slug: p.slug || undefined,
          name: L(p.name) ?? '',
          description: L(p.description) ?? '',
          image: image(p.image),
        })),
      )
    }
    const items = (raw?.manufactureItems ?? []) as Raw[]
    if (items.length) {
      put(
        to,
        'manufacture.items',
        items.map((p) => ({
          id: p._id,
          slug: p.slug || undefined,
          title: L(p.title) ?? '',
          description: L(p.description) ?? '',
          image: p.image?.assetId ? p.image : undefined,
        })),
      )
    }
  }

  const channels: Partial<CmsChannels> = {}
  if (s?.phone) channels.phone = { display: s.phone, href: phoneHref(s.phone) }
  if (s?.whatsapp) channels.whatsapp = { display: s.whatsapp, href: whatsappHref(s.whatsapp) }
  if (s?.email) channels.email = { display: s.email, href: `mailto:${s.email}` }
  if (s?.instagramUrl)
    channels.instagram = { display: s.instagramHandle ?? '', href: s.instagramUrl }
  if (s?.facebookUrl) channels.facebook = { display: s.facebookName ?? '', href: s.facebookUrl }

  return {
    generatedAt,
    content: content as CmsSnapshot['content'],
    channels,
    media: {
      heroVideo: video(h?.heroVideo),
      loaderVideo: video(h?.loaderVideo),
      aboutIntro: image(a?.introImage),
      aboutStory: image(a?.storyImage),
      aboutVision: image(a?.visionImage),
      contact: image(c?.image),
    },
  }
}

/** Static content with the CMS partial laid over it. Lists called `items` are replaced as a whole. */
export function mergeContent<T>(base: T, over: unknown): T {
  if (over === undefined || over === null) return base
  if (Array.isArray(base) && Array.isArray(over)) {
    return base.map((b, i) => (over[i] === undefined ? b : mergeContent(b, over[i]))) as T
  }
  if (base && typeof base === 'object' && typeof over === 'object' && !Array.isArray(over)) {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) }
    for (const [key, value] of Object.entries(over as Record<string, unknown>)) {
      out[key] = key === 'items' && Array.isArray(value) ? value : mergeContent(out[key], value)
    }
    return out as T
  }
  return over as T
}

/**
 * Only what differs from the static content: unchanged strings are dropped, so the snapshot that ships in the
 * JavaScript bundle stays tiny (lists called `items` are kept whole). `mergeContent` gives the same result.
 */
const prune = (over: unknown, base: unknown): unknown => {
  if (Array.isArray(over)) {
    if (!Array.isArray(base)) return over
    const out = over.map((o, i) => prune(o, base[i]))
    while (out.length && out[out.length - 1] === undefined) out.pop()
    return out.length ? out.map((x) => (x === undefined ? null : x)) : undefined
  }
  if (over && typeof over === 'object') {
    if (!base || typeof base !== 'object') return over
    const out: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(over)) {
      const p = key === 'items' ? value : prune(value, (base as Record<string, unknown>)[key])
      if (p !== undefined) out[key] = p
    }
    return Object.keys(out).length ? out : undefined
  }
  return over === base ? undefined : over
}

export function pruneSnapshot(
  snapshot: CmsSnapshot,
  staticContent: { en: unknown; ar: unknown },
  staticChannels: unknown,
): CmsSnapshot {
  return {
    ...snapshot,
    content: {
      en: (prune(snapshot.content.en, staticContent.en) ?? {}) as CmsSnapshot['content']['en'],
      ar: (prune(snapshot.content.ar, staticContent.ar) ?? {}) as CmsSnapshot['content']['ar'],
    },
    channels: (prune(snapshot.channels, staticChannels) ?? {}) as CmsSnapshot['channels'],
  }
}

/** Same snapshot apart from its timestamp? */
export const sameSnapshot = (a: CmsSnapshot, b: CmsSnapshot) =>
  JSON.stringify({ ...a, generatedAt: '' }) === JSON.stringify({ ...b, generatedAt: '' })
