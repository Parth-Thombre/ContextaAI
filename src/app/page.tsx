'use client'

import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatArea from '../components/ChatArea'

export default function Home() {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [sidebarVisible, setSidebarVisible] = useState(true)

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
      {sidebarVisible && (
        <Sidebar
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
          activeConversationId={activeConversationId}
          refreshTrigger={refreshTrigger}
          onToggleSidebar={() => setSidebarVisible(prev => !prev)}
        />
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