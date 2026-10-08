import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { ensureUserProfile, fetchCurrentUserProfile } from './api'

type Profile = {
  id: string
  name: string
  handle: string
  username: string
  avatar: string
  bio: string | null
  cover: string | null
  location: string | null
}

function mapAuthError(message: string) {
  const m = message.toLowerCase()
  if (m.includes('fetch') || m.includes('network') || m.includes('failed to fetch')) {
    return 'Sem conexão com o servidor. Tente de novo em instantes.'
  }
  if (m.includes('invalid login') || m.includes('invalid credentials')) {
    return 'E-mail ou senha inválidos.'
  }
  if (m.includes('already registered') || m.includes('already been registered')) {
    return 'Não foi possível criar a conta com estes dados.'
  }
  if (m.includes('password') && (m.includes('6') || m.includes('least'))) {
    return 'A senha deve ter pelo menos 6 caracteres.'
  }
  return 'Não foi possível concluir. Tente de novo.'
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
    if (error) return { error: mapAuthError(error.message) }
    try {
      await refreshProfile()
    } catch {
      /* profile load is best-effort after login */
    }
    return {}
  }

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) return { error: mapAuthError(error.message) }

    if (!data.session) {
      const signed = await supabase.auth.signInWithPassword({ email, password })
      if (signed.error) return { error: mapAuthError(signed.error.message) }
    }

    try {
      await ensureUserProfile(name)
      await refreshProfile()
    } catch {
      return { error: 'A conta foi criada, mas o perfil não pôde ser salvo. Tente entrar de novo.' }
    }
    return {}
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
