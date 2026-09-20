import { useState, useRef } from 'react'
import { ChevronLeft, Search as SearchIcon, X, Share2, Lock, Globe, Users, Plus } from 'lucide-react'

type Status = 'Público' | 'Privado' | 'Participando'

interface GrupoItem {
  id: string
  name: string
  description: string
  cover: string
  members: number
  posts: number
  status: Status
  memberAvatars: string[]
}

const gruposData: GrupoItem[] = [
  {
    id: 'corrida',
    name: 'Corrida para Iniciantes',
    description: 'Comece a correr no seu ritmo, com apoio e metas realistas.',
    cover: '/assets/40f99.png',
    members: 512,
    posts: 248,
    status: 'Participando',
    memberAvatars: ['/assets/eec11.png', '/assets/0b179.png', '/assets/1023c.png'],
  },
  {
    id: 'ciclismo',
    name: 'Ciclismo Urbano',
    description: 'Pedal na cidade com segurança, prazer e comunidade.',
    cover: '/assets/48d71.png',
    members: 975,
    posts: 520,
    status: 'Participando',
    memberAvatars: ['/assets/0b179.png', '/assets/4b35d.png', '/assets/988ee.png'],
  },
  {
    id: 'nutricao',
    name: 'Nutrição Consciente',
    description: 'Compartilhe receitas e construa hábitos alimentares saudáveis.',
    cover: '/assets/074f9.png',
    members: 396,
    posts: 183,
    status: 'Participando',
    memberAvatars: ['/assets/7c77a.png', '/assets/eec11.png', '/assets/988ee.png'],
  },
  {
    id: 'vida',
    name: 'Vida Natural',
    description: 'Um espaço para viver com mais naturalidade e equilíbrio.',
    cover: '/assets/8aa91.png',
    members: 304,
    posts: 97,
    status: 'Público',
    memberAvatars: ['/assets/988ee.png', '/assets/a35b8.png'],
  },
  {
    id: 'treino',
    name: 'Treino Funcional',
    description: 'Treinos funcionais para todos os níveis. Sem academia, sem desculpa.',
    cover: '/assets/89f86.png',
    members: 428,
    posts: 312,
    status: 'Participando',
    memberAvatars: ['/assets/1023c.png', '/assets/2f96e.png', '/assets/4b35d.png'],
  },
  {
    id: 'alimentacao',
    name: 'Alimentação Saudável',
    description: 'Dicas práticas para comer melhor no dia a dia.',
    cover: '/assets/f71df.png',
    members: 267,
    posts: 144,
    status: 'Privado',
    memberAvatars: ['/assets/eec11.png', '/assets/7c77a.png'],
  },
  {
    id: 'yoga',
    name: 'Yoga & Respiração',
    description: 'Conecte mente e corpo com práticas diárias de yoga.',
    cover: '/assets/40f99.png',
    members: 221,
    posts: 88,
    status: 'Público',
    memberAvatars: ['/assets/a35b8.png', '/assets/0b179.png'],
  },
  {
    id: 'pedal',
    name: 'Pedal de Fim de Semana',
    description: 'Encontros semanais para pedalar em grupo pela cidade.',
    cover: '/assets/48d71.png',
    members: 640,
    posts: 410,
    status: 'Participando',
    memberAvatars: ['/assets/4b35d.png', '/assets/1023c.png', '/assets/2f96e.png'],
  },
  {
    id: 'hiking',
    name: 'Hiking & Trilhas',
    description: 'Aventuras em trilhas e contato com a natureza.',
    cover: '/assets/074f9.png',
    members: 183,
    posts: 76,
    status: 'Privado',
    memberAvatars: ['/assets/2f96e.png', '/assets/a35b8.png'],
  },
]

const filters = ['Todos', 'Participando', 'Sugeridos', 'Corrida', 'Ciclismo', 'Nutrição', 'Yoga', 'Treino']

export default function Grupos({
  onBack,
  onOpenGroup,
}: {
  onBack: () => void
  onOpenGroup: (groupId: string) => void
}) {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('Todos')
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = gruposData.filter((g) => {
    const matchesQuery = !query || g.name.toLowerCase().includes(query.toLowerCase()) || g.description.toLowerCase().includes(query.toLowerCase())
    const matchesFilter =
      activeFilter === 'Todos' ||
      (activeFilter === 'Participando' && g.status === 'Participando') ||
      (activeFilter === 'Sugeridos' && g.status !== 'Participando') ||
      g.name.toLowerCase().includes(activeFilter.toLowerCase())
    return matchesQuery && matchesFilter
  })

  return (
    <div className="fixed inset-0 z-60 flex flex-col bg-canvas overflow-y-auto">
      {/* Top nav */}
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-surface px-4 py-3 border-b border-neutral-200">
        <button
          onClick={onBack}
          aria-label="Voltar"
          className="grid h-9 w-9 place-items-center rounded-full text-ink transition-colors hover:bg-neutral-100"
        >
          <ChevronLeft size={22} />
        </button>
        <span className="flex-1 text-[17px] font-semibold text-ink">Meus grupos</span>
        <button
          aria-label="Criar grupo"
          className="grid h-9 w-9 place-items-center rounded-full bg-secondary-500 text-white transition-colors hover:bg-secondary-600"
        >
          <Plus size={18} />
        </button>
      </header>

      <div className="mx-auto w-full max-w-[900px] px-4 pt-5 pb-10">

        {/* Search */}
        <div className="mb-4 flex items-center gap-2.5 rounded-[14px] bg-surface border border-neutral-200 px-4 py-3">
          <SearchIcon size={16} className="shrink-0 text-neutral-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar grupos e comunidades..."
            className="flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-neutral-400"
          />
          {query && (
            <button onClick={() => { setQuery(''); inputRef.current?.focus() }} className="text-neutral-400 hover:text-ink">
              <X size={15} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Filter chips */}
        <div className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                activeFilter === f
                  ? 'bg-secondary-500 text-white'
                  : 'bg-surface text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-neutral-100">
              <Users size={24} className="text-neutral-400" />
            </div>
            <p className="text-[15px] font-semibold text-ink">Nenhum grupo encontrado</p>
            <p className="text-[13px] text-neutral-500">Tente outro filtro ou termo de busca.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 min-[700px]:grid-cols-3">
            {filtered.map((grupo) => (
              <button
                key={grupo.id}
                onClick={() => onOpenGroup(grupo.id)}
                className="group overflow-hidden rounded-[20px] bg-surface border border-neutral-200 text-left transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                {/* Cover */}
                <div className="relative overflow-hidden" style={{ height: 130 }}>
                  <img
                    src={grupo.cover}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Top-right: privacy + share */}
                  <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      aria-label="Compartilhar"
                      className="grid h-7 w-7 place-items-center rounded-full bg-white/90 backdrop-blur text-neutral-700 transition-colors hover:bg-white"
                    >
                      <Share2 size={13} />
                    </button>
                  </div>

                  {/* Privacy badge top-left */}
                  <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 backdrop-blur-sm">
                    {grupo.status === 'Privado'
                      ? <Lock size={10} className="text-white/90" />
                      : <Globe size={10} className="text-white/90" />
                    }
                    <span className="text-[11px] font-medium text-white/90">{grupo.status === 'Privado' ? 'Privado' : 'Público'}</span>
                  </div>

                  {/* Member avatars bottom-left */}
                  <div className="absolute bottom-2.5 left-3 flex items-center">
                    {grupo.memberAvatars.slice(0, 3).map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt=""
                        className="h-6 w-6 rounded-full object-cover ring-[1.5px] ring-white"
                        style={{ marginLeft: i === 0 ? 0 : -6, zIndex: 3 - i }}
                      />
                    ))}
                    {grupo.members > 3 && (
                      <span
                        className="flex h-6 items-center rounded-full bg-black/50 px-1.5 text-[10px] font-semibold text-white backdrop-blur-sm"
                        style={{ marginLeft: -6, zIndex: 0 }}
                      >
                        +{(grupo.members - 3).toLocaleString('pt-BR')}
                      </span>
                    )}
                  </div>

                  {/* Participando badge bottom-right */}
                  {grupo.status === 'Participando' && (
                    <span className="absolute bottom-2.5 right-2.5 rounded-full bg-secondary-500 px-2 py-0.5 text-[11px] font-bold text-white">
                      Participando
                    </span>
                  )}
                </div>

                {/* Card body */}
                <div className="px-3.5 pt-3 pb-3.5">
                  <p className="mb-0.5 text-[14px] font-semibold text-ink leading-snug line-clamp-1">{grupo.name}</p>
                  <p className="mb-2.5 text-[12px] leading-relaxed text-neutral-500 line-clamp-1">{grupo.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-1 text-[12px] text-neutral-500">
                      <Users size={11} className="shrink-0" />
                      {grupo.members.toLocaleString('pt-BR')} membros
                    </p>
                    <span className="text-[12px] text-neutral-400">{grupo.posts} posts</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
