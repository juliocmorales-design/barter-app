'use client'

import { useRouter } from 'next/navigation'

export default function ItemCard({ item }: { item: any }) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/item/${item.id}`)
  }

  // 🔥 USAR image (igual que ficha)
  const image = item.image
    ? item.image
    : 'https://via.placeholder.com/300?text=Item'

  return (
    <div style={styles.card} onClick={handleClick}>
      <img src={image} style={styles.image} />

      <div style={styles.info}>
        <h3>{item.title}</h3>
        <p>{item.city}</p>
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
  },
  image: {
    width: '100%',
    height: 140,
    objectFit: 'cover'
  },
  info: {
    padding: 10
  }
}