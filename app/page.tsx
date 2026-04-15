import Link from "next/link";

const items = [
  {
    id: "1",
    titulo: "Bicicleta de montaña",
    ciudad: "Monterrey",
    imagen: "https://images.unsplash.com/photo-1518655048521-f130df041f66"
  },
  {
    id: "2",
    titulo: "Guitarra acústica",
    ciudad: "San Pedro",
    imagen: "https://images.unsplash.com/photo-1511379938547-c1f69419868d"
  },
  {
    id: "3",
    titulo: "Laptop usada",
    ciudad: "Guadalupe",
    imagen: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8"
  },
  {
    id: "4",
    titulo: "Cámara profesional",
    ciudad: "Apodaca",
    imagen: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32"
  }
];

export default function Home() {
  return (
    <main style={{ padding: 20 }}>
      <h1>🔥 Barter</h1>
      <p>Feed de intercambios</p>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              width: 250,
              overflow: "hidden"
            }}
          >
            <img
              src={item.imagen}
              alt={item.titulo}
              style={{
                width: "100%",
                height: 150,
                objectFit: "cover"
              }}
            />

            <div style={{ padding: 10 }}>
              <h3>{item.titulo}</h3>
              <p>{item.ciudad}</p>

              <Link href={`/item/${item.id}`}>
                Ver detalle →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}