import { createHash } from 'node:crypto'
import { copyFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const [directory] = process.argv.slice(2)
if (!directory) throw new Error('Provide the safely extracted user WebP directory')
mkdirSync('public/media/backgrounds', { recursive: true })
const files = readdirSync(directory).filter(name => /^boldstudio_lateral_[0-9]*_1x\.webp$/.test(name)).sort().map(name => {
  const source = join(directory, name)
  const bytes = readFileSync(source)
  if (bytes.subarray(0, 4).toString() !== 'RIFF' || bytes.subarray(8, 12).toString() !== 'WEBP') throw new Error('Invalid WebP')
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 12)
  const file = `${name.slice(0, -5)}-${hash}.webp`
  copyFileSync(source, join('public/media/backgrounds', file))
  return { name, file, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'),
    object: `backgrounds-20261005/${file}`,
    url: `https://erhtqgaxibncpondscna.supabase.co/storage/v1/object/public/brand/backgrounds-20261005/${file}` }
})
writeFileSync('src/apps/site/data/backgrounds.json', JSON.stringify(files.map(f => f.file), null, 2) + '\n')
writeFileSync('.verification/background-upload-manifest.json', JSON.stringify({ source: 'User ZIP, unchanged WebP bytes', files }, null, 2) + '\n')
console.log(JSON.stringify({ count: files.length, bytes: files.reduce((sum, file) => sum + file.bytes, 0), files: files.map(f => f.file) }))
