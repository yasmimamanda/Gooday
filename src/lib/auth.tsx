import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { ADMIN_CREDENTIALS, DEMO_CREDENTIALS, supabase } from './supabase'
import { fetchCurrentUserProfile } from './api'

type Profile = {
  id: string
  name: string
  handle: string
  username: string
  avatar: string
  bio: string | null
  cover: string | null
}

type AuthContextValue = {
  session: Session | null
  user: User | null
  profile: Profile | null
  loading: boolean
  /** true quando app_metadata.role === 'admin' (JWT) */
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readIsAdmin(user: User | null | undefined) {
  const role = user?.app_metadata?.role
  return role === 'admin'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = async () => {
    const uid = (await supabase.auth.getUser()).data.user?.id
    if (!uid) {
      setProfile(null)
      return
    }
    const p = await fetchCurrentUserProfile(uid)
    setProfile(p)
  }

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!session?.user) {
      setProfile(null)
      return
    }
    void refreshProfile()
  }, [session?.user?.id])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error ? { error: error.message } : {}
  }

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    return error ? { error: error.message } : {}
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }

  const user = session?.user ?? null

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        isAdmin: readIsAdmin(user),
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export { ADMIN_CREDENTIALS, DEMO_CREDENTIALS }
