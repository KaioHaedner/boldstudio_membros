import { test } from 'node:test'
import assert from 'node:assert/strict'
import handler from '../api/media.ts'

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
  assert.ok(calls[0].target.includes('/brand/backgrounds-20261005/test.webp'))
})
test('range keeps 206 and private browser cache, never shared cache', async t => {
  const calls = mockFetch(t, () => new Response(new Uint8Array([1, 2]), { status: 206, headers: { 'content-range': 'bytes 0-1/50' } }))
  const response = await handler(new Request(url, { headers: { range: 'bytes=0-1' } }))
  assert.equal(calls[0].init.headers.range, 'bytes=0-1')
  assert.equal(response.status, 206)
  assert.equal(response.headers.get('content-range'), 'bytes 0-1/50')
  assert.match(response.headers.get('cache-control'), /^private/)
})
test('conditional validation returns 304 with no object body', async t => {
  const calls = mockFetch(t, () => new Response(null, { status: 304, headers: { etag: 'test' } }))
  const response = await handler(new Request(url, { headers: { 'if-none-match': 'test' } }))
  assert.equal(calls[0].init.headers['if-none-match'], 'test')
  assert.equal(response.status, 304)
  assert.equal(response.body, null)
})
for (const status of [402, 429]) test(`quota ${status} is not retried or cached`, async t => {
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
  mockFetch(t, () => { throw new TypeError('network error') })
  const response = await handler(new Request(url))
  assert.equal(response.status, 502)
  assert.equal(response.headers.get('cache-control'), 'no-store')
  assert.equal(response.headers.get('x-media-error'), 'fetch-failed')
})
