import { supabase } from './supabase'
import type {
  ChatMessage,
  Contact,
  Conversation,
  Group,
  Post,
  Story,
} from './media'

const MARCOS_ID = '11111111-1111-4111-8111-111111111111'

export function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'agora'
  if (mins < 60) return `${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} h`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'ontem'
  if (days < 7) return `${days} d`
  return new Date(iso).toLocaleDateString('pt-BR', { weekday: 'short' })
}

export async function fetchCurrentUserProfile(userId?: string) {
  const id = userId ?? (await supabase.auth.getUser()).data.user?.id ?? MARCOS_ID
  const { data, error } = await supabase.from('users').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  if (!data) return null
  return {
    id: data.id,
    name: data.name,
    handle: data.handle,
    username: data.username ?? data.handle.replace(/^@/, ''),
    avatar: data.avatar_url ?? '',
    bio: data.bio,
    cover: data.cover_url,
  }
}

export async function fetchFeedPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('feed_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(40)

  if (error) throw error

  const posts = data ?? []
  const ids = posts.map((p) => p.id)
  const reactionMap = new Map<string, { emoji: string; count: number }[]>()

  if (ids.length) {
    const { data: reactions } = await supabase
      .from('reactions')
      .select('post_id, emoji')
      .in('post_id', ids)

    const counts = new Map<string, Map<string, number>>()
    for (const r of reactions ?? []) {
      if (!counts.has(r.post_id)) counts.set(r.post_id, new Map())
      const m = counts.get(r.post_id)!
      m.set(r.emoji, (m.get(r.emoji) ?? 0) + 1)
    }
    for (const [postId, emojis] of counts) {
      reactionMap.set(
        postId,
        [...emojis.entries()].map(([emoji, count]) => ({ emoji, count })),
      )
    }
  }

  return posts.map((p) => ({
    author: p.author_handle,
    avatar: p.author_avatar ?? '',
    time: formatRelativeTime(p.created_at),
    text: p.body,
    mention: p.mention_handle ?? undefined,
    tags: p.tags ?? [],
    image: p.image_url ?? '',
    reactions: reactionMap.get(p.id) ?? [],
    likes: p.likes_count,
    comments: p.comments_count,
  }))
}

export async function fetchGroups(): Promise<Group[]> {
  const { data: groups, error } = await supabase
    .from('groups')
    .select('*')
    .is('deleted_at', null)
    .order('name')

  if (error) throw error

  const result: Group[] = []
  for (const g of groups ?? []) {
    const { data: members } = await supabase
      .from('group_members')
      .select('user_id, users(avatar_url)')
      .eq('group_id', g.id)
      .eq('status', 'ACTIVE')
      .limit(3)

    const avatars =
      members?.map((m) => {
        const u = m.users as { avatar_url: string | null } | null
        return u?.avatar_url ?? ''
      }).filter(Boolean) ?? []

    result.push({
      id: g.slug,
      name: g.name,
      cover: g.cover_url ?? '',
      groups: g.subgroup_count,
      members: `${g.member_count.toLocaleString('pt-BR')} membros`,
      members_avatars: avatars,
    })
  }
  return result
}

export async function fetchStories(viewerId?: string): Promise<Story[]> {
  const sessionUser = (await supabase.auth.getUser()).data.user?.id
  const viewer = viewerId ?? sessionUser ?? MARCOS_ID

  if (sessionUser) {
    try {
      await supabase.rpc('expire_stories')
    } catch {
      /* optional */
    }
  }

  const { data: stories, error } = await supabase
    .from('stories')
    .select('id, author_id, created_at, users(name, handle, username, avatar_url), media(url)')
    .eq('status', 'ACTIVE')
    .is('deleted_at', null)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })

  if (error) throw error

  const seen = new Set<string>()
  if (sessionUser) {
    const { data: views } = await supabase
      .from('story_views')
      .select('story_id')
      .eq('viewer_id', viewer)
    for (const v of views ?? []) seen.add(v.story_id)
  }

  const mapped: Story[] = (stories ?? []).map((s) => {
    const author = s.users as {
      name: string
      handle: string
      username: string | null
      avatar_url: string | null
    } | null
    const media = s.media as { url: string }[] | null
    const isMe = s.author_id === viewer
    return {
      name: isMe ? 'Você' : author?.username ?? author?.handle?.replace(/^@/, '') ?? 'user',
      avatar: author?.avatar_url ?? '',
      cover: media?.[0]?.url ?? '',
      seen: seen.has(s.id),
    }
  })

  mapped.sort((a, b) => {
    if (a.name === 'Você') return -1
    if (b.name === 'Você') return 1
    return 0
  })

  return mapped
}

export async function fetchContacts(): Promise<Contact[]> {
  const me = (await supabase.auth.getUser()).data.user?.id ?? MARCOS_ID
  const { data, error } = await supabase
    .from('users')
    .select('id, name, handle, username, avatar_url')
    .neq('id', me)
    .order('name')

  if (error) throw error

  const interestCounts = new Map<string, number>()
  const { data: interests } = await supabase.from('user_interests').select('user_id')
  for (const row of interests ?? []) {
    interestCounts.set(row.user_id, (interestCounts.get(row.user_id) ?? 0) + 1)
  }

  return (data ?? []).map((u) => ({
    id: u.username ?? u.handle.replace(/^@/, ''),
    name: u.name,
    handle: u.handle,
    avatar: u.avatar_url ?? '',
    online: false,
    interests: interestCounts.get(u.id) ?? 0,
  }))
}

