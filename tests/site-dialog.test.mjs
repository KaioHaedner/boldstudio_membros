import { test } from 'node:test'
import assert from 'node:assert/strict'
import { bindDialogBehavior } from '../src/apps/site/lib/dialog-behavior.ts'

function setup(t, count = 2) {
  globalThis.document = new EventTarget()
  document.body = { style: { overflow: 'auto' } }
  const makeElement = () => ({
    tabIndex: 0, isConnected: true, closest: () => null,
    focus() { document.activeElement = this },
  })
  const trigger = makeElement()
  document.activeElement = trigger
  const elements = Array.from({ length: count }, makeElement)
  const panel = { ...makeElement(), querySelectorAll: () => elements,
    contains: element => elements.includes(element) || element === panel }
  let closes = 0
  const cleanup = bindDialogBehavior(panel, () => { closes++ })
  t.after(cleanup)
  const key = (value, shiftKey = false) => {
    const event = new Event('keydown', { cancelable: true })
    Object.assign(event, { key: value, shiftKey })
    document.dispatchEvent(event)
    return event
  }
  return { panel, elements, trigger, cleanup, key, closes: () => closes }
}

test('dialog locks scroll, focuses content and closes with Escape', t => {
  const s = setup(t)
  assert.equal(document.body.style.overflow, 'hidden')
  assert.equal(document.activeElement, s.elements[0])
  assert.equal(s.key('Escape').defaultPrevented, true)
  assert.equal(s.closes(), 1)
})

test('Tab and Shift+Tab cycle inside a dialog', t => {
  const s = setup(t)
  assert.equal(s.key('Tab', true).defaultPrevented, true)
  assert.equal(document.activeElement, s.elements[1])
  assert.equal(s.key('Tab').defaultPrevented, true)
  assert.equal(document.activeElement, s.elements[0])
})

test('empty dialog still traps focus without errors', t => {
  const s = setup(t, 0)
  assert.equal(document.activeElement, s.panel)
  assert.equal(s.key('Tab').defaultPrevented, true)
  assert.equal(document.activeElement, s.panel)
})

test('cleanup restores scroll and focus and removes the Escape listener', t => {
  const s = setup(t)
  s.cleanup()
  assert.equal(document.body.style.overflow, 'auto')
  assert.equal(document.activeElement, s.trigger)
  s.key('Escape')
  assert.equal(s.closes(), 0)
})
