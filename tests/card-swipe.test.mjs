import { test } from 'node:test'
import assert from 'node:assert/strict'
import { bindCardSwipe } from '../src/apps/site/hooks/card-swipe.ts'

function setup(t) {
  const stage = new EventTarget()
  stage.setPointerCapture = () => {}
  stage.hasPointerCapture = () => false
  globalThis.window = new EventTarget()
  globalThis.document = new EventTarget()
  document.hidden = false
  const finishes = []
  const moves = []
  const cleanup = bindCardSwipe(stage, { begin() {}, width: () => 300,
    move: d => moves.push(d), finish: advance => finishes.push(advance) })
  t.after(cleanup)
  const send = (target, type, x, y, id = 1) => {
    const e = new Event(type, { cancelable: true })
    Object.assign(e, { clientX: x, clientY: y, pointerId: id, button: 0, isPrimary: true })
    target.dispatchEvent(e)
    return e
  }
  send(stage, 'pointerdown', 100, 100)
  return { stage, send, finishes, moves, cleanup }
}
test('horizontal swipe advances exactly once', t => {
  const s = setup(t)
  const e = s.send(window, 'pointermove', 200, 103)
  assert.equal(e.defaultPrevented, true)
  s.send(window, 'pointerup', 200, 103)
  assert.deepEqual(s.finishes, [true])
})
test('vertical and diagonal gestures leave native scrolling free', t => {
  const s = setup(t)
  const e = s.send(window, 'pointermove', 115, 130)
  assert.equal(e.defaultPrevented, false)
  s.send(window, 'pointerup', 115, 130)
  assert.deepEqual(s.moves, [])
  assert.deepEqual(s.finishes, [false])
})
for (const type of ['pointercancel', 'lostpointercapture', 'resize', 'blur', 'visibilitychange']) {
  test(`${type} does not advance even after a long horizontal drag`, t => {
    const s = setup(t)
    s.send(window, 'pointermove', 250, 100)
    if (type === 'visibilitychange') { document.hidden = true; document.dispatchEvent(new Event(type)) }
    else if (type === 'lostpointercapture') s.send(s.stage, type, 250, 100)
    else s.send(window, type, 250, 100)
    s.send(window, 'pointerup', 250, 100)
    assert.deepEqual(s.finishes, [false])
  })
}
test('second pointer cannot hijack an active gesture', t => {
  const s = setup(t)
  s.send(window, 'pointermove', 300, 100, 2)
  assert.deepEqual(s.moves, [])
})
test('cleanup removes all listeners before StrictMode remount', t => {
  const s = setup(t)
  s.cleanup()
  s.send(s.stage, 'pointerdown', 100, 100)
  s.send(window, 'pointermove', 250, 100)
  s.send(window, 'pointerup', 250, 100)
  assert.deepEqual(s.finishes, [])
})
