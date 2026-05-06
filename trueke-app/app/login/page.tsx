'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/app/lib/supabase'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const [resetSent, setResetSent]       = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  const [showMagicLink, setShowMagicLink] = useState(false)
  const [magicEmail, setMagicEmail]       = useState('')
  const [magicSending, setMagicSending]   = useState(false)
  const [magicSent, setMagicSent]         = useState(false)
  const [magicError, setMagicError]       = useState('')

  const signIn = async () => {
    if (!email.trim() || !password) return
    setLoading(true)
    setError('')

    const { data, error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    setLoading(false)

    if (err) {
      setError('Correo o contraseña incorrectos')
      return
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', data.user.id)
        .single()

      router.push(profile?.username ? '/' : '/onboarding')
    }
  }

  const sendMagicLink = async () => {
    if (!magicEmail.trim()) return
    setMagicSending(true)
    setMagicError('')

    const { error: err } = await supabase.auth.signInWithOtp({ email: magicEmail.trim() })

    setMagicSending(false)

    if (err) {
      setMagicError(err.message)
    } else {
      setMagicSent(true)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.backLink} onClick={() => router.push('/onboarding')}>
        ← Volver
      </div>

      <h1 style={styles.title}>Iniciar sesión</h1>

      <input
        style={styles.input}
        placeholder="correo@ejemplo.com"
        value={email}
        onChange={e => { setEmail(e.target.value); setError('') }}
        type="email"
        autoComplete="email"
      />
      <input
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChange={e => { setPassword(e.target.value); setError('') }}
        type="password"
        autoComplete="current-password"
      />

      {error && <p style={styles.errorText}>{error}</p>}

      <button style={styles.button} onClick={signIn} disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>

      {resetSent ? (
        <p style={{ color: '#16A34A', fontSize: 14, textAlign: 'center', margin: '0 0 24px' }}>
          Revisa tu correo — te enviamos el enlace
        </p>
      ) : (
        <p
          style={{ color: '#F97316', fontSize: 14, textAlign: 'center', cursor: 'pointer', margin: '0 0 24px' }}
          onClick={async () => {
            if (!email.trim() || resetLoading) return
            setResetLoading(true)
            await supabase.auth.resetPasswordForEmail(email.trim())
            setResetLoading(false)
            setResetSent(true)
          }}
        >
          {resetLoading ? 'Enviando...' : '¿Olvidaste tu contraseña?'}
        </p>
      )}

      <div style={styles.separator}>
        <span style={styles.separatorLine} />
        <span style={styles.separatorText}>o</span>
        <span style={styles.separatorLine} />
      </div>

      <button style={styles.buttonOutline} onClick={() => { setShowMagicLink(!showMagicLink); setMagicSent(false); setMagicError('') }}>
        Recibir enlace por email
      </button>

      {showMagicLink && (
        magicSent ? (
          <div style={styles.successMsg}>
            Revisa tu correo — te enviamos un enlace para entrar
          </div>
        ) : (
          <>
            <input
              style={styles.input}
              placeholder="correo@ejemplo.com"
              value={magicEmail}
              onChange={e => { setMagicEmail(e.target.value); setMagicError('') }}
              type="email"
            />
            {magicError && <p style={styles.errorText}>{magicError}</p>}
            <button style={styles.button} onClick={sendMagicLink} disabled={magicSending}>
              {magicSending ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </>
        )
      )}

      <p style={styles.register}>
        ¿No tienes cuenta?{' '}
        <span
          style={{ color: '#F97316', fontWeight: 600, cursor: 'pointer' }}
          onClick={() => router.push('/onboarding')}
        >
          Regístrate
        </span>
      </p>
    </div>
  )
}

const styles: any = {
  container: {
    padding: 24,
    minHeight: '100vh',
    background: '#FDF8F3',
    display: 'flex',
    flexDirection: 'column',
  },

  backLink: {
    color: '#6B7680',
    fontSize: 14,
    cursor: 'pointer',
    marginBottom: 32,
    marginTop: 16,
    padding: '12px 0',
  },

  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#1A2744',
    marginBottom: 24,
  },

  input: {
    width: '100%',
    padding: 14,
    borderRadius: 10,
    border: 'none',
    marginBottom: 16,
    fontSize: 16,
    background: '#F0EAE0',
    boxSizing: 'border-box',
  },

  button: {
    width: '100%',
    padding: 16,
    background: '#F97316',
    color: '#fff',
    border: 'none',
    borderRadius: 16,
    fontWeight: 600,
    fontSize: 16,
    cursor: 'pointer',
    marginBottom: 16,
  },

  buttonOutline: {
    width: '100%',
    padding: 16,
    background: 'transparent',
    color: '#F97316',
    border: '2px solid #F97316',
    borderRadius: 16,
    fontWeight: 600,
    fontSize: 16,
    cursor: 'pointer',
    marginBottom: 16,
  },

  separator: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },

  separatorLine: {
    flex: 1,
    height: 1,
    background: '#ddd',
  },

  separatorText: {
    color: '#9CA3AF',
    fontSize: 13,
    whiteSpace: 'nowrap',
  },

  successMsg: {
    background: '#F0FDF4',
    border: '1px solid #86EFAC',
    color: '#16A34A',
    padding: '14px 16px',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 16,
  },

  register: {
    textAlign: 'center',
    color: '#6B7680',
    fontSize: 14,
    marginTop: 'auto',
    paddingTop: 24,
  },

  errorText: {
    color: '#e53e3e',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
}
