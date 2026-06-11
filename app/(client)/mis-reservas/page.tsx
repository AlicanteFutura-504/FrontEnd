"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getBookingsByCustomer, updateBooking, updatePayment } from "@/lib/api";
import { Booking } from "@/lib/types";
import Loading from "@/components/ui/Loading";

export default function MisReservasPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Payment Modal states
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [paymentType, setPaymentType] = useState<"tarjeta" | "bizum" | "transferencia">("tarjeta");
  const [paying, setPaying] = useState(false);

  const fetchBookings = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getBookingsByCustomer(user.id);
      setBookings(data || []);
    } catch (e) {
      console.error("Error al cargar reservas:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm("¿Estás seguro de que deseas cancelar esta reserva?")) return;
    try {
      await updateBooking(bookingId, { status: "cancelled" });
      alert("Reserva cancelada con éxito.");
      fetchBookings();
    } catch (e: any) {
      alert("Error al cancelar: " + e.message);
    }
  };

  const handleOpenPay = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowPayModal(true);
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking || !selectedBooking.payment) return;
    setPaying(true);
    try {
      await updatePayment(selectedBooking.payment.id, {
        status: "pagado",
        type: paymentType
      });
      alert("¡Pago realizado con éxito!");
      setShowPayModal(false);
      setSelectedBooking(null);
      fetchBookings();
    } catch (e: any) {
      alert("Error al realizar el pago: " + e.message);
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <Loading />;

  const activeBookings = bookings.filter(b => b.status !== "cancelled" && b.status !== "completed");
  const completedBookings = bookings.filter(b => b.status === "completed");
  const cancelledBookings = bookings.filter(b => b.status === "cancelled");

  const getStatusBadge = (status: string) => {
    let text = status;
    let bg = "var(--border-strong)";
    let fg = "var(--text)";

    if (status === "pending") {
      text = "Pendiente";
      bg = "rgba(23,162,184,0.1)";
      fg = "#17a2b8";
    } else if (status === "confirmed") {
      text = "Confirmada";
      bg = "rgba(40,167,69,0.1)";
      fg = "#28a745";
    } else if (status === "completed") {
      text = "Completada";
      bg = "rgba(108,117,125,0.1)";
      fg = "#6c757d";
    } else if (status === "cancelled") {
      text = "Cancelada";
      bg = "rgba(220,53,69,0.1)";
      fg = "#dc3545";
    } else if (status === "modified") {
      text = "Modificada";
      bg = "rgba(255,193,7,0.1)";
      fg = "#ffc107";
    }

    return (
      <span style={{ background: bg, color: fg, padding: "4px 10px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 700 }}>
        {text}
      </span>
    );
  };

  const renderBookingCard = (b: Booking) => {
    const isPendingPayment = b.payment && b.payment.status === "pendiente";
    
    return (
      <div key={b.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
              {b.propertyName || (b.property as any)?.nombre || `Propiedad #${b.propertyId}`}
            </h3>
            <p style={{ color: "var(--text-muted)", margin: "4px 0 0 0", fontSize: "0.95rem" }}>
              📍 {(b.property as any)?.city || "Alicante"}
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {getStatusBadge(b.status)}
            {b.payment && (
              <span style={{ 
                background: b.payment.status === "pagado" ? "rgba(40,167,69,0.1)" : "rgba(255,193,7,0.1)", 
                color: b.payment.status === "pagado" ? "#28a745" : "#d39e00", 
                padding: "4px 10px", 
                borderRadius: "8px", 
                fontSize: "0.85rem", 
                fontWeight: 700 
              }}>
                {b.payment.status === "pagado" ? "Pagado" : "Pago Pendiente"}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: "24px", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "16px 0", flexWrap: "wrap" }}>
          <div>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "var(--text-muted)" }}>Fecha Llegada</span>
            <div style={{ fontWeight: 600, fontSize: "1.05rem", marginTop: "4px" }}>
              {new Date(b.checkInDate).toLocaleDateString("es-ES", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "var(--text-muted)" }}>Fecha Salida</span>
            <div style={{ fontWeight: 600, fontSize: "1.05rem", marginTop: "4px" }}>
              {new Date(b.checkOutDate).toLocaleDateString("es-ES", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
          </div>
          {b.payment && (
            <div>
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "var(--text-muted)" }}>Importe Estancia</span>
              <div style={{ fontWeight: 700, fontSize: "1.1rem", marginTop: "4px", color: "var(--text)" }}>
                {b.payment.amount} €
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          {isPendingPayment && b.status !== "cancelled" && (
            <button 
              onClick={() => handleOpenPay(b)}
              style={{
                background: "linear-gradient(135deg, #FF385C, #E61E4D)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "10px 20px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(255, 56, 92, 0.3)"
              }}
            >
              💸 Realizar Pago
            </button>
          )}

          {(b.status === "pending" || b.status === "confirmed" || b.status === "modified") && (
            <button 
              onClick={() => handleCancelBooking(b.id)}
              style={{
                background: "transparent",
                color: "var(--danger)",
                border: "1px solid var(--danger)",
                borderRadius: "8px",
                padding: "10px 20px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Cancelar Reserva
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px", width: "100%" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>Mis Reservas</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "32px" }}>Gestiona tus solicitudes de estancias, pagos e historial de reservas.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        {/* Activas */}
        <section>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            📅 Activas/Pendientes
            <span style={{ fontSize: "0.9rem", background: "var(--surface-active)", padding: "2px 8px", borderRadius: "100px", color: "var(--text)" }}>
              {activeBookings.length}
            </span>
          </h2>
          {activeBookings.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {activeBookings.map(renderBookingCard)}
            </div>
          ) : (
            <div style={{ padding: "32px", border: "1px dashed var(--border-strong)", borderRadius: "12px", textAlign: "center", color: "var(--text-muted)" }}>
              No tienes ninguna reserva activa en este momento.
            </div>
          )}
        </section>

        {/* Completadas */}
        {completedBookings.length > 0 && (
          <section>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "16px", color: "var(--text-muted)" }}>
              ✓ Completadas
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {completedBookings.map(renderBookingCard)}
            </div>
          </section>
        )}

        {/* Canceladas */}
        {cancelledBookings.length > 0 && (
          <section>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "16px", color: "var(--text-muted)" }}>
              ✗ Canceladas
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {cancelledBookings.map(renderBookingCard)}
            </div>
          </section>
        )}
      </div>

      {/* Payment Modal */}
      {showPayModal && selectedBooking && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "grid", placeItems: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "20px", padding: "32px", maxWidth: "450px", width: "100%", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "8px" }}>Completar Pago</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "24px" }}>
              Introduce los datos para realizar el pago de la reserva en <strong>{selectedBooking.propertyName || (selectedBooking.property as any)?.nombre}</strong>.
            </p>

            <form onSubmit={handleConfirmPayment} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px" }}>Método de Pago</label>
                <div style={{ display: "flex", gap: "12px" }}>
                  {(["tarjeta", "bizum", "transferencia"] as const).map((method) => (
                    <label 
                      key={method} 
                      style={{ 
                        flex: 1, 
                        border: paymentType === method ? "2px solid #FF385C" : "1px solid var(--border-strong)",
                        borderRadius: "10px", 
                        padding: "12px 8px", 
                        textAlign: "center", 
                        cursor: "pointer",
                        textTransform: "capitalize",
                        fontWeight: 600,
                        background: paymentType === method ? "rgba(255, 56, 92, 0.05)" : "transparent"
                      }}
                    >
                      <input 
                        type="radio" 
                        name="payment_method" 
                        checked={paymentType === method} 
                        onChange={() => setPaymentType(method)}
                        style={{ display: "none" }}
                      />
                      {method}
                    </label>
                  ))}
                </div>
              </div>

              {paymentType === "tarjeta" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "4px" }}>Número de Tarjeta</label>
                    <input type="text" placeholder="4000 1234 5678 9010" required style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)" }} />
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "4px" }}>Expiración</label>
                      <input type="text" placeholder="MM/AA" required style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "4px" }}>CVV</label>
                      <input type="text" placeholder="123" required style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)" }} />
                    </div>
                  </div>
                </div>
              )}

              {paymentType === "bizum" && (
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "4px" }}>Número de Teléfono</label>
                  <input type="text" placeholder="600 000 000" required style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)" }} />
                </div>
              )}

              {paymentType === "transferencia" && (
                <div style={{ background: "var(--surface-hover)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", fontWeight: 600 }}>IBAN para la transferencia:</p>
                  <code style={{ fontSize: "0.9rem", color: "var(--text)", wordBreak: "break-all" }}>ES21 1234 5678 9012 3456 7890</code>
                </div>
              )}

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px", marginTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Total a pagar:</span>
                  <div style={{ fontSize: "1.45rem", fontWeight: 800 }}>{selectedBooking.payment.amount} €</div>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button 
                    type="button" 
                    onClick={() => setShowPayModal(false)}
                    style={{ background: "transparent", color: "var(--text)", border: "1px solid var(--border-strong)", borderRadius: "8px", padding: "10px 16px", fontWeight: 600, cursor: "pointer" }}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    disabled={paying}
                    style={{ background: "linear-gradient(135deg, #28a745, #218838)", color: "white", border: "none", borderRadius: "8px", padding: "10px 20px", fontWeight: 600, cursor: paying ? "not-allowed" : "pointer", opacity: paying ? 0.7 : 1 }}
                  >
                    {paying ? "Procesando..." : "Confirmar Pago"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
