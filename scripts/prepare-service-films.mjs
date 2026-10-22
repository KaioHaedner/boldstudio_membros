import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs'

// Keep the supplied masters untouched. Versioned static URLs need no API proxy.
const downloads = 'C:/Users/user/Downloads'
const inputs = [
  ['agrobaggio-institucional', 'AgroBaggio — John Deere', 'Filme institucional da AgroBaggio John Deere produzido pela Bold Studio.', 'Agro Baggio Comercial 4k.mp4'],
  ['fazcarnes-institucional', 'FazCarnes', 'Filme institucional da FazCarnes produzido pela Bold Studio.', 'Institucional Redes Sociais.mp4'],
  ['mascarello-guerra-institucional', 'Mascarello & Guerra Advogados', 'Filme institucional do escritório Mascarello & Guerra Advogados produzido pela Bold Studio.', 'Video Final - Mascarello & Guerra .mp4'],
  ['exponorte-2026-aftermovie', 'Exponorte 2026', 'Aftermovie da Exponorte 2026 produzido pela Bold Studio.', 'Exponorte 2026 - Aftermovie.mp4'],
  ['agrobaggio-confraternizacao-sorriso', 'AgroBaggio — Confraternização em Sorriso', 'Cobertura da confraternização AgroBaggio em Sorriso pela Bold Studio.', 'Agro Baggio - Evento Confraternização Sorriso.mp4'],
  ['agrobaggio-resumo-feira-dia-5', 'AgroBaggio — Resumo da feira', 'Resumo do quinto dia de feira da AgroBaggio produzido pela Bold Studio.', 'Dia 5 - Resumo da Feira.mp4'],
  ['forteza-filme-produto', 'Forteza', 'Filme de produto Forteza produzido pela Bold Studio.', 'Forteza - Video Principal .mp4'],
  ['louvada-weis-filme-produto', 'Louvada Weis', 'Filme de produto Louvada Weis produzido pela Bold Studio.', 'Louvada Weis.mp4'],
  ['mangut-fit-batata-doce', 'Mangut Fit — Batata Doce', 'Filme de produto Batata Doce da Mangut Fit produzido pela Bold Studio.', '02 - Batata Doce.mp4'],
]
const directory = 'public/media/services'
mkdirSync(directory, { recursive: true })
const assets = {}
const probe = file => JSON.parse(execFileSync('ffprobe', ['-v','error','-show_streams','-show_format','-of','json',file], { encoding: 'utf8' }))
for (const [id, title, description, filename] of inputs) {
  const actual = readdirSync(downloads).find(name => name.normalize('NFC') === filename.normalize('NFC'))
  if (!actual) throw new Error(`Missing file: ${filename}`)
  const input = `${downloads}/${actual}`
  const original = statSync(input)
  const metadata = probe(input)
  const stream = metadata.streams.find(item => item.codec_type === 'video')
  const correctRotation = id === 'agrobaggio-confraternizacao-sorriso'
  const profile = correctRotation ? 'native-copy-rotation90-v2' : 'native-crf24-v1'
  const hash = createHash('sha256').update(`${id}:${original.size}:${original.mtimeMs}:${profile}`).digest('hex').slice(0, 12)
  const basename = `bold-studio-${id}-${hash}`
  const variants = []
  const levels = Math.min(stream.width, stream.height) > 1080 ? [720, 1080, Math.min(stream.width, stream.height)] : [Math.min(720, stream.width, stream.height), Math.min(stream.width, stream.height)]
  for (const level of [...new Set(levels)]) {
    const native = level === Math.min(stream.width, stream.height)
    const publicOutput = `${directory}/${basename}-${level}p.mp4`
    const archivedOutput = `.verification/native-service-masters/${basename}-${level}p.mp4`
    const output = existsSync(archivedOutput) ? archivedOutput : publicOutput
    if (!existsSync(output)) {
      console.log(`Encoding ${id} ${level}p`)
      const scale = stream.width >= stream.height ? `scale=-2:${level}` : `scale=${level}:-2`
      if (correctRotation) execFileSync('ffmpeg', ['-nostdin','-n','-display_rotation','90','-i',input,'-map','0:v:0','-map','0:a:0?','-map_metadata','-1','-c','copy','-movflags','+faststart',output], {stdio:['ignore','ignore','pipe']})
      else execFileSync('ffmpeg', ['-nostdin','-n','-i',input,'-map','0:v:0','-map','0:a:0?','-map_metadata','-1','-vf',scale,'-c:v','libx264','-threads','4','-preset','fast','-crf','24','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-ac','2','-movflags','+faststart','-metadata',`title=${title} | Bold Studio`,'-metadata',`comment=${description}`,output], {stdio:['ignore','ignore','pipe']})
      // Already-compressed H.264 sources can be smaller than a re-encode.
      if (!correctRotation && native && statSync(output).size > original.size && stream.codec_name === 'h264' && stream.pix_fmt === 'yuv420p') {
        execFileSync('ffmpeg', ['-nostdin','-y','-i',input,'-map','0:v:0','-map','0:a:0?','-map_metadata','-1','-c','copy','-movflags','+faststart',output], {stdio:['ignore','ignore','pipe']})
      }
    }
    const result = probe(output)
    const video = result.streams.find(item => item.codec_type === 'video')
    variants.push({ src: `/media/services/${basename}-${level}p.mp4`, width: video.width, height: video.height, bytes: statSync(output).size })
  }
  const poster = `${directory}/${basename}.webp`
  const posterSecond = id === 'agrobaggio-confraternizacao-sorriso' ? '20' : '3'
  const posterInput = correctRotation ? `${directory}/${basename}-${levels[0]}p.mp4` : input
  if (!existsSync(poster)) execFileSync('ffmpeg', ['-nostdin','-n','-ss',posterSecond,'-i',posterInput,'-frames:v','1','-vf','scale=960:-2','-quality','82',poster], {stdio:['ignore','ignore','pipe']})
  assets[id] = { id, title, description, src: variants.find(item => Math.min(item.width,item.height) === 1080)?.src ?? variants.at(-1).src, poster: `/media/services/${basename}.webp`, duration: Number(metadata.format.duration), uploadDate: '2026-10-22T00:00:00-03:00', variants }
  console.log(JSON.stringify({id, originalBytes:original.size, variants}))
}
writeFileSync('src/apps/site/data/service-films.json', JSON.stringify(assets,null,2)+'\n')
await import('./package-service-4k.mjs')
await import('./generate-service-video-sitemap.mjs')
