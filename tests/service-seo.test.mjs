import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const seo=JSON.parse(readFileSync('src/apps/site/data/service-seo.json','utf8'))
const config=JSON.parse(readFileSync('vercel.json','utf8'))
for(const slug of Object.keys(seo))test(`${slug}: static SEO entry has its own canonical and matching rewrite`,()=>{
 const destination=`/seo/services/${slug}.html`
 const html=readFileSync(`dist${destination}`,'utf8')
 const url=`https://boldstudiobrasil.com/servico/${slug}`
 assert(html.includes(`<link rel="canonical" href="${url}"`))
 assert(html.includes(`<meta property="og:url" content="${url}"`))
 assert(html.includes(`<title>${seo[slug].title}</title>`))
 assert(config.rewrites.some(rule=>rule.source===`/servico/${slug}` && rule.destination===destination))
 const data=html.match(/<script type="application\/ld\+json" data-service-videos>(.*?)<\/script>/s)
 if(['institucionais','eventos','food-produto'].includes(slug)){
  const videos=JSON.parse(data?.[1]??'null');assert.equal(videos.length,3)
  for(const video of videos){assert.equal(video['@type'],'VideoObject');assert(video['@id'].startsWith(`${url}#`));assert(video.contentUrl.startsWith('https://boldstudiobrasil.com/media/services/'))}
 }
})
