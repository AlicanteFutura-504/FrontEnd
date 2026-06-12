"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBusiness, createBooking } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import Loading from "@/components/ui/Loading";
import { Wifi, Coffee, Waves, CookingPot, Snowflake, Tv, Sparkles, MapPin, Star } from "lucide-react";
import dynamic from "next/dynamic";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale/es";
import { useToast } from "@/components/ui/Toast";

registerLocale("es", es);

const PropertyMap = dynamic(() => import("@/components/ui/PropertyMap"), { ssr: false });

interface ExtendedBusiness {
  id: number;
  nombre: string;
  city?: string;
  address?: string;
  telefono?: string;
  usuarioId: number;
  description?: string;
  pricePerNight?: number;
  maxGuests?: number;
  amenities?: string[];
  images?: string[];
  usuario?: {
    nombreCompleto?: string;
    username: string;
  };
  score?: number;
  isPromoted?: boolean;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;
  
  const { user } = useAuth();
  const [property, setProperty] = useState<ExtendedBusiness | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [occupiedDates, setOccupiedDates] = useState<Date[]>([]);
  const [canReview, setCanReview] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reviews states
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewScore, setReviewScore] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Dynamic pricing
  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const { toast } = useToast();

  // Control de fecha de hoy para los inputs
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchPropertyAndReviews = async () => {
      try {
        setLoading(true);
        const data = await getBusiness(Number(propertyId));
        setProperty(data as any);

        // Eliminada la barra inclinada final potencial para evitar fallos de enrutado/CORS en producción
        const reviewsData = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/properties/${propertyId}/reviews`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
          }
        }).then(r => {
          if (!r.ok) throw new Error("Error al obtener reseñas");
          return r.json();
        });
        setReviews(reviewsData || []);

        const occupiedData = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/bookings/property/${propertyId}/occupied-dates`).then(r => r.json()).catch(() => []);
        setOccupiedDates((Array.isArray(occupiedData) ? occupiedData : []).map((d: string) => new Date(d)));

        if (localStorage.getItem("access_token")) {
          const canRevData = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/properties/${propertyId}/can-review`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
          }).then(r => r.json()).catch(() => ({ canReview: false }));
          setCanReview(canRevData.canReview || false);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Error al cargar la propiedad";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    if (propertyId) fetchPropertyAndReviews();
  }, [propertyId]);

  useEffect(() => {
    if (checkIn && checkOut && property) {
      const d1 = checkIn;
      const d2 = checkOut;
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        setNights(diffDays);
        setTotalPrice(diffDays * Number(property.pricePerNight || 0));
      } else {
        setNights(0);
        setTotalPrice(0);
      }
    } else {
      setNights(0);
      setTotalPrice(0);
    }
  }, [checkIn, checkOut, property]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.info("Por favor, inicia sesión para reservar.");
      router.push("/login");
      return;
    }
    if (!checkIn || !checkOut) {
      toast.error("Por favor, selecciona las fechas de entrada y salida.");
      return;
    }
    setBookingLoading(true);
    try {
      const formatLocal = (d: Date) => {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      };

      await createBooking({
        checkInDate: formatLocal(checkIn),
        checkOutDate: formatLocal(checkOut),
        status: "pending",
        propertyId: Number(propertyId),
        usuarioId: user.id
      });
      toast.success("¡Reserva solicitada con éxito! Está pendiente de confirmación.");
      router.push("/mis-reservas");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      toast.error("Error al reservar: " + message);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmittingReview(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/properties/${propertyId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        },
        body: JSON.stringify({ score: reviewScore, comment: reviewComment })
      });
      if (!res.ok) {
        const errObj = await res.json().catch(() => ({}));
        throw new Error(errObj.message || "Error al enviar reseña");
      }
      toast.success("¡Reseña publicada con éxito!");
      setReviewComment("");
      
      // Refresh reviews and score
      const reviewsData = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/properties/${propertyId}/reviews`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
      }).then(r => r.json());
      setReviews(reviewsData || []);
      
      const propData = await getBusiness(Number(propertyId));
      setProperty(propData as any);
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Loading />;
  if (error || !property) return <div style={{ padding: "40px", textAlign: "center", color: "var(--danger)" }}>{error || "Propiedad no encontrada"}</div>;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "16px" }}>{property.nombre}</h1>
      
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px", fontSize: "1.1rem", alignItems: "center" }}>
        {(property.score && property.score > 0) ? (
          <span style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}><Star size={20} color="#f59e0b" fill="#f59e0b" /> {property.score.toFixed(1)}</span>
        ) : (
          <span style={{ color: "var(--text-muted)" }}>Nueva</span>
        )}
        <span>·</span>
        <span style={{ textDecoration: "underline", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
          <MapPin size={18} /> {property.city ? `${property.city}, España` : "Ubicación no especificada"}
        </span>
      </div>

      {/* 🔴 CRÍTICO: Removidas las imágenes fijas (hardcodeadas) de Unsplash en los paneles laterales */}
      <div style={{ display: "flex", gap: "12px", height: "400px", marginBottom: "40px", borderRadius: "16px", overflow: "hidden" }}>
        <div style={{ flex: 2, background: "#eee" }}>
          <img 
            src={property.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            alt="Main Property Photo"
          />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
          <img 
            src={property.images?.[1] || "https://images.unsplash.com/photo-1502672260266-1c1de2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            alt="Property Secondary View 1" 
          />
          <img 
            src={property.images?.[2] || "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            alt="Property Secondary View 2" 
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: "60px", flexWrap: "wrap" }}>
        <div style={{ flex: 2, minWidth: "300px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "8px" }}>
            Alojamiento entero
          </h2>
          <div style={{ display: "flex", gap: "12px", color: "var(--text-muted)", fontSize: "1rem", marginBottom: "20px" }}>
            <span>{property.maxGuests || 2} huéspedes</span> · 
            <span>{Math.ceil((property.maxGuests || 2) / 2)} habitaciones</span> · 
            <span>{Math.ceil((property.maxGuests || 2) / 2)} camas</span> · 
            <span>{Math.ceil((property.maxGuests || 2) / 3) || 1} baños</span>
          </div>

          <h2 style={{ fontSize: "1.3rem", fontWeight: 600, borderBottom: "1px solid var(--border)", paddingBottom: "20px", marginBottom: "20px" }}>
            Anfitrión: {property.usuario?.nombreCompleto || property.usuario?.username || 'Desconocido'}
          </h2>
          
          <p style={{ lineHeight: 1.6, color: "var(--text)", marginBottom: "40px" }}>
            {property.description || "Un alojamiento excepcional ideal para relajarse y disfrutar de tu tiempo."}
          </p>

          <h3 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "20px" }}>Lo que ofrece este lugar</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", color: "var(--text)" }}>
            {(property.amenities && property.amenities.length > 0 ? property.amenities : ["Wifi", "Piscina", "Cocina", "TV", "Aire acondicionado", "Cafetera"]).map((amenity, i) => {
              let icon: React.ReactNode = <Sparkles size={24} />;
              const lower = amenity.toLowerCase();
              if (lower.includes("wifi")) icon = <Wifi size={24} />;
              else if (lower.includes("caf")) icon = <Coffee size={24} />;
              else if (lower.includes("piscina")) icon = <Waves size={24} />;
              else if (lower.includes("cocina")) icon = <CookingPot size={24} />;
              else if (lower.includes("aire")) icon = <Snowflake size={24} />;
              else if (lower.includes("tv") || lower.includes("televisión")) icon = <Tv size={24} />;
              
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "24px" }}>{icon}</span> 
                  <span style={{ fontSize: "1.05rem" }}>{amenity}</span>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: "40px", padding: "20px", background: "var(--surface-hover)", borderRadius: "12px" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "12px" }}>Privacidad de la Dirección</h3>
            <p style={{ color: "var(--text-muted)" }}>
              Dirección exacta: <strong>{property.address || "La dirección se revelará una vez que tengas una reserva confirmada y pagada."}</strong>
            </p>
          </div>

          <div style={{ marginTop: "40px" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "20px" }}>A dónde irás</h3>
            <PropertyMap city={property.city} />
            <p style={{ marginTop: "12px", color: "var(--text-muted)", fontSize: "0.95rem" }}>
              Ubicación exacta proporcionada después de la reserva.
            </p>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: "300px" }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", position: "sticky", top: "120px" }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 600, marginBottom: "20px" }}>
              {property.pricePerNight || 0} € <span style={{ fontSize: "1rem", fontWeight: 400, color: "var(--text-muted)" }}>noche</span>
            </div>
            
            <form onSubmit={handleBooking} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ border: "1px solid var(--border-strong)", borderRadius: "8px", overflow: "hidden" }}>
                <div style={{ display: "flex", borderBottom: "1px solid var(--border-strong)" }}>
                  <div style={{ flex: 1, padding: "10px", borderRight: "1px solid var(--border-strong)" }}>
                    <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>Llegada</label>
                    <DatePicker 
                      selected={checkIn} 
                      onChange={(date: Date | null) => { setCheckIn(date); if (checkOut && date && date >= checkOut) setCheckOut(null); }} 
                      selectsStart 
                      startDate={checkIn || undefined} 
                      endDate={checkOut || undefined} 
                      minDate={new Date()} 
                      excludeDates={occupiedDates}
                      locale="es"
                      placeholderText="Añade fechas"
                      customInput={<input style={{ width: "100%", border: "none", outline: "none", background: "transparent", marginTop: "4px", color: "var(--text)" }} />}
                      required
                    />
                  </div>
                  <div style={{ flex: 1, padding: "10px" }}>
                    <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>Salida</label>
                    <DatePicker 
                      selected={checkOut} 
                      onChange={(date: Date | null) => setCheckOut(date)} 
                      selectsEnd 
                      startDate={checkIn || undefined} 
                      endDate={checkOut || undefined} 
                      minDate={checkIn || new Date()} 
                      excludeDates={occupiedDates}
                      locale="es"
                      placeholderText="Añade fechas"
                      customInput={<input style={{ width: "100%", border: "none", outline: "none", background: "transparent", marginTop: "4px", color: "var(--text)" }} />}
                      required
                    />
                  </div>
                </div>
              </div>
              
              {nights > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "8px 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
                    <span>{property.pricePerNight} € x {nights} noches</span>
                    <span>{totalPrice} €</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.05rem", borderTop: "1px solid var(--border)", paddingTop: "8px", marginTop: "4px" }}>
                    <span>Total estimado</span>
                    <span>{totalPrice} €</span>
                  </div>
                </div>
              )}

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

      {/* Reviews list & write review */}
      <div style={{ marginTop: "60px", borderTop: "1px solid var(--border)", paddingTop: "40px" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 600, marginBottom: "24px" }}>
          Reseñas ({reviews.length})
        </h2>
        
        {reviews.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px", marginBottom: "40px" }}>
            {reviews.map((rev) => (
              <div key={rev.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "20px", borderRadius: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <img 
                    src={rev.guest?.profilePicture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"} 
                    style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
                    alt={rev.guest?.nombreCompleto || rev.guest?.username}
                  />
                  <div>
                    <div style={{ fontWeight: 600 }}>{rev.guest?.nombreCompleto || rev.guest?.username || "Huésped"}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {new Date(rev.createdAt).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
                    </div>
                  </div>
                </div>
                <div style={{ color: "#f59e0b", fontWeight: 700, marginBottom: "8px" }}>
                  {"★".repeat(rev.score)}{"☆".repeat(5 - rev.score)}
                </div>
                <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.5, color: "var(--text)" }}>{rev.comment}</p>
                
                {rev.hostReply && (
                  <div style={{ marginTop: "16px", padding: "16px", background: "var(--surface-hover)", borderRadius: "12px", borderLeft: "4px solid var(--accent)" }}>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--accent)", marginBottom: "4px" }}>Respuesta del Anfitrión:</div>
                    <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.5, color: "var(--text)" }}>{rev.hostReply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "var(--text-muted)", marginBottom: "40px" }}>No hay reseñas todavía para este alojamiento.</p>
        )}

        {user && user.role === "guest" && canReview && (
          <div style={{ background: "var(--surface-hover)", padding: "24px", borderRadius: "16px", border: "1px solid var(--border-strong)" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "16px" }}>Deja tu opinión</h3>
            <form onSubmit={handleReviewSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>Puntuación</label>
                <select 
                  value={reviewScore} 
                  onChange={e => setReviewScore(Number(e.target.value))}
                  style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)", outline: "none", fontSize: "1rem" }}
                >
                  <option value={5}>★★★★★ (5 - Excelente)</option>
                  <option value={4}>★★★★☆ (4 - Muy bueno)</option>
                  <option value={3}>★★★☆☆ (3 - Bueno)</option>
                  <option value={2}>★★☆☆☆ (2 - Aceptable)</option>
                  <option value={1}>★☆☆☆☆ (1 - Malo)</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>Comentario</label>
                <textarea 
                  rows={4}
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="Comparte tu experiencia en este alojamiento..."
                  maxLength={300}
                  required
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)", outline: "none", fontSize: "1rem", resize: "none" }}
                />
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", alignSelf: "flex-end" }}>Máximo 300 caracteres</span>
              </div>
              <button 
                type="submit" 
                disabled={submittingReview}
                style={{
                  background: 'linear-gradient(135deg, #FF385C, #E61E4D)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: 600,
                  cursor: submittingReview ? 'not-allowed' : 'pointer',
                  alignSelf: "flex-start",
                  opacity: submittingReview ? 0.7 : 1
                }}
              >
                {submittingReview ? "Enviando..." : "Enviar Reseña"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}