import { getApp, getApps, initializeApp, type FirebaseOptions } from 'firebase/app'
import { connectAuthEmulator, getAuth, type Auth } from 'firebase/auth'
import { connectStorageEmulator, getStorage, type FirebaseStorage } from 'firebase/storage'

export const FIREBASE_PROJECT_ID = 'boldstudiohub'
const APP_NAME = 'boldstudiohub-web'
let auth: Auth | undefined
let storage: FirebaseStorage | undefined

export function usesFirebaseEmulators() {
  if (import.meta.env.VITE_FIREBASE_USE_EMULATORS !== 'true') return false
  if (!import.meta.env.DEV || !['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)) {
    throw new Error('Emuladores Firebase só podem ser usados no desenvolvimento local.')
  }
  return true
}

export function getFirebaseApp() {
  if (import.meta.env.VITE_FIREBASE_ENABLED !== 'true') {
    throw new Error('Firebase desativado. Configure VITE_FIREBASE_ENABLED na cópia de desenvolvimento.')
  }
  const options: FirebaseOptions = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  }
  if (options.projectId !== FIREBASE_PROJECT_ID || !options.apiKey || !options.appId || !options.authDomain) {
    throw new Error('Configuração pública Firebase incompleta ou projeto diferente de boldstudiohub.')
  }
  return getApps().some(app => app.name === APP_NAME)
    ? getApp(APP_NAME)
    : initializeApp(options, APP_NAME)
}

export function getFirebaseAuth() {
  if (!auth) {
    const local = usesFirebaseEmulators()
    auth = getAuth(getFirebaseApp())
    if (local) connectAuthEmulator(auth, 'http://127.0.0.1:9099')
  }
  return auth
}

export function getFirebaseStorage() {
  if (!storage) {
    const local = usesFirebaseEmulators()
    if (!import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) throw new Error('Bucket Firebase ainda não configurado.')
    storage = getStorage(getFirebaseApp())
    if (local) connectStorageEmulator(storage, '127.0.0.1', 9199)
  }
  return storage
}
