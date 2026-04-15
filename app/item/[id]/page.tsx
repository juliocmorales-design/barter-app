const items = [
  {
    id: "1",
    titulo: "Bicicleta de montaña",
    descripcion: "Ideal para cerros, ciudad y aventura.",
    ciudad: "Monterrey",
    imagen: "https://images.unsplash.com/photo-1518655048521-f130df041f66"
  },
  {
    id: "2",
    titulo: "Guitarra acústica",
    descripcion: "Excelente sonido, perfecta para empezar.",
    ciudad: "San Pedro",
    imagen: "https://images.unsplash.com/photo-1511379938547-c1f69419868d"
  },
  {
    id: "3",
    titulo: "Laptop usada",
    descripcion: "Funciona bien, lista para trabajar o estudiar.",
    ciudad: "Guadalupe",
    imagen: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8"
  },
  {
    id: "4",
    titulo: "Cámara profesional",
    descripcion: "Alta calidad para fotos y video.",
    ciudad: "Apodaca",
    imagen: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32"
  }
];

// 👇 👇 👇 IMPORTANTE: async + await params
export default async function ItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const item = items.find((i) => i.id === id);

  if (!item) {
    return (
      <div style={{ padding: 20 }}>
        ❌ Artículo no encontrado (ID: {id})
      </div>
    );
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>{item.titulo}</h1>

      <img
        src={item.imagen}
        alt={item.titulo}
        style={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 10
        }}
      />

      <p style={{ marginTop: 10 }}>{item.descripcion}</p>
      <p>📍 {item.ciudad}</p>

      <button
        style={{
          marginTop: 20,
          padding: "12px 24px",
          borderRadius: 10,
          border: "none",
          background: "black",
          color: "white",
          cursor: "pointer"
        }}
      >
        Proponer intercambio
      </button>
    </main>
  );
}