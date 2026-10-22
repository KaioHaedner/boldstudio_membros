import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
const pages = JSON.parse(readFileSync('src/apps/site/data/service-seo.json','utf8'))
const films = JSON.parse(readFileSync('src/apps/site/data/service-films.json','utf8'))
const groups = {
  institucionais: ['agrobaggio-institucional','fazcarnes-institucional','mascarello-guerra-institucional'],
  eventos: ['exponorte-2026-aftermovie','agrobaggio-confraternizacao-sorriso','agrobaggio-resumo-feira-dia-5'],
  'food-produto': ['forteza-filme-produto','louvada-weis-filme-produto','mangut-fit-batata-doce'],
}
const template = readFileSync('dist/index.html','utf8')
const escape = text => text.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;')
mkdirSync('dist/seo/services',{recursive:true})
for (const [slug,seo] of Object.entries(pages)) {
  const url = `https://boldstudiobrasil.com/servico/${slug}`
  let html = template.replace(/<title>[^<]*<\/title>/,`<title>${escape(seo.title)}</title>`).replace(/(<link rel="canonical" href=")[^"]*(")/,`$1${url}$2`)
  for (const [kind,key,value] of [['name','description',seo.description],['property','og:title',seo.title],['property','og:description',seo.description],['property','og:url',url],['name','twitter:title',seo.title],['name','twitter:description',seo.description]]) {
    html=html.replace(new RegExp(`(<meta\\s+${kind}="${key}"\\s+content=")[^"]*(")`),`$1${escape(value)}$2`)
  }
  const videos=(groups[slug]??[]).map(id=>{
    const film=films[id]
    if(!film)throw new Error(`Film not prepared: ${id}`)
    return {'@context':'https://schema.org','@type':'VideoObject','@id':`${url}#${film.id}`,name:film.title,description:film.description,thumbnailUrl:`https://boldstudiobrasil.com${film.poster}`,contentUrl:`https://boldstudiobrasil.com${film.src}`,uploadDate:film.uploadDate,duration:`PT${Math.round(film.duration)}S`,creator:{'@type':'Organization',name:'Bold Studio Brasil'}}
  })
  if(videos.length)html=html.replace('</head>',`<script type="application/ld+json" data-service-videos>${JSON.stringify(videos).replaceAll('<','\\u003c')}</script></head>`)
  writeFileSync(`dist/seo/services/${slug}.html`,html)
}
console.log('Service SEO: 5 HTML entry points with individual canonical URLs.')
