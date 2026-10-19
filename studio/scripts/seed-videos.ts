/**
 * Replaces ONLY the hero and loader videos (and their posters) in the Home page with the files in
 * public/media / _source/videos/client-v2, and registers the new asset ids as "seeded" so the site keeps using its
 * optimised local copies. Other content is not touched.
 *   cd studio && npx sanity exec scripts/seed-videos.ts --with-user-token
 */
import fs from 'node:fs'
import path from 'node:path'
import {getCliClient} from 'sanity/cli'
import manifest from '../../src/media-manifest.json'

const client = getCliClient({apiVersion: '2024-01-01'})
const ROOT = path.resolve(process.cwd(), '..')
const seededFile = path.join(ROOT, 'src', 'content', 'seeded-assets.json')
const seeded: Record<string, string> = JSON.parse(fs.readFileSync(seededFile, 'utf8'))

async function video(mp4: string, poster: string, key: string) {
  const file = await client.assets.upload('file', fs.createReadStream(path.join(ROOT, 'public', mp4)), {
    filename: path.basename(mp4),
    contentType: 'video/mp4',
  })
  const image = await client.assets.upload('image', fs.createReadStream(poster), {filename: path.basename(poster)})
  seeded[file._id] = `video:${key}`
  seeded[image._id] = `poster:${key}`
  return {
    _type: 'siteVideo',
    file: {_type: 'file', asset: {_type: 'reference', _ref: file._id}},
    poster: {_type: 'image', asset: {_type: 'reference', _ref: image._id}},
  }
}

const v2 = path.join(ROOT, '_source', 'videos', 'client-v2')
const heroVideo = await video(manifest['hero-fabric.mp4'], path.join(v2, 'hero-fabric-poster.jpg'), 'hero-fabric')
const loaderVideo = await video(manifest['drape-closeup.mp4'], path.join(v2, 'loading-pingpong-poster.jpg'), 'drape-closeup')
await client.patch('homePage').set({heroVideo, loaderVideo}).commit()
fs.writeFileSync(seededFile, JSON.stringify(seeded, null, 2) + '\n')
console.log('Home page videos replaced with the client\'s v2 files.')
