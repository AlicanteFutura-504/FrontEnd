import { getBusinesses } from "@/lib/api";
import Link from "next/link";
import { Suspense } from "react";

export default async function ClientHome() {
  const { data: businesses } = await getBusinesses(1, 100);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
      <header style={{ marginBottom: 40, textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--text)" }}>Alicante Futura - Reservas</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.2rem", marginTop: 10 }}>Encuentra el negocio ideal y haz tu reserva</p>
      </header>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
        {businesses.map((business) => (
          <Link 
            key={business.id} 
            href={`/business/${business.id}/book`}
            style={{ 
              display: "block",
              padding: 24, 
              background: "var(--surface)", 
              borderRadius: 12, 
              border: "1px solid var(--border)",
              textDecoration: "none",
              color: "inherit",
              transition: "transform 0.2s, box-shadow 0.2s"
            }}
            className="business-card"
          >
            <h2 style={{ fontSize: "1.4rem", marginBottom: 10 }}>{business.nombre}</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: 8 }}>{business.direccion || "Sin dirección"}</p>
            {business.telefono && <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>📞 {business.telefono}</p>}
            <div style={{ marginTop: 20, textAlign: "right" }}>
              <span className="primary-btn" style={{ padding: "8px 16px", fontSize: "0.9rem" }}>Reservar</span>
            </div>
          </Link>
        ))}
      </div>
      
      <style>{`
        .business-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          border-color: var(--primary);
        }
      `}</style>
    </div>
  );
}
