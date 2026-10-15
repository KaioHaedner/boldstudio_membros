import { createHash } from 'node:crypto'
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

// Preserve supplied WebP bytes and unrelated logos (DuoTorri/Sonhalto).
const source = resolve(process.argv[2] || '.verification/white-logos-20261005')
const manifestPath = 'src/apps/site/data/client-logos.json'
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
const names = {
  'agro-baggio-john-deere': 'agro_baggio', 'machado-supermercados': 'machado',
  unimed: 'unimed', 'paiol-agricola': 'paiol', exponorte: 'exponorte', forteza: 'forteza',
  'mado-burguer': 'mado', 'grupo-sinop': 'grupo_sinop', 'shopping-sinop': 'shopping_sinop',
  frialto: 'frialto', 'jmd-urbanismo': 'jmd', fobel: 'fobel', biancon: 'biancon',
  embrapa: 'embrapa', 'parrilla-do-campo': 'parrilha_do_campo',
}
mkdirSync('public/brand/clients', { recursive: true })
for (const [slug, name] of Object.entries(names)) {
  const base = `boldstudio_logo_branco_${name}_1x`
  const input = join(source, `${base}.webp`)
  const bytes = readFileSync(input)
  if (bytes.subarray(0, 4).toString() !== 'RIFF' || bytes.subarray(8, 12).toString() !== 'WEBP') throw new Error(`Invalid WebP: ${name}`)
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 12)
  const filename = `${base}-${hash}.webp`
  const target = join('public/brand/clients', filename)
  if (!existsSync(target)) copyFileSync(input, target)
  manifest[slug] = { src: `/brand/clients/${filename}`, treatment: 'transparent' }
}
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
console.log(`Imported ${Object.keys(names).length} white logos; retained ${Object.keys(manifest).length - Object.keys(names).length} previous logos`)
