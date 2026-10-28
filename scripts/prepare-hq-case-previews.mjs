import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import path from 'node:path'

const root = '.verification/recovery/2026-10-05/objects/erhtqgaxibncpondscna'
const manifestPath = 'src/shared/lib/public-previews.json'
const audioPath = 'src/shared/lib/preview-audio.json'
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
const audio = JSON.parse(readFileSync(audioPath, 'utf8'))
for (const key of Object.keys(manifest)) {
  if (!key.startsWith('CLIENTES_CONTEINER_PREVIA_VD/')) continue
  const source = path.join(root, key)
  if (!existsSync(source)) throw new Error(`Missing source: ${key}`)
  const hash = createHash('sha256').update(readFileSync(source)).digest('hex').slice(0, 12)
  const name = path.basename(key, '.mp4').toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const url = `/media/previews/${name}-hq-${hash}.mp4`
  // Copy the original encoded frames and audio: no additional quality loss.
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', source, '-t', '10', '-map', '0:v:0', '-map', '0:a:0?', '-c', 'copy', '-movflags', '+faststart', `public${url}`])
  const info = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', `public${url}`], { encoding: 'utf8' }))
  const video = info.streams.find(stream => stream.codec_type === 'video')
  if (Number(info.format.duration) > 10.5) throw new Error('Preview exceeds duration budget')
  audio[url] = info.streams.some(stream => stream.codec_type === 'audio')
  manifest[key] = url
  console.log(`${key}: ${video.width}x${video.height}, ${(Number(info.format.size)/1e6).toFixed(2)} MB`)
}
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
writeFileSync(audioPath, `${JSON.stringify(audio, null, 2)}\n`)
