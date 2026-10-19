import type { Lang, LinkTarget } from '../content'

/** /en, /en/about, /en/contact (+ optional #section) */
export const toPath = (lang: Lang, target: LinkTarget): string => {
  const base = target.route === 'home' ? `/${lang}` : `/${lang}/${target.route}`
  return target.hash ? `${base}#${target.hash}` : base
}

/** Same page in another language: /en/about ↔ /ar/about */
export const switchLangPathname = (pathname: string, lang: Lang): string =>
  pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${lang}`)
