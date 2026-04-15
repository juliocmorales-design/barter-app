import Link from "next/link";

export default function Home() {
  return (
    <main style={{
      background: "#F5F5F4",
      minHeight: "100vh",
      padding: 16,
      paddingBottom: 100,
      fontFamily: "system-ui"
    }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10
        }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#F97316",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff"
          }}>
            🔁
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 600 }}>Barter</h1>
        </div>

        <div style={{ fontSize: 20 }}>
          🔍 🔔
        </div>
      </div>

      {/* FILTROS */}
      <div style={{
        display: "flex",
        gap: 10,
        marginBottom: 16
      }}>
        {["Para ti", "Recientes", "Cercanos"].map((tab, i) => (
          <div key={i} style={{
            padding: "8px 14px",
            borderRadius: 20,
            background: i === 1 ? "#111" : "#E7E5E4",
            color: i === 1 ? "#fff" : "#444",
            fontSize: 14
          }}>
            {tab}
          </div>
        ))}
      </div>

      {/* GRID DE ARTÍCULOS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12
      }}>
        
        {[1,2,3,4].map((item) => (
          <Link 
            key={item} 
            href={`/item/${item}`} 
            style={{ textDecoration: "none" }}
          >
            <div style={{
              background: "#fff",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
            }}>
              
              {/* IMAGEN */}
              <div style={{
                height: 120,
                background: "#DDD"
              }} />

              {/* INFO */}
              <div style={{ padding: 10 }}>
                <div style={{
                  fontWeight: 600,
                  marginBottom: 6,
                  color: "#000"
                }}>
                  Artículo {item}
                </div>

                <div style={{
                  fontSize: 12,
                  color: "#777"
                }}>
                  Monterrey
                </div>
              </div>

            </div>
          </Link>
        ))}

      </div>

      {/* BOTÓN CENTRAL */}
      <div style={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        width: 60,
        height: 60,
        borderRadius: "50%",
        background: "#F97316",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: 28,
        boxShadow: "0 10px 20px rgba(249,115,22,0.4)"
      }}>
        +
      </div>

      {/* NAVBAR */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        background: "#fff",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        borderTop: "1px solid #ddd"
      }}>
        <Link href="/">🏠</Link>
        <Link href="/chat">💬</Link>
        <Link href="/perfil">👤</Link>
      </div>

    </main>
  );
}