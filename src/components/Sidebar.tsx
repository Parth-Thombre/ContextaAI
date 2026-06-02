'use client'

import { useState } from 'react'
import { MessageSquare, Plus, Folder } from 'lucide-react'

const projects = [
  { id: 1, name: 'My Startup', chats: 3 },
  { id: 2, name: 'Research', chats: 5 },
  { id: 3, name: 'Coding Help', chats: 8 },
]

export default function Sidebar() {
  const [activeProject, setActiveProject] = useState(1)

  return (
    <div style={{
      width: '260px',
      height: '100vh',
      backgroundColor: '#111111',
      borderRight: '1px solid #222222',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px',
      gap: '8px'
    }}>
      {/* Logo */}
      <div style={{
        fontSize: '20px',
        fontWeight: '700',
        color: '#ffffff',
        padding: '8px 0 16px 0',
        borderBottom: '1px solid #222222',
        marginBottom: '8px'
      }}>
        ContextaAI
      </div>

      {/* New Chat Button */}
      <button style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#6c47ff',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 14px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        marginBottom: '16px'
      }}>
        <Plus size={16} />
        New Chat
      </button>

      {/* Projects */}
      <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
        Projects
      </div>

      {projects.map(project => (
        <button
          key={project.id}
          onClick={() => setActiveProject(project.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: activeProject === project.id ? '#1a1a1a' : 'transparent',
            color: activeProject === project.id ? '#ffffff' : '#888888',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 12px',
            cursor: 'pointer',
            fontSize: '14px',
            textAlign: 'left',
            width: '100%'
          }}
        >
          <Folder size={15} />
          <span style={{ flex: 1 }}>{project.name}</span>
          <span style={{ fontSize: '11px', color: '#555' }}>{project.chats}</span>
        </button>
      ))}

      {/* Recent Chats */}
      <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', margin: '16px 0 4px 0' }}>
        Recent
      </div>

      {['Landing page copy', 'API architecture', 'Pitch deck ideas'].map((chat, i) => (
        <button
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'transparent',
            color: '#888888',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 12px',
            cursor: 'pointer',
            fontSize: '13px',
            textAlign: 'left',
            width: '100%'
          }}
        >
          <MessageSquare size={13} />
          <span style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>{chat}</span>
        </button>
      ))}
    </div>
  )
}