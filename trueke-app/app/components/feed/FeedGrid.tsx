'use client'

import Link from 'next/link'

type Item = {
  id: number
  title: string
  description: string
  image?: string | null
  images?: string[] | null
  city?: string | null
}

export default function FeedGrid({ items }: { items: Item[] }) {
  return (
    <div style={styles.grid}>
      {items.map((item) => {
        const image =
          item.image ||
          (item.images && item.images.length > 0 ? item.images[0] : null) ||
          '/images/placeholder.jpg'

        return (
          <Link key={item.id} href={`/item/${item.id}`} style={styles.card}>
            <img src={image} style={styles.image} />

            <div style={styles.content}>
              <div style={styles.title}>{item.title}</div>
              <div style={styles.city}>{item.city || 'Sin ubicación'}</div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  },
  card: {
    background: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    textDecoration: 'none',
    color: 'black',
    boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
  },
  image: {
    width: '100%',
    height: 140,
    objectFit: 'cover',
  },
  content: {
    padding: 10,
  },
  title: {
    fontWeight: 600,
  },
  city: {
    fontSize: 12,
    color: '#777',
  },
}