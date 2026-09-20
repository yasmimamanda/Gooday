import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { fetchNotifications, type AppNotification } from '../lib/api'
import { supabase } from '../lib/supabase'

type Notif = AppNotification

export default function Notifications({ onClose }: { onClose: () => void }) {
  const [notifs, setNotifs] = useState<Notif[]>([])
  const [acted, setActed] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const rows = await fetchNotifications()
        if (!cancelled) setNotifs(rows)
      } catch (err) {
        console.warn('[Gooday] notifications', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const unreadCount = notifs.filter((n) => !n.read).length

  const markAllRead = async () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))
    const ids = notifs.filter((n) => !n.read).map((n) => n.id)
    if (ids.length) {
      await supabase.from('notifications').update({ is_read: true }).in('id', ids)
    }
  }

  const markRead = async (id: string) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
  }

  const handleCta = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setActed((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
    void markRead(id)
  }

  const recent = notifs.filter(
    (n) =>
      n.time.includes('min') ||
      n.time.includes(' h') ||
      n.time === 'agora' ||
      /^\d+ h$/.test(n.time),
  )
  const older = notifs.filter((n) => !recent.includes(n))

  const renderGroup = (items: Notif[], label: string) => {
    if (!items.length) return null
    return (
      <div className="mb-1">
        <p className="px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.8px] text-neutral-500">{label}</p>
        {items.map((n) => (
          <button
            key={n.id}
            onClick={() => void markRead(n.id)}
            className="flex w-full items-start gap-3 px-5 py-3.5 text-left transition-colors"
            style={{ background: n.read ? 'transparent' : 'rgba(212,245,53,0.14)' }}
          >
            <div className="h-[52px] w-[52px] shrink-0 overflow-hidden rounded-full">
              <img src={n.avatar} alt="" className="h-full w-full object-cover" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[14px] leading-snug text-ink">
                <span className="font-bold">{n.name}</span>{' '}
                <span className="font-normal text-neutral-600">{n.text}</span>
              </p>
              <p className="mt-0.5 text-[12px] text-neutral-400">{n.time}</p>
            </div>

            {n.cta && (
              <button
                onClick={(e) => handleCta(n.id, e)}
                className={
                  acted.has(n.id)
                    ? 'ml-2 shrink-0 self-center rounded-full bg-neutral-100 px-3.5 py-2 text-[13px] font-semibold text-neutral-700 transition-colors'
                    : 'ml-2 shrink-0 self-center rounded-full px-3.5 py-2 text-[13px] font-semibold text-ink transition-colors'
                }
                style={!acted.has(n.id) ? { background: '#d4f535' } : undefined}
              >
                {acted.has(n.id)
                  ? n.cta.action === 'follow'
                    ? 'Seguindo'
                    : n.cta.action === 'accept'
                      ? 'Aceito'
                      : n.cta.label
                  : n.cta.label}
              </button>
            )}

            {!n.read && (
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full self-start bg-green-500" />
            )}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center min-[600px]:items-center"
      style={{ background: 'rgba(18,22,28,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[580px] overflow-hidden bg-white min-[600px]:rounded-[24px] rounded-t-[24px]"
        style={{ maxHeight: '90dvh', boxShadow: '0 8px 40px rgba(18,22,28,0.18)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-[20px] font-bold text-ink">Notificações</h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="grid h-10 w-10 place-items-center rounded-[12px] bg-neutral-100 text-neutral-700 transition-colors hover:bg-neutral-200"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => void markAllRead()}
            className="mx-5 mb-2 text-[14px] font-semibold text-secondary-500 transition-opacity hover:opacity-70"
          >
            Marcar todas como lidas
          </button>
        )}

        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90dvh - 100px)' }}>
          {loading && (
            <p className="px-5 py-8 text-center text-[14px] text-neutral-400">Carregando…</p>
          )}
          {!loading && !notifs.length && (
            <p className="px-5 py-8 text-center text-[14px] text-neutral-400">Nenhuma notificação</p>
          )}
          {renderGroup(recent, 'Hoje')}
          {renderGroup(older, 'Esta semana')}
          <div className="h-4" />
        </div>
      </div>
    </div>
  )
}
