import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  Lock,
  Palette,
  User,
  HelpCircle,
  LogOut,
  Moon,
  Smartphone,
  Shield,
  Eye,
  Trash2,
} from 'lucide-react'
import { currentUser as mockUser, displayHandle } from '../lib/media'
import { MediaImg } from '../components/ui'
import { useAuth } from '../lib/auth'
import { useSession } from '../lib/session'

type Section = 'main' | 'conta' | 'notificacoes' | 'privacidade' | 'aparencia'

function Toggle({
  on,
  onToggle,
  disabled,
}: {
  on: boolean
  onToggle: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={disabled ? undefined : onToggle}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        on ? 'bg-secondary-500' : 'bg-neutral-200'
      } ${disabled ? 'cursor-not-allowed opacity-40' : ''}`}
    >
      <span
        className={`pointer-events-none absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-[left] duration-200 ${
          on ? 'left-[22px]' : 'left-0.5'
        }`}
      />
    </button>
  )
}

function RowLink({ icon: Icon, label, subtitle, onClick, danger }: {
  icon: React.ElementType
  label: string
  subtitle?: string
  onClick?: () => void
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3.5 rounded-[14px] bg-surface px-4 py-3.5 transition-colors hover:bg-neutral-50 text-left"
    >
      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${danger ? 'bg-red-50 text-red-500' : 'bg-neutral-100 text-neutral-600'}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-[15px] font-medium ${danger ? 'text-red-500' : 'text-ink'}`}>{label}</p>
        {subtitle && <p className="text-[12px] text-neutral-500 mt-0.5">{subtitle}</p>}
      </div>
      {!danger && <ChevronRight size={18} className="shrink-0 text-neutral-300" />}
    </button>
  )
}

function RowToggle({ icon: Icon, label, subtitle, on, onToggle, disabled }: {
  icon: React.ElementType
  label: string
  subtitle?: string
  on: boolean
  onToggle: () => void
  disabled?: boolean
}) {
  return (
    <div className={`flex w-full items-center gap-3.5 rounded-[14px] bg-surface px-4 py-3.5 ${disabled ? 'opacity-70' : ''}`}>
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-neutral-100 text-neutral-600">
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-medium text-ink">{label}</p>
        {subtitle && <p className="text-[12px] text-neutral-500 mt-0.5">{subtitle}</p>}
      </div>
      <Toggle on={on} onToggle={onToggle} disabled={disabled} />
    </div>
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-2 mt-5 px-1 text-[11px] font-semibold uppercase tracking-[0.8px] text-neutral-500">
      {children}
    </p>
  )
}

