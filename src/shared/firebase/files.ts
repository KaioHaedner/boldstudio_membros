import { getBlob, ref, uploadBytes, type UploadResult } from 'firebase/storage'
import { getFirebaseAuth, getFirebaseStorage } from './client'

const MAX_FILE_BYTES = 20 * 1024 * 1024
const TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])

function ownFileReference(id: string) {
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(id)) throw new Error('Identificador de arquivo inválido.')
  const user = getFirebaseAuth().currentUser
  if (!user?.emailVerified) throw new Error('Entre com uma conta com e-mail verificado.')
  return ref(getFirebaseStorage(), `users/${user.uid}/files/${id}`)
}

export async function uploadPrivateFirebaseFile(file: File): Promise<UploadResult> {
  if (!TYPES.has(file.type) || file.size === 0 || file.size > MAX_FILE_BYTES) {
    throw new Error('Use JPEG, PNG, WebP ou PDF de até 20 MiB.')
  }
  // Sem getDownloadURL: URLs com token não são apropriadas para arquivos privados.
  return uploadBytes(ownFileReference(crypto.randomUUID()), file, { contentType: file.type })
}

export function readPrivateFirebaseFile(id: string) {
  return getBlob(ownFileReference(id), MAX_FILE_BYTES)
}
