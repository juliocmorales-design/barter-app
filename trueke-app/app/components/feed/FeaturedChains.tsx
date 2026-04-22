'use client'

export default function FeaturedChains() {
  const chains = [
    {
      id: 1,
      title: 'De libro a bicicleta',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    },
    {
      id: 2,
      title: 'De audífonos a laptop',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    },
  ]

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Cadenas destacadas</h3>

      <div style={styles.scroll}>
        {chains.map((chain) => (
          <div key={chain.id} style={styles.card}>
            <img src={chain.image} style={styles.image} />
            <p style={styles.text}>{chain.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// 🔥 TIPADO FLEXIBLE PARA EVITAR ERRORES
const styles: any = {
  container: {
    padding: 12,
  },

  title: {
    fontWeight: 'bold',
    marginBottom: 10,
  },

  scroll: {
    display: 'flex',
    gap: 10,
    overflowX: 'auto',
  },

  card: {
    minWidth: 140,
    background: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: 90,
    objectFit: 'cover',
  },

  text: {
    fontSize: 12,
    padding: 6,
  },
}