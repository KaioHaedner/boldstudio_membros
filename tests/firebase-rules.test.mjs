import { before, after, beforeEach, describe, it } from 'node:test'
import { readFileSync } from 'node:fs'
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing'
import { collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc, Timestamp, updateDoc } from 'firebase/firestore'
import { deleteObject, getMetadata, ref, uploadBytes } from 'firebase/storage'

function localEmulator(variable) {
  const value = process.env[variable]
  const match = /^(localhost|127\.0\.0\.1):(\d+)$/.exec(value ?? '')
  if (!match) throw new Error(`${variable} deve apontar para um emulador local. Nunca execute estes testes contra produção.`)
  return { host: match[1], port: Number(match[2]) }
}

let environment
const verified = { email: 'owner@example.test', email_verified: true }
const profile = (uid = 'alice') => ({ uid, displayName: 'Alice', createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
const database = (uid = 'alice', claims = verified) => environment.authenticatedContext(uid, claims).firestore()

before(async () => {
  environment = await initializeTestEnvironment({
    projectId: 'demo-boldstudiohub',
    firestore: { ...localEmulator('FIRESTORE_EMULATOR_HOST'), rules: readFileSync('firestore.rules', 'utf8') },
    storage: { ...localEmulator('FIREBASE_STORAGE_EMULATOR_HOST'), rules: readFileSync('storage.rules', 'utf8') },
  })
})
after(async () => { await environment?.cleanup() })
beforeEach(async () => { await environment.clearFirestore(); await environment.clearStorage() })

describe('Firestore — propriedade, schema e bloqueio de privilégios', () => {
  it('nega anônimo e e-mail não verificado', async () => {
    await assertFails(getDoc(doc(environment.unauthenticatedContext().firestore(), 'users_private/alice')))
    await assertFails(setDoc(doc(database('alice', { email_verified: false }), 'users_private/alice'), profile()))
  })
  it('permite criar, consultar e atualizar somente o próprio perfil válido', async () => {
    const own = doc(database(), 'users_private/alice')
    await assertSucceeds(setDoc(own, profile()))
    await assertSucceeds(getDoc(own))
    await assertSucceeds(updateDoc(own, { displayName: 'Alice atualizada', updatedAt: serverTimestamp() }))
  })
  it('nega leitura e escrita por outro usuário, inclusive com claim admin', async () => {
    await setDoc(doc(database(), 'users_private/alice'), profile())
    const foreign = doc(database('bob', { ...verified, role: 'admin' }), 'users_private/alice')
    await assertFails(getDoc(foreign))
    await assertFails(updateDoc(foreign, { displayName: 'Bob', updatedAt: serverTimestamp() }))
  })
  it('nega papéis, campos inesperados, UID falso e schema inválido na criação', async () => {
    const own = doc(database(), 'users_private/alice')
    for (const data of [
      { ...profile(), role: 'admin' }, { ...profile(), email: 'private@example.test' },
      { ...profile('bob') }, { ...profile(), displayName: 123 },
      { ...profile(), displayName: '' }, { ...profile(), displayName: 'a'.repeat(101) },
      { ...profile(), createdAt: '2026-10-05' },
    ]) await assertFails(setDoc(own, data))
    await assertFails(setDoc(own, { uid: 'alice', displayName: 'Alice' }))
  })
  it('nega bypass de schema, troca de UID e de createdAt na atualização', async () => {
    const own = doc(database(), 'users_private/alice')
    await setDoc(own, profile())
    for (const data of [
      { role: 'admin' }, { uid: 'bob' }, { createdAt: Timestamp.fromMillis(0) },
      { displayName: 'a'.repeat(101) }, { displayName: false },
    ]) await assertFails(updateDoc(own, { ...data, updatedAt: serverTimestamp() }))
    await assertFails(setDoc(own, { uid: 'alice', updatedAt: serverTimestamp() }))
    await assertFails(updateDoc(own, { updatedAt: Timestamp.fromMillis(0) }))
  })
  it('nega listagem ampla, exclusão, subcoleções e áreas ainda não migradas', async () => {
    const db = database()
    await setDoc(doc(db, 'users_private/alice'), profile())
    await assertFails(getDocs(collection(db, 'users_private')))
    await assertFails(deleteDoc(doc(db, 'users_private/alice')))
    for (const path of ['users_private/alice/secrets/key', 'courses/course', 'roles/alice', 'enrollments/alice']) {
      await assertFails(setDoc(doc(db, path), { owner: 'alice' }))
      await assertFails(getDoc(doc(db, path)))
    }
  })
})

describe('Storage — arquivos privados imutáveis e limitados', () => {
  const ownFile = (id = 'file') => ref(environment.authenticatedContext('alice', verified).storage(), `users/alice/files/${id}`)
  it('permite arquivo privado válido e leitura pelo dono', async () => {
    await assertSucceeds(uploadBytes(ownFile(), new Uint8Array([1, 2]), { contentType: 'image/png' }))
    await assertSucceeds(getMetadata(ownFile()))
  })
  it('nega outros usuários e anônimos', async () => {
    await uploadBytes(ownFile(), new Uint8Array([1]), { contentType: 'application/pdf' })
    for (const context of [environment.unauthenticatedContext(), environment.authenticatedContext('bob', verified)]) {
      const file = ref(context.storage(), 'users/alice/files/file')
      await assertFails(getMetadata(file))
      await assertFails(uploadBytes(file, new Uint8Array([1]), { contentType: 'image/jpeg' }))
    }
  })
  it('nega não verificado, SVG, vazio e acima de 20 MiB', async () => {
    const unverified = ref(environment.authenticatedContext('alice', { email_verified: false }).storage(), 'users/alice/files/file')
    await assertFails(uploadBytes(unverified, new Uint8Array([1]), { contentType: 'image/png' }))
    await assertFails(uploadBytes(ownFile('svg'), new Uint8Array([1]), { contentType: 'image/svg+xml' }))
    await assertFails(uploadBytes(ownFile('empty'), new Uint8Array(), { contentType: 'image/png' }))
    await assertFails(uploadBytes(ownFile('large'), new Uint8Array(20 * 1024 * 1024 + 1), { contentType: 'image/png' }))
  })
  it('nega sobrescrita, exclusão e caminhos fora da área privada', async () => {
    await uploadBytes(ownFile(), new Uint8Array([1]), { contentType: 'image/png' })
    await assertFails(uploadBytes(ownFile(), new Uint8Array([2]), { contentType: 'image/png' }))
    await assertFails(deleteObject(ownFile()))
    for (const path of ['public/image', 'academy/video', 'users/alice/files/file/nested']) {
      const file = ref(environment.authenticatedContext('alice', verified).storage(), path)
      await assertFails(uploadBytes(file, new Uint8Array([1]), { contentType: 'image/png' }))
    }
  })
})
