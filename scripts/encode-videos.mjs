// Prepares the client's own loop videos exactly as delivered (_source/videos/client-v3: 848x464, about 24-30 fps,
// about 15.9 s): NO effects, NO recolouring, NO upscaling, NO frame-rate change, so only the native size is output, as MP4 (H.264) and WebM (VP9), no audio,
// faststart, plus a WebP poster from the delivered poster. The hero MP4 is the client's stream copied as is.
// Every file served from /media gets a content hash in its name (first 8 hex chars of its SHA-256, e.g.
// hero-fabric.3f9a2c1d.mp4) and src/media-manifest.json maps the logical name to the hashed URL.
// The OG image (_source/media/og-image.jpg) goes through the same step.
// Uses the ffmpeg already on the machine (no npm dependency). Run: node scripts/encode-videos.mjs
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, parse } from 'node:path'

const SRC = '_source/videos/client-v3'
const POSTERS = '_source/videos/client-v2' // the same first frames
const OUT = 'public/media'
const MANIFEST = 'src/media-manifest.json'
// master = file in SRC (without .mp4); copy = keep the delivered H.264 stream untouched.
const CLIPS = [
  { master: 'hero-client-loop', poster: 'hero-fabric-poster', name: 'hero-fabric', copy: true, crf264: 0, crfVp9: 30 },
  { master: 'loading-client-loop', poster: 'loading-pingpong-poster', name: 'drape-closeup', copy: true, crf264: 0, crfVp9: 30 },
]
const run = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' })
const kb = (f) => Math.round(statSync(f).size / 1024) + ' KB'

const tmp = mkdtempSync(join(tmpdir(), 'omraa-media-'))

for (const c of CLIPS) {
  const input = `${SRC}/${c.master}.mp4`
  // No scaling at all: the native 848x464.
  run(['-i', input, '-an', ...(c.copy ? ['-c:v', 'copy'] : ['-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', String(c.crf264), '-pix_fmt', 'yuv420p']), '-movflags', '+faststart', `${tmp}/${c.name}.mp4`])
  run(['-i', input, '-an', '-c:v', 'libvpx-vp9', '-crf', String(c.crfVp9), '-b:v', '0', '-row-mt', '1', '-pix_fmt', 'yuv420p', `${tmp}/${c.name}.webm`])
  run(['-i', `${POSTERS}/${c.poster}.jpg`, '-c:v', 'libwebp', '-quality', '92', `${tmp}/${c.name}-poster.webp`])
}
copyFileSync('_source/media/og-image.jpg', `${tmp}/og-image.jpg`)

// Content-hash every file and write the manifest. Old copies (hashed or not) are deleted first.
mkdirSync(OUT, { recursive: true })
for (const f of readdirSync(OUT)) rmSync(join(OUT, f), { force: true })
const manifest = {}
for (const file of readdirSync(tmp).sort()) {
  const bytes = readFileSync(join(tmp, file))
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 8)
  const { name, ext } = parse(file)
  const hashed = `${name}.${hash}${ext}`
  writeFileSync(join(OUT, hashed), bytes)
  manifest[file] = `/media/${hashed}`
  console.log(file.padEnd(34), kb(join(OUT, hashed)).padStart(8), hashed)
}
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
rmSync(tmp, { recursive: true, force: true })
console.log('wrote', MANIFEST)
