'use client'

import { useEffect, useState } from 'react'
import supabase from '@/app/lib/supabase'
import { useRouter } from 'next/navigation'

export default function MensajesPage() {
  const [conversaciones, setConversaciones] = useState<any[]>([])
  const [totalUnread, setTotalUnread] = useState(0)
  const router = useRouter()

  const CURRENT_USER = 'user_1'

  useEffect(() => {
    cargar()

    const channel = supabase
      .channel('mensajes')
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
    const { data: offers } = await supabase.from('offers').select('*')

    if (!offers) return

    const lista: any[] = []
    let unreadGlobal = 0

    for (let offer of offers) {
      const { data: fromItem } = await supabase
        .from('items')
        .select('*')
        .eq('id', offer.from_item_id)
        .single()

      const { data: toItem } = await supabase
        .from('items')
        .select('*')
        .eq('id', offer.to_item_id)
        .single()

      if (!fromItem || !toItem) continue

      if (
        fromItem.user_id !== CURRENT_USER &&
        toItem.user_id !== CURRENT_USER
      )
        continue

      const { data: mensajes } = await supabase
        .from('messages')
        .select('*')
        .eq('offer_id', offer.id)
        .order('created_at', { ascending: false })

      const lastMsg = mensajes?.[0]

      const unreadCount = mensajes?.filter(
        (m) => m.sender !== CURRENT_USER && !m.is_read
      ).length || 0

      unreadGlobal += unreadCount

      lista.push({
        offer,
        fromItem,
        toItem,
        lastMsg,
        unreadCount,
        lastDate: lastMsg?.created_at || offer.created_at,
      })
    }

    lista.sort(
      (a, b) =>
        new Date(b.lastDate).getTime() -
        new Date(a.lastDate).getTime()
    )

    setConversaciones(lista)
    setTotalUnread(unreadGlobal)
  }

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold' }}>
        💬 Mensajes {totalUnread > 0 && `🔴 ${totalUnread}`}
      </h1>

      <div style={{ marginTop: 20 }}>
        {conversaciones.map((c, i) => (
          <div
            key={i}
            onClick={() => router.push(`/chat/${c.offer.id}`)}
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: 12,
              marginBottom: 12,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <img
                  src={c.fromItem.images?.[0] || 'https://via.placeholder.com/100'}
                  style={{ width: 60, height: 60, borderRadius: 8 }}
                />
                <p style={{ fontSize: 12 }}>{c.fromItem.title}</p>
              </div>

              <span>🔁</span>

              <div>
                <img
                  src={c.toItem.images?.[0] || 'https://via.placeholder.com/100'}
                  style={{ width: 60, height: 60, borderRadius: 8 }}
                />
                <p style={{ fontSize: 12 }}>{c.toItem.title}</p>
              </div>
            </div>

            <p style={{ fontSize: 12 }}>Estado: {c.offer.status}</p>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p>{c.lastMsg?.text || 'Sin mensajes'}</p>

              {c.unreadCount > 0 && (
                <span
                  style={{
                    background: 'red',
                    color: '#fff',
                    borderRadius: 10,
                    padding: '2px 8px',
                    fontSize: 12,
                  }}
                >
                  {c.unreadCount}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}