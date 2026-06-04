'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, ChevronDown } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import TypingIndicator from './TypingIndicator'

const models = [
  { id: 'llama', name: 'Llama 3.3', color: '#10a37f' },
  { id: 'mixtral', name: 'Mixtral', color: '#cc785c' },
  { id: 'gemma', name: 'Gemma 2', color: '#4285f4' },
]

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
}

interface ChatAreaProps {
  selectedConversation: any
  onConversationSaved: (id: string) => void
  sidebarVisible: boolean
  onToggleSidebar: () => void
}

export default function ChatArea({ selectedConversation, onConversationSaved, sidebarVisible, onToggleSidebar }: ChatAreaProps) {
  const [selectedModel, setSelectedModel] = useState(models[0])
  const [showModelDropdown, setShowModelDropdown] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (selectedConversation) {
      setConversationId(selectedConversation.id)
      setMessages(selectedConversation.messages.map((m: any, i: number) => ({
        id: i,
        role: m.role,
        content: m.content
      })))
    } else {
      setConversationId(null)
      setMessages([])
    }
  }, [selectedConversation])

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'
  }, [input])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = { id: Date.now(), role: 'user', content: input }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          model: selectedModel.id
        })
      })

      const data = await response.json()
      const assistantMessage: Message = { id: Date.now() + 1, role: 'assistant', content: data.message }
      const finalMessages = [...updatedMessages, assistantMessage]
      setMessages(finalMessages)

      const title = userMessage.content.slice(0, 50)
      const dbMessages = finalMessages.map(m => ({ role: m.role, content: m.content }))

      if (!conversationId) {
        const saveResponse = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, model: selectedModel.name, messages: dbMessages })
        })
        const saveData = await saveResponse.json()
        if (saveData.conversation?.id) {
          setConversationId(saveData.conversation.id)
          onConversationSaved(saveData.conversation.id)
        }
      } else {
        await fetch('/api/conversations', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: conversationId, messages: dbMessages, title })
        })
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#0a0a0a' }}>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #222222' }}>
        {/* <button
          onClick={onToggleSidebar}
          title={sidebarVisible ? 'Hide sidebar' : 'Show sidebar'}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#888', padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
        </button> // if we need to keep that toggle button in chat. */}

        {/* Model Switcher */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '8px 12px', color: '#ffffff', cursor: 'pointer', fontSize: '14px' }}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: selectedModel.color }} />
            {selectedModel.name}
            <ChevronDown size={14} />
          </button>

          {showModelDropdown && (
            <div style={{ position: 'absolute', top: '44px', right: '0', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden', zIndex: 100, minWidth: '140px' }}>
              {models.map(model => (
                <button
                  key={model.id}
                  onClick={() => { setSelectedModel(model); setShowModelDropdown(false) }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 14px', backgroundColor: selectedModel.id === model.id ? '#2a2a2a' : 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '14px', textAlign: 'left' }}
                >
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: model.color }} />
                  {model.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {messages.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px' }}>
            <div style={{ fontSize: '32px' }}>⚡</div>
            <div style={{ color: '#444', fontSize: '16px' }}>Start a conversation</div>
            <div style={{ color: '#333', fontSize: '13px' }}>One memory for every AI.</div>
          </div>
        )}

        {messages.map(message => (
          <div key={message.id} style={{ display: 'flex', justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start', padding: '0 24px' }}>
            <div style={{
              maxWidth: '70%',
              backgroundColor: message.role === 'user' ? '#6c47ff' : 'transparent',
              borderRadius: message.role === 'user' ? '18px 18px 4px 18px' : '0',
              padding: message.role === 'user' ? '12px 16px' : '0',
              fontSize: '15px',
              lineHeight: '1.7',
              color: '#ffffff',
            }}>
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" {...props}>
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code style={{ backgroundColor: '#2d2d2d', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', fontFamily: 'monospace' }} {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {loading && <div style={{ padding: '0 24px' }}><TypingIndicator /></div>}
        <div ref={messagesEndRef} />
      </div>

      {/* Input — centered at bottom like Claude */}
      <div style={{ padding: '16px 24px 24px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '680px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '16px', padding: '12px 16px' }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message ContextaAI..."
              rows={1}
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontSize: '15px',
                resize: 'none',
                lineHeight: '1.6',
                maxHeight: '160px',
                overflowY: 'auto',
                fontFamily: 'inherit'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                backgroundColor: loading || !input.trim() ? '#333' : '#6c47ff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginBottom: '2px'
              }}>
              <Send size={16} color="white" />
            </button>
          </div>
          <div style={{ textAlign: 'center', color: '#333', fontSize: '11px', marginTop: '8px' }}>
            Press Enter to send · Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  )
}