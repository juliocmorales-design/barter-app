'use client'

import { useState } from 'react'

export default function PerfilPage() {
  const [tab, setTab] = useState<'objetos' | 'cadenas'>('objetos')

  const objetos = [
    { id: 1, title: 'Bicicleta', image: '/images/bike.jpg' },
    { id: 2, title: 'Libros', image: '/images/books.jpg' },
  ]

  const cadenas = [
    {
      id: 1,
      from: 'Libro',
      to: 'Bicicleta',
      steps: 3,
    },
    {
      id: 2,
      from: 'Audífonos',
      to: 'Laptop',
      steps: 5,
    },
  ]

  return (
    <div style={styles.container}>
      {/* Header perfil */}
      <div style={styles.header}>
        <img src="/images/bike.jpg" style={styles.avatar} />

        <div>
          <div style={styles.name}>Carlos Gómez</div>
          <div style={styles.trust}>92 · Muy confiable</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={tab === 'objetos' ? styles.tabActive : styles.tab}
          onClick={() => setTab('objetos')}
        >
          Objetos
        </button>

        <button
          style={tab === 'cadenas' ? styles.tabActive : styles.tab}
          onClick={() => setTab('cadenas')}
        >
          Cadenas
        </button>
      </div>

      {/* Contenido */}
      {tab === 'objetos' && (
        <div style={styles.grid}>
          {objetos.map((item) => (
            <div key={item.id} style={styles.card}>
              <img src={item.image} style={styles.image} />
              <div style={styles.itemTitle}>{item.title}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'cadenas' && (
        <div style={styles.list}>
          {cadenas.map((chain) => (
            <div key={chain.id} style={styles.chainCard}>
              <div style={styles.chainTitle}>
                {chain.from} → {chain.to}
              </div>

              <div style={styles.chainSteps}>
                🔁 {chain.steps} intercambios
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    padding: 16,
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: '50%',
    objectFit: 'cover' as const,
  },

  name: {
    fontSize: 18,
    fontWeight: 700,
  },

  trust: {
    fontSize: 13,
    color: '#22C55E',
  },

  tabs: {
    display: 'flex',
    gap: 10,
    marginBottom: 16,
  },

  tab: {
    padding: '8px 12px',
    borderRadius: 10,
    border: '1px solid #ddd',
    background: '#fff',
  },

  tabActive: {
    padding: '8px 12px',
    borderRadius: 10,
    border: 'none',
    background: '#F97316',
    color: '#fff',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
  },

  card: {
    borderRadius: 12,
    overflow: 'hidden',
    background: '#fff',
  },

  image: {
    width: '100%',
    height: 100,
    objectFit: 'cover' as const,
  },

  itemTitle: {
    padding: 8,
    fontSize: 13,
    fontWeight: 600,
  },

  list: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 10,
  },

  chainCard: {
    padding: 12,
    borderRadius: 12,
    background: '#FFF7ED',
  },

  chainTitle: {
    fontWeight: 600,
  },

  chainSteps: {
    fontSize: 12,
    color: '#6B7280',
  },
}