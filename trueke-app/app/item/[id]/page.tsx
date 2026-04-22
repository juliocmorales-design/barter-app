'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import  supabase from '../../lib/supabase'

export default function ExchangePage() {
  const params = useParams()
  const router = useRouter()

  const targetId = Number(params.id)

  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error) setItems(data || [])

      setLoading(false)
    }

    fetchItems()
  }, [])

  const handleSelect = async (myItemId: number) => {
    if (myItemId === targetId) {
      alert('No puedes intercambiar el mismo item')
      return
    }

    const { error } = await supabase
      .from('offers')
      .insert([
        {
          from_item_id: myItemId,
          to_item_id: targetId,
          status: 'pending'
        }
      ])

    if (error) {
      console.error(error)
      alert('Error creando intercambio')
      return
    }

    alert('Intercambio propuesto 🔥')

    router.push('/')
  }

  if (loading) {
    return <div style={{ padding: 20 }}>Cargando...</div>
  }

  return (
    <div style={{ padding: 16, paddingBottom: 120 }}>
      <h2>Selecciona tu item</h2>

      <div style={styles.grid}>
        {items.map(item => {
          const image =
            Array.isArray(item.images) && item.images.length > 0
              ? item.images[0]
              : '/images/placeholder.jpg'

          return (
            <div
              key={item.id}
              style={styles.card}
              onClick={() => handleSelect(item.id)}
            >
              <img src={image} style={styles.image} />

              <div style={{ padding: 8 }}>
                <div style={{ fontWeight: 'bold' }}>
                  {item.title}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12
  },

  card: {
    background: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    cursor: 'pointer'
  },

  image: {
    width: '100%',
    height: 120,
    objectFit: 'cover'
  }
}