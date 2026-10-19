/**
 * Seeds the Sanity dataset with the CURRENT site content, word for word, then proves it.
 *
 *   cd studio
 *   npx sanity exec scripts/seed.ts --with-user-token
 *
 * `--with-user-token` runs the script with the login of whoever is signed in to the Sanity CLI (the designer),
 * so no token is ever typed or stored. Alternatively set SANITY_WRITE_TOKEN in your own terminal
 * (see ../.env.example); never commit it.
 *
 * It is safe to run again: assets are de-duplicated by Sanity (same file = same asset), singletons are
 * replaced, and products / applications are matched by their internal key.
 */
import fs from 'node:fs'
import path from 'node:path'
import {createClient} from '@sanity/client'
import {getCliClient} from 'sanity/cli'
import {LexoRank} from 'lexorank'
import {ar} from '../../src/content/ar'
import {channels} from '../../src/content/channels'
import {en} from '../../src/content/en'
import {buildSnapshot, mergeContent, QUERY, SANITY} from '../../src/content/fromSanity'
import manifest from '../../src/media-manifest.json'

const ROOT = path.resolve(process.cwd(), '..')
const SRC = path.join(ROOT, '_source')

const client = process.env.SANITY_WRITE_TOKEN
  ? createClient({...SANITY, token: process.env.SANITY_WRITE_TOKEN, useCdn: false})
  : getCliClient({apiVersion: SANITY.apiVersion})

type Ref = {_type: 'reference'; _ref: string}
const ref = (id: string): Ref => ({_type: 'reference', _ref: id})
const key = () => Math.random().toString(36).slice(2, 10)
const loc = (e: string, a: string) => ({_type: 'localeString', en: e, ar: a})
const locText = (e: string, a: string) => ({_type: 'localeText', en: e, ar: a})

/** The seeded assets: Sanity asset id → the local optimised file the site keeps using until it is replaced. */
const seeded: Record<string, string> = {}

async function uploadImage(file: string, localKey: string) {
  const asset = await client.assets.upload('image', fs.createReadStream(file), {
    filename: path.basename(file),
  })
  seeded[asset._id] = localKey
  return {_type: 'image', asset: ref(asset._id)}
}

async function uploadVideo(file: string, poster: string, localKey: string) {
  const asset = await client.assets.upload('file', fs.createReadStream(file), {
    filename: path.basename(file),
    contentType: 'video/mp4',
  })
  seeded[asset._id] = `video:${localKey}`
  return {
    _type: 'siteVideo',
    file: {_type: 'file', asset: ref(asset._id)},
    poster: await uploadImage(poster, `poster:${localKey}`),
  }
}

const mediaFile = (name: keyof typeof manifest) => path.join(ROOT, 'public', manifest[name])

// ---------------------------------------------------------------------------------------------------

