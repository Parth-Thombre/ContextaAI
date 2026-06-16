'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Sidebar from '../components/Sidebar'
import ChatArea from '../components/ChatArea'
import AuthPage from '../components/AuthPage'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [logoHovered, setLogoHovered] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isGuest, setIsGuest] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    // Check if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
        // Stale/expired token — clean logout
        supabase.auth.signOut()
        setUser(null)
        setIsGuest(false)
      } else {
        setUser(session?.user ?? null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSelectConversation = (conversation: any) => {
    setActiveConversationId(conversation.id)
    setSelectedConversation(conversation)
  }

  const handleNewChat = () => {
    setActiveConversationId(null)
    setSelectedConversation(null)
  }

  const handleConversationSaved = (id: string) => {
    setActiveConversationId(id)
    setRefreshTrigger(prev => prev + 1)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsGuest(false)
    setUser(null)
  }

  if (authLoading) {
    return (
      <div style={{ height: '100vh', backgroundColor: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#333', fontSize: '14px' }}>Loading...</div>
      </div>
    )
  }

  if (!user && !isGuest) {
    return <AuthPage onGuestContinue={() => setIsGuest(true)} />
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0a0a0a' }}>
      {sidebarVisible && (
        <Sidebar
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
          activeConversationId={activeConversationId}
          refreshTrigger={refreshTrigger}
          onToggleSidebar={() => setSidebarVisible(false)}
          user={user}
          isGuest={isGuest}
          onLogout={handleLogout}
        />
      )}

      {!sidebarVisible && (
        <div style={{ width: '52px', height: '100vh', backgroundColor: '#111111', borderRight: '1px solid #1e1e1e', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '14px' }}>
          <button
            onClick={() => setSidebarVisible(true)}
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px' }}
          >
            {logoHovered ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            ) : (
              <Image src="/logo.png" alt="ContextaAI" width={72} height={72} quality={100} style={{ borderRadius: '6px', width: '36px', height: '36px' }} />
            )}
          </button>
        </div>
      )}

      <ChatArea
        key={activeConversationId ?? 'new'}
        selectedConversation={selectedConversation}
        onConversationSaved={handleConversationSaved}
        sidebarVisible={sidebarVisible}
        onToggleSidebar={() => setSidebarVisible(prev => !prev)}
        user={user}
        isGuest={isGuest}
      />
    </div>
  )
}