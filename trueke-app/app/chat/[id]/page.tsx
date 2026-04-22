'use client'

import { useEffect, useState, useRef } from 'react'
import supabase from '@/app/lib/supabase'
import { useParams } from 'next/navigation'

export default function ChatPage() {
  const params = useParams()
  const chatId = params.id

  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState('')
  const [currentUser, setCurrentUser] = useState<string | null>(null)

  const bottomRef = useRef<any>(null)

  // 🔥 AUTH
  useEffect(() => {
    async function initUser() {
      const { data } = await supabase.auth.getUser()
      if (data.user) setCurrentUser(data.user.id)
    }

    initUser()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setCurrentUser(session?.user?.id || null)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  // 🔹 MENSAJES + REALTIME
  useEffect(() => {
    if (!chatId || !currentUser) return

    fetchMessages()

    const channel = supabase
      .channel('chat-' + chatId)

      // 🔥 NUEVOS MENSAJES
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `offer_id=eq.${chatId}`,
        },
        async (payload) => {
          const newMsg = payload.new

          setMessages((prev) => [...prev, newMsg])

          // marcar leído si no es mío
          if (newMsg.sender !== currentUser) {
            await supabase
              .from('messages')
              .update({ is_read: true })
              .eq('id', newMsg.id)
          }
        }
      )

      // 🔥 ACTUALIZACIONES (AQUÍ VIVE EL ✔✔)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `offer_id=eq.${chatId}`,
        },
        (payload) => {
          const updated = payload.new

          setMessages((prev) =>
            prev.map((m) => (m.id === updated.id ? updated : m))
          )
        }
      )

      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [chatId, currentUser])

  async function fetchMessages() {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('offer_id', chatId)
      .order('created_at', { ascending: true })

    setMessages(data || [])

    // marcar como leído al entrar
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('offer_id', chatId)
      .neq('sender', currentUser)
  }

  async function sendMessage() {
    if (!text.trim() || !currentUser) return

    await supabase.from('messages').insert({
      offer_id: chatId,
      sender: currentUser,
      text,
      is_read: false,
    })

    setText('')
  }

  function handleKeyDown(e: any) {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessage()
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>💬 Chat</h2>

      <div style={styles.messages}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignSelf:
                msg.sender === currentUser ? 'flex-end' : 'flex-start',
              maxWidth: '70%',
            }}
          >
            <div
              style={{
                ...styles.bubble,
                background:
                  msg.sender === currentUser ? '#22c55e' : '#e5e7eb',
                color: msg.sender === currentUser ? '#fff' : '#000',
              }}
            >
              {msg.text}
            </div>

            {msg.sender === currentUser && (
              <span style={styles.check}>
                {msg.is_read ? '✔✔' : '✔'}
              </span>
            )}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      <div style={styles.inputBar}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe mensaje..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>
          Enviar
        </button>
      </div>
    </div>
  )
}

const styles: any = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: '#f3f4f6',
  },

  header: {
    padding: 16,
    fontSize: 20,
    fontWeight: 'bold',
  },

  messages: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: 16,
    gap: 10,
    overflowY: 'auto',
    paddingBottom: 100,
  },

  bubble: {
    padding: '10px 14px',
    borderRadius: 16,
  },

  check: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
    alignSelf: 'flex-end',
  },

  inputBar: {
    position: 'fixed',
    bottom: 80,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 500,
    display: 'flex',
    padding: 10,
    background: '#fff',
    borderTop: '1px solid #ddd',
  },

  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: '1px solid #ccc',
  },

  button: {
    marginLeft: 10,
    padding: '10px 16px',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
  },
}