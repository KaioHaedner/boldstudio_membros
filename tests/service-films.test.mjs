import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname } from 'node:path'

const films = JSON.parse(readFileSync('src/apps/site/data/service-films.json','utf8'))
const native = {
  'agrobaggio-institucional': [3840,2160], 'fazcarnes-institucional': [1920,1080],
  'mascarello-guerra-institucional': [3840,2160], 'exponorte-2026-aftermovie': [1276,718],
  'agrobaggio-confraternizacao-sorriso': [720,1280], 'agrobaggio-resumo-feira-dia-5': [1920,1080],
  'forteza-filme-produto': [1278,720], 'louvada-weis-filme-produto': [3840,2160], 'mangut-fit-batata-doce': [1920,1080],
}
test('all nine supplied films have complete discoverable metadata',()=>{
 assert.deepEqual(Object.keys(films).sort(),Object.keys(native).sort())
 for (const film of Object.values(films)) {
  assert(film.title && film.description && film.uploadDate && film.duration>0)
  assert(existsSync(`public${film.poster}`));assert(film.variants.some(v=>v.src===film.src))
  assert(film.src.startsWith('/media/services/bold-studio-'))
 }
})
for(const [id, dimensions] of Object.entries(native)) test(`${id}: native resolution retained, static renditions valid`,()=>{
 const film=films[id]; assert(film)
 assert.deepEqual([film.variants.at(-1).width,film.variants.at(-1).height],dimensions)
 for(const variant of film.variants){
  assert(variant.width<=dimensions[0] && variant.height<=dimensions[1]);assert(variant.bytes>0)
  const path=`public${variant.src}`;assert(existsSync(path))
  if(path.endsWith('.m3u8')){
   const contents=readFileSync(path,'utf8');assert(contents.includes('#EXT-X-ENDLIST'))
   const folder=dirname(path);const files=readdirSync(folder)
   assert(files.some(name=>name.endsWith('.m4s')))
   for(const name of files)assert(statSync(`${folder}/${name}`).size<100_000_000)
  }else{assert.equal(statSync(path).size,variant.bytes);assert(statSync(path).size<100_000_000)}
 }
})
test('video sitemap includes every supplied film without API proxies',()=>{
 const sitemap=readFileSync('public/video-sitemap.xml','utf8')
 assert.equal((sitemap.match(/<video:video>/g)||[]).length,9)
 assert(!sitemap.includes('/api/'));assert(!sitemap.includes('supabase.co'))
})
