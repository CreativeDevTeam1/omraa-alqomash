// Lists (and with --delete removes) FILE assets that nothing references any more (the old video versions).
//   npx sanity exec scripts/clean-assets.ts --with-user-token            (dry run)
//   npx sanity exec scripts/clean-assets.ts --with-user-token -- --delete
import fs from 'node:fs'
import path from 'node:path'
import {getCliClient} from 'sanity/cli'
const client = getCliClient({apiVersion: '2024-01-01'})
const unused: {_id: string; originalFilename: string; size: number}[] = await client.fetch(
  '*[_type == "sanity.fileAsset" && count(*[references(^._id)]) == 0]{_id, originalFilename, size}',
)
for (const a of unused) console.log('unused:', a._id, a.originalFilename, (a.size / 1048576).toFixed(1) + ' MB')
if (process.argv.includes('--delete')) {
  const seededFile = path.resolve(process.cwd(), '..', 'src', 'content', 'seeded-assets.json')
  const seeded: Record<string, string> = JSON.parse(fs.readFileSync(seededFile, 'utf8'))
  for (const a of unused) {
    await client.delete(a._id)
    delete seeded[a._id]
    console.log('deleted', a._id)
  }
  fs.writeFileSync(seededFile, JSON.stringify(seeded, null, 2) + '\n')
}
if (!unused.length) console.log('no unused file assets')
