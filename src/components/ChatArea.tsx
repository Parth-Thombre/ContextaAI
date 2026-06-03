'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, ChevronDown } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import TypingIndicator from './TypingIndicator'

const models = [
  { id: 'gpt-4', name: 'GPT-4', color: '#10a37f' },
  { id: 'claude', name: 'Claude', color: '#cc785c' },
  { id: 'gemini', name: 'Gemini', color: '#4285f4' },
]

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
}

export default function ChatArea() {
  const [selectedModel, setSelectedModel] = useState(models[0])
  const [showModelDropdown, setShowModelDropdown] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async () => {
  if (!input.trim() || loading) return

  const userMessage: Message = {
    id: Date.now(),
    role: 'user',
    content: input
  }

  const updatedMessages = [...messages, userMessage]
  setMessages(updatedMessages)
  setInput('')
  setLoading(true)

  try {
    // Get AI response
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: updatedMessages.map(m => ({
          role: m.role,
          content: m.content
        }))
      })
    })

    const data = await response.json()

    const assistantMessage: Message = {
      id: Date.now() + 1,
      role: 'assistant',
      content: data.message
    }

    const finalMessages = [...updatedMessages, assistantMessage]
    setMessages(finalMessages)

    // Save to database
    const title = userMessage.content.slice(0, 50)
    const dbMessages = finalMessages.map(m => ({
      role: m.role,
      content: m.content
    }))

    if (!conversationId) {
      // Create new conversation
      const saveResponse = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          model: selectedModel.name,
          messages: dbMessages
        })
      })
      const saveData = await saveResponse.json()
      console.log('Save response:', saveData)
      if (saveData.conversation?.id) {
        setConversationId(saveData.conversation.id)
      }
    } else {
      // Update existing conversation
      await fetch('/api/conversations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: conversationId,
          messages: dbMessages,
          title
        })
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
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: '#0a0a0a'
    }}>

      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        borderBottom: '1px solid #222222'
      }}>
        <span style={{ color: '#888', fontSize: '14px' }}>New Chat</span>

        {/* Model selector */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: selectedModel.color
            }} />
            {selectedModel.name}
            <ChevronDown size={14} />
          </button>

          {showModelDropdown && (
            <div style={{
              position: 'absolute',
              top: '44px',
              right: '0',
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '8px',
              overflow: 'hidden',
              zIndex: 100,
              minWidth: '140px'
            }}>
              {models.map(model => (
                <button
                  key={model.id}
                  onClick={() => {
                    setSelectedModel(model)
                    setShowModelDropdown(false)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '14px',
                    textAlign: 'left'
                  }}
                >
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: model.color
                  }} />
                  {model.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {messages.length === 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: '12px'
          }}>
            <div style={{ fontSize: '32px' }}>⚡</div>
            <div style={{ color: '#444', fontSize: '16px' }}>
              Start a conversation
            </div>
            <div style={{ color: '#333', fontSize: '13px' }}>
              One memory for every AI.
            </div>
          </div>
        )}

        {messages.map(message => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div style={{
              maxWidth: '70%',
              backgroundColor: message.role === 'user' ? '#6c47ff' : '#1a1a1a',
              borderRadius: message.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              padding: '12px 16px',
              fontSize: '14px',
              lineHeight: '1.6',
              color: '#ffffff',
            }}>
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code style={{
                        backgroundColor: '#2d2d2d',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        fontFamily: 'monospace'
                      }} {...props}>
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

        {loading && <TypingIndicator />}
        <div ref={messagesEndRef} />

      </div>

      {/* Input */}
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid #222222'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '12px',
          padding: '12px 16px'
        }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message ContextaAI..."
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '14px'
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#444' : '#6c47ff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Send size={16} color="white" />
          </button>
        </div>
        <div style={{ textAlign: 'center', color: '#333', fontSize: '11px', marginTop: '8px' }}>
          Press Enter to send · Shift+Enter for new line
        </div>
      </div>

    </div>
  )
}