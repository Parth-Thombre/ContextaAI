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
  user: any
  isGuest: boolean
  onLogout: () => void
}

function formatTimestamp(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function SkeletonItem() {
  return (
    <div style={{ padding: '8px 4px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <div style={{
        height: '13px',
        borderRadius: '4px',
        backgroundColor: '#1e1e1e',
        width: `${60 + Math.random() * 30}%`,
        animation: 'pulse 1.4s ease-in-out infinite',
      }} />
      <div style={{
        height: '10px',
        borderRadius: '4px',
        backgroundColor: '#1a1a1a',
        width: '30%',
        animation: 'pulse 1.4s ease-in-out infinite 0.2s',
      }} />
    </div>
  )
}

export default function Sidebar({ onSelectConversation, onNewChat, activeConversationId, refreshTrigger, onToggleSidebar, user, isGuest, onLogout }: SidebarProps) {
  const [activeProject, setActiveProject] = useState<number | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(true)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => { loadConversations() }, [refreshTrigger, user, isGuest])

  const loadConversations = async (q?: string) => {
    try {
      setSearching(true)
      if (!q) setLoading(true)

      if (isGuest) {
        setConversations([])
        setLoading(false)
        setSearching(false)
        return
      }

      const params = new URLSearchParams()
      if (user?.id) params.set('user_id', user.id)
      if (q) params.set('q', q)
      const url = `/api/conversations?${params.toString()}`
      const response = await fetch(url)
      const data = await response.json()
      setConversations(data.conversations || [])
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setSearching(false)
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    if (value.trim()) {
      loadConversations(value)
    } else {
      loadConversations()
    }
  }

  const deleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    try {
      await fetch('/api/conversations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      setConversations(prev => prev.filter(c => c.id !== id))
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .conv-item:hover {
          background-color: #1a1a1a !important;
          color: #cccccc !important;
        }
        .delete-btn:hover {
          color: #ff5555 !important;
          background-color: #2a1a1a !important;
        }
        .project-btn:hover {
          background-color: #1a1a1a !important;
          color: #aaaaaa !important;
        }
      `}</style>
      <div style={{ width: '260px', height: '100vh', backgroundColor: '#111111', borderRight: '1px solid #1e1e1e', display: 'flex', flexDirection: 'column', padding: '12px', gap: '2px' }}>

        {/* Logo + Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 4px 14px 4px', marginBottom: '6px', borderBottom: '1px solid #1e1e1e' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Image src="/logo.png" alt="ContextaAI" width={36} height={36} style={{ borderRadius: '8px' }} />
            <div style={{ fontSize: '17px', fontWeight: '700', color: '#ffffff' }}>ContextaAI</div>
          </div>
          <button
            onClick={onToggleSidebar}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#555', padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#aaa')}
            onMouseLeave={e => (e.currentTarget.style.color = '#555')}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>
        </div>

        {/* New Chat */}
        <button
          onClick={onNewChat}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#6c47ff', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '10px 12px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', marginBottom: '12px', transition: 'background-color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#7c57ff')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#6c47ff')}
        >
          <Plus size={15} />
          New Chat
        </button>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <input
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search conversations..."
            style={{
              width: '100%',
              backgroundColor: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: '8px',
              padding: '8px 12px 8px 32px',
              color: '#ffffff',
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = '#444')}
            onBlur={e => (e.currentTarget.style.borderColor = '#2a2a2a')}
          />
          <svg
            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#555' }}
            width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          {searching && (
            <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#555', fontSize: '11px' }}>...</div>
          )}
        </div>

        {/* Projects */}
        <div style={{ fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '1px', padding: '4px 4px', marginBottom: '2px' }}>Projects</div>

        {projects.map(project => (
          <button
            key={project.id}
            className="project-btn"
            onClick={() => setActiveProject(activeProject === project.id ? null : project.id)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: activeProject === project.id ? '#1e1e1e' : 'transparent', color: activeProject === project.id ? '#ffffff' : '#777', border: 'none', borderRadius: '8px', padding: '8px 4px', cursor: 'pointer', fontSize: '13px', textAlign: 'left', width: '100%', transition: 'background-color 0.15s, color 0.15s' }}
          >
            <Folder size={14} />
            <span style={{ flex: 1 }}>{project.name}</span>
            <span style={{ fontSize: '11px', color: '#444' }}>{project.chats}</span>
          </button>
        ))}

        {/* Recent */}
        <div style={{ fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '1px', padding: '4px 4px', margin: '12px 0 2px 0' }}>Recent</div>

        <div style={{ flex: 1, overflowY: 'auto' }}>

          {/* Loading skeleton */}
          {loading && (
            <div>
              {[1, 2, 3, 4, 5].map(i => <SkeletonItem key={i} />)}
            </div>
          )}

          {/* Empty state */}
          {!loading && conversations.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '24px 8px', textAlign: 'center' }}>
              {isGuest ? (
                <>
                  <div style={{ fontSize: '22px', marginBottom: '4px' }}>👋</div>
                  <div style={{ color: '#888', fontSize: '13px', fontWeight: '500', lineHeight: '1.5' }}>Sign up to save your chats</div>
                  <div style={{ color: '#444', fontSize: '12px', lineHeight: '1.5' }}>Your conversations will appear here once you create an account.</div>
                </>
              ) : searchQuery ? (
                <>
                  <div style={{ fontSize: '22px', marginBottom: '4px' }}>🔍</div>
                  <div style={{ color: '#888', fontSize: '13px', fontWeight: '500' }}>No results for "{searchQuery}"</div>
                  <div style={{ color: '#444', fontSize: '12px' }}>Try a different search term.</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '22px', marginBottom: '4px' }}>💬</div>
                  <div style={{ color: '#888', fontSize: '13px', fontWeight: '500' }}>No chats yet</div>
                  <div style={{ color: '#444', fontSize: '12px', lineHeight: '1.5' }}>Start a conversation and it'll show up here.</div>
                </>
              )}
            </div>
          )}

          {/* Conversation list */}
          {!loading && conversations.map((conversation) => (
            <div
              key={conversation.id}
              onMouseEnter={() => setHoveredId(conversation.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{ position: 'relative', display: 'flex', alignItems: 'center', borderRadius: '8px', marginBottom: '1px' }}
            >
              <button
                className="conv-item"
                onClick={() => onSelectConversation(conversation)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '2px',
                  backgroundColor: activeConversationId === conversation.id ? '#1e1e1e' : 'transparent',
                  color: activeConversationId === conversation.id ? '#ffffff' : '#777',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '7px 28px 7px 4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'background-color 0.12s, color 0.12s',
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%', display: 'block' }}>
                  {conversation.title}
                </span>
                <span style={{ fontSize: '11px', color: '#3a3a3a', fontWeight: '400' }}>
                  {formatTimestamp(conversation.created_at)}
                </span>
              </button>

              {hoveredId === conversation.id && (
                <button
                  className="delete-btn"
                  onClick={(e) => deleteConversation(e, conversation.id)}
                  style={{
                    position: 'absolute',
                    right: '4px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#555',
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'color 0.12s, background-color 0.12s',
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M9 6V4h6v2" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* User / Guest footer */}
        <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: '12px', marginTop: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '12px', color: '#444', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user ? user.email : '👤 Guest'}
            </div>
            <button
              onClick={onLogout}
              style={{ background: 'transparent', border: 'none', color: '#444', fontSize: '12px', cursor: 'pointer', flexShrink: 0, transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#888')}
              onMouseLeave={e => (e.currentTarget.style.color = '#444')}
            >
              {user ? 'Log out' : 'Sign up'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}