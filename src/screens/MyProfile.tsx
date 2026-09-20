import { useState } from 'react'
import { ChevronLeft, Settings, Grid3x3, Heart, MessageSquare, Camera, Edit3 } from 'lucide-react'
import { currentUser as mockUser } from '../lib/media'
import { useAuth } from '../lib/auth'

type Tab = 'posts' | 'curtidas'

export default function MyProfile({
  onBack,
  onSettings,
}: {
  onBack: () => void
  onSettings: () => void
}) {
  const { profile } = useAuth()
  const myData = {
    name: profile?.name ?? 'Marcos Vinícius',
    handle: profile?.handle ?? '@marcos_v',
    avatar: profile?.avatar || mockUser.avatar,
    cover: profile?.cover || 'https://images.unsplash.com/photo-1530143311094-34d807799e8f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=900&h=400',
    location: 'São Paulo, SP',
    bio: profile?.bio || 'Corredor amador e entusiasta de vida saudável. Acredito que movimento é remédio. 🏃‍♂️',
    interests: ['Corrida', 'Nutrição', 'Hiking', 'Ciclismo'],
    followers: 1240,
    following: 318,
    posts: [
      'https://images.unsplash.com/photo-1498581444814-7e44d2fbe0e2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=400',
      'https://images.unsplash.com/photo-1530143311094-34d807799e8f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=400',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=400',
      'https://images.unsplash.com/photo-1606224547099-b15c94ca5ef2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=400',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=400',
      'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=400',
    ],
  }

  const [tab, setTab] = useState<Tab>('posts')
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState(myData.bio)
  const [draftBio, setDraftBio] = useState(bio)

  return (
    <div className="fixed inset-0 z-60 flex flex-col bg-canvas overflow-y-auto">

      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-surface px-4 py-3 border-b border-neutral-200">
        <button
          onClick={onBack}
          aria-label="Voltar"
          className="grid h-9 w-9 place-items-center rounded-full text-ink transition-colors hover:bg-neutral-100"
        >
          <ChevronLeft size={22} />
        </button>
        <span className="flex-1 text-[17px] font-semibold text-ink">Meu Perfil</span>
        <button
          onClick={onSettings}
          aria-label="Configurações"
          className="grid h-9 w-9 place-items-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100"
        >
          <Settings size={20} />
        </button>
      </header>

      <div className="mx-auto w-full max-w-[700px] px-4 pt-5 pb-10">

        {/* Cover */}
        <div className="relative h-[160px] w-full overflow-hidden rounded-[18px]">
          <img src={myData.cover} alt="" className="h-full w-full object-cover" />
          <button
            aria-label="Alterar capa"
            className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/70"
          >
            <Camera size={13} />
            Alterar capa
          </button>
        </div>

        {/* Avatar overlapping cover */}
        <div className="-mt-10 ml-4 mb-4 flex items-end justify-between">
          <div className="relative">
            <div className="h-[88px] w-[88px] overflow-hidden rounded-full ring-[3px] ring-canvas">
              <img src={myData.avatar} alt={myData.name} className="h-full w-full object-cover" />
            </div>
            <button
              aria-label="Alterar foto"
              className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-secondary-500 text-white ring-2 ring-canvas transition-colors hover:bg-secondary-600"
            >
              <Camera size={13} />
            </button>
          </div>
        </div>

        {/* Name + handle + location */}
        <h1 className="text-[22px] font-bold text-ink leading-tight">{myData.name}</h1>
        <p className="mt-0.5 text-[14px] text-neutral-500">
          {myData.handle}{myData.location ? ` · ${myData.location}` : ''}
        </p>

        {/* Bio — editable */}
        {editing ? (
          <div className="mt-3">
            <textarea
              value={draftBio}
              onChange={(e) => setDraftBio(e.target.value)}
              rows={3}
              className="w-full rounded-[12px] border border-neutral-200 bg-surface px-3.5 py-2.5 text-[14px] leading-relaxed text-ink outline-none focus:border-secondary-500 resize-none"
              autoFocus
            />
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => { setBio(draftBio); setEditing(false) }}
                className="rounded-full bg-secondary-500 px-4 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-secondary-600"
              >
                Salvar
              </button>
              <button
                onClick={() => { setDraftBio(bio); setEditing(false) }}
                className="rounded-full bg-neutral-100 px-4 py-1.5 text-[13px] font-semibold text-neutral-700 transition-colors hover:bg-neutral-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <p
            className="mt-3 cursor-text text-[14px] leading-relaxed text-neutral-700"
            onClick={() => { setDraftBio(bio); setEditing(true) }}
          >
            {bio}
          </p>
        )}

        {/* Interest chips */}
        <div className="mt-3 flex flex-wrap gap-2">
          {myData.interests.map((interest) => (
            <span
              key={interest}
              className="rounded-full bg-neutral-100 px-3.5 py-1 text-[13px] font-medium text-neutral-700"
            >
              {interest}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-5 flex gap-8">
          {[
            { label: 'seguidores', value: myData.followers.toLocaleString('pt-BR') },
            { label: 'seguindo', value: myData.following.toLocaleString('pt-BR') },
            { label: 'publicações', value: myData.posts.length.toString() },
          ].map(({ label, value }) => (
            <button key={label} className="flex flex-col items-start gap-0.5 transition-opacity hover:opacity-70">
              <span className="text-[20px] font-bold text-ink leading-none">{value}</span>
              <span className="text-[12px] text-neutral-500">{label}</span>
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={() => { setDraftBio(bio); setEditing(true) }}
            className="flex flex-1 items-center justify-center gap-2 rounded-[14px] bg-secondary-500 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-secondary-600"
          >
            <Edit3 size={16} />
            Editar perfil
          </button>
          <button
            onClick={onSettings}
            className="flex flex-1 items-center justify-center gap-2 rounded-[14px] bg-neutral-100 py-3.5 text-[15px] font-semibold text-neutral-700 transition-colors hover:bg-neutral-200"
          >
            <Settings size={16} />
            Configurações
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-7 flex border-b border-neutral-200">
          {([
            { key: 'posts', label: 'Publicações', icon: Grid3x3 },
            { key: 'curtidas', label: 'Curtidas', icon: Heart },
          ] as { key: Tab; label: string; icon: typeof Grid3x3 }[]).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex flex-1 items-center justify-center gap-2 pb-3 text-[14px] font-semibold transition-colors ${
                tab === key
                  ? 'border-b-2 border-secondary-500 text-secondary-500'
                  : 'text-neutral-400 hover:text-ink'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Posts grid */}
        {tab === 'posts' && (
          myData.posts.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-neutral-100">
                <Grid3x3 size={24} className="text-neutral-400" />
              </div>
              <p className="text-[15px] font-semibold text-ink">Nada publicado ainda</p>
              <p className="text-[13px] text-neutral-500">Compartilhe seu primeiro momento.</p>
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-3 gap-1 overflow-hidden rounded-[14px]">
              {myData.posts.map((src, i) => (
                <div key={i} className="aspect-square overflow-hidden">
                  <img src={src} alt="" className="h-full w-full object-cover transition-transform hover:scale-105" />
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'curtidas' && (
          <div className="flex flex-col items-center gap-3 py-16">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-neutral-100">
              <Heart size={24} className="text-neutral-400" />
            </div>
            <p className="text-[15px] font-semibold text-ink">Nenhuma curtida ainda</p>
            <p className="text-[13px] text-neutral-500">Os posts que você curtir aparecem aqui.</p>
          </div>
        )}
      </div>
    </div>
  )
}
