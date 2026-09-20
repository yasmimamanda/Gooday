import { useEffect, useState } from 'react'
import {
  BottomNav,
  ContextRail,
  GroupCard,
  MobileHeader,
  PostCard,
  SidebarNav,
  StoriesRow,
  TopBar,
} from '../components/home'
import Notifications from '../components/Notifications'
import { currentUser as mockUser, groups as mockGroups, posts as mockPosts, stories as mockStories } from '../lib/media'
import type { Group, Post, Story } from '../lib/media'
import { fetchFeedPosts, fetchGroups, fetchStories } from '../lib/api'
import { useAuth } from '../lib/auth'

export default function Home({
  onNavigate,
  activeKey,
  onOpenGroup,
}: {
  onNavigate?: (key: string) => void
  activeKey?: string
  onOpenGroup?: (id: string) => void
}) {
  const [showNotifs, setShowNotifs] = useState(false)
  const { profile } = useAuth()
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [groups, setGroups] = useState<Group[]>(mockGroups)
  const [stories, setStories] = useState<Story[]>(mockStories)

  const user = profile
    ? { name: profile.name, handle: profile.handle, avatar: profile.avatar }
    : mockUser

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [p, g, s] = await Promise.all([
          fetchFeedPosts(),
          fetchGroups(),
          fetchStories(profile?.id),
        ])
        if (cancelled) return
        if (p.length) setPosts(p)
        if (g.length) setGroups(g)
        if (s.length) setStories(s)
      } catch (err) {
        console.warn('[Gooday] Falling back to mock feed data', err)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [profile?.id])

  return (
    <div className="min-h-dvh w-full bg-canvas pb-28 min-[800px]:pb-0">
      <TopBar user={user} onNavigate={onNavigate} onNotifications={() => setShowNotifs(true)} />
      <MobileHeader user={user} onNotifications={() => setShowNotifs(true)} onNavigate={onNavigate} />
      {showNotifs && <Notifications onClose={() => setShowNotifs(false)} />}

      <div className="w-full px-5 min-[1800px]:px-8">
        <section className="py-4">
          <StoriesRow stories={stories} />
        </section>

        <section className="min-[800px]:hidden">
          <h2 className="mb-3 px-0.5 text-[16px] font-semibold text-ink">Grupos para você</h2>
          <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-1">
            {groups.map((g) => (
              <div key={g.id || g.name} className="w-[190px] shrink-0 sm:w-[220px]">
                <GroupCard group={g} onOpenGroup={onOpenGroup} />
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 py-5 min-[800px]:grid-cols-[max-content_minmax(280px,560px)_minmax(240px,1fr)] min-[1200px]:gap-10 min-[1800px]:gap-12">
          <aside className="hidden min-[800px]:block">
            <div className="sticky top-[68px]">
              <SidebarNav activeKey={activeKey} onNavigate={onNavigate} />
            </div>
          </aside>

          <main className="mx-auto w-full max-w-[640px] space-y-5 min-[800px]:mx-0 min-[800px]:max-w-none">
            {posts.map((p, i) => (
              <PostCard key={`${p.author}-${p.time}-${i}`} post={p} />
            ))}
          </main>

          <aside className="hidden min-[800px]:block">
            <div
              className="sticky top-[68px] overflow-y-auto"
              style={{
                maxHeight: 'calc(100dvh - 68px)',
                maskImage: 'linear-gradient(to bottom, transparent 0px, black 24px, black calc(100% - 24px), transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, black 24px, black calc(100% - 24px), transparent 100%)',
                scrollbarWidth: 'none',
              }}
            >
              <div className="py-6">
                <ContextRail groups={groups} onOpenGroup={onOpenGroup} />
              </div>
            </div>
          </aside>
        </div>
      </div>

      <BottomNav activeKey={activeKey} onNavigate={onNavigate} />
    </div>
  )
}
