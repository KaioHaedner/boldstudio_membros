import { connectFirestoreEmulator, doc, getDoc, getFirestore, runTransaction, serverTimestamp, Timestamp, type Firestore } from 'firebase/firestore'
import { getFirebaseApp, getFirebaseAuth, usesFirebaseEmulators } from './client'

export interface FirebasePrivateProfile {
  uid: string
  displayName: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

let database: Firestore | undefined

export function getFirebaseDatabase() {
  if (!database) {
    const local = usesFirebaseEmulators()
    database = getFirestore(getFirebaseApp())
    if (local) connectFirestoreEmulator(database, '127.0.0.1', 8080)
  }
  return database
}

function ownProfileReference() {
  const user = getFirebaseAuth().currentUser
  if (!user?.emailVerified) throw new Error('Entre com uma conta com e-mail verificado.')
  return doc(getFirebaseDatabase(), 'users_private', user.uid)
}

export async function readOwnFirebaseProfile(): Promise<FirebasePrivateProfile | null> {
  const snapshot = await getDoc(ownProfileReference())
  if (!snapshot.exists()) return null
  const data = snapshot.data()
  if (data.uid !== snapshot.id || typeof data.displayName !== 'string'
    || !(data.createdAt instanceof Timestamp) || !(data.updatedAt instanceof Timestamp)) {
    throw new Error('Perfil Firebase incompatível com o modelo inicial.')
  }
  return { uid: data.uid, displayName: data.displayName, createdAt: data.createdAt, updatedAt: data.updatedAt }
}

export async function saveOwnFirebaseProfile(displayName: string) {
  const name = displayName.trim()
  if (!name || name.length > 100) throw new Error('O nome precisa ter entre 1 e 100 caracteres.')
  const reference = ownProfileReference()
  await runTransaction(getFirebaseDatabase(), async transaction => {
    const existing = await transaction.get(reference)
    const fields = { displayName: name, updatedAt: serverTimestamp() }
    if (existing.exists()) transaction.update(reference, fields)
    else transaction.set(reference, { ...fields, uid: reference.id, createdAt: serverTimestamp() })
  })
}
