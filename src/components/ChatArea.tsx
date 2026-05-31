'use client'

import { useState } from 'react'
import { Send, ChevronDown } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

const models = [
  { id: 'gpt-4', name: 'GPT-4', color: '#10a37f' },
  { id: 'claude', name: 'Claude', color: '#cc785c' },
  { id: 'gemini', name: 'Gemini', color: '#4285f4' },
]

const mockMessages = [
  { id: 1, role: 'user', content: 'Help me write a landing page for my startup.' },
  { id: 2, role: 'assistant', content: 'Sure! Tell me about your startup — what does it do and who is your target audience?' },
  { id: 3, role: 'user', content: 'It is an AI memory workspace for developers.' },
  { id: 4, role: 'assistant', content: 'Great concept! Here is a landing page headline:\n\n**"One Memory for Every AI."**\n\nSubheadline: Stop losing context. ContextaAI remembers everything across ChatGPT, Claude, and Gemini — so you never start from scratch.' },
]

export default function ChatArea() {
  const [selectedModel, setSelectedModel] = useState(models[0])
  const [showModelDropdown, setShowModelDropdown] = useState(false)
  const [input, setInput] = useState('')

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
        <span style={{ color: '#888', fontSize: '14px' }}>Landing page copy</span>

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
        {mockMessages.map(message => (
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
              whiteSpace: 'pre-wrap'
            }}>
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          </div>
        ))}
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
          <button style={{
            backgroundColor: '#6c47ff',
            border: 'none',
            borderRadius: '8px',
            padding: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Send size={16} color="white" />
          </button>
        </div>
      </div>
    </div>
  )
}
