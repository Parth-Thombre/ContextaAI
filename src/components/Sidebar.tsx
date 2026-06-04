// 'use client'

// import { useState, useEffect } from 'react'
// import { MessageSquare, Plus, Folder } from 'lucide-react'

// const projects = [
//   { id: 1, name: 'My Startup', chats: 3 },
//   { id: 2, name: 'Research', chats: 5 },
//   { id: 3, name: 'Coding Help', chats: 8 },
// ]

// interface Conversation {
//   id: string
//   title: string
//   model: string
//   created_at: string
// }

// interface SidebarProps {
//   onSelectConversation: (conversation: any) => void
//   onNewChat: () => void
//   activeConversationId: string | null
//   refreshTrigger: number //refresh the chats in recent chats instently after opening a new chat.
// }

// export default function Sidebar({ onSelectConversation, onNewChat, activeConversationId, refreshTrigger }: SidebarProps) {
//   const [activeProject, setActiveProject] = useState(1)
//   const [conversations, setConversations] = useState<Conversation[]>([])

//   useEffect(() => {
//     loadConversations()
//   }, [refreshTrigger])

//   const loadConversations = async () => {
//     try {
//       const response = await fetch('/api/conversations')
//       const data = await response.json()
//       setConversations(data.conversations || [])
//     } catch (error) {
//       console.error('Error loading conversations:', error)
//     }
//   }

//   return (
//     <div style={{
//       width: '260px',
//       height: '100vh',
//       backgroundColor: '#111111',
//       borderRight: '1px solid #222222',
//       display: 'flex',
//       flexDirection: 'column',
//       padding: '16px',
//       gap: '8px'
//     }}>
//       {/* Logo */}
//       <div style={{
//         fontSize: '20px',
//         fontWeight: '700',
//         color: '#ffffff',
//         padding: '8px 0 16px 0',
//         borderBottom: '1px solid #222222',
//         marginBottom: '8px'
//       }}>
//         ContextaAI
//       </div>

//       {/* New Chat Button */}
//       <button
//         onClick={onNewChat}
//         style={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: '8px',
//           backgroundColor: '#6c47ff',
//           color: '#ffffff',
//           border: 'none',
//           borderRadius: '8px',
//           padding: '10px 14px',
//           cursor: 'pointer',
//           fontSize: '14px',
//           fontWeight: '500',
//           marginBottom: '16px'
//         }}>
//         <Plus size={16} />
//         New Chat
//       </button>

//       {/* Projects */}
//       <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
//         Projects
//       </div>

//       {projects.map(project => (
//         <button
//           key={project.id}
//           onClick={() => setActiveProject(project.id)}
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: '10px',
//             backgroundColor: activeProject === project.id ? '#1a1a1a' : 'transparent',
//             color: activeProject === project.id ? '#ffffff' : '#888888',
//             border: 'none',
//             borderRadius: '8px',
//             padding: '10px 12px',
//             cursor: 'pointer',
//             fontSize: '14px',
//             textAlign: 'left',
//             width: '100%'
//           }}
//         >
//           <Folder size={15} />
//           <span style={{ flex: 1 }}>{project.name}</span>
//           <span style={{ fontSize: '11px', color: '#555' }}>{project.chats}</span>
//         </button>
//       ))}

//       {/* Recent Chats from database */}
//       <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', margin: '16px 0 4px 0' }}>
//         Recent
//       </div>

//       <div style={{ flex: 1, overflowY: 'auto' }}>
//         {conversations.length === 0 && (
//           <div style={{ color: '#444', fontSize: '13px', padding: '8px 12px' }}>
//             No conversations yet
//           </div>
//         )}

//         {conversations.map((conversation) => (
//           <button
//             key={conversation.id}
//             onClick={() => onSelectConversation(conversation)}
//             style={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: '10px',
//               backgroundColor: activeConversationId === conversation.id ? '#1a1a1a' : 'transparent',
//               color: activeConversationId === conversation.id ? '#ffffff' : '#888888',
//               border: 'none',
//               borderRadius: '8px',
//               padding: '8px 12px',
//               cursor: 'pointer',
//               fontSize: '13px',
//               textAlign: 'left',
//               width: '100%'
//             }}
//           >
//             <MessageSquare size={13} />
//             <span style={{
//               overflow: 'hidden',
//               textOverflow: 'ellipsis',
//               whiteSpace: 'nowrap'
//             }}>{conversation.title}</span>
//           </button>
//         ))}
//       </div>
//     </div>
//   )
// }
'use client'

import { useState, useEffect } from 'react'
import { Plus, Folder } from 'lucide-react'

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

  useEffect(() => {
    loadConversations()
  }, [refreshTrigger])

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
    <div style={{ width: '260px', height: '100vh', backgroundColor: '#111111', borderRight: '1px solid #222222', display: 'flex', flexDirection: 'column', padding: '16px', gap: '8px' }}>

      {/* Logo + Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0 16px 0', borderBottom: '1px solid #222222', marginBottom: '8px' }}>
        <div style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff' }}>ContextaAI</div>
        <button
          onClick={onToggleSidebar}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#888', padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
        </button>
      </div>

      {/* New Chat */}
      <button onClick={onNewChat} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#6c47ff', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '10px 14px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', marginBottom: '16px' }}>
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
          onClick={() => setActiveProject(activeProject === project.id ? null : project.id)}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: activeProject === project.id ? '#1a1a1a' : 'transparent', color: activeProject === project.id ? '#ffffff' : '#888888', border: 'none', borderRadius: '8px', padding: '10px 12px', cursor: 'pointer', fontSize: '14px', textAlign: 'left', width: '100%' }}
        >
          <Folder size={15} />
          <span style={{ flex: 1 }}>{project.name}</span>
          <span style={{ fontSize: '11px', color: '#555' }}>{project.chats}</span>
        </button>
      ))}

      {/* Recent */}
      <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', margin: '16px 0 4px 0' }}>
        Recent
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {conversations.length === 0 && (
          <div style={{ color: '#444', fontSize: '13px', padding: '8px 12px' }}>No conversations yet</div>
        )}

        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            style={{ display: 'flex', alignItems: 'center', backgroundColor: activeConversationId === conversation.id ? '#1a1a1a' : 'transparent', color: activeConversationId === conversation.id ? '#ffffff' : '#888888', border: 'none', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', fontSize: '13px', textAlign: 'left', width: '100%' }}
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conversation.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}