'use client'

import { useState, useEffect } from 'react'
import { Plus, Folder } from 'lucide-react'
import Image from 'next/image'

const projects = [
  { id: 1, name: 'My Startup', chats: 3 },
  { id: 2, name: 'Research', chats: 5 },
  { id: 3, name: 'Coding Help', chats: 8 },
]

interface Conversation {
  id: string
  title: string
  model: string
  created_at: string
}

interface SidebarProps {
  onSelectConversation: (conversation: any) => void
  onNewChat: () => void
  activeConversationId: string | null
  refreshTrigger: number
  onToggleSidebar: () => void
}

export default function Sidebar({ onSelectConversation, onNewChat, activeConversationId, refreshTrigger, onToggleSidebar }: SidebarProps) {
  const [activeProject, setActiveProject] = useState<number | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [logoHovered, setLogoHovered] = useState(false)

  useEffect(() => { loadConversations() }, [refreshTrigger])

  const loadConversations = async () => {
    try {
      const response = await fetch('/api/conversations')
      const data = await response.json()
      setConversations(data.conversations || [])
    } catch (error) {
      console.error('Error loading conversations:', error)
    }
  }

  return (
    <div style={{ width: '260px', height: '100vh', backgroundColor: '#111111', borderRight: '1px solid #1e1e1e', display: 'flex', flexDirection: 'column', padding: '12px', gap: '2px' }}>

      {/* Logo + Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 4px 14px 4px', marginBottom: '6px', borderBottom: '1px solid #1e1e1e' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Image src="/logo.png" alt="ContextaAI" width={36} height={36} style={{ borderRadius: '8px' }} />
          <div style={{ fontSize: '17px', fontWeight: '700', color: '#ffffff' }}>ContextaAI</div>
        </div>
        <button
          onClick={onToggleSidebar}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#555', padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
        </button>
      </div>

      {/* New Chat */}
      <button onClick={onNewChat} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#6c47ff', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '10px 12px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>
        <Plus size={15} />
        New Chat
      </button>

      {/* Projects */}
      <div style={{ fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '1px', padding: '4px 4px', marginBottom: '2px' }}>Projects</div>

      {projects.map(project => (
        <button
          key={project.id}
          onClick={() => setActiveProject(activeProject === project.id ? null : project.id)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: activeProject === project.id ? '#1e1e1e' : 'transparent', color: activeProject === project.id ? '#ffffff' : '#777', border: 'none', borderRadius: '8px', padding: '8px 4px', cursor: 'pointer', fontSize: '13px', textAlign: 'left', width: '100%' }}
        >
          <Folder size={14} />
          <span style={{ flex: 1 }}>{project.name}</span>
          <span style={{ fontSize: '11px', color: '#444' }}>{project.chats}</span>
        </button>
      ))}

      {/* Recent */}
      <div style={{ fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '1px', padding: '4px 4px', margin: '12px 0 2px 0' }}>Recent</div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {conversations.length === 0 && (
          <div style={{ color: '#444', fontSize: '13px', padding: '6px 4px' }}>No conversations yet</div>
        )}
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            style={{ display: 'block', backgroundColor: activeConversationId === conversation.id ? '#1e1e1e' : 'transparent', color: activeConversationId === conversation.id ? '#ffffff' : '#777', border: 'none', borderRadius: '8px', padding: '8px 4px', cursor: 'pointer', fontSize: '13px', textAlign: 'left', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {conversation.title}
          </button>
        ))}
      </div>
    </div>
  )
}