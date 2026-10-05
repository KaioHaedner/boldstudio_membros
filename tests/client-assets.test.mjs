import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'

const logos = JSON.parse(readFileSync('src/apps/site/data/client-logos.json', 'utf8'))
const previews = JSON.parse(readFileSync('src/shared/lib/public-previews.json', 'utf8'))
const recovered = JSON.parse(readFileSync('src/shared/lib/recovered-case-previews.json', 'utf8'))

test('15 white logos and both previously supplied logos are real content-hashed WebPs', () => {
  assert.equal(Object.keys(logos).length, 17)
  assert.equal(Object.values(logos).filter(logo => logo.src.includes('logo_branco_')).length, 15)
  for (const logo of Object.values(logos)) {
    const bytes = readFileSync(`public${logo.src}`)
    assert.equal(bytes.subarray(0, 4).toString(), 'RIFF')
    assert.equal(bytes.subarray(8, 12).toString(), 'WEBP')
    assert.ok(logo.src.includes(createHash('sha256').update(bytes).digest('hex').slice(0, 12)))
    assert.equal(logo.treatment, 'transparent')
  }
})

test('recovered previews match their own brands and exist locally', () => {
  const pairs = {
    'agrobaggio-cine': 'AGRO_BAGGIO_JHON_DEERE_', 'machado-copa': 'MACHADO_',
    'unimed-institucional': 'UNIMED_MT_', 'paiol-cine': 'PAIOL_AGRICOLA_',
    'exponorte-aftermovie': 'EXPORNORTE_', 'forteza-video-principal': 'FORTEZA_',
  }
  assert.equal(Object.keys(recovered).length, 6)
  for (const [name, legacy] of Object.entries(pairs)) {
    const key = recovered[`Videos_Cliente_New/${name}.mp4`]
    assert.equal(key, `CLIENTES_CONTEINER_PREVIA_VD/${legacy}.mp4`)
    assert.ok(existsSync(`public${previews[key]}`))
  }
})

test('unrecovered brands are not substituted with another brand video', () => {
  for (const name of ['duotorri-lancamento-cine', 'sonhalto-paranoa', 'showsafra-aftermovie']) {
    assert.equal(recovered[`Videos_Cliente_New/${name}.mp4`], undefined)
  }
})
