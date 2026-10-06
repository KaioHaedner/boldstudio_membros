import { test } from 'node:test'
import assert from 'node:assert/strict'
import { observeVideo } from '../src/shared/lib/video-budget.ts'

function setup(t, { saveData = false, controls = false, autoplay = true } = {}) {
  let callback
  globalThis.IntersectionObserver = class {
    constructor(cb) { callback = cb }
    observe() {}
    disconnect() {}
  }
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { connection: { saveData } } })
  globalThis.window = { matchMedia: () => ({ matches: false }) }
  globalThis.document = new EventTarget()
  document.hidden = false
  const attrs = new Map()
  const video = { controls, plays: 0, pauses: 0, loads: 0, writes: 0, getAttribute: k => attrs.get(k),
    setAttribute(k, v) { this.writes++; attrs.set(k, v) }, removeAttribute: k => attrs.delete(k),
    play() { this.plays++; return Promise.resolve() }, pause() { this.pauses++ }, load() { this.loads++ } }
  const cleanup = observeVideo(video, '/media/previews/test-v1.mp4', autoplay)
  t.after(cleanup)
  return { video, attrs, visible: value => callback([{ isIntersecting: value }]), cleanup }
}
test('offscreen video has no source and makes no automatic load', t => {
  const s = setup(t)
  s.visible(false)
  assert.equal(s.attrs.get('src'), undefined)
  assert.equal(s.video.plays, 0)
})
test('entering loads once; leaving/hidden pauses without changing stable URL', t => {
  const s = setup(t)
  s.visible(true)
  assert.equal(s.attrs.get('src'), '/media/previews/test-v1.mp4')
  s.visible(false)
  assert.equal(s.attrs.get('src'), '/media/previews/test-v1.mp4')
  s.visible(true)
  assert.equal(s.video.writes, 1)
  document.hidden = true
  document.dispatchEvent(new Event('visibilitychange'))
  assert.ok(s.video.pauses > 0)
})
test('data-saving mode does not attach decorative video', t => {
  const s = setup(t, { saveData: true })
  s.visible(true)
  assert.equal(s.attrs.get('src'), undefined)
})
test('full movie with controls never autoplays', t => {
  const s = setup(t, { controls: true, autoplay: false })
  s.visible(true)
  assert.equal(s.video.plays, 0)
  assert.ok(s.attrs.has('src'))
})

test('effect reconnection to the same source retains the buffer', async t => {
  const s = setup(t)
  s.visible(true)
  s.cleanup()
  const reconnect = observeVideo(s.video, '/media/previews/test-v1.mp4', true)
  t.after(reconnect)
  await Promise.resolve()
  s.visible(true)
  assert.equal(s.video.loads, 0)
  assert.equal(s.video.writes, 1)
})

test('source change aborts the previous transfer, and real unmount unloads', async t => {
  const s = setup(t)
  s.visible(true)
  s.cleanup()
  const reconnect = observeVideo(s.video, '/media/previews/other-v1.mp4', true)
  t.after(reconnect)
  assert.equal(s.video.loads, 1)
  s.visible(true)
  assert.equal(s.attrs.get('src'), '/media/previews/other-v1.mp4')
  reconnect()
  await Promise.resolve()
  assert.equal(s.attrs.has('src'), false)
  assert.equal(s.video.loads, 2)
})
