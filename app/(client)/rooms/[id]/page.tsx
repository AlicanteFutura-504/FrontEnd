"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBusiness, createBooking } from "@/lib/api";
import { Business } from "@/lib/types";
import { useAuth } from "@/components/AuthProvider";
import Loading from "@/components/ui/Loading";

interface ExtendedBusiness extends Business {
  score?: number;
  isPromoted?: boolean;
  pricePerNight?: number;
  images?: string[];
  description?: string;
  amenities?: string[];
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;
  
  const { user } = useAuth();
  const [property, setProperty] = useState<ExtendedBusiness | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await getBusiness(Number(propertyId));
        setProperty(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Error al cargar la propiedad";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    if (propertyId) fetchProperty();
  }, [propertyId]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Por favor, inicia sesión para reservar.");
      router.push("/login");
      return;
    }
    if (!checkIn || !checkOut) {
      alert("Por favor, selecciona las fechas de entrada y salida.");
      return;
    }
    setBookingLoading(true);
    try {
      await createBooking({
        checkInDate: checkIn,
        checkOutDate: checkOut,
        status: "pending",
        propertyId: Number(propertyId),
        usuarioId: user.id
      });
      alert("¡Reserva solicitada con éxito! Está pendiente de confirmación.");
      setCheckIn("");
      setCheckOut("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      alert("Error al reservar: " + message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error || !property) return <div style={{ padding: "40px", textAlign: "center", color: "var(--danger)" }}>{error || "Propiedad no encontrada"}</div>;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "16px" }}>{property.nombre}</h1>
      
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px", fontSize: "1.1rem", alignItems: "center" }}>
        {(property.score && property.score > 0) ? (
          <span style={{ fontWeight: 600 }}>★ {property.score.toFixed(1)}</span>
        ) : (
          <span style={{ color: "var(--text-muted)" }}>Nueva</span>
        )}
        <span>·</span>
        <span style={{ textDecoration: "underline", color: "var(--text-muted)" }}>
          {property.city ? `${property.city}, España` : "Ubicación no especificada"}
        </span>
      </div>

      <div style={{ display: "flex", gap: "12px", height: "400px", marginBottom: "40px", borderRadius: "16px", overflow: "hidden" }}>
        <div style={{ flex: 2, background: "#eee" }}>
          <img 
            src={property.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            alt="Main"
          />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
          <img src="https://images.unsplash.com/photo-1502672260266-1c1de2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Side 1" />
          <img src="https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Side 2" />
        </div>
      </div>

      <div style={{ display: "flex", gap: "60px", flexWrap: "wrap" }}>
        <div style={{ flex: 2, minWidth: "300px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, borderBottom: "1px solid var(--border)", paddingBottom: "20px", marginBottom: "20px" }}>
            Anfitrión: {property.usuario?.nombreCompleto || 'Desconocido'}
          </h2>
          
          <p style={{ lineHeight: 1.6, color: "var(--text)", marginBottom: "40px" }}>
            {property.description || "Un alojamiento excepcional ideal para relajarse y disfrutar de tu tiempo."}
          </p>

          <h3 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "20px" }}>Lo que ofrece este lugar</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", color: "var(--text)" }}>
            {(property.amenities || ["Wifi", "Piscina", "Cocina", "TV", "Aire acondicionado"]).map((amenity, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "1.2rem" }}>✨</span> {amenity}
              </div>
            ))}
          </div>

          <div style={{ marginTop: "40px", padding: "20px", background: "var(--surface-hover)", borderRadius: "12px" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "12px" }}>Privacidad de la Dirección</h3>
            <p style={{ color: "var(--text-muted)" }}>
              Dirección exacta: <strong>{property.address || "La dirección se revelará una vez que tengas una reserva confirmada."}</strong>
            </p>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: "300px" }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", position: "sticky", top: "100px" }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 600, marginBottom: "20px" }}>
              {property.pricePerNight || 0} € <span style={{ fontSize: "1rem", fontWeight: 400, color: "var(--text-muted)" }}>noche</span>
            </div>
            
            <form onSubmit={handleBooking} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ border: "1px solid var(--border-strong)", borderRadius: "8px", overflow: "hidden" }}>
                <div style={{ display: "flex", borderBottom: "1px solid var(--border-strong)" }}>
                  <div style={{ flex: 1, padding: "10px", borderRight: "1px solid var(--border-strong)" }}>
                    <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>Llegada</label>
                    <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} required style={{ width: "100%", border: "none", outline: "none", background: "transparent", marginTop: "4px" }} />
                  </div>
                  <div style={{ flex: 1, padding: "10px" }}>
                    <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>Salida</label>
                    <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} required style={{ width: "100%", border: "none", outline: "none", background: "transparent", marginTop: "4px" }} />
                  </div>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={bookingLoading}
                style={{
                  background: 'linear-gradient(135deg, #FF385C, #E61E4D)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '14px',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  cursor: bookingLoading ? 'not-allowed' : 'pointer',
                  opacity: bookingLoading ? 0.7 : 1,
                }}
              >
                {bookingLoading ? "Procesando..." : "Reservar"}
              </button>
            </form>
            
            <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "16px" }}>
              Aún no se te cobrará ningún importe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
