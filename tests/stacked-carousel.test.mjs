import { test } from 'node:test'
import assert from 'node:assert/strict'
import { slideOffset, slideAppearance, slideIndex, swipeTarget } from '../src/shared/lib/stacked-carousel.ts'

test('active card is centered, with symmetric compact neighbors', () => {
  assert.equal(slideOffset(0, 0, 9), 0)
  assert.equal(slideOffset(8, 0, 9), -1)
  assert.equal(slideOffset(1, 0, 9), 1)
  assert.deepEqual(slideAppearance(-1), slideAppearance(1))
  assert.equal(slideAppearance(0).scale, 1)
  assert.equal(slideAppearance(0).opacity, 1)
})
test('only the active card and two neighbors per side are visible at rest', () => {
  const visible = Array.from({ length: 9 }, (_, index) => slideAppearance(slideOffset(index, 0, 9))).filter(slide => slide.opacity > 0)
  assert.equal(visible.length, 5)
  assert.equal(slideAppearance(3).opacity, 0)
  assert(slideAppearance(0).zIndex > slideAppearance(1).zIndex)
})
test('loop works in both directions and after repeated navigation', () => {
  for (const progress of [-900, -10, -1, 0, 1, 8, 9, 999]) {
    const index = slideIndex(progress, 9)
    assert.equal(slideOffset(index, progress, 9), 0)
    assert(index >= 0 && index < 9)
  }
  assert.equal(slideIndex(-1, 9), 8)
  assert.equal(slideIndex(9, 9), 0)
})
test('short, vertical and canceled drags return to their starting selection', () => {
  for (const distance of [-500, -10, 0, 10, 500]) assert.equal(swipeTarget(3, distance, false), 3)
})
test('each completed swipe selects exactly one card in the gesture direction', () => {
  assert.equal(swipeTarget(3, -80, true), 4)
  assert.equal(swipeTarget(3, 80, true), 2)
  assert.equal(swipeTarget(3, -900, true), 4)
  assert.equal(swipeTarget(3.2, 80, true), 2)
})
