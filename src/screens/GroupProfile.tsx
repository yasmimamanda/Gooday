import { useEffect, useState } from 'react'
import { ChevronLeft, Users, Lock, Globe, Heart, MessageSquare, Share2, MoreHorizontal } from 'lucide-react'
import { fetchGroupBySlug } from '../lib/api'

const groupData: Record<string, {
  id: string
  name: string
  cover: string
  privacy: string
  subgroups: number
  members: number
  postsCount: number
  description: string
  category: string
  memberAvatars: string[]
  posts: { id: string; avatar: string; name: string; handle: string; time: string; text: string; image?: string; likes: number; comments: number }[]
}> = {
  corrida: {
    id: 'corrida',
    name: 'Corrida para Iniciantes',
    cover: '/assets/40f99.png',
    privacy: 'Público',
    subgroups: 18,
    members: 512,
    postsCount: 248,
    description: 'Comece a correr no seu ritmo, com apoio e metas realistas. Um grupo acolhedor para quem está começando a incluir a corrida na rotina.',
    category: 'Esportes',
    memberAvatars: ['/assets/eec11.png', '/assets/0b179.png', '/assets/1023c.png', '/assets/7c77a.png'],
    posts: [
      { id: 'p1', avatar: '/assets/2f96e.png', name: 'Rafael Lima', handle: '@rafael_lima', time: '1 d', text: 'Semana 4 do plano: 3 km contínuos! O grupo me puxou pra cá. Nunca pensei que conseguiria correr sem parar 🏃‍♂️', image: '/assets/40f99.png', likes: 34, comments: 8 },
      { id: 'p2', avatar: '/assets/7c77a.png', name: 'Nicole Bueno', handle: '@nicole_bueno', time: '2 d', text: 'Dica de hoje: aqueça por 5 minutos antes de qualquer treino. Seu joelho agradece! 🦵', likes: 52, comments: 14 },
      { id: 'p3', avatar: '/assets/a35b8.png', name: 'Júlia Andrade', handle: '@julia_andrade', time: '3 d', text: 'Completei minha primeira corrida de 5km! Obrigada a todos do grupo 💚', image: '/assets/48d71.png', likes: 89, comments: 22 },
    ],
  },
  ciclismo: {
    id: 'ciclismo', name: 'Ciclismo Urbano', cover: '/assets/48d71.png', privacy: 'Público', subgroups: 22, members: 975, postsCount: 520,
    description: 'Pedal na cidade com segurança, prazer e comunidade. Rotas, dicas e encontros semanais para ciclistas de todos os níveis.',
    category: 'Esportes',
    memberAvatars: ['/assets/0b179.png', '/assets/4b35d.png', '/assets/988ee.png', '/assets/1023c.png'],
    posts: [
      { id: 'p1', avatar: '/assets/0b179.png', name: 'Renata Silva', handle: '@renata_silva', time: '5 h', text: 'Rota nova pela ciclovia da Paulista: 18 km sem parar! 🚴‍♀️', image: '/assets/48d71.png', likes: 61, comments: 19 },
      { id: 'p2', avatar: '/assets/4b35d.png', name: 'Tiago Souza', handle: '@tiago_souza', time: '1 d', text: 'Pedal coletivo amanhã às 7h no Parque Ibirapuera. Quem vem? 🚵', likes: 43, comments: 31 },
    ],
  },
  nutricao: {
    id: 'nutricao', name: 'Nutrição Consciente', cover: '/assets/074f9.png', privacy: 'Público', subgroups: 9, members: 396, postsCount: 183,
    description: 'Compartilhe receitas, tire dúvidas e construa hábitos alimentares mais saudáveis com apoio da comunidade.',
    category: 'Saúde',
    memberAvatars: ['/assets/7c77a.png', '/assets/eec11.png', '/assets/988ee.png'],
    posts: [{ id: 'p1', avatar: '/assets/7c77a.png', name: 'Nicole Bueno', handle: '@nicole_bueno', time: '3 h', text: 'Smoothie verde de hoje: couve, maçã, gengibre e limão. Energia pura! 🌿', image: '/assets/074f9.png', likes: 74, comments: 26 }],
  },
  vida: {
    id: 'vida', name: 'Vida Natural', cover: '/assets/8aa91.png', privacy: 'Privado', subgroups: 6, members: 304, postsCount: 97,
    description: 'Um espaço para quem quer viver com mais naturalidade, equilíbrio e consciência no dia a dia.',
    category: 'Bem-estar',
    memberAvatars: ['/assets/988ee.png', '/assets/a35b8.png', '/assets/eec11.png'],
    posts: [{ id: 'p1', avatar: '/assets/988ee.png', name: 'Lidiane Costa', handle: '@lidiane_costa', time: '6 h', text: 'Meditação matinal de 10 min. mudou completamente minha manhã ✨', image: '/assets/8aa91.png', likes: 48, comments: 12 }],
  },
  treino: {
    id: 'treino', name: 'Treino Funcional', cover: '/assets/89f86.png', privacy: 'Privado', subgroups: 12, members: 428, postsCount: 312,
    description: 'Treinos funcionais para todos os níveis. Sem academia, sem desculpa.',
    category: 'Fitness',
    memberAvatars: ['/assets/1023c.png', '/assets/2f96e.png', '/assets/4b35d.png'],
    posts: [{ id: 'p1', avatar: '/assets/1023c.png', name: 'Lucas Marte', handle: '@lucas_marte', time: '2 h', text: 'Treino de hoje: 4 séries de burpees, agachamento e flexão. Quem aguentou? 💪', image: '/assets/89f86.png', likes: 57, comments: 18 }],
  },
  alimentacao: {
    id: 'alimentacao', name: 'Alimentação Saudável', cover: '/assets/f71df.png', privacy: 'Privado', subgroups: 5, members: 267, postsCount: 144,
    description: 'Dicas práticas para comer melhor no dia a dia, sem abrir mão do sabor.',
    category: 'Saúde',
    memberAvatars: ['/assets/eec11.png', '/assets/7c77a.png', '/assets/0b179.png'],
    posts: [{ id: 'p1', avatar: '/assets/eec11.png', name: 'Bruna Carla', handle: '@bruna_carla', time: '1 d', text: 'Bowl de frutas com granola caseira. Fácil, bonito e gostoso! 🍓', image: '/assets/f71df.png', likes: 39, comments: 9 }],
  },
  yoga: {
    id: 'yoga', name: 'Yoga & Respiração', cover: '/assets/40f99.png', privacy: 'Público', subgroups: 7, members: 221, postsCount: 88,
    description: 'Conecte mente e corpo com práticas diárias de yoga e técnicas de respiração consciente.',
    category: 'Bem-estar',
    memberAvatars: ['/assets/a35b8.png', '/assets/0b179.png', '/assets/988ee.png'],
    posts: [{ id: 'p1', avatar: '/assets/a35b8.png', name: 'Júlia Andrade', handle: '@julia_andrade', time: '4 h', text: 'Sequência de hoje: 20 min de vinyasa + 5 min de pranayama. Dia muito mais leve! 🧘‍♀️', image: '/assets/40f99.png', likes: 31, comments: 7 }],
  },
  pedal: {
    id: 'pedal', name: 'Pedal de Fim de Semana', cover: '/assets/48d71.png', privacy: 'Público', subgroups: 10, members: 640, postsCount: 410,
    description: 'Encontros semanais para pedalar em grupo pela cidade. Todos os níveis são bem-vindos.',
    category: 'Esportes',
    memberAvatars: ['/assets/4b35d.png', '/assets/1023c.png', '/assets/2f96e.png'],
    posts: [{ id: 'p1', avatar: '/assets/4b35d.png', name: 'Tiago Souza', handle: '@tiago_souza', time: '8 h', text: 'Resumo do pedal de ontem: 32 km, 8 participantes e muita risada 🚵‍♀️', image: '/assets/48d71.png', likes: 68, comments: 24 }],
  },
  hiking: {
    id: 'hiking', name: 'Hiking & Trilhas', cover: '/assets/074f9.png', privacy: 'Privado', subgroups: 4, members: 183, postsCount: 76,
    description: 'Aventuras em trilhas e contato com a natureza. Para quem ama caminhar e explorar.',
    category: 'Natureza',
    memberAvatars: ['/assets/2f96e.png', '/assets/a35b8.png'],
    posts: [{ id: 'p1', avatar: '/assets/2f96e.png', name: 'Bruno Mendes', handle: '@bruno_mendes', time: '1 d', text: 'Trilha do Pico do Jaraguá neste sábado às 6h30. Vagas limitadas! 🏔️', image: '/assets/074f9.png', likes: 29, comments: 16 }],
  },
}

