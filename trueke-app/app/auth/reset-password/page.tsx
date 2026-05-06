'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/app/lib/supabase'

export default function ResetPasswordPage() {
  const router = useRouter()

  const [ready, setReady]                   = useState(false)
  const [sessionError, setSessionError]     = useState(false)
  const [password, setPassword]             = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError]                   = useState('')
  const [saving, setSaving]                 = useState(false)
  const [success, setSuccess]               = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setSessionError(true)
      }
      setReady(true)
    })
  }, [])

  const handleSubmit = async () => {
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setSaving(true)
    setError('')

    const { error: err } = await supabase.auth.updateUser({ password })

    setSaving(false)

    if (err) {
      setError(err.message)
      return
    }

    setSuccess(true)
    setTimeout(() => router.replace('/login'), 2000)
  }

  if (!ready) {
    return (
      <>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={styles.centered}>
          <div style={styles.spinner} />
        </div>
      </>
    )
  }

  if (sessionError) {
    return (
      <div style={styles.container}>
        <p style={styles.errorBlock}>
          El enlace expiró o ya fue utilizado. Solicita uno nuevo desde la pantalla de inicio de sesión.
        </p>
        <button style={styles.button} onClick={() => router.replace('/login')}>
          Ir al login
        </button>
      </div>
    )
  }

  if (success) {
    return (
      <div style={styles.container}>
        <p style={styles.successBlock}>✅ Contraseña actualizada</p>
        <p style={{ color: '#6B7680', fontSize: 14, textAlign: 'center' }}>
          Redirigiendo al login…
        </p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Nueva contraseña</h1>
      <p style={styles.subtitle}>Elige una contraseña para tu cuenta</p>

      <input
        style={styles.input}
        placeholder="Nueva contraseña"
        value={password}
        onChange={e => { setPassword(e.target.value); setError('') }}
        type="password"
        autoComplete="new-password"
      />
      <input
        style={styles.input}
        placeholder="Confirma tu contraseña"
        value={confirmPassword}
        onChange={e => { setConfirmPassword(e.target.value); setError('') }}
        type="password"
        autoComplete="new-password"
      />

      {error && <p style={styles.errorText}>{error}</p>}

      <button style={styles.button} onClick={handleSubmit} disabled={saving}>
        {saving ? 'Guardando...' : 'Guardar contraseña'}
      </button>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: 24,
    minHeight: '100vh',
    background: '#FDF8F3',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  centered: {
    minHeight: '100vh',
    background: '#FDF8F3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  spinner: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: '3px solid #F0EAE0',
    borderTopColor: '#F97316',
    animation: 'spin 0.8s linear infinite',
  },

  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#1A2744',
    marginBottom: 8,
  },

  subtitle: {
    color: '#6B7680',
    fontSize: 15,
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
  },

  errorText: {
    color: '#e53e3e',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },

  errorBlock: {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    color: '#B91C1C',
    padding: '14px 16px',
    borderRadius: 10,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },

  successBlock: {
    background: '#F0FDF4',
    border: '1px solid #86EFAC',
    color: '#16A34A',
    padding: '14px 16px',
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 600,
    textAlign: 'center',
    marginBottom: 12,
  },
}