async function main() {
  console.log('Uploading images and videos (original high-resolution sources)…')
  const photos = path.join(SRC, 'photos')
  const img = {
    stillLife: await uploadImage(path.join(photos, 'still-life.jpg'), 'photos/still-life'),
    weave: await uploadImage(path.join(photos, 'weave-macro.jpg'), 'photos/weave-macro'),
    swatchFan: await uploadImage(path.join(photos, 'swatch-fan.jpg'), 'photos/swatch-fan'),
    linen: await uploadImage(path.join(photos, 'linen-drape.jpg'), 'photos/linen-drape'),
  }
  const v2 = path.join(SRC, 'videos', 'client-v2')
  // The videos are the client's delivered files (848x464, as MP4): both are under the Studio's 8 MB limit.
  const heroVideo = await uploadVideo(
    mediaFile('hero-fabric.mp4'),
    path.join(v2, 'hero-fabric-poster.jpg'),
    'hero-fabric',
  )
  const loaderVideo = await uploadVideo(
    mediaFile('drape-closeup.mp4'),
    path.join(v2, 'loading-pingpong-poster.jpg'),
    'drape-closeup',
  )

  const both = (pick: (c: typeof en) => string) => loc(pick(en), pick(ar))
  const bothText = (pick: (c: typeof en) => string) => locText(pick(en), pick(ar))

  console.log('Writing documents…')
  const docs: Record<string, unknown>[] = [
    {
      _id: 'siteSettings',
      _type: 'siteSettings',
      phone: channels.phone.display,
      whatsapp: channels.whatsapp.display,
      email: channels.email.display,
      instagramHandle: channels.instagram.display,
      instagramUrl: channels.instagram.href,
      facebookName: channels.facebook.display,
      facebookUrl: channels.facebook.href,
      location: both((c) => c.footer.contact.location),
      brandName: both((c) => c.footer.brandName),
      tagline: both((c) => c.brand.tagline),
      descriptor: both((c) => c.footer.descriptor),
      highlights: en.footer.highlights.map((_, i) => ({
        _key: key(),
        ...loc(en.footer.highlights[i], ar.footer.highlights[i]),
      })),
      footerColumns: en.footer.columns.map((col, i) => ({
        _key: key(),
        _type: 'footerColumn',
        title: loc(col.title, ar.footer.columns[i].title),
        links: col.links.map((l, j) => ({
          _key: key(),
          ...loc(l.label, ar.footer.columns[i].links[j].label),
        })),
      })),
      footerContactTitle: both((c) => c.footer.contact.title),
      footerInstagramLabel: both((c) => c.footer.contact.instagram),
      footerFacebookLabel: both((c) => c.footer.contact.facebook),
      copyright: both((c) => c.footer.copyright),
    },
    {
      _id: 'homePage',
      _type: 'homePage',
      heroTitle: both((c) => c.hero.title),
      heroDescriptor: both((c) => c.hero.descriptor),
      heroVideo,
      loaderVideo,
      productsTitle: both((c) => c.products.title),
      productsListIntro: both((c) => c.products.listIntro),
      productsHeadline: both((c) => c.products.headline),
      productsNote: bothText((c) => c.products.note),
      ctaCatalogue: both((c) => c.products.cta.catalogue),
      ctaSamples: both((c) => c.products.cta.samples),
      ctaQuote: both((c) => c.products.cta.quote),
      manufactureTitle: both((c) => c.manufacture.title),
      manufactureHeadline: both((c) => c.manufacture.headline),
      manufactureIntro: bothText((c) => c.manufacture.intro),
    },
    {
      _id: 'aboutPage',
      _type: 'aboutPage',
      title: both((c) => c.about.title),
      lead: bothText((c) => c.about.paragraphs[0]),
      introImage: img.stillLife,
      highlights: en.about.highlights.map((_, i) => ({
        _key: key(),
        ...loc(en.about.highlights[i], ar.about.highlights[i]),
      })),
      story1: bothText((c) => c.about.paragraphs[1]),
      story2: bothText((c) => c.about.paragraphs[2]),
      story3: bothText((c) => c.about.paragraphs[5]),
      storyImage: img.weave,
      partnership: bothText((c) => c.about.paragraphs[3]),
      quote: bothText((c) => c.about.paragraphs[4]),
      isoLabel: en.about.isoLabel,
      isoText: bothText((c) => c.about.paragraphs[6]),
      visionTitle: both((c) => c.vision.title),
      visionHeadline: bothText((c) => c.vision.headline),
      visionBody1: bothText((c) => c.vision.body[0]),
      visionBody2: bothText((c) => c.vision.body[1]),
      missionTitle: both((c) => c.mission.title),
      missionHeadline: bothText((c) => c.mission.headline),
      missionBody1: bothText((c) => c.mission.body[0]),
      visionImage: img.swatchFan,
    },
    {
      _id: 'contactPage',
      _type: 'contactPage',
      title: both((c) => c.contact.title),
      headline: bothText((c) => c.contact.headline),
      intro: bothText((c) => c.contact.intro),
      phoneLabel: both((c) => c.contact.phone.label),
      whatsappLabel: both((c) => c.contact.whatsapp.label),
      locationLabel: both((c) => c.contact.location.label),
      emailLabel: both((c) => c.contact.email.label),
      instagramLabel: both((c) => c.contact.instagram.label),
      facebookLabel: both((c) => c.contact.facebook.label),
      inquiriesLabel: both((c) => c.contact.inquiries.label),
      inquiriesText: bothText((c) => c.contact.inquiries.text),
      image: img.linen,
    },
    {
      _id: 'interfaceLabels',
      _type: 'interfaceLabels',
      navHome: both((c) => c.nav[0].label),
      navAbout: both((c) => c.nav[1].label),
      navContact: both((c) => c.nav[2].label),
      languageSwitch: both((c) => c.ui.languageSwitch.label),
      menuOpen: both((c) => c.ui.menuOpen),
      menuClose: both((c) => c.ui.menuClose),
      skipToContent: both((c) => c.ui.skipToContent),
      notFound: both((c) => c.ui.notFound),
      carouselPause: both((c) => c.ui.carouselPause),
      carouselPlay: both((c) => c.ui.carouselPlay),
    },
  ]
  for (const doc of docs) await client.createOrReplace(doc as {_id: string; _type: string})

  // Products and applications: matched by their internal key, so running this again never duplicates them.
  const existing: {_id: string; _type: string; slug: string}[] = await client.fetch(
    '*[_type in ["product","manufactureItem"] && defined(slug)]{_id, _type, slug}',
  )
  const find = (type: string, slug: string) =>
    existing.find((d) => d._type === type && d.slug === slug)?._id

  let rank = LexoRank.min()
  for (const p of en.products.items) {
    rank = rank.genNext().genNext()
    const arItem = ar.products.items.find((x) => x.slug === p.slug)!
    const doc = {
      _type: 'product',
      orderRank: rank.toString(),
      slug: p.slug,
      name: loc(p.name, arItem.name),
      description: locText(p.description, arItem.description),
      image: await uploadImage(path.join(SRC, 'products', `${p.slug}.jpg`), `products/${p.slug}`),
      visible: true,
    }
    const id = find('product', p.slug!)
    if (id) await client.createOrReplace({_id: id, ...doc})
    else await client.create(doc)
  }
  rank = LexoRank.min()
  for (const p of en.manufacture.items) {
    rank = rank.genNext().genNext()
    const arItem = ar.manufacture.items.find((x) => x.slug === p.slug)!
    const doc = {
      _type: 'manufactureItem',
      orderRank: rank.toString(),
      slug: p.slug,
      title: loc(p.title, arItem.title),
      description: locText(p.description, arItem.description),
      image: await uploadImage(path.join(SRC, 'uses', `${p.slug}.jpg`), `uses/${p.slug}`),
    }
    const id = find('manufactureItem', p.slug!)
    if (id) await client.createOrReplace({_id: id, ...doc})
    else await client.create(doc)
  }

  fs.writeFileSync(
    path.join(ROOT, 'src', 'content', 'seeded-assets.json'),
    JSON.stringify(seeded, null, 2) + '\n',
  )

  await verify()
}

