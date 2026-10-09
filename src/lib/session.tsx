import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { ChatMessage, Post, Story } from './media'
import { useAuth } from './auth'

type SessionContextValue = {
  posts: Post[]
  stories: Story[]
  seenStoryKeys: Set<string>
  messagesByContact: Record<string, ChatMessage[]>
  addPost: (post: Post) => void
  addStory: (story: Story) => void
  markStorySeen: (key: string) => void
  addMessage: (contactId: string, message: ChatMessage) => void
}

const SessionContext = createContext<SessionContextValue | null>(null)

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [stories, setStories] = useState<Story[]>([])
  const [seenKeys, setSeenKeys] = useState<string[]>([])
  const [messagesByContact, setMessagesByContact] = useState<Record<string, ChatMessage[]>>({})

  useEffect(() => {
    setPosts([])
    setStories([])
    setSeenKeys([])
    setMessagesByContact({})
  }, [user?.id])

  const addPost = useCallback((post: Post) => {
    setPosts((prev) => [{ ...post, id: post.id ?? newId() }, ...prev])
  }, [])

  const addStory = useCallback((story: Story) => {
    setStories((prev) => {
      if (story.name === 'Você') {
        return [story, ...prev.filter((s) => s.name !== 'Você')]
      }
      return [story, ...prev]
    })
  }, [])

  const markStorySeen = useCallback((key: string) => {
    setSeenKeys((prev) => (prev.includes(key) ? prev : [...prev, key]))
  }, [])

  const addMessage = useCallback((contactId: string, message: ChatMessage) => {
    setMessagesByContact((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] ?? []), { ...message, id: message.id || newId() }],
    }))
  }, [])

  const seenStoryKeys = useMemo(() => new Set(seenKeys), [seenKeys])

  const value = useMemo(
    () => ({
      posts,
      stories,
      seenStoryKeys,
      messagesByContact,
      addPost,
      addStory,
      markStorySeen,
      addMessage,
    }),
    [posts, stories, seenStoryKeys, messagesByContact, addPost, addStory, markStorySeen, addMessage],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within SessionProvider')
  return ctx
}

export function mergeStories(sessionStories: Story[], base: Story[]): Story[] {
  const names = new Set(sessionStories.map((s) => s.name))
  return [...sessionStories, ...base.filter((s) => !names.has(s.name))]
}
