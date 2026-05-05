'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/app/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/login')
    }, 3000)

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      clearTimeout(timeout)

      if (!session) {
        router.replace('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', session.user.id)
        .single()

      if (profile?.username) {
        router.replace('/')
      } else {
        router.replace('/onboarding')
      }
    })

    return () => clearTimeout(timeout)
  }, [router])

  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={styles.container}>
        <svg width={64} height={64} viewBox="0 0 64 64" fill="none">
          <circle cx={32} cy={32} r={32} fill="#F97316" />
          <text
            x={32}
            y={38}
            textAnchor="middle"
            fontSize={28}
            fontWeight={700}
            fill="#fff"
            fontFamily="sans-serif"
          >
            T
          </text>
        </svg>

        <p style={styles.title}>Verificando tu cuenta...</p>
        <p style={styles.subtitle}>Un momento por favor</p>

        <div style={styles.spinner} />
      </div>
    </>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: '#FDF8F3',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: '#1A2744',
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: '#6F7A82',
    margin: 0,
  },
  spinner: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: '3px solid #F0EAE0',
    borderTopColor: '#F97316',
    animation: 'spin 0.8s linear infinite',
  },
}
