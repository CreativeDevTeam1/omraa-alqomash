import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import manifest from './src/media-manifest.json'
import seeded from './src/content/seeded-assets.json'
import snapshot from './src/content/snapshot.json'
import { SANITY } from './src/content/fromSanity'
import { SITE_URL } from './src/site'

/**
 * Anaqa, the Arabic identity font, ships as static files in public/fonts/anaqa/:
 *   Anaqa-Regular.woff2  (400) declared in src/styles/fonts.css
 *   Anaqa-Bold.woff2     (700) declared HERE, only when the file exists (no 404s, no faux bold meanwhile)
 * This plugin also preloads the face the Arabic hero uses (Bold if present, else Regular), on /ar pages only.
 * See "Arabic font: Anaqa" in README.md.
 */
function anaqaFont(): Plugin {
  const dir = 'fonts/anaqa'
  return {
    name: 'anaqa-font',
    transformIndexHtml(html) {
      const has = (file: string) => fs.existsSync(path.resolve('public', dir, file))
      const bold = has('Anaqa-Bold.woff2')
      const hero = bold
        ? 'Anaqa-Bold.woff2'
        : has('Anaqa-Regular.woff2')
          ? 'Anaqa-Regular.woff2'
          : null
      let head = ''
      if (bold) {
        head += `<style>@font-face{font-family:'Anaqa';font-weight:700;font-style:normal;font-display:swap;src:url('/${dir}/Anaqa-Bold.woff2') format('woff2');unicode-range:U+0020-002F,U+003A-0040,U+005B-0060,U+007B-007E,U+00A0,U+00AB,U+00BB,U+0600-06FF,U+0750-077F,U+08A0-08FF,U+200C-200F,U+2010-2011,U+2018-201D,U+2026,U+FB50-FDFF,U+FE70-FEFC}</style>`
      }
      if (hero) {
        head += `<script>if((location.pathname+'/').indexOf('/ar/')===0){var l=document.createElement('link');l.rel='preload';l.as='font';l.type='font/woff2';l.crossOrigin='anonymous';l.href='/${dir}/${hero}';document.head.appendChild(l)}</script>`
      }
      return head ? html.replace('</head>', `${head}</head>`) : html
    },
  }
}

/** Preloads the English hero face (Playfair Display 400) on non-Arabic pages only. */
function playfairPreload(): Plugin {
  return {
    name: 'playfair-preload',
    transformIndexHtml(html) {
      const script = `<script>if((location.pathname+'/').indexOf('/ar/')!==0){var l=document.createElement('link');l.rel='preload';l.as='font';l.type='font/woff2';l.crossOrigin='anonymous';l.href='/fonts/playfair/PlayfairDisplay-400.woff2';document.head.appendChild(l)}</script>`
      return html.replace('</head>', `${script}</head>`)
    },
  }
}

/**
 * Injects the content-hashed media URLs (src/media-manifest.json, written by scripts/encode-videos.mjs)
 * into index.html: the poster preloads in the inline script and the absolute og:image URL.
 */
/** CDN URL of a CMS poster the client has replaced (the seeded posters keep their local hashed files). */
function cmsPoster(kind: 'heroVideo' | 'loaderVideo', width: number): string | null {
  const media = (
    snapshot as { media?: Record<string, { poster?: { assetId: string } } | undefined> }
  ).media
  const id = media?.[kind]?.poster?.assetId
  const match =
    id && !(seeded as Record<string, string>)[id] ? /^image-(.+)-(d+xd+)-(w+)$/.exec(id) : null
  return match
    ? `https://cdn.sanity.io/images/${SANITY.projectId}/${SANITY.dataset}/${match[1]}-${match[2]}.${match[3]}?w=${width}&fm=webp&q=80`
    : null
}

function mediaManifest(): Plugin {
  return {
    name: 'media-manifest',
    transformIndexHtml(html) {
      const urls: Record<string, string> = { ...manifest }
      const overrides = {
        'hero-fabric-poster.webp': cmsPoster('heroVideo', 1200),
        'drape-closeup-poster.webp': cmsPoster('loaderVideo', 1200),
        }
      for (const [name, url] of Object.entries(overrides)) if (url) urls[name] = url
      return html
        .replace('__MEDIA_MAP__', JSON.stringify(urls))
        .replace('__OG_IMAGE__', SITE_URL + manifest['og-image.jpg'])
    },
  }
}

export default defineConfig({
  plugins: [react(), anaqaFont(), playfairPreload(), mediaManifest()],
})
