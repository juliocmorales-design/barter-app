'use client'

import { useEffect, useState } from 'react'
import  supabase  from './lib/supabase'
import Link from 'next/link'

export default function Home() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
    } else {
      console.log('ITEMS:', data)
      setItems(data || [])
    }

    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🏠 Home</h2>

      <div style={styles.grid}>
        {items.map((item) => {
          let image = '/images/placeholder.jpg'

          // 🔥 CASO 1: columna "images" (array)
          if (item.images) {
            try {
              const parsed =
                typeof item.images === 'string'
                  ? JSON.parse(item.images)
                  : item.images

              if (Array.isArray(parsed) && parsed.length > 0) {
                image = parsed[0]
              }
            } catch (e) {
              console.log('Error parsing images')
            }
          }

          // 🔥 CASO 2: columna "image" (string)
          if (!image && item.image) {
            image = item.image
          }

          return (
            <Link
              key={item.id}
              href={`/item/${item.id}`}
              style={styles.card}
            >
              <img
                src={image}
                style={styles.image}
                onError={(e) => {
                  e.currentTarget.src = '/images/placeholder.jpg'
                }}
              />

              <div style={styles.content}>
                <div style={styles.itemTitle}>{item.title}</div>
                <div style={styles.city}>
                  {item.city || 'Sin ubicación'}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: 16,
    paddingBottom: 120,
    maxWidth: 500,
    margin: '0 auto'
  },

  title: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 16
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12
  },

  card: {
    background: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    textDecoration: 'none',
    color: 'black',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
  },

  image: {
    width: '100%',
    height: 140,
    objectFit: 'cover'
  },

  content: {
    padding: 10
  },

  itemTitle: {
    fontWeight: 'bold'
  },

  city: {
    fontSize: 12,
    color: '#777',
    marginTop: 4
  }
}