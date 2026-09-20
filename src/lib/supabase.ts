import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  console.warn(
    '[Gooday] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Check your .env file.',
  )
}

export const supabase = createClient(url ?? '', anonKey ?? '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export const DEMO_CREDENTIALS = {
  email: 'yasmandago@gmail.com',
  /** Nunca versionar senha — preencha só no .env local / login manual */
  password: '',
} as const

/** Conta admin — role=admin no app_metadata do Supabase Auth */
export const ADMIN_CREDENTIALS = DEMO_CREDENTIALS

