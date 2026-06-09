'use client'

import { useState } from 'react'
import Image from 'next/image'
import { supabase } from '../lib/supabase'

interface AuthPageProps {
  onGuestContinue: () => void
}

export default function AuthPage({ onGuestContinue }: AuthPageProps) {
  const [mode, setMode] = useState<'landing' | 'login' | 'signup'>('landing')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSignup = async () => {
    if (!email || !password) return setError('Please fill in all fields')
    if (password.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
    else setSuccess('Account created! Logging you in...')
    setLoading(false)
  }

  const handleLogin = async () => {
    if (!email || !password) return setError('Please fill in all fields')
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div style={{ height: '100vh', backgroundColor: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '0 24px' }}>

        {/* Logo + Name */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px', gap: '16px' }}>
          <Image src="/logo.png" alt="ContextaAI" width={240} height={240} quality={100} style={{ width: '72px', height: '72px', borderRadius: '16px' }} />
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff' }}>ContextaAI</div>
          <div style={{ fontSize: '14px', color: '#555', textAlign: 'center' }}>One memory for every AI.</div>
        </div>

        {mode === 'landing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => setMode('signup')}
              style={{ width: '100%', backgroundColor: '#6c47ff', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
            >
              Create account
            </button>
            <button
              onClick={() => setMode('login')}
              style={{ width: '100%', backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}
            >
              Log in
            </button>
            <div style={{ textAlign: 'center', margin: '8px 0', color: '#333', fontSize: '13px' }}>or</div>
            <button
              onClick={onGuestContinue}
              style={{ width: '100%', backgroundColor: 'transparent', color: '#555', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '14px', fontSize: '14px', cursor: 'pointer' }}
            >
              Continue as guest · 10 free messages
            </button>
          </div>
        )}

        {(mode === 'login' || mode === 'signup') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '14px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (mode === 'login' ? handleLogin() : handleSignup())}
              style={{ width: '100%', backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '14px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />

            {error && <div style={{ color: '#ff4444', fontSize: '13px', textAlign: 'center' }}>{error}</div>}
            {success && <div style={{ color: '#44ff88', fontSize: '13px', textAlign: 'center' }}>{success}</div>}

            <button
              onClick={mode === 'login' ? handleLogin : handleSignup}
              disabled={loading}
              style={{ width: '100%', backgroundColor: loading ? '#333' : '#6c47ff', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? '...' : mode === 'login' ? 'Log in' : 'Create account'}
            </button>

            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess('') }}
              style={{ background: 'transparent', border: 'none', color: '#555', fontSize: '13px', cursor: 'pointer', textAlign: 'center' }}
            >
              {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
            </button>

            <button
              onClick={() => { setMode('landing'); setError(''); setSuccess('') }}
              style={{ background: 'transparent', border: 'none', color: '#333', fontSize: '13px', cursor: 'pointer', textAlign: 'center' }}
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}