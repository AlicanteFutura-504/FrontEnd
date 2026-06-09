"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getBusiness, createBooking } from "@/lib/api";
import type { Business } from "@/lib/types";

export default function ClientBookPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    date: "",
    time: "",
    serviceName: "",
    paymentOption: "pending" // "pending" o "pay_now"
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({ card: "", exp: "", cvc: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getBusiness(Number(params.id))
      .then((data) => {
        setBusiness(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.paymentOption === "pay_now") {
      setShowPaymentModal(true);
    } else {
      await processBooking("pending");
    }
  };

  const processBooking = async (status: "pending" | "paid") => {
    setIsSubmitting(true);
    try {
      // Nota: Asume que el usuario está logueado como cliente y el backend sacará el usuarioId del token
      // Si no, habrá que mandarlo. Por ahora envíamos usuarioId = 1 (dummy) si no hay sistema real de session
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      await createBooking({
        date: form.date,
        time: form.time,
        serviceName: form.serviceName,
        status: status === "paid" ? "paid" : "pending",
        businessId: Number(params.id),
        usuarioId: user.id || 1, // Placeholder
      });
      alert("¡Reserva completada con éxito!");
      router.push("/client");
    } catch (e) {
      console.error(e);
      alert("Error al crear reserva");
    } finally {
      setIsSubmitting(false);
      setShowPaymentModal(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await processBooking("paid");
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Cargando propiedad...</div>;
  if (!business) return <div style={{ padding: 40, textAlign: "center" }}>Propiedad no encontrado.</div>;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 24, background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)" }}>
      <h1 style={{ fontSize: "1.8rem", marginBottom: 10 }}>Reservar en {business.nombre}</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 30 }}>Completa los datos para agendar tu cita.</p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <label className="label">Servicio</label>
          <input 
            type="text" 
            className="input" 
            placeholder="Ej. Corte de pelo, Consulta..." 
            value={form.serviceName}
            onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
            required 
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div>
            <label className="label">Fecha</label>
            <input 
              type="date" 
              className="input" 
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required 
            />
          </div>
          <div>
            <label className="label">Hora</label>
            <input 
              type="time" 
              className="input" 
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              required 
            />
          </div>
        </div>

        <div>
          <label className="label">Opción de Pago</label>
          <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input 
                type="radio" 
                name="payment" 
                value="pending" 
                checked={form.paymentOption === "pending"}
                onChange={() => setForm({ ...form, paymentOption: "pending" })}
              />
              Pagar en el local
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input 
                type="radio" 
                name="payment" 
                value="pay_now" 
                checked={form.paymentOption === "pay_now"}
                onChange={() => setForm({ ...form, paymentOption: "pay_now" })}
              />
              Pagar ahora (Tarjeta)
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          className="primary-btn" 
          style={{ padding: "12px", fontSize: "1.1rem", marginTop: 10 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Procesando..." : (form.paymentOption === "pay_now" ? "Proceder al Pago" : "Confirmar Reserva")}
        </button>
      </form>

      {/* MODAL DE PAGO FICTICIO */}
      {showPaymentModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "var(--surface)", padding: 30, borderRadius: 16, width: "100%", maxWidth: 400, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: 5 }}>Pago Seguro Ficticio</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: 20, fontSize: "0.9rem" }}>Esta es una pasarela de prueba.</p>
            
            <form onSubmit={handlePaymentSubmit}>
              <div style={{ marginBottom: 15 }}>
                <label className="label" style={{ fontSize: "0.85rem" }}>Número de Tarjeta</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="4242 4242 4242 4242" 
                  value={paymentData.card}
                  onChange={(e) => setPaymentData({ ...paymentData, card: e.target.value })}
                  maxLength={19}
                  required 
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginBottom: 25 }}>
                <div>
                  <label className="label" style={{ fontSize: "0.85rem" }}>Caducidad</label>
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="MM/YY" 
                    value={paymentData.exp}
                    onChange={(e) => setPaymentData({ ...paymentData, exp: e.target.value })}
                    maxLength={5}
                    required 
                  />
                </div>
                <div>
                  <label className="label" style={{ fontSize: "0.85rem" }}>CVC</label>
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="123" 
                    value={paymentData.cvc}
                    onChange={(e) => setPaymentData({ ...paymentData, cvc: e.target.value })}
                    maxLength={4}
                    required 
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button 
                  type="button" 
                  className="secondary-btn" 
                  style={{ flex: 1, padding: "12px" }}
                  onClick={() => setShowPaymentModal(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="primary-btn" 
                  style={{ flex: 1, padding: "12px", background: "#10b981", borderColor: "#10b981" }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Pagando..." : "Pagar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
