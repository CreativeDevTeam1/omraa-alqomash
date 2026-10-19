// Optional tool (not a project dependency): subsets the client-supplied Anaqa TTFs to woff2.
// Run: npm i --no-save subset-font fontkit && node scripts/subset-anaqa.mjs Regular   (or Bold, once the file exists)
// Reads _source/fonts/anaqa/Anaqa-<Weight>.ttf (or ArbFONTS-Anaqa-<Weight>.ttf), writes public/fonts/anaqa/Anaqa-<Weight>.woff2.
// Keeps Arabic, presentation forms A/B, ASCII punctuation, joiners and all shaping features (init/medi/fina/calt/rlig/kern/mark/mkmk).
import subsetFont from 'subset-font'
import * as fontkit from 'fontkit'
import fs from 'node:fs'
const root = process.cwd()
const weight = process.argv[2] || 'Regular'
const dir = root + '/_source/fonts/anaqa/'
const file = ['Anaqa-', 'ArbFONTS-Anaqa-']
  .map((p) => dir + p + weight + '.ttf')
  .find((p) => fs.existsSync(p))
const src = fs.readFileSync(file)
const f = fontkit.create(src)
let text = ''
const add = (a, b) => {
  for (let c = a; c <= b; c++) if (f.hasGlyphForCodePoint(c)) text += String.fromCodePoint(c)
}
add(0x600, 0x6ff)
add(0x750, 0x77f)
add(0x8a0, 0x8ff)
add(0xfb50, 0xfdff)
add(0xfe70, 0xfefc)
add(0x200c, 0x200f)
add(0x2010, 0x2011)
add(0x20, 0x2f)
add(0x3a, 0x40)
add(0x5b, 0x60)
add(0x7b, 0x7e)
add(0xa0, 0xbf)
add(0x2018, 0x201d)
add(0x2026, 0x2026)
console.log('codepoints kept', [...text].length)
fs.mkdirSync(root + '/public/fonts/anaqa', { recursive: true })
const out = await subsetFont(src, text, { targetFormat: 'woff2' })
fs.writeFileSync(root + '/public/fonts/anaqa/Anaqa-' + weight + '.woff2', out)
console.log(file, src.length, '-> woff2', out.length)
const g = fontkit.create(Buffer.from(await subsetFont(src, text, { targetFormat: 'truetype' })))
console.log('features kept', g.availableFeatures.join(' '))