export async function fetchConversations(userId?: string): Promise<Conversation[]> {
  const me = userId ?? (await supabase.auth.getUser()).data.user?.id ?? MARCOS_ID

  const { data: parts, error } = await supabase
    .from('conversation_participants')
    .select('conversation_id, last_read_at, conversations(id, updated_at)')
    .eq('user_id', me)
    .is('left_at', null)

  if (error) throw error

  const result: Conversation[] = []

  for (const part of parts ?? []) {
    const convId = part.conversation_id
    const { data: others } = await supabase
      .from('conversation_participants')
      .select('user_id, users(username, handle)')
      .eq('conversation_id', convId)
      .neq('user_id', me)
      .limit(1)

    const other = others?.[0]?.users as { username: string | null; handle: string } | null
    const contactId = other?.username ?? other?.handle?.replace(/^@/, '') ?? 'unknown'

    const { data: lastMsg } = await supabase
      .from('messages')
      .select('body, sent_at, sender_id')
      .eq('conversation_id', convId)
      .is('deleted_at', null)
      .order('sent_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!lastMsg) continue

    const { count } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('conversation_id', convId)
      .neq('sender_id', me)
      .gt('sent_at', part.last_read_at ?? '1970-01-01')

    result.push({
      contactId,
      lastMessage: lastMsg.body,
      time: formatRelativeTime(lastMsg.sent_at),
      unread: count && count > 0 ? count : undefined,
      fromMe: lastMsg.sender_id === me,
    })
  }

  return result
}

export async function fetchChatMessages(contactUsername: string): Promise<ChatMessage[]> {
  const me = (await supabase.auth.getUser()).data.user?.id ?? MARCOS_ID

  const { data: other } = await supabase
    .from('users')
    .select('id')
    .eq('username', contactUsername)
    .maybeSingle()

  if (!other) return []

  const { data: myParts } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('user_id', me)

  const myConvIds = (myParts ?? []).map((p) => p.conversation_id)
  if (!myConvIds.length) return []

  const { data: shared } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('user_id', other.id)
    .in('conversation_id', myConvIds)
    .limit(1)

  const convId = shared?.[0]?.conversation_id
  if (!convId) return []

  const { data: messages, error } = await supabase
    .from('messages')
    .select('id, body, sent_at, sender_id')
    .eq('conversation_id', convId)
    .is('deleted_at', null)
    .order('sent_at', { ascending: true })

  if (error) throw error

  return (messages ?? []).map((m) => ({
    id: m.id,
    text: m.body,
    time: formatRelativeTime(m.sent_at),
    fromMe: m.sender_id === me,
  }))
}

export type AppNotification = {
  id: string
  type: 'like' | 'follow' | 'mention' | 'group_approved' | 'comment' | 'group_invite'
  name: string
  avatar: string
  text: string
  time: string
  read: boolean
  cta?: { label: string; action: string }
}

const notifTypeMap: Record<string, AppNotification['type']> = {
  LIKE: 'like',
  FOLLOW: 'follow',
  MENTION: 'mention',
  COMMENT: 'comment',
  GROUP_ACCEPTED: 'group_approved',
  GROUP_INVITE: 'group_invite',
}

export async function fetchNotifications(): Promise<AppNotification[]> {
  const me = (await supabase.auth.getUser()).data.user?.id
  if (!me) return []

  const { data, error } = await supabase
    .from('notifications')
    .select('id, type, body, is_read, created_at, actor_id')
    .eq('recipient_id', me)
    .order('created_at', { ascending: false })
    .limit(30)

  if (error) throw error

  const actorIds = [...new Set((data ?? []).map((n) => n.actor_id).filter(Boolean))] as string[]
  const actors = new Map<string, { name: string; avatar_url: string | null }>()
  if (actorIds.length) {
    const { data: users } = await supabase
      .from('users')
      .select('id, name, avatar_url')
      .in('id', actorIds)
    for (const u of users ?? []) actors.set(u.id, { name: u.name, avatar_url: u.avatar_url })
  }

  return (data ?? []).map((n) => {
    const actor = n.actor_id ? actors.get(n.actor_id) : null
    const type = notifTypeMap[n.type] ?? 'like'
    const cta =
      type === 'follow'
        ? { label: 'Seguir de volta', action: 'follow' }
        : type === 'group_approved'
          ? { label: 'Ver grupo', action: 'group' }
          : type === 'group_invite'
            ? { label: 'Aceitar', action: 'accept' }
            : undefined

    return {
      id: n.id,
      type,
      name: actor?.name ?? 'Alguém',
      avatar: actor?.avatar_url ?? '',
      text: n.body ?? '',
      time: formatRelativeTime(n.created_at),
      read: n.is_read,
      cta,
    }
  })
}

export async function fetchUserByUsername(username: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function fetchGroupBySlug(slug: string) {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw error
  return data
}
