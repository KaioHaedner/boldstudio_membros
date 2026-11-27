import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, statSync, writeFileSync } from 'node:fs'
import { basename, resolve, sep } from 'node:path'

const manifest = 'src/apps/site/data/service-films.json'
const films = JSON.parse(readFileSync(manifest,'utf8'))
const publicRoot = resolve('public/media/services')
const archiveRoot = resolve('.verification/native-service-masters')
mkdirSync(archiveRoot, { recursive: true })
for (const film of Object.values(films)) for (const variant of film.variants) {
  if (Math.min(variant.width,variant.height) < 2160 || variant.src.endsWith('.m3u8')) continue
  const input = resolve('public', `.${variant.src}`)
  const archived = resolve(archiveRoot, basename(input))
  if (!input.startsWith(publicRoot + sep) || !archived.startsWith(archiveRoot + sep)) throw new Error('Unsafe media path')
  const source = existsSync(input) ? input : archived
  if (!existsSync(source)) throw new Error(`Missing master: ${film.id}`)
  const folder = input.slice(0,-4)
  mkdirSync(folder, { recursive: true })
  const playlist = `${folder}/index.m3u8`
  if (!existsSync(playlist)) execFileSync('ffmpeg', ['-nostdin','-n','-i',source,'-map','0:v:0','-map','0:a:0?','-c','copy','-f','hls','-hls_time','6','-hls_playlist_type','vod','-hls_segment_type','fmp4','-hls_fmp4_init_filename','init.mp4','-hls_segment_filename',`${folder}/chunk-%04d.m4s`,playlist], {stdio:['ignore','ignore','pipe']})
  const contents = readFileSync(playlist,'utf8')
  if (!contents.includes('#EXT-X-ENDLIST')) throw new Error('Incomplete streaming playlist')
  variant.src = `${variant.src.slice(0,-4)}/index.m3u8`
  variant.bytes = readdirSync(folder).reduce((sum,name)=>sum+statSync(`${folder}/${name}`).size,0)
  // Recoverable move of generated transcode only; supplied Downloads files stay intact.
  if (existsSync(input) && !existsSync(archived)) renameSync(input,archived)
  console.log(`${film.id}: 4K streaming, ${readdirSync(folder).filter(name=>name.endsWith('.m4s')).length} segments`)
}
writeFileSync(manifest, JSON.stringify(films,null,2)+'\n')
