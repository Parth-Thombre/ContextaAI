'use client'

import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatArea from '../components/ChatArea'

export default function Home() {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

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
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: '#0a0a0a'
    }}>
      <Sidebar
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        activeConversationId={activeConversationId}
        refreshTrigger={refreshTrigger}
      />
      <ChatArea
        selectedConversation={selectedConversation}
        onConversationSaved={handleConversationSaved}
      />
    </div>
  )
}