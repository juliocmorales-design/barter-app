'use client'

import './globals.css'
import { useEffect } from 'react'
import BottomNav from './components/layout/BottomNav'
import supabase from './lib/supabase'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // 🔥 Ver sesión al cargar
    supabase.auth.getSession().then(({ data }) => {
      console.log('SESSION GLOBAL:', data.session)
    })

    // 🔥 Escuchar cambios de login/logout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('AUTH CHANGE:', session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <html lang="es">
      <body style={styles.body}>
        <div style={styles.app}>
          <div style={styles.content}>
            {children}
          </div>

          <BottomNav />
        </div>
      </body>
    </html>
  )
}

const styles: any = {
  body: {
    margin: 0,
    background: '#cfc7bb',
    display: 'flex',
    justifyContent: 'center'
  },

  app: {
    width: '100%',
    maxWidth: 500,
    background: '#fff',
    minHeight: '100vh',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column'
  },

  content: {
    flex: 1,
    paddingBottom: 80 // 👈 espacio REAL para el BottomNav
  }
}