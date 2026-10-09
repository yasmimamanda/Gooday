import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { MediaImg } from '../components/ui'

export const profileData: Record<string, {
  id: string
  name: string
  handle: string
  avatar: string
  cover: string
  location: string
  bio: string
  interests: string[]
  followers: number
  following: number
  posts: string[]
}> = {
  bruna: {
    id: 'bruna',
    name: 'Bruna Carla',
    handle: '@bruna_carla',
    avatar: '/assets/eec11.png',
    cover: '/assets/40f99.png',
    location: 'Curitiba, PR',
    bio: 'Receitas naturais e sucos coloridos. Menos industrializado, mais sabor.',
    interests: ['Nutrição', 'Sucos', 'Vida natural'],
    followers: 2840,
    following: 412,
    posts: ['/assets/40f99.png', '/assets/48d71.png', '/assets/074f9.png'],
  },
  renata: {
    id: 'renata',
    name: 'Renata Silva',
    handle: '@renata_silva',
    avatar: '/assets/0b179.png',
    cover: '/assets/48d71.png',
    location: 'Rio de Janeiro, RJ',
    bio: 'Ciclista urbana e entusiasta de vida saudável. Pedalo todo dia! 🚴‍♀️',
    interests: ['Ciclismo', 'Nutrição', 'Pilates', 'Hiking', 'Culinária saudável'],
    followers: 3620,
    following: 511,
    posts: ['/assets/48d71.png', '/assets/40f99.png', '/assets/074f9.png', '/assets/8aa91.png', '/assets/89f86.png', '/assets/f71df.png'],
  },
  lucas: {
    id: 'lucas',
    name: 'Lucas Marte',
    handle: '@lucas_marte',
    avatar: '/assets/1023c.png',
    cover: '/assets/074f9.png',
    location: 'Belo Horizonte, MG',
    bio: 'Treino funcional e vida ao ar livre. Personal trainer. 💪',
    interests: ['Treino Funcional', 'Crossfit'],
    followers: 890,
    following: 230,
    posts: ['/assets/074f9.png', '/assets/40f99.png', '/assets/48d71.png', '/assets/8aa91.png', '/assets/89f86.png', '/assets/f71df.png'],
  },
  nicole: {
    id: 'nicole',
    name: 'Nicole Bueno',
    handle: '@nicole_bueno',
    avatar: '/assets/7c77a.png',
    cover: '/assets/8aa91.png',
    location: 'Curitiba, PR',
    bio: 'Nutricionista clínica. Alimentação natural e funcional. 🥦',
    interests: ['Nutrição', 'Alimentação Saudável', 'Yoga', 'Corrida'],
    followers: 5400,
    following: 186,
    posts: ['/assets/8aa91.png', '/assets/40f99.png', '/assets/48d71.png', '/assets/074f9.png', '/assets/89f86.png', '/assets/f71df.png'],
  },
  bruno: {
    id: 'bruno',
    name: 'Bruno Mendes',
    handle: '@bruno_mendes',
    avatar: '/assets/2f96e.png',
    cover: '/assets/89f86.png',
    location: 'Porto Alegre, RS',
    bio: 'Aventureiro. Trilhas, camping e muito treino ao ar livre. 🏔️',
    interests: ['Hiking', 'Camping', 'Corrida'],
    followers: 742,
    following: 315,
    posts: ['/assets/89f86.png', '/assets/40f99.png', '/assets/48d71.png', '/assets/074f9.png', '/assets/8aa91.png', '/assets/f71df.png'],
  },
  lidiane: {
    id: 'lidiane',
    name: 'Lidiane Costa',
    handle: '@lidiane_costa',
    avatar: '/assets/988ee.png',
    cover: '/assets/f71df.png',
    location: 'Salvador, BA',
    bio: 'Professora de dança e instrutora de zumba. Movimento é vida! 💃',
    interests: ['Dança', 'Zumba', 'Pilates', 'Nutrição', 'Meditação', 'Yoga'],
    followers: 9200,
    following: 622,
    posts: ['/assets/f71df.png', '/assets/40f99.png', '/assets/48d71.png', '/assets/074f9.png', '/assets/8aa91.png', '/assets/89f86.png'],
  },
  tiago: {
    id: 'tiago',
    name: 'Tiago Souza',
    handle: '@tiago_souza',
    avatar: '/assets/4b35d.png',
    cover: '/assets/40f99.png',
    location: 'Recife, PE',
    bio: 'Maratonista amador. 42km são poucos! 🏃‍♂️',
    interests: ['Corrida', 'Triathlon'],
    followers: 1560,
    following: 420,
    posts: ['/assets/40f99.png', '/assets/48d71.png', '/assets/074f9.png', '/assets/8aa91.png', '/assets/89f86.png', '/assets/f71df.png'],
  },
  julia: {
    id: 'julia',
    name: 'Júlia Andrade',
    handle: '@julia_andrade',
    avatar: '/assets/a35b8.png',
    cover: '/assets/48d71.png',
    location: 'Florianópolis, SC',
    bio: 'Surfista e instrutora de stand-up paddle. Vida no mar! 🌊',
    interests: ['Surf', 'SUP', 'Yoga', 'Alimentação Saudável'],
    followers: 4100,
    following: 290,
    posts: ['/assets/48d71.png', '/assets/40f99.png', '/assets/074f9.png', '/assets/8aa91.png', '/assets/89f86.png', '/assets/f71df.png'],
  },
  pedro: {
    id: 'pedro',
    name: 'Pedro Run',
    handle: '@pedro.run',
    avatar: '/assets/4b35d.png',
    cover: '/assets/40f99.png',
    location: 'São Paulo, SP',
    bio: 'Corredor. 10K, 21K e o que vier. Respeite sua mente e trate seu corpo bem.',
    interests: ['Corrida', '10K', 'Vida saudável'],
    followers: 2180,
    following: 340,
    posts: ['/assets/40f99.png', '/assets/48d71.png', '/assets/074f9.png'],
  },
}

export function personIdFromAuthor(author?: string | null): string | null {
  if (!author) return null
  const raw = author.replace(/^@/, '').toLowerCase()
  const compact = raw.replace(/[._\s-]/g, '')
  for (const [id, p] of Object.entries(profileData)) {
    const handle = p.handle.replace(/^@/, '').toLowerCase()
    if (id === raw || handle === raw) return id
    if (id.replace(/[._\s-]/g, '') === compact || handle.replace(/[._\s-]/g, '') === compact) return id
  }
  return null
}

export default function Profile({
  personId,
  onBack,
  onMessage,
}: {
  personId: string
  onBack: () => void
  onMessage: (personId: string) => void
}) {
  const profile = profileData[personId] ?? profileData['renata']
  const [following, setFollowing] = useState(false)
  const [followerCount, setFollowerCount] = useState(profile.followers)

  const handleFollow = () => {
    setFollowing((f) => {
      setFollowerCount((c) => (f ? c - 1 : c + 1))
      return !f
    })
  }

  return (
    <div className="fixed inset-0 z-60 flex flex-col bg-canvas overflow-y-auto">
      {/* Top nav bar */}
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-surface px-4 py-3 border-b border-neutral-200">
        <button
          onClick={onBack}
          aria-label="Voltar"
          className="grid h-9 w-9 place-items-center rounded-full text-ink transition-colors hover:bg-neutral-100"
        >
          <ChevronLeft size={22} />
        </button>
        <span className="text-[17px] font-semibold text-ink">Perfil</span>
      </header>

      {/* Scrollable content */}
      <div className="mx-auto w-full max-w-[700px] px-4 pt-5 pb-10">
        {/* Cover — rounded, padded */}
        <div className="h-[160px] w-full overflow-hidden rounded-[18px]">
          <MediaImg src={profile.cover} alt="" className="h-full w-full object-cover" />
        </div>

        {/* Avatar overlapping cover */}
        <div className="-mt-10 ml-4 mb-4">
          <div className="h-[88px] w-[88px] overflow-hidden rounded-full ring-[3px] ring-canvas">
            <MediaImg src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
          </div>
        </div>

        {/* Name, handle, location */}
        <h1 className="text-[22px] font-bold text-ink leading-tight">{profile.name}</h1>
        <p className="mt-0.5 text-[14px] text-neutral-500">
          {profile.handle}{profile.location ? ` · ${profile.location}` : ''}
        </p>

        {/* Bio */}
        {profile.bio && (
          <p className="mt-3 text-[14px] leading-relaxed text-neutral-700">{profile.bio}</p>
        )}

        {/* Interest chips — lime per reference */}
        {profile.interests.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <span
                key={interest}
                className="rounded-full bg-secondary-500 px-3.5 py-1 text-[13px] font-medium text-white"
              >
                {interest}
              </span>
            ))}
          </div>
        )}

        {/* Stats — plain, no card */}
        <div className="mt-5 flex gap-8">
          {[
            { label: 'seguidores', value: followerCount.toLocaleString('pt-BR') },
            { label: 'seguindo', value: profile.following.toLocaleString('pt-BR') },
            { label: 'publicações', value: profile.posts.length.toString() },
          ].map(({ label, value }) => (
            <button key={label} className="flex flex-col items-start gap-0.5 transition-opacity hover:opacity-70">
              <span className="text-[20px] font-bold text-ink leading-none">{value}</span>
              <span className="text-[12px] text-neutral-500">{label}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={handleFollow}
            className={`flex-1 rounded-[14px] py-3.5 text-[15px] font-semibold transition-colors ${
              following
                ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                : 'bg-secondary-500 text-white hover:bg-secondary-600'
            }`}
          >
            {following ? 'Seguindo' : 'Seguir'}
          </button>
          <button
            onClick={() => onMessage(profile.id)}
            className="flex-1 rounded-[14px] bg-neutral-100 py-3.5 text-[15px] font-semibold text-neutral-700 transition-colors hover:bg-neutral-200"
          >
            Mensagem
          </button>
        </div>

        {/* Posts grid */}
        <div className="mt-7">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.8px] text-neutral-500">
            Publicações
          </p>
          {profile.posts.length === 0 ? (
            <p className="py-8 text-center text-[14px] text-neutral-500">Nada publicado…</p>
          ) : (
            <div className="grid grid-cols-3 gap-1 overflow-hidden rounded-[14px]">
              {profile.posts.map((src, i) => (
                <div key={i} className="aspect-square overflow-hidden">
                  <MediaImg src={src} alt="" className="h-full w-full object-cover transition-transform hover:scale-105" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
