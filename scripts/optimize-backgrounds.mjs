import { createHash } from 'node:crypto'
import { readFileSync, mkdirSync, writeFileSync, statSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { execFileSync } from 'node:child_process'

const [ffmpeg, inputDirectory] = process.argv.slice(2)
if (!ffmpeg || !inputDirectory) throw new Error('Provide ffmpeg and original photo directory')
const names = ['DSC07787', 'DSC07901', 'DSC08726', 'DSC00428', 'DSC00452', 'DSC07197', 'DSC08119', 'DSC08947', 'DSC02008']
const output = resolve('public/media/backgrounds')
mkdirSync(output, { recursive: true })
const files = []
const missing = []
for (const name of names) {
  const original = join(inputDirectory, `${name}.jpg`)
  if (!existsSync(original)) { missing.push(name); continue }
  const hash = createHash('sha256').update(readFileSync(original)).update('webp-v1-1440-q75').digest('hex').slice(0, 12)
  const file = `${name.toLowerCase()}-${hash}.webp`
  const target = join(output, file)
  execFileSync(ffmpeg, ['-nostdin', '-n', '-i', original, '-vf',
    "scale='min(1440,iw)':'min(1440,ih)':force_original_aspect_ratio=decrease",
    '-frames:v', '1', '-c:v', 'libwebp', '-quality', '75', target], { stdio: ['ignore', 'ignore', 'pipe'] })
  files.push({ name, file, originalBytes: statSync(original).size, webpBytes: statSync(target).size,
    object: `backgrounds-20261005/${file}`,
    url: `https://erhtqgaxibncpondscna.supabase.co/storage/v1/object/public/brand/backgrounds-20261005/${file}` })
}
writeFileSync('src/apps/site/data/backgrounds.json', JSON.stringify(files.map(({ file }) => file), null, 2) + '\n')
writeFileSync('.verification/background-upload-manifest.json', JSON.stringify({ files, missing }, null, 2) + '\n')
console.log(JSON.stringify({ count: files.length, missing, originalBytes: files.reduce((s, f) => s + f.originalBytes, 0),
  webpBytes: files.reduce((s, f) => s + f.webpBytes, 0) }))
