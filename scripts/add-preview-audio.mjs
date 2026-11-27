import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
const originalDir = process.argv[2]
if (!originalDir) throw new Error('Provide recovered case directory')
const path = 'src/shared/lib/public-previews.json'
const manifest = JSON.parse(readFileSync(path, 'utf8'))
const audio = {}
for (const [key, preview] of Object.entries(manifest)) {
  if (!key.startsWith('CLIENTES_CONTEINER_PREVIA_VD/')) continue
  if (/-audio-[a-f0-9]+\.mp4$/.test(preview)) { audio[preview] = true; continue }
  const original = join(originalDir, key.split('/')[1])
  const streams = JSON.parse(execFileSync('ffprobe', ['-v','error','-select_streams','a','-show_entries','stream=codec_type','-of','json',original], {encoding:'utf8'})).streams
  if (!streams.length) { audio[preview] = false; continue }
  const hash = createHash('sha256').update(readFileSync(original)).update('audio-aac64-v1').digest('hex').slice(0,12)
  const target = preview.replace(/\.mp4$/, `-audio-${hash}.mp4`)
  if (!existsSync(`public${target}`)) execFileSync('ffmpeg', ['-nostdin','-n','-i',`public${preview}`,'-i',original,'-map','0:v:0','-map','1:a:0','-t','10','-c:v','copy','-c:a','aac','-b:a','64k','-ac','2','-movflags','+faststart',`public${target}`], {stdio:['ignore','ignore','pipe']})
  manifest[key] = target
  audio[target] = true
}
writeFileSync(path, JSON.stringify(manifest,null,2)+'\n')
writeFileSync('src/shared/lib/preview-audio.json', JSON.stringify(audio,null,2)+'\n')
console.log(JSON.stringify({withAudio:Object.values(audio).filter(Boolean).length,withoutAudio:Object.values(audio).filter(v=>!v).length}))
