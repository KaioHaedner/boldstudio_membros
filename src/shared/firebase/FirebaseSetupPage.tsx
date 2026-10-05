import { useEffect, useState, type FormEvent } from 'react'
import type { User } from 'firebase/auth'
import { FIREBASE_PROJECT_ID } from './client'
import { loginFirebaseWithEmail, loginFirebaseWithGoogle, logoutFirebase, observeFirebaseUser } from './auth'
import { readOwnFirebaseProfile, saveOwnFirebaseProfile } from './profiles'

export default function FirebaseSetupPage() {
  const [user, setUser] = useState<User | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('Aguardando ação. Nenhum dado será migrado automaticamente.')
  const [busy, setBusy] = useState(false)
  const [name, setName] = useState('')

  useEffect(() => {
    if (import.meta.env.VITE_FIREBASE_ENABLED !== 'true') return
    return observeFirebaseUser(setUser)
  }, [])

  async function run(action: () => Promise<unknown>) {
    setBusy(true)
    try {
      await action()
      setStatus('Operação concluída no Firebase. O Supabase não foi alterado.')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Não foi possível concluir.')
    } finally {
      setBusy(false)
    }
  }

  function login(event: FormEvent) {
    event.preventDefault()
    void run(() => loginFirebaseWithEmail(email, password).finally(() => setPassword('')))
  }

  return (
    <main className="mx-auto max-w-xl space-y-5 px-5 py-12 text-white">
      <h1 className="text-3xl font-bold">Firebase · laboratório local</h1>
      <p>Projeto: {FIREBASE_PROJECT_ID}. Sem troca de login ou publicação do site atual.</p>
      <p>SDK: {import.meta.env.VITE_FIREBASE_ENABLED === 'true' ? 'configurado' : 'desativado'}.</p>
      {user ? (
        <section className="space-y-3">
          <p>Conta conectada: {user.email ?? user.uid}</p>
          <p>E-mail {user.emailVerified ? 'verificado' : 'não verificado'}.</p>
          <label>Nome do perfil privado<input className="block w-full rounded border p-2" value={name} onChange={e => setName(e.target.value)} maxLength={100} /></label>
          <button className="rounded border p-3" disabled={busy || !user.emailVerified} onClick={() => void run(() => saveOwnFirebaseProfile(name))}>Salvar meu perfil</button>
          <button className="rounded border p-3" disabled={busy || !user.emailVerified} onClick={() => void run(async () => {
            const profile = await readOwnFirebaseProfile()
            setName(profile?.displayName ?? '')
          })}>Consultar meu perfil</button>
          <button disabled={busy} onClick={() => void run(logoutFirebase)}>Sair do Firebase</button>
        </section>
      ) : (
        <form onSubmit={login} className="flex flex-col gap-4">
          <label>E-mail<input className="block w-full rounded border p-2" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" required /></label>
          <label>Senha<input className="block w-full rounded border p-2" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required /></label>
          <button className="rounded border p-3" disabled={busy} type="submit">Entrar com e-mail</button>
          <button className="rounded border p-3" disabled={busy} type="button" onClick={() => void run(loginFirebaseWithGoogle)}>Entrar com Google</button>
        </form>
      )}
      <p role="status" aria-live="polite" className="break-words">{status}</p>
      <p className="text-sm">As contas Supabase ainda não existem aqui. Google pode criar uma nova conta Firebase; esse teste não concede acesso ao Admin, Crew ou Academy. O botão de salvar grava apenas seu perfil privado no banco selecionado.</p>
    </main>
  )
}
