import { test } from 'node:test'
import assert from 'node:assert/strict'
import handler from '../api/media.ts'
import { media, mediaBase } from '../src/shared/lib/media.ts'

const url = 'https://bold.example/api/media?b=brand&f=backgrounds-20261005/test.webp&v=2'
function mockFetch(t, responder) {
  const original = globalThis.fetch
  const calls = []
  globalThis.fetch = async (target, init) => { calls.push({ target, init }); return responder(target, init) }
  t.after(() => { globalThis.fetch = original })
  return calls
}
test('HEAD is forwarded as HEAD and never streams the object', async t => {
  const calls = mockFetch(t, () => new Response(null, { headers: { 'content-length': '300000', etag: 'test' } }))
  const response = await handler(new Request(url, { method: 'HEAD' }))
  assert.equal(calls[0].init.method, 'HEAD')
  assert.equal(response.body, null)
  assert.equal(response.headers.get('etag'), 'test')
  assert.equal(response.headers.get('vercel-cdn-cache-control'), 'no-store')
  assert.ok(calls[0].target.includes('/brand/backgrounds-20261005/test.webp'))
})
test('range keeps 206 and private browser cache, never shared cache', async t => {
  const calls = mockFetch(t, () => new Response(new Uint8Array([1, 2]), { status: 206, headers: { 'content-range': 'bytes 0-1/50' } }))
  const response = await handler(new Request(url, { headers: { range: 'bytes=0-1' } }))
  assert.equal(calls[0].init.headers.range, 'bytes=0-1')
  assert.equal(response.status, 206)
  assert.equal(response.headers.get('content-range'), 'bytes 0-1/50')
  assert.match(response.headers.get('cache-control'), /^private/)
  assert.equal(response.headers.get('cdn-cache-control'), 'no-store')
  assert.equal(response.headers.get('vercel-cdn-cache-control'), 'no-store')
})
test('conditional validation returns 304 with no object body', async t => {
  const calls = mockFetch(t, () => new Response(null, { status: 304, headers: { etag: 'test' } }))
  const response = await handler(new Request(url, { headers: { 'if-none-match': 'test' } }))
  assert.equal(calls[0].init.headers['if-none-match'], 'test')
  assert.equal(response.status, 304)
  assert.equal(response.body, null)
  assert.equal(response.headers.get('vercel-cdn-cache-control'), 'no-store')
})
for (const status of [402, 429, 500, 503]) test(`failure ${status} is not retried or cached`, async t => {
  const calls = mockFetch(t, () => new Response('restriction', { status }))
  const response = await handler(new Request(url))
  assert.equal(calls.length, 1)
  assert.equal(response.status, status)
  assert.equal(response.headers.get('cache-control'), 'no-store')
})
test('416 preserves content-range', async t => {
  mockFetch(t, () => new Response('bad range', { status: 416, headers: { 'content-range': 'bytes */50' } }))
  const response = await handler(new Request(url))
  assert.equal(response.headers.get('content-range'), 'bytes */50')
})
test('invalid bucket, traversal and POST do not call upstream', async t => {
  const calls = mockFetch(t, () => { throw new Error('Must not fetch') })
  assert.equal((await handler(new Request(url.replace('b=brand', 'b=unknown')))).status, 404)
  assert.equal((await handler(new Request(url.replace('b=brand', 'b=constructor')))).status, 404)
  assert.equal((await handler(new Request(url.replace('b=brand', 'b=__proto__')))).status, 404)
  assert.equal((await handler(new Request(url.replace('test.webp', '../test.webp')))).status, 404)
  assert.equal((await handler(new Request(url.replace('test.webp', 'bad%5Cpath.webp')))).status, 404)
  assert.equal((await handler(new Request(url.replace('test.webp', 'bad%00path.webp')))).status, 404)
  assert.equal((await handler(new Request(url, { method: 'POST' }))).status, 405)
  assert.equal(calls.length, 0)
})

test('upstream uses its own signal and permits storage redirects', async t => {
  const calls = mockFetch(t, () => new Response('image'))
  const request = new Request(url)
  await handler(request)
  assert.notEqual(calls[0].init.signal, request.signal)
  assert.equal(calls[0].init.redirect, 'follow')
})

test('network failure returns an uncached diagnostic 502', async t => {
  const calls = mockFetch(t, () => { throw new TypeError('network error') })
  const response = await handler(new Request(url))
  assert.equal(response.status, 502)
  assert.equal(response.headers.get('cache-control'), 'no-store')
  assert.equal(response.headers.get('x-media-error'), 'fetch-failed')
  assert.equal(calls.length, 1)
})

test('ignored Range still bypasses shared caches without claiming unsupported ranges', async t => {
  mockFetch(t, () => new Response('whole object'))
  const response = await handler(new Request(url, { headers: { range: 'bytes=0-1' } }))
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('vary'), 'Range')
  assert.equal(response.headers.get('vercel-cdn-cache-control'), 'no-store')
  assert.equal(response.headers.get('accept-ranges'), null)
})

test('full GET remains cacheable and carries validators and real range support', async t => {
  mockFetch(t, () => new Response('whole object', { headers: { 'accept-ranges': 'bytes', etag: 'stable', 'last-modified': 'Mon, 05 Oct 2026 00:00:00 GMT' } }))
  const response = await handler(new Request(url))
  assert.match(response.headers.get('cache-control'), /public.*s-maxage=31536000.*immutable/)
  assert.equal(response.headers.get('accept-ranges'), 'bytes')
  assert.equal(response.headers.get('etag'), 'stable')
  assert.ok(response.headers.has('last-modified'))
})

test('compressed upstream wire length is not copied to the decoded response', async t => {
  mockFetch(t, () => new Response('decoded svg', { headers: { 'content-encoding': 'gzip', 'content-length': '4' } }))
  const response = await handler(new Request(url))
  assert.equal(response.headers.get('content-length'), null)
})

test('all generated media URLs stay same-origin, stable and query-safe', () => {
  assert.equal(media('brand', 'coins/Bold coin.webp'), '/api/media?b=brand&v=2&f=coins%2FBold%20coin.webp')
  assert.equal(mediaBase('bucket with space'), '/api/media?b=bucket%20with%20space&v=2&f=')
})
