import type { CmsImage } from './fromSanity'

export type Lang = 'en' | 'ar'
export type RouteKey = 'home' | 'about' | 'contact'

/** Internal link: a route plus an optional section id on that page. */
export interface LinkTarget {
  route: RouteKey
  hash?: string
}

export interface Link {
  label: string
  to: LinkTarget
}

export interface Product {
  /** CMS document id (only for products that come from the CMS) */
  id?: string
  /** Matches the image file name in public/images/products (absent for products added in the CMS) */
  slug?: string
  /** The CMS image, when the product comes from the CMS */
  image?: CmsImage
  name: string
  description: string
}

export interface ManufactureItem {
  id?: string
  /** Matches the image file name in public/images/uses */
  slug?: string
  image?: CmsImage
  title: string
  description: string
}

export interface Content {
  lang: Lang
  /** <html lang> + dir */
  dir: 'ltr' | 'rtl'
  brand: {
    name: string
    /** Arabic tagline from the logo / identity guide */
    tagline: string
  }
  /** Interface strings that are not in the PDF — see TODO(content) markers. */
  ui: {
    menuOpen: string
    menuClose: string
    carouselPause: string
    carouselPlay: string
    skipToContent: string
    languageSwitch: { label: string; targetLang: Lang }
    notFound: string
  }
  nav: Link[]
  hero: { title: string; descriptor: string }
  about: {
    title: string
    /** Seven paragraphs, in PDF order. */
    paragraphs: string[]
    isoLabel: string
    /** The four short phrases of the strip under the intro */
    highlights: string[]
  }
  /** body = paragraphs, each kept whole as in the PDF */
  vision: { title: string; headline: string; body: string[] }
  mission: { title: string; headline: string; body: string[] }
  products: {
    title: string
    headline: string
    intro: string
    listIntro: string
    items: Product[]
    note: string
    cta: { catalogue: string; samples: string; quote: string }
  }
  manufacture: {
    title: string
    headline: string
    intro: string
    items: ManufactureItem[]
  }
  contact: {
    title: string
    headline: string
    intro: string
    phone: { label: string; value: string }
    whatsapp: { label: string; value: string }
    location: { label: string; value: string }
    inquiries: { label: string; text: string }
    email: { label: string }
    instagram: { label: string }
    facebook: { label: string }
  }
  footer: {
    brandName: string
    descriptor: string
    highlights: string[]
    columns: { title: string; links: Link[] }[]
    contact: {
      title: string
      phone: string
      whatsapp: string
      location: string
      instagram: string
      facebook: string
    }
    copyright: string
  }
}
