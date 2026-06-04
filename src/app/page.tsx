'use client'

import { useState } from 'react'
import Image from 'next/image'
import Sidebar from '../components/Sidebar'
import ChatArea from '../components/ChatArea'

export default function Home() {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [logoHovered, setLogoHovered] = useState(false)

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

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0a0a0a' }}>

      {/* Sidebar */}
      {sidebarVisible && (
        <Sidebar
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
          activeConversationId={activeConversationId}
          refreshTrigger={refreshTrigger}
          onToggleSidebar={() => setSidebarVisible(false)}
        />
      )}

      {/* Mini rail when sidebar is hidden */}
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
              // <Image src="/logo.png" alt="ContextaAI" width={36} height={36} style={{ borderRadius: '8px' }} />
              <Image
                src="/logo.png"
                alt="ContextaAI"
                width={72}
                height={72}
                quality={100}
                style={{ borderRadius: '8px', width: '36px', height: '36px' }}
              />
            )}
          </button>
        </div>
      )}

      <ChatArea
        selectedConversation={selectedConversation}
        onConversationSaved={handleConversationSaved}
        sidebarVisible={sidebarVisible}
        onToggleSidebar={() => setSidebarVisible(prev => !prev)}
      />
    </div>
  )
}