'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Send } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import TypingIndicator from './TypingIndicator'
import Image from 'next/image'

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
  user: any
  isGuest: boolean
}

/**
 * Generates a smart title from the user's first message.
 * Priority:
 *   1. First sentence (up to 60 chars), trimmed at word boundary
 *   2. Falls back to first 50 chars + "…" if no sentence boundary found
 */
function generateTitle(userMessage: string): string {
  const text = userMessage.trim()

  // Strip common filler prefixes like "Code: " or "Write: "
  const stripped = text.replace(/^(code|write|learn|strategize|explain|help me with|help me|can you|could you|please)[:\s]+/i, '').trim()

  // Try to find a natural sentence or clause boundary
  const sentenceMatch = stripped.match(/^(.{10,60}?)[.!?]/)
  if (sentenceMatch) {
    return sentenceMatch[1].trim()
  }

  // Try to cut at a comma or dash if within range
  const clauseMatch = stripped.match(/^(.{15,55})[,—–]/)
  if (clauseMatch) {
    return clauseMatch[1].trim()
  }

  // Trim at word boundary under 60 chars
  if (stripped.length <= 60) return stripped

  const truncated = stripped.slice(0, 60)
  const lastSpace = truncated.lastIndexOf(' ')
  return (lastSpace > 30 ? truncated.slice(0, lastSpace) : truncated) + '…'
}

export default function ChatArea({ selectedConversation, onConversationSaved, sidebarVisible, onToggleSidebar, user, isGuest }: ChatAreaProps) {
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
        id: i, role: m.role, content: m.content
      })))
    } else {
      setConversationId(null)
      setMessages([])
      setInput('')
    }
  }, [selectedConversation])

  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'
  }, [input])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    // Guest token limit check
    if (isGuest) {
      const stored = localStorage.getItem('guest_usage')
      const usage = stored ? JSON.parse(stored) : { tokens: 0, resetAt: Date.now() + 5 * 60 * 60 * 1000 }
      if (Date.now() > usage.resetAt) {
        usage.tokens = 0
        usage.resetAt = Date.now() + 5 * 60 * 60 * 1000
      }
      if (usage.tokens >= 10000) {
        alert('You\'ve used your free tokens. Sign up for unlimited access — it\'s free!')
        return
      }
      const estimatedTokens = input.length / 4
      usage.tokens += estimatedTokens + 500
      localStorage.setItem('guest_usage', JSON.stringify(usage))
    }

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

      if (user?.id) {
        // Use smarter title generation instead of first 50 chars
        const title = generateTitle(userMessage.content)
        const dbMessages = finalMessages.map(m => ({ role: m.role, content: m.content }))

        if (!conversationId) {
          const saveResponse = await fetch('/api/conversations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, model: selectedModel.name, messages: dbMessages, user_id: user.id })
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

  const currentTitle = selectedConversation?.title || 'New Chat'

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#0a0a0a', overflow: 'hidden' }}>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', borderBottom: '1px solid #1e1e1e' }}>
        {!sidebarVisible && (
          <button onClick={onToggleSidebar} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#666', padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>
        )}
        <span style={{ color: '#888', fontSize: '14px', fontWeight: '500' }}>{currentTitle}</span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 0', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {messages.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '24px' }}>
            <Image
              src="/logo.png"
              alt="ContextaAI"
              width={120}
              height={120}
              style={{ borderRadius: '16px' }}
              priority
            />
            <div style={{ fontSize: '26px', color: '#ffffff', fontWeight: '600' }}>What can I help with?</div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { label: 'Code', icon: '</>' },
                { label: 'Strategize', icon: '↗' },
                { label: 'Write', icon: '✎' },
                { label: 'Learn', icon: '◎' },
              ].map(chip => (
                <button
                  key={chip.label}
                  onClick={() => setInput(chip.label + ': ')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '20px', padding: '8px 16px', color: '#aaa', cursor: 'pointer', fontSize: '13px', fontWeight: '500', transition: 'background-color 0.15s, border-color 0.15s, color 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#222'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#444' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#1a1a1a'; e.currentTarget.style.color = '#aaa'; e.currentTarget.style.borderColor = '#2a2a2a' }}
                >
                  <span style={{ fontSize: '12px' }}>{chip.icon}</span>
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(message => (
          <div key={message.id} style={{ display: 'flex', justifyContent: 'center', padding: '0 24px' }}>
            <div style={{ width: '100%', maxWidth: '700px', display: 'flex', justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '85%',
                backgroundColor: message.role === 'user' ? '#6c47ff' : 'transparent',
                borderRadius: message.role === 'user' ? '18px 18px 4px 18px' : '0',
                padding: message.role === 'user' ? '12px 16px' : '0',
                fontSize: '15px', lineHeight: '1.7', color: '#ffffff',
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
          </div>
        ))}

        {loading && <div style={{ padding: '0 24px' }}><TypingIndicator /></div>}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div style={{ padding: '12px 24px 24px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '700px' }}>
          <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '16px', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

            {/* Guest token indicator */}
            {isGuest && (() => {
              const stored = typeof window !== 'undefined' ? localStorage.getItem('guest_usage') : null
              const usage = stored ? JSON.parse(stored) : { tokens: 0 }
              const remaining = Math.max(0, 10000 - (usage.tokens || 0))
              const percent = (remaining / 10000) * 100
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ flex: 1, height: '2px', backgroundColor: '#2a2a2a', borderRadius: '2px' }}>
                    <div style={{ width: `${percent}%`, height: '100%', backgroundColor: percent > 30 ? '#6c47ff' : '#ff4444', borderRadius: '2px', transition: 'width 0.3s' }} />
                  </div>
                  <div style={{ fontSize: '11px', color: '#444', flexShrink: 0 }}>{Math.round(remaining / 100)} credits left</div>
                </div>
              )
            })()}

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message ContextaAI..."
              rows={1}
              style={{
                backgroundColor: 'transparent', border: 'none', outline: 'none',
                color: '#ffffff', fontSize: '15px', resize: 'none', lineHeight: '1.6',
                maxHeight: '160px', overflowY: 'auto', fontFamily: 'inherit', width: '100%'
              }}
            />

            {/* Bottom row: model switcher + send */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

              {/* Model switcher */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowModelDropdown(!showModelDropdown)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#2a2a2a', border: '1px solid #333', borderRadius: '8px', padding: '6px 10px', color: '#aaa', cursor: 'pointer', fontSize: '13px' }}
                >
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: selectedModel.color }} />
                  {selectedModel.name}
                  <ChevronDown size={12} />
                </button>

                {showModelDropdown && (
                  <div style={{ position: 'absolute', bottom: '36px', left: '0', backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: '10px', overflow: 'hidden', zIndex: 100, minWidth: '150px' }}>
                    {models.map(model => (
                      <button
                        key={model.id}
                        onClick={() => { setSelectedModel(model); setShowModelDropdown(false) }}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 14px', backgroundColor: selectedModel.id === model.id ? '#2a2a2a' : 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '13px', textAlign: 'left' }}
                      >
                        <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: model.color }} />
                        {model.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Send button */}
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{ backgroundColor: loading || !input.trim() ? '#2a2a2a' : '#6c47ff', border: 'none', borderRadius: '8px', padding: '8px 10px', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.15s' }}
                onMouseEnter={e => { if (!loading && input.trim()) e.currentTarget.style.backgroundColor = '#7c57ff' }}
                onMouseLeave={e => { if (!loading && input.trim()) e.currentTarget.style.backgroundColor = '#6c47ff' }}
              >
                <Send size={15} color={loading || !input.trim() ? '#555' : 'white'} />
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', color: '#2a2a2a', fontSize: '11px', marginTop: '8px' }}>
            Press Enter to send · Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  )
}