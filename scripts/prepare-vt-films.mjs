import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
const inputs = [
  ['machado-vertical', 'Machado — Copa do Mundo', 'C:/Users/user/Downloads/Machado - Copa do Mundo (Vertical).mp4', true],
  ['machado-horizontal', 'Machado — Copa do Mundo', 'C:/Users/user/Downloads/Machado - Copa do Mundo v5.mp4', false],
  ['unimed', 'Unimed', 'C:/Users/user/Downloads/Unimed- Institucional.mp4', false],
  ['mascarello-guerra', 'Mascarello & Guerra Advocacia', 'C:/Users/user/Downloads/Video Final - Mascarello & Guerra .mp4', false],
]
const directory = 'public/media/services'
mkdirSync(directory, { recursive: true })
const assets = {}
for (const [id, title, input, portrait] of inputs) {
  const original = statSync(input)
  const hash = createHash('sha256').update(`${id}:${original.size}:${original.mtimeMs}:web720-v1`).digest('hex').slice(0,12)
  const basename = `${id}-${hash}`
  const output = `${directory}/${basename}.mp4`
  if (!existsSync(output)) execFileSync('ffmpeg', ['-nostdin','-n','-i',input,'-map','0:v:0','-map','0:a:0?', '-map_metadata','-1','-vf', portrait ? 'scale=720:1280,fps=24' : 'scale=1280:720,fps=24','-c:v','libx264','-threads','2','-preset','fast','-crf','26','-maxrate','1400k','-bufsize','2800k','-pix_fmt','yuv420p','-c:a','aac','-b:a','96k','-ac','2','-movflags','+faststart',output], {stdio:['ignore','ignore','pipe']})
  const poster = `${directory}/${basename}.webp`
  if (!existsSync(poster)) execFileSync('ffmpeg',['-nostdin','-n','-ss','3','-i',output,'-frames:v','1','-vf',portrait?'scale=450:800':'scale=960:540','-quality','80',poster], {stdio:['ignore','ignore','pipe']})
  assets[id] = { id, title, src:`/media/services/${basename}.mp4`, poster:`/media/services/${basename}.webp` }
  console.log(JSON.stringify({id, originalBytes:original.size, webBytes:statSync(output).size}))
}
writeFileSync('src/apps/site/data/vt-films.json', JSON.stringify(assets,null,2)+'\n')