// ---------------------------------------------------------------------------------------------------
// Proof: read everything back through the SAME code the site uses and diff every string.
// ---------------------------------------------------------------------------------------------------

type Json = unknown
const leaves = (node: Json, prefix = ''): [string, string][] => {
  if (typeof node === 'string') return [[prefix, node]]
  if (Array.isArray(node)) return node.flatMap((n, i) => leaves(n, `${prefix}[${i}]`))
  if (node && typeof node === 'object')
    return Object.entries(node).flatMap(([k, v]) => leaves(v, prefix ? `${prefix}.${k}` : k))
  return []
}
/** Strings that are not copy: keys, route names, language codes. */
const NOT_COPY = /(\.slug|\.id|\.route|\.hash|^lang$|^dir$)/

async function verify() {
  console.log('\nVerifying: fetching every document back and diffing every string…')
  const raw = await client.withConfig({perspective: 'published', useCdn: false}).fetch(QUERY)
  const snapshot = buildSnapshot(raw)
  let compared = 0
  const diffs: string[] = []
  const covered = new Set<string>()
  for (const lang of ['en', 'ar'] as const) {
    const base = lang === 'en' ? en : ar
    const merged = mergeContent(base, snapshot.content[lang]) as typeof base
    const strip = (c: typeof base) => ({
      ...c,
      products: {...c.products, items: c.products.items.map(({id: _i, image: _m, ...r}) => r)},
      manufacture: {...c.manufacture, items: c.manufacture.items.map(({id: _i, image: _m, ...r}) => r)},
    })
    const a = new Map(leaves(strip(base)))
    const b = new Map(leaves(strip(merged)))
    for (const [p, v] of a) {
      if (NOT_COPY.test(p)) continue
      compared++
      if (b.get(p) !== v) diffs.push(`${lang}:${p}\n   site : ${JSON.stringify(v)}\n   CMS  : ${JSON.stringify(b.get(p))}`)
    }
    for (const p of b.keys()) if (!a.has(p)) diffs.push(`${lang}:${p} exists only in the CMS`)
    // Which static strings does the CMS actually drive? (the rest stays static, e.g. product intro)
    const fromCms = new Map(leaves(snapshot.content[lang]))
    for (const p of fromCms.keys()) covered.add(`${lang}:${p}`)
    const uncovered = [...a.keys()].filter(
      (p) => !NOT_COPY.test(p) && !fromCms.has(p) && !/^products\.items|^manufacture\.items/.test(p),
    )
    if (uncovered.length) console.log(`  ${lang}: strings kept static (not editable in the CMS):`, uncovered.join(', '))
  }
  // Contact channels
  for (const k of Object.keys(channels) as (keyof typeof channels)[]) {
    const got = snapshot.channels?.[k]
    compared += 2
    if (got?.display !== channels[k].display) diffs.push(`channels.${k}.display: ${got?.display} ≠ ${channels[k].display}`)
    if (got?.href !== channels[k].href) diffs.push(`channels.${k}.href: ${got?.href} ≠ ${channels[k].href}`)
  }
  // Counts: products and applications in the same order
  for (const lang of ['en', 'ar'] as const) {
    const base = lang === 'en' ? en : ar
    const items = snapshot.content[lang].products?.items ?? []
    if (items.length !== base.products.items.length) diffs.push(`${lang}: ${items.length} products in the CMS, ${base.products.items.length} on the site`)
  }
  const videos = [snapshot.media.heroVideo, snapshot.media.loaderVideo]
  if (videos.some((v) => !v?.fileUrl || !v.poster)) diffs.push('a video or its poster is missing')

  console.log(`\nSEED DIFF RESULT: ${compared} strings compared (EN + AR + channels), ${diffs.length} differences.`)
  if (diffs.length) {
    console.log(diffs.join('\n'))
    process.exitCode = 1
  } else {
    console.log('0 differences ✅')
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