export default function Settings({ onBack, onLogout }: { onBack: () => void; onLogout: () => void }) {
  const { profile, user } = useAuth()
  const { profileDraft, updateProfile } = useSession()
  const currentUser = {
    name: profileDraft.name ?? profile?.name ?? mockUser.name,
    handle: displayHandle(profileDraft.handle ?? profile?.handle ?? mockUser.handle),
    avatar: profileDraft.avatar || profile?.avatar || mockUser.avatar,
    location: profileDraft.location ?? profile?.location ?? 'São Paulo, SP',
    phone: profileDraft.phone ?? '+55 11 99999-0000',
    bio: profileDraft.bio ?? profile?.bio ?? 'Corredor amador e entusiasta de vida saudável. Acredito que movimento é remédio. 🏃‍♂️',
  }
  const [section, setSection] = useState<Section>('main')
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    pushNotif: true,
    emailNotif: false,
    groupNotif: true,
    postNotif: true,
    privateAccount: false,
    showActivity: true,
    showLocation: false,
    darkMode: false,
    reduceMotion: false,
    showOnlineStatus: true,
  })

  const toggle = (key: string) =>
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }))

  const sectionTitle: Record<Section, string> = {
    main: 'Configurações',
    conta: 'Conta',
    notificacoes: 'Notificações',
    privacidade: 'Privacidade',
    aparencia: 'Aparência',
  }

  return (
    <div className="fixed inset-0 z-60 flex flex-col bg-canvas overflow-y-auto">

      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-surface px-4 py-3 border-b border-neutral-200">
        <button
          onClick={section === 'main' ? onBack : () => setSection('main')}
          aria-label="Voltar"
          className="grid h-9 w-9 place-items-center rounded-full text-ink transition-colors hover:bg-neutral-100"
        >
          <ChevronLeft size={22} />
        </button>
        <span className="flex-1 text-[17px] font-semibold text-ink">{sectionTitle[section]}</span>
      </header>

      <div className="mx-auto w-full max-w-[700px] px-4 pt-5 pb-10">

        {/* ---- MAIN ---- */}
        {section === 'main' && (
          <>
            {/* User card */}
            <div className="mb-5 flex items-center gap-4 rounded-[18px] bg-surface px-4 py-4">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full">
                <MediaImg src={currentUser.avatar} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[17px] font-semibold text-ink leading-tight">{currentUser.name}</p>
                <p className="text-[14px] text-neutral-500">{currentUser.handle}</p>
              </div>
            </div>

            <SectionLabel>Conta</SectionLabel>
            <div className="space-y-0.5 overflow-hidden rounded-[18px]">
              <RowLink icon={User} label="Editar perfil" subtitle="Nome, foto e bio" onClick={() => setSection('conta')} />
            </div>

            <SectionLabel>Preferências</SectionLabel>
            <div className="space-y-0.5 overflow-hidden rounded-[18px]">
              <RowLink icon={Bell} label="Notificações" onClick={() => setSection('notificacoes')} />
              <RowLink icon={Lock} label="Privacidade" onClick={() => setSection('privacidade')} />
              <RowLink icon={Palette} label="Aparência" onClick={() => setSection('aparencia')} />
            </div>

            <SectionLabel>Suporte</SectionLabel>
            <div className="space-y-0.5 overflow-hidden rounded-[18px]">
              <RowLink icon={HelpCircle} label="Ajuda e suporte" />
              <RowLink icon={Shield} label="Termos e privacidade" />
              <RowLink icon={Smartphone} label="Sobre o Gooday" subtitle="Versão 1.0.0" />
            </div>

            <div className="mt-5 space-y-0.5 overflow-hidden rounded-[18px]">
              <RowLink icon={LogOut} label="Sair da conta" onClick={onLogout} danger />
            </div>
          </>
        )}

        {/* ---- CONTA ---- */}
        {section === 'conta' && (
          <>
            <SectionLabel>Informações pessoais</SectionLabel>
            <div className="space-y-3">
              <label className="block rounded-[14px] bg-surface px-4 py-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.6px] text-neutral-400">Nome completo</span>
                <input
                  value={currentUser.name}
                  onChange={(e) => updateProfile({ name: e.target.value })}
                  className="mt-1 w-full bg-transparent text-[15px] text-ink outline-none"
                />
              </label>
              <label className="block rounded-[14px] bg-surface px-4 py-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.6px] text-neutral-400">Nome de usuário</span>
                <input
                  value={currentUser.handle}
                  onChange={(e) => updateProfile({ handle: e.target.value })}
                  className="mt-1 w-full bg-transparent text-[15px] text-ink outline-none"
                />
              </label>
              <div className="rounded-[14px] bg-surface px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-neutral-400">E-mail</p>
                <p className="mt-1 text-[15px] text-ink">{user?.email ?? '—'}</p>
              </div>
              <label className="block rounded-[14px] bg-surface px-4 py-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.6px] text-neutral-400">Telefone</span>
                <input
                  value={currentUser.phone}
                  onChange={(e) => updateProfile({ phone: e.target.value })}
                  className="mt-1 w-full bg-transparent text-[15px] text-ink outline-none"
                />
              </label>
              <label className="block rounded-[14px] bg-surface px-4 py-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.6px] text-neutral-400">Localização</span>
                <input
                  value={currentUser.location}
                  onChange={(e) => updateProfile({ location: e.target.value })}
                  className="mt-1 w-full bg-transparent text-[15px] text-ink outline-none"
                />
              </label>
              <label className="block rounded-[14px] bg-surface px-4 py-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.6px] text-neutral-400">Bio</span>
                <textarea
                  value={currentUser.bio}
                  onChange={(e) => updateProfile({ bio: e.target.value })}
                  rows={3}
                  className="mt-1 w-full resize-none bg-transparent text-[15px] leading-relaxed text-ink outline-none"
                />
              </label>
            </div>
            <p className="mt-4 text-center text-[13px] text-neutral-500">Alterações ficam salvas nesta sessão.</p>
          </>
        )}

        {/* ---- NOTIFICAÇÕES ---- */}
        {section === 'notificacoes' && (
          <>
            <SectionLabel>Push</SectionLabel>
            <div className="space-y-0.5 overflow-hidden rounded-[18px]">
              <RowToggle icon={Bell} label="Notificações push" subtitle="Ativar todas" on={toggles.pushNotif} onToggle={() => toggle('pushNotif')} />
              <RowToggle icon={User} label="Novos seguidores" on={toggles.postNotif} onToggle={() => toggle('postNotif')} />
              <RowToggle icon={User} label="Atividade nos grupos" on={toggles.groupNotif} onToggle={() => toggle('groupNotif')} />
            </div>
            <SectionLabel>E-mail</SectionLabel>
            <div className="space-y-0.5 overflow-hidden rounded-[18px]">
              <RowToggle icon={Bell} label="Resumo semanal" subtitle="Receba um resumo por e-mail" on={toggles.emailNotif} onToggle={() => toggle('emailNotif')} />
            </div>
          </>
        )}

        {/* ---- PRIVACIDADE ---- */}
        {section === 'privacidade' && (
          <>
            <SectionLabel>Visibilidade</SectionLabel>
            <div className="space-y-0.5 overflow-hidden rounded-[18px]">
              <RowToggle icon={Lock} label="Conta privada" subtitle="Apenas seguidores aprovados veem seu conteúdo" on={toggles.privateAccount} onToggle={() => toggle('privateAccount')} />
              <RowToggle icon={Eye} label="Status de atividade" subtitle="Mostrar quando você está online" on={toggles.showOnlineStatus} onToggle={() => toggle('showOnlineStatus')} />
              <RowToggle icon={Eye} label="Mostrar localização" on={toggles.showLocation} onToggle={() => toggle('showLocation')} />
            </div>
            <SectionLabel>Dados</SectionLabel>
            <div className="space-y-0.5 overflow-hidden rounded-[18px]">
              <RowLink icon={Shield} label="Baixar meus dados" />
              <RowLink icon={Trash2} label="Limpar histórico de busca" danger />
            </div>
          </>
        )}

        {/* ---- APARÊNCIA ---- */}
        {section === 'aparencia' && (
          <>
            <SectionLabel>Tema</SectionLabel>
            <div className="space-y-0.5 overflow-hidden rounded-[18px] opacity-60 pointer-events-none">
              <RowToggle icon={Moon} label="Modo escuro" subtitle="Em breve" on={false} onToggle={() => {}} disabled />
              <RowToggle icon={Smartphone} label="Reduzir animações" subtitle="Em breve" on={false} onToggle={() => {}} disabled />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