export default function GroupProfile({
  groupId,
  onBack,
}: {
  groupId: string
  onBack: () => void
}) {
  const fallback = groupData[groupId] ?? groupData['corrida']
  const [group, setGroup] = useState(fallback)
  const [joined, setJoined] = useState(false)
  const [likes, setLikes] = useState<Set<string>>(new Set())

  useEffect(() => {
    let cancelled = false
    setGroup(groupData[groupId] ?? groupData['corrida'])
    ;(async () => {
      try {
        const row = await fetchGroupBySlug(groupId)
        if (cancelled || !row) return
        setGroup((prev) => ({
          ...prev,
          id: row.slug,
          name: row.name,
          cover: row.cover_url || prev.cover,
          privacy: row.privacy === 'PRIVATE' ? 'Privado' : 'Público',
          subgroups: row.subgroup_count,
          members: row.member_count,
          description: row.description || prev.description,
        }))
      } catch (err) {
        console.warn('[Gooday] group profile', err)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [groupId])

  const toggleLike = (id: string) =>
    setLikes((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const joinLabel = group.privacy === 'Privado' ? 'Solicitar entrada' : 'Participar'
  const joinedLabel = group.privacy === 'Privado' ? 'Solicitado' : 'Participando'

  return (
    <div className="fixed inset-0 z-60 flex flex-col bg-canvas overflow-y-auto">

      {/* Header — idêntico ao Perfil */}
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-surface px-4 py-3 border-b border-neutral-200">
        <button
          onClick={onBack}
          aria-label="Voltar"
          className="grid h-9 w-9 place-items-center rounded-full text-ink transition-colors hover:bg-neutral-100"
        >
          <ChevronLeft size={22} />
        </button>
        <span className="flex-1 text-[17px] font-semibold text-ink">Grupo</span>
        <button aria-label="Compartilhar" className="grid h-9 w-9 place-items-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100">
          <Share2 size={18} />
        </button>
        <button aria-label="Mais opções" className="grid h-9 w-9 place-items-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100">
          <MoreHorizontal size={18} />
        </button>
      </header>

      {/* Conteúdo — mesma estrutura do Perfil */}
      <div className="mx-auto w-full max-w-[700px] px-4 pt-5 pb-10">

        {/* Cover arredondada — igual ao Perfil */}
        <div className="h-[160px] w-full overflow-hidden rounded-[18px]">
          <img src={group.cover} alt="" className="h-full w-full object-cover" />
        </div>

        {/* Nome + meta — igual à estrutura nome/handle do Perfil */}
        <h1 className="mt-4 text-[22px] font-bold text-ink leading-tight">{group.name}</h1>
        <p className="mt-0.5 flex items-center gap-1.5 text-[14px] text-neutral-500">
          {group.privacy === 'Privado'
            ? <Lock size={13} className="shrink-0" />
            : <Globe size={13} className="shrink-0" />
          }
          {group.privacy} · {group.subgroups} subgrupos · {group.members.toLocaleString('pt-BR')} membros
        </p>

        {/* Descrição — igual à bio do Perfil */}
        <p className="mt-3 text-[14px] leading-relaxed text-neutral-700">{group.description}</p>

        {/* Chips de categoria — lime, igual aos chips de interesses do Perfil */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-neutral-100 px-3.5 py-1 text-[13px] font-medium text-neutral-700">
            {group.category}
          </span>
        </div>

        {/* Stats — idêntico ao Perfil (seguidores / seguindo / publicações) */}
        <div className="mt-5 flex gap-8">
          {[
            { label: 'membros', value: group.members.toLocaleString('pt-BR') },
            { label: 'subgrupos', value: group.subgroups.toString() },
            { label: 'publicações', value: group.postsCount.toLocaleString('pt-BR') },
          ].map(({ label, value }) => (
            <button key={label} className="flex flex-col items-start gap-0.5 transition-opacity hover:opacity-70">
              <span className="text-[20px] font-bold text-ink leading-none">{value}</span>
              <span className="text-[12px] text-neutral-500">{label}</span>
            </button>
          ))}
        </div>

        {/* Avatars empilhados + Ver membros */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center">
            {group.memberAvatars.slice(0, 4).map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="h-8 w-8 rounded-full object-cover ring-2 ring-canvas"
                style={{ marginLeft: i === 0 ? 0 : -10, zIndex: group.memberAvatars.length - i }}
              />
            ))}
          </div>
          <button className="flex items-center gap-1.5 text-[13px] font-semibold text-secondary-500 transition-colors hover:text-secondary-600">
            <Users size={13} />
            Ver todos os membros
          </button>
        </div>

        {/* Botões de ação — mesma estrutura do Perfil */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={() => setJoined((v) => !v)}
            className={`flex-1 rounded-[14px] py-3.5 text-[15px] font-semibold transition-colors ${
              joined
                ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                : 'bg-secondary-500 text-white hover:bg-secondary-600'
            }`}
          >
            {joined ? joinedLabel : joinLabel}
          </button>
          <button className="flex-1 rounded-[14px] bg-neutral-100 py-3.5 text-[15px] font-semibold text-neutral-700 transition-colors hover:bg-neutral-200">
            Compartilhar
          </button>
        </div>

        {/* Feed do Grupo */}
        <div className="mt-7">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.8px] text-neutral-500">
            Feed do Grupo
          </p>
          <div className="space-y-3">
            {group.posts.map((post) => (
              <div key={post.id} className="overflow-hidden rounded-[18px] bg-surface border border-neutral-200">
                {/* Header do post */}
                <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
                    <img src={post.avatar} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold text-ink leading-none">{post.name}</p>
                    <p className="mt-0.5 text-[12px] text-neutral-500">{post.handle} · {post.time}</p>
                  </div>
                  <button className="text-neutral-400 transition-colors hover:text-ink">
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                {/* Texto */}
                <p className="px-4 pb-3 text-[14px] leading-relaxed text-neutral-700">{post.text}</p>

                {/* Imagem */}
                {post.image && (
                  <div className="mx-4 mb-3 overflow-hidden rounded-[12px] aspect-[4/3]">
                    <img src={post.image} alt="" className="h-full w-full object-cover" />
                  </div>
                )}

                {/* Ações */}
                <div className="flex items-center gap-5 border-t border-neutral-200 px-4 py-2.5">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 text-[13px] font-medium transition-colors ${
                      likes.has(post.id) ? 'text-accent-500' : 'text-neutral-500 hover:text-accent-500'
                    }`}
                  >
                    <Heart size={16} fill={likes.has(post.id) ? 'currentColor' : 'none'} />
                    {likes.has(post.id) ? post.likes + 1 : post.likes}
                  </button>
                  <button className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-500 transition-colors hover:text-ink">
                    <MessageSquare size={16} />
                    {post.comments}
                  </button>
                  <button className="ml-auto text-neutral-400 transition-colors hover:text-ink">
                    <Share2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
