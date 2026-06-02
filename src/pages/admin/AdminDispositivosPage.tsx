import { useEffect, useState } from 'react'
import { Smartphone, Monitor, Tablet, AlertTriangle, Trash2, ShieldCheck } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Loader } from '@/components/Loader'

const MAX_DEVICES = 3

interface DeviceRow {
  id: string
  user_id: string
  device_label: string | null
  device_type: string | null
  last_seen_at: string
}
interface UserDevices {
  user_id: string
  name: string
  devices: DeviceRow[]
}

function DeviceIcon({ type }: { type: string | null }) {
  if (type === 'mobile') return <Smartphone size={14} />
  if (type === 'tablet') return <Tablet size={14} />
  return <Monitor size={14} />
}

export function AdminDispositivosPage() {
  const [groups, setGroups] = useState<UserDevices[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data: devices } = await supabase
      .from('device_sessions')
      .select('id, user_id, device_label, device_type, last_seen_at')
      .order('last_seen_at', { ascending: false })
    const { data: profiles } = await supabase.from('profiles').select('id, full_name')
    const nameMap = new Map((profiles ?? []).map((p) => [p.id, p.full_name]))

    const byUser = new Map<string, DeviceRow[]>()
    for (const d of devices ?? []) {
      const arr = byUser.get(d.user_id) ?? []
      arr.push(d as DeviceRow)
      byUser.set(d.user_id, arr)
    }
    const g: UserDevices[] = [...byUser.entries()].map(([uid, devs]) => ({
      user_id: uid,
      name: (nameMap.get(uid) as string) ?? '(sem nome)',
      devices: devs,
    }))
    g.sort((a, b) => b.devices.length - a.devices.length)
    setGroups(g)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function removeDevice(id: string) {
    await supabase.from('device_sessions').delete().eq('id', id)
    load()
  }

  const overLimit = groups.filter((g) => g.devices.length > MAX_DEVICES)

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs text-bold-yellow uppercase tracking-widest">Segurança</p>
        <h1 className="text-2xl md:text-3xl font-extrabold mt-1.5">Dispositivos</h1>
        <p className="mt-2 text-sm text-bold-white/60">
          Limite de {MAX_DEVICES} aparelhos por aluno. {groups.length} com dispositivos registrados
          {overLimit.length > 0 && (
            <span className="text-red-400 font-medium"> • {overLimit.length} acima do limite</span>
          )}
        </p>
      </header>

      {overLimit.length > 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
          <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={18} />
          <div className="text-sm text-red-200">
            <p className="font-semibold">
              {overLimit.length} aluno{overLimit.length > 1 ? 's' : ''} com mais de {MAX_DEVICES} dispositivos
            </p>
            <p className="text-red-200/70 mt-0.5">
              Pode indicar compartilhamento de conta. Revise e remova os aparelhos que não reconhecer.
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <Loader label="Carregando dispositivos..." />
      ) : groups.length === 0 ? (
        <div className="rounded-lg border border-bold-white/10 bg-bold-gray/40 p-8 text-center text-sm text-bold-white/60">
          Nenhum dispositivo registrado ainda. Os aparelhos aparecem aqui conforme os alunos fazem login.
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map((g) => {
            const exceeded = g.devices.length > MAX_DEVICES
            return (
              <div
                key={g.user_id}
                className={`rounded-lg border p-4 ${
                  exceeded ? 'border-red-500/40 bg-red-500/5' : 'border-bold-white/10 bg-bold-gray/40'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{g.name}</p>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider ${
                        exceeded ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
                      }`}
                    >
                      {g.devices.length}/{MAX_DEVICES}
                    </span>
                  </div>
                  {!exceeded && <ShieldCheck className="text-green-400/60" size={15} />}
                </div>
                <div className="space-y-1.5">
                  {g.devices.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between rounded-md bg-bold-black/40 px-3 py-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-bold-white/60">
                          <DeviceIcon type={d.device_type} />
                        </span>
                        <span className="text-sm truncate">{d.device_label || 'Dispositivo'}</span>
                        <span className="text-[11px] text-bold-white/40 shrink-0">
                          • {new Date(d.last_seen_at).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDevice(d.id)}
                        title="Remover dispositivo"
                        className="text-bold-white/40 hover:text-red-400 transition shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
