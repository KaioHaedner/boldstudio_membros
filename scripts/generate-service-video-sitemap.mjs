import { readFileSync, writeFileSync } from 'node:fs'
const films = JSON.parse(readFileSync('src/apps/site/data/service-films.json','utf8'))
const sections = {
  institucionais: ['agrobaggio-institucional','fazcarnes-institucional','mascarello-guerra-institucional'],
  eventos: ['exponorte-2026-aftermovie','agrobaggio-confraternizacao-sorriso','agrobaggio-resumo-feira-dia-5'],
  'food-produto': ['forteza-filme-produto','louvada-weis-filme-produto','mangut-fit-batata-doce'],
}
const base = 'https://boldstudiobrasil.com'
const xml = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;')
const urls = Object.entries(sections).map(([slug, ids]) => `  <url><loc>${base}/servico/${slug}</loc>\n${ids.map(id => {
  const film = films[id]
  if (!film) throw new Error(`Film not prepared: ${id}`)
  return `    <video:video><video:thumbnail_loc>${base}${xml(film.poster)}</video:thumbnail_loc><video:title>${xml(film.title)}</video:title><video:description>${xml(film.description)}</video:description><video:content_loc>${base}${xml(film.src)}</video:content_loc><video:duration>${Math.round(film.duration)}</video:duration><video:publication_date>${film.uploadDate}</video:publication_date></video:video>`
}).join('\n')}\n  </url>`)
writeFileSync('public/video-sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n${urls.join('\n')}\n</urlset>\n`)
console.log('Video sitemap: 3 service pages, 9 films.')
