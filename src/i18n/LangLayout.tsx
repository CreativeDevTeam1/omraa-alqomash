import { useEffect } from 'react'
import { Outlet, useLocation, useParams } from 'react-router-dom'
import { DEFAULT_LANG, isLang } from '../content'
import { useCmsContent } from '../content/cms'
import { NotFound } from '../pages/NotFound'
import { SITE_URL } from '../site'
import { ContentContext } from './context'

const setMeta = (attr: 'name' | 'property', key: string, value: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

const setLink = (rel: string, href: string | null, hreflang?: string) => {
  const sel = `link[rel="${rel}"]${hreflang ? `[hreflang="${hreflang}"]` : ''}`
  let el = document.head.querySelector<HTMLLinkElement>(sel)
  if (!href) return el?.remove()
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    if (hreflang) el.hreflang = hreflang
    document.head.appendChild(el)
  }
  el.href = href
}

/** Writes <html lang dir> (only when it differs). Called during render, see LangLayout. */
function applyDirection(lang: string, dir: string) {
  const root = document.documentElement
  if (root.lang !== lang) root.lang = lang
  if (root.dir !== dir) root.dir = dir
}

/**
 * Route element for /:lang/* — sets <html lang/dir>, the title and meta, and provides the content.
 * An unknown language segment (/fr, /foo/bar) renders the English 404 instead.
 */
export function LangLayout() {
  const { lang } = useParams()
  const { pathname } = useLocation()
  const valid = isLang(lang)
  const c = useCmsContent(valid ? lang : DEFAULT_LANG)

  // Set lang/dir during render, i.e. before any child lays out or measures: a client-side language
  // switch must never let a section (e.g. the pinned gallery) measure with the previous direction.
  applyDirection(c.lang, c.dir)

  // Page name exactly as in the nav; descriptions reuse existing verified sentences only.
  const page = valid ? pathname.split('/')[2] : undefined
  const pageTitle = page === 'about' ? c.about.title : page === 'contact' ? c.contact.title : null
  const description =
    page === 'about'
      ? c.about.paragraphs[0]
      : page === 'contact'
        ? c.contact.intro
        : c.footer.descriptor
  const title = pageTitle ? `${c.brand.name} — ${pageTitle}` : c.brand.name

  useEffect(() => {
    const root = document.documentElement
    root.lang = c.lang
    root.dir = c.dir
  }, [c.lang, c.dir])

  // Canonical, og:url and hreflang alternates for the real pages (not for 404s).
  const known =
    valid && (page === undefined || page === '' || page === 'about' || page === 'contact')
  const suffix = page === 'about' || page === 'contact' ? `/${page}` : ''
  useEffect(() => {
    if (!known) {
      setLink('canonical', null)
      setLink('alternate', null, 'en')
      setLink('alternate', null, 'ar')
      setLink('alternate', null, 'x-default')
      return
    }
    const url = `${SITE_URL}/${c.lang}${suffix}`
    setLink('canonical', url)
    setMeta('property', 'og:url', url)
    setLink('alternate', `${SITE_URL}/en${suffix}`, 'en')
    setLink('alternate', `${SITE_URL}/ar${suffix}`, 'ar')
    setLink('alternate', `${SITE_URL}/en${suffix}`, 'x-default')
  }, [known, c.lang, suffix])

  useEffect(() => {
    document.title = title
    setMeta('property', 'og:title', title)
    if (description) setMeta('name', 'description', description)
  }, [title, description])

  return (
    <ContentContext.Provider value={c}>{valid ? <Outlet /> : <NotFound />}</ContentContext.Provider>
  )
}
