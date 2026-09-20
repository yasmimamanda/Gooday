import { useEffect, useState } from 'react'
import AuthScreen from './screens/AuthScreen'
import Home from './screens/Home'
import Search from './screens/Search'
import Messages from './screens/Messages'
import Chat from './screens/Chat'
import Create from './screens/Create'
import Profile from './screens/Profile'
import MyProfile from './screens/MyProfile'
import GroupProfile from './screens/GroupProfile'
import Grupos from './screens/Grupos'
import Settings from './screens/Settings'
import { useAuth } from './lib/auth'

type Screen =
  | 'login'
  | 'signup'
  | 'home'
  | 'search'
  | 'messages'
  | 'chat'
  | 'create'
  | 'profile'
  | 'myprofile'
  | 'group'
  | 'grupos'
  | 'settings'

export default function App() {
  const { session, loading, signOut } = useAuth()
  const [screen, setScreen] = useState<Screen>('login')
  const [chatContactId, setChatContactId] = useState<string>('renata')
  const [profileId, setProfileId] = useState<string>('renata')
  const [groupId, setGroupId] = useState<string>('corrida')
  const [prevScreen, setPrevScreen] = useState<Screen>('home')

  useEffect(() => {
    if (loading) return
    if (session && (screen === 'login' || screen === 'signup')) {
      setScreen('home')
    }
    if (!session && !['login', 'signup'].includes(screen)) {
      setScreen('login')
    }
  }, [session, loading])

  const navigate = (key: string) => {
    if (
      key === 'search' ||
      key === 'messages' ||
      key === 'home' ||
      key === 'create' ||
      key === 'grupos' ||
      key === 'settings'
    ) {
      setScreen(key as Screen)
    } else if (key === 'profile') {
      setPrevScreen(screen as Screen)
      setScreen('myprofile')
    }
  }

  const openProfile = (personId: string, from: Screen = 'search') => {
    setProfileId(personId)
    setPrevScreen(from)
    setScreen('profile')
  }

  const openGroup = (gId: string, from: Screen = 'home') => {
    setGroupId(gId)
    setPrevScreen(from)
    setScreen('group')
  }

  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center bg-canvas text-[15px] text-neutral-500">
        Carregando Gooday…
      </div>
    )
  }

  if (screen === 'search')
    return (
      <>
        <Home onNavigate={navigate} activeKey="search" onOpenGroup={(id) => openGroup(id, 'search')} />
        <Search
          onBack={() => setScreen('home')}
          onOpenProfile={(id) => openProfile(id, 'search')}
          onOpenGroup={(id) => openGroup(id, 'search')}
        />
      </>
    )

  if (screen === 'profile')
    return (
      <>
        <Home onNavigate={navigate} activeKey="home" onOpenGroup={(id) => openGroup(id, 'home')} />
        <Profile
          personId={profileId}
          onBack={() => setScreen(prevScreen)}
          onMessage={(id) => {
            setChatContactId(id)
            setScreen('chat')
          }}
        />
      </>
    )

  if (screen === 'myprofile')
    return (
      <>
        <Home onNavigate={navigate} activeKey="profile" onOpenGroup={(id) => openGroup(id, 'home')} />
        <MyProfile onBack={() => setScreen(prevScreen)} onSettings={() => setScreen('settings')} />
      </>
    )

  if (screen === 'settings')
    return (
      <>
        <Home onNavigate={navigate} activeKey="settings" onOpenGroup={(id) => openGroup(id, 'home')} />
        <Settings
          onBack={() => setScreen('myprofile')}
          onLogout={async () => {
            await signOut()
            setScreen('login')
          }}
        />
      </>
    )

  if (screen === 'group')
    return (
      <>
        <Home onNavigate={navigate} activeKey="home" onOpenGroup={(id) => openGroup(id, 'home')} />
        <GroupProfile groupId={groupId} onBack={() => setScreen(prevScreen)} />
      </>
    )

  if (screen === 'grupos')
    return (
      <>
        <Home onNavigate={navigate} activeKey="grupos" onOpenGroup={(id) => openGroup(id, 'grupos')} />
        <Grupos onBack={() => setScreen('home')} onOpenGroup={(id) => openGroup(id, 'grupos')} />
      </>
    )

  if (screen === 'messages')
    return (
      <Messages
        onBack={() => setScreen('home')}
        onSelectContact={(id) => {
          setChatContactId(id)
          setScreen('chat')
        }}
        onOpenProfile={(id) => openProfile(id, 'messages')}
      />
    )

  if (screen === 'chat')
    return <Chat contactId={chatContactId} onBack={() => setScreen('messages')} />

  if (screen === 'create')
    return (
      <>
        <Home onNavigate={navigate} activeKey="create" onOpenGroup={(id) => openGroup(id, 'home')} />
        <Create onClose={() => setScreen('home')} />
      </>
    )

  if (screen === 'home')
    return <Home onNavigate={navigate} activeKey="home" onOpenGroup={(id) => openGroup(id, 'home')} />

  return (
    <AuthScreen
      mode={screen === 'signup' ? 'signup' : 'login'}
      onSwitch={(m) => setScreen(m)}
      onEnter={() => setScreen('home')}
    />
  )
}
