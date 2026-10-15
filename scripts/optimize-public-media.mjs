import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, mkdirSync, writeFileSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { execFileSync } from 'node:child_process'

// Creates NEW public previews only. Never overwrites recovered originals.
// Usage: node scripts/optimize-public-media.mjs <ffmpeg> <recovered-project-directory>
const [ffmpeg, recovered] = process.argv.slice(2)
if (!ffmpeg || !recovered) throw new Error('Provide ffmpeg and recovered project directory')
const output = resolve('public/media/previews')
mkdirSync(output, { recursive: true })
const manifest = {}
let originalBytes = 0
let previewBytes = 0
for (const bucket of ['avatars', 'CLIENTES_CONTEINER_PREVIA_VD']) {
  for (const file of readdirSync(join(recovered, bucket)).filter((name) => name.endsWith('.mp4'))) {
    if (bucket === 'avatars' && file !== 'VD_BOLD_01.mp4') continue
    const input = join(recovered, bucket, file)
    const hash = createHash('sha256').update(readFileSync(input)).update('preview-v1-10s-720p-crf28').digest('hex').slice(0, 12)
    const name = `${file.slice(0, -4).toLowerCase()}-${hash}.mp4`
    const target = join(output, name)
    // Public muted decorative previews: <=10 seconds, <=720px long edge, no audio.
    execFileSync(ffmpeg, ['-nostdin', '-n', '-i', input, '-t', '10', '-an', '-vf',
      "scale='min(720,iw)':'min(720,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2,fps=24",
      '-c:v', 'libx264', '-preset', 'fast', '-crf', '28', '-maxrate', '1000k', '-bufsize', '2000k',
      '-pix_fmt', 'yuv420p', '-movflags', '+faststart', target], { stdio: ['ignore', 'ignore', 'pipe'] })
    manifest[`${bucket}/${file}`] = `/media/previews/${name}`
    originalBytes += statSync(input).size
    previewBytes += statSync(target).size
  }
}
writeFileSync('src/shared/lib/public-previews.json', JSON.stringify(manifest, null, 2) + '\n')
console.log(JSON.stringify({ count: Object.keys(manifest).length, originalBytes, previewBytes,
  reductionPercent: Number((100 * (1 - previewBytes / originalBytes)).toFixed(2)) }))
