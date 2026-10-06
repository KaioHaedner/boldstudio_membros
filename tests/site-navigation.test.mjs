import { test } from 'node:test'
import assert from 'node:assert/strict'
import { HOME_PATH, homeSectionHref, isPlainNavigation } from '../src/apps/site/lib/home-navigation.ts'

test('home navigation retains same-page section hashes', () => {
  for (const hash of ['#home', '#sobre', '#servicos', '#crew', '#cases', '#processo', '#clientes', '#contato']) {
    assert.equal(homeSectionHref(HOME_PATH, hash), hash)
  }
})

test('service header and footer links go to home instead of absent sections', () => {
  for (const hash of ['#home', '#crew', '#cases', '#contato']) {
    assert.equal(homeSectionHref('/servico/filmes-publicitarios', hash), `${HOME_PATH}${hash}`)
  }
})

test('modified clicks retain native browser new-tab navigation', () => {
  const click = { button: 0, ctrlKey: false, metaKey: false, altKey: false, shiftKey: false }
  assert.equal(isPlainNavigation(click), true)
  assert.equal(isPlainNavigation({ ...click, button: 1 }), false)
  for (const modifier of ['ctrlKey', 'metaKey', 'altKey', 'shiftKey']) {
    assert.equal(isPlainNavigation({ ...click, [modifier]: true }), false)
  }
})
