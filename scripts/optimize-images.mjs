// Generates AVIF + WebP + JPG at several widths from _source into public/images.
// Uses the ffmpeg already installed on the machine (no npm dependency).
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync, unlinkSync } from 'node:fs'
import { join, parse } from 'node:path'

const GROUPS = ['products', 'uses', 'photos']
const WIDTHS = [480, 800, 1200, 1800]
// Photos the site does not use (kept in _source as spares) are not converted.
const UNUSED = new Set(['fabric-rolls', 'grey-sofa', 'living-room', 'upholsterer'])

const probeWidth = (file) =>
  Number(
    execFileSync(
      'ffprobe',
      [
        '-v',
        'error',
        '-select_streams',
        'v:0',
        '-show_entries',
        'stream=width',
        '-of',
        'csv=p=0',
        file,
      ],
      { encoding: 'utf8' },
    ).trim(),
  )

const probeHeight = (file) =>
  Number(
    execFileSync(
      'ffprobe',
      [
        '-v',
        'error',
        '-select_streams',
        'v:0',
        '-show_entries',
        'stream=height',
        '-of',
        'csv=p=0',
        file,
      ],
      { encoding: 'utf8' },
    ).trim(),
  )

const run = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' })

const manifest = {}

for (const group of GROUPS) {
  const srcDir = join('_source', group)
  const outDir = join('public', 'images', group)
  mkdirSync(outDir, { recursive: true })
  // Start clean: drop stale outputs from earlier size sets.
  for (const stale of readdirSync(outDir)) unlinkSync(join(outDir, stale))
  const files = readdirSync(srcDir).filter((f) => /\.jpe?g$/i.test(f) && !UNUSED.has(parse(f).name))
  for (const file of files) {
    const src = join(srcDir, file)
    const name = parse(file).name
    const srcWidth = probeWidth(src)
    // Widths below the source width, plus the source width as the largest size (capped at 1800).
    const widths = [...new Set([...WIDTHS.filter((w) => w < srcWidth), Math.min(srcWidth, 1800)])]
    for (const w of widths) {
      const base = join(outDir, `${name}-${w}`)
      if (existsSync(`${base}.avif`) && statSync(`${base}.avif`).mtimeMs > statSync(src).mtimeMs)
        continue
      const scale = ['-vf', `scale=${w}:-2:flags=lanczos`]
      run(['-i', src, ...scale, '-q:v', '4', '-pix_fmt', 'yuvj420p', `${base}.jpg`])
      run(['-i', src, ...scale, '-c:v', 'libwebp', '-quality', '78', `${base}.webp`])
      run([
        '-i',
        src,
        ...scale,
        '-c:v',
        'libaom-av1',
        '-crf',
        '34',
        '-cpu-used',
        '6',
        '-still-picture',
        '1',
        `${base}.avif`,
      ])
    }
    manifest[`${group}/${name}`] = { widths, width: srcWidth, height: probeHeight(src) }
    console.log(`${group}/${name}: ${widths.join(', ')}`)
  }
}

writeFileSync('src/lib/image-manifest.json', JSON.stringify(manifest, null, 2) + '\n')
console.log('wrote src/lib/image-manifest.json')
