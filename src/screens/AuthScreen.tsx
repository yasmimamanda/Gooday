import { Logo, MoonIcon } from '../components/icons'
import { Button, Checkbox, Field } from '../components/ui'
import { photo } from '../lib/media'
import { useState } from 'react'
import { useAuth } from '../lib/auth'

type Mode = 'login' | 'signup'

const copy = {
  login: {
    hero: photo.runnerWoman,
    subtitle: 'Bem-vindo de volta. Compartilhe um pouco do seu dia.',
    cta: 'Entrar no Gooday',
    switchText: 'Ainda não tem conta?',
    switchLink: 'Criar conta',
  },
  signup: {
    hero: photo.sprintTrack,
    subtitle: 'Crie sua conta e comece a cuidar de você todos os dias.',
    cta: 'Criar minha conta',
    switchText: 'Já faz parte do Gooday?',
    switchLink: 'Entrar',
  },
}

export default function AuthScreen({
  mode,
  onSwitch,
  onEnter,
}: {
  mode: Mode
  onSwitch: (m: Mode) => void
  onEnter: () => void
}) {
  const c = copy[mode]
  const { signIn, signUp } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      if (mode === 'signup') {
        if (password !== confirm) {
          setError('As senhas não coincidem.')
          return
        }
        const res = await signUp(email.trim(), password, name.trim() || 'Usuário')
        if (res.error) {
          setError(res.error)
          return
        }
      } else {
        const res = await signIn(email.trim(), password)
        if (res.error) {
          setError(res.error)
          return
        }
      }
      onEnter()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="h-dvh w-full bg-canvas p-3 sm:p-5 lg:p-6">
      <div className="flex h-full w-full flex-col gap-4 lg:flex-row lg:gap-6">

        <div className="relative hidden overflow-hidden rounded-3xl sm:block sm:h-48 lg:h-auto lg:flex-[7]">
          <img src={c.hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-black/20" />
          <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7ee787] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#5fd873]" />
            </span>
            <span className="text-[14px] font-medium tracking-tight text-white">Ao vivo</span>
          </div>
          <p className="absolute bottom-8 left-8 right-8 hidden text-[24px] font-semibold leading-snug text-white lg:block">
            Respeite sua mente e trate
            <br />
            seu corpo bem.
          </p>
        </div>

        <div className="relative flex flex-1 items-center justify-center overflow-y-auto rounded-3xl bg-surface px-6 py-10 sm:px-10 lg:flex-[3]">
          <button
            aria-label="Alternar tema"
            className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200"
          >
            <MoonIcon width={20} height={20} />
          </button>

          <div className="w-full max-w-[380px]">
            <div className="mb-4 flex justify-center">
              <Logo className="text-[108px]" markClassName="text-ink" />
            </div>
            <p className="mx-auto mb-8 max-w-[300px] text-center text-[16px] leading-snug text-neutral-500">
              {c.subtitle}
            </p>

            <form className="space-y-3.5" onSubmit={submit}>
              {mode === 'signup' && (
                <Field
                  placeholder="Nome completo"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}
              <Field
                type="email"
                placeholder="Email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Field
                type="password"
                placeholder="Senha"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {mode === 'signup' && (
                <Field
                  type="password"
                  placeholder="Confirmar senha"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              )}

              {mode === 'login' ? (
                <div className="flex items-center justify-between pt-1">
                  <Checkbox label="Lembrar minha senha" />
                  <button type="button" className="text-[14px] text-neutral-500 hover:text-ink">
                    Esqueci minha senha
                  </button>
                </div>
              ) : (
                <p className="pt-1 text-[13px] leading-relaxed text-neutral-400">
                  Ao criar sua conta você concorda com nossos Termos e a Política de Privacidade.
                </p>
              )}

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-600">{error}</p>
              )}

              <Button type="submit" className="mt-4 w-full" disabled={busy}>
                {busy ? 'Aguarde…' : c.cta}
              </Button>
            </form>

            <p className="mt-6 text-center text-[15px] text-neutral-500">
              {c.switchText}{' '}
              <button
                onClick={() => onSwitch(mode === 'login' ? 'signup' : 'login')}
                className="font-semibold text-accent-600 hover:underline"
              >
                {c.switchLink}
              </button>
            </p>

            <p className="mt-8 text-center text-[13px] text-neutral-400">
              Respeite sua mente e trate seu corpo bem.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
