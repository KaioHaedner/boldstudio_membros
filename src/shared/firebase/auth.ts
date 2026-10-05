import {
  GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail,
  signInWithEmailAndPassword, signInWithPopup, signOut, type User,
} from 'firebase/auth'
import { getFirebaseAuth } from './client'

// Separado do AuthContext Supabase: não converte sessões, perfis ou permissões antigas.
export function observeFirebaseUser(listener: (user: User | null) => void) {
  return onAuthStateChanged(getFirebaseAuth(), listener)
}

export function loginFirebaseWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password)
}

export function loginFirebaseWithGoogle() {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })
  return signInWithPopup(getFirebaseAuth(), provider)
}

export function logoutFirebase() {
  return signOut(getFirebaseAuth())
}

export function resetFirebasePassword(email: string) {
  return sendPasswordResetEmail(getFirebaseAuth(), email.trim())
}
