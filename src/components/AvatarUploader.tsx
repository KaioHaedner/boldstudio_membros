import { useRef, useState } from 'react'
import { Camera, Loader2, Trash2, User as UserIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

const MAX_SIZE_BYTES = 3 * 1024 * 1024 // 3 MB
const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp']

interface AvatarUploaderProps {
  size?: number
  onChanged?: () => void
}

export function AvatarUploader({ size = 192, onChanged }: AvatarUploaderProps) {
  const { user, profile, refreshProfile } = useAuth()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    if (!user?.id) return
    setError(null)

    if (!ACCEPTED.includes(file.type)) {
      setError('Formato inválido. Use PNG, JPG ou WEBP.')
      return
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError('Imagem muito grande (máximo 3 MB).')
      return
    }

    setUploading(true)
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
    const path = `${user.id}/avatar-${Date.now()}.${ext}`

    const { error: upErr } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, cacheControl: '3600' })

    if (upErr) {
      setUploading(false)
      setError(upErr.message)
      return
    }

    const { data: publicUrl } = supabase.storage.from('avatars').getPublicUrl(path)
    const url = `${publicUrl.publicUrl}?v=${Date.now()}` // cache buster

    const { error: updErr } = await supabase
      .from('profiles')
      .update({ avatar_url: url })
      .eq('id', user.id)

    setUploading(false)
    if (updErr) {
      setError(updErr.message)
      return
    }
    await refreshProfile()
    onChanged?.()
  }

  async function handleRemove() {
    if (!user?.id || !profile?.avatar_url) return
    setError(null)
    setUploading(true)
    const { error: updErr } = await supabase
      .from('profiles')
      .update({ avatar_url: null })
      .eq('id', user.id)
    setUploading(false)
    if (updErr) {
      setError(updErr.message)
      return
    }
    await refreshProfile()
    onChanged?.()
  }

  const initials = (profile?.full_name ?? user?.email ?? 'B')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative rounded-full overflow-hidden bg-bold-gray border-2 border-bold-yellow/40 shadow-[0_0_30px_-10px_rgba(255,215,18,0.4)]"
        style={{ width: size, height: size }}
      >
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-bold-gray to-bold-black">
            {profile?.full_name ? (
              <span className="text-4xl font-extrabold text-bold-yellow">{initials}</span>
            ) : (
              <UserIcon size={64} className="text-bold-white/30" />
            )}
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-bold-black/60 flex items-center justify-center">
            <Loader2 className="animate-spin text-bold-yellow" size={32} />
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col items-center gap-2 w-full">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center justify-center gap-2 w-full max-w-[200px] px-4 py-2 rounded-md bg-bold-yellow text-bold-black text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition"
        >
          <Camera size={14} />
          {profile?.avatar_url ? 'Trocar foto' : 'Enviar foto'}
        </button>

        {profile?.avatar_url && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={uploading}
            className="inline-flex items-center gap-1 text-xs text-bold-white/50 hover:text-red-400 transition"
          >
            <Trash2 size={12} /> Remover
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED.join(',')}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
            e.target.value = ''
          }}
        />

        {error && (
          <p className="mt-1 text-xs text-red-400 text-center max-w-[220px]">{error}</p>
        )}

        <p className="text-[10px] text-bold-white/30 uppercase tracking-widest mt-1">
          PNG / JPG / WEBP. Máximo 3MB
        </p>
      </div>
    </div>
  )
}
