"use client";

import { useEffect, useState } from "react";
import { Booking, Review } from "@/lib/types";
import { getReviewsByProperty } from "@/lib/api";
import Badge from "@/components/ui/Badge";
import Loading from "@/components/ui/Loading";

/**
 * Props para el modal de detalles de la reserva.
 */
interface BookingDetailsModalProps {
  booking: Booking;
  businessName: string;
  customerName: string;
  onClose: () => void;
}

/**
 * Formatea una cadena de fecha ISO al formato DD/MM/AAAA en español.
 */
function formatDate(dateStr: string) {
  try {
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

/**
 * Componente modal que muestra los detalles de una reserva y las reseñas
 * que el huésped haya dejado para esa propiedad.
 */
export default function BookingDetailsModal({
  booking,
  businessName,
  customerName,
  onClose,
}: BookingDetailsModalProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true);
        const allReviews = await getReviewsByProperty(booking.propertyId);
        // Filtramos para mostrar solo las reseñas de este huésped
        const guestReviews = allReviews.filter(
          (r) => r.guestId === booking.usuarioId
        );
        setReviews(guestReviews);
      } catch (err) {
        setError("No se pudieron cargar las reseñas.");
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [booking.propertyId, booking.usuarioId]);

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-card" style={{ maxWidth: 600, width: "100%", padding: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h3 className="modal-title" style={{ margin: 0 }}>
              Detalles de la Reserva #{booking.id}
            </h3>
            <p className="modal-text" style={{ marginTop: 4 }}>
              Información completa y reseñas asociadas
            </p>
          </div>
          <button type="button" onClick={onClose} style={{ background: "transparent", border: "none", fontSize: 24, cursor: "pointer", color: "var(--text-muted)" }}>
            &times;
          </button>
        </div>

        {/* Información de la Reserva */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: 16, marginBottom: 24 }}>
          <h4 style={{ margin: "0 0 16px 0", fontSize: 16 }}>Datos principales</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>Propiedad</p>
              <p style={{ margin: 0, fontWeight: 600 }}>{businessName}</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>Huésped</p>
              <p style={{ margin: 0, fontWeight: 600 }}>{customerName}</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>Check-In</p>
              <p style={{ margin: 0, fontWeight: 600 }}>{formatDate(booking.checkInDate)}</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>Check-Out</p>
              <p style={{ margin: 0, fontWeight: 600 }}>{formatDate(booking.checkOutDate)}</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>Estado</p>
              <div style={{ marginTop: 4 }}>
                <Badge status={booking.status} />
              </div>
            </div>
          </div>
        </div>

        {/* Reseñas */}
        <div>
          <h4 style={{ margin: "0 0 16px 0", fontSize: 16 }}>Reseñas del huésped</h4>
          {loading ? (
            <div style={{ padding: 24, display: "flex", justifyContent: "center" }}>
              <Loading text="Cargando reseñas..." />
            </div>
          ) : error ? (
            <div className="message-error">{error}</div>
          ) : reviews.length === 0 ? (
            <div style={{ padding: 24, textAlign: "center", background: "var(--surface)", border: "1px dashed var(--border)", borderRadius: "var(--radius-md)" }}>
              <p style={{ color: "var(--text-muted)", margin: 0 }}>
                El huésped aún no ha dejado ninguna reseña para esta propiedad.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxHeight: 300, overflowY: "auto", paddingRight: 8 }}>
              {reviews.map((review) => (
                <div key={review.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ display: "flex", gap: 4, color: "#eab308" }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} style={{ fontSize: 16 }}>
                          {i < review.score ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: "var(--text)", fontStyle: review.comment ? "normal" : "italic" }}>
                    {review.comment || "Sin comentarios adicionales."}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-actions" style={{ marginTop: 32 }}>
          <button type="button" className="secondary-btn" onClick={onClose} style={{ width: "100%" }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
