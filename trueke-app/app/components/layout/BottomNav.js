'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import supabase from '@/app/lib/supabase'

export default function BottomNav() {
  const [unread, setUnread] = useState(0)

  const CURRENT_USER = 'user_2'

  useEffect(() => {
    cargar()

    const channel = supabase
      .channel('global-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        () => cargar()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function cargar() {
    const { data } = await supabase
      .from('messages')
      .select('*')

    if (!data) return

    const count = data.filter(
      (m) => m.sender !== CURRENT_USER && !m.is_read
    ).length

    setUnread(count)
  }

  return (
    <div style={styles.container}>
      <Link href="/" style={styles.link}>Inicio</Link>
      <Link href="/intercambios" style={styles.link}>Intercambios</Link>

      <Link href="/mensajes" style={styles.link}>
        Mensajes
        {unread > 0 && (
          <span style={styles.badge}>{unread}</span>
        )}
      </Link>

      <Link href="/perfil" style={styles.link}>Perfil</Link>

      <div style={styles.fab}>+</div>
    </div>
  )
}

const styles = {
  container: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 500,
    height: 60,
    background: '#fff',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTop: '1px solid #ddd',
    zIndex: 100,
  },

  link: {
    position: 'relative',
    textDecoration: 'none',
    color: '#333',
    fontSize: 14,
  },

  badge: {
    position: 'absolute',
    top: -8,
    right: -12,
    background: 'red',
    color: '#fff',
    borderRadius: 10,
    padding: '2px 6px',
    fontSize: 10,
    fontWeight: 'bold',
  },

  fab: {
    position: 'absolute',
    top: -25,
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#ff7a00',
    color: '#fff',
    width: 55,
    height: 55,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  },
}