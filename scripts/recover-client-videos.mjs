import { mkdirSync, existsSync, readFileSync, writeFileSync, renameSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { createHash } from 'node:crypto'
import { Readable, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'

// Public Storage objects only: never reads credentials or changes cloud data.
const target = resolve('.verification/recovery/client-videos-20261005')
mkdirSync(target, { recursive: true })
const names = ['agrobaggio-cine', 'showsafra-aftermovie', 'machado-copa', 'unimed-institucional',
  'paiol-cine', 'exponorte-aftermovie', 'forteza-video-principal', 'duotorri-lancamento-cine', 'sonhalto-paranoa']
const result = []
for (const name of names) {
  const file = `${name}.mp4`
  const url = `https://heriogfvynncvabbwspu.supabase.co/storage/v1/object/public/Videos_Cliente_New/${file}`
  const destination = join(target, file)
  if (existsSync(destination)) {
    const bytes = readFileSync(destination)
    result.push({ file, status: 200, reused: true, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') })
    continue
  }
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(180000) })
    if (response.status !== 200) {
      const diagnostic = (await response.text()).slice(0, 250)
      result.push({ file, status: response.status, diagnostic })
      console.log(JSON.stringify(result.at(-1)))
      continue
    }
    if (!(response.headers.get('content-type') || '').includes('video')) {
      await response.body.cancel()
      throw new Error('Unexpected content type')
    }
    const expected = Number(response.headers.get('content-length')) || 0
    if (expected > 1024 ** 3) { await response.body.cancel(); throw new Error('Safety limit 1 GiB') }
    let size = 0
    const hash = createHash('sha256')
    await pipeline(Readable.fromWeb(response.body), new Transform({ transform(chunk, _, done) {
      size += chunk.length
      if (size > 1024 ** 3) return done(new Error('Safety limit 1 GiB'))
      hash.update(chunk); done(null, chunk)
    } }), (await import('node:fs')).createWriteStream(`${destination}.partial`, { flags: 'wx' }))
    if (expected && size !== expected) throw new Error('Incomplete transfer; partial preserved')
    renameSync(`${destination}.partial`, destination)
    result.push({ file, status: 200, bytes: size, sha256: hash.digest('hex') })
  } catch (error) { result.push({ file, error: error.message }) }
  writeFileSync(join(target, 'manifest.json'), JSON.stringify(result, null, 2))
  console.log(JSON.stringify(result.at(-1)))
}
writeFileSync(join(target, 'manifest.json'), JSON.stringify(result, null, 2))
