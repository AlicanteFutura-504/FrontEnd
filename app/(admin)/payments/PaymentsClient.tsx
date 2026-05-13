"use client";

import { useState, useMemo } from "react";
import type { Payment, PaymentStatus, PaymentTypeEnum, CreatePaymentDtoReq } from "@/lib/api";
import { createPayment } from "@/lib/api";

interface PaymentsClientProps {
  initialPayments: Payment[];
}

interface KpiCardProps {
  title: string;
  value: string;
  subtitle: string;
  variant?: "positive" | "warning";
}

function KpiCard({ title, value, subtitle, variant }: KpiCardProps) {
  return (
    <div className="kpi-card">
      <p className="kpi-card__label">{title}</p>
      <h3 className="kpi-card__value">{value}</h3>
      <p className={`kpi-card__meta ${variant === "positive" ? "kpi-card__meta--positive" : variant === "warning" ? "kpi-card__meta--warning" : ""}`}>
        {subtitle}
      </p>
    </div>
  );
}

function Badge({ status }: { status: PaymentStatus }) {
  return (
    <span className={`badge badge--${status === "pendiente" ? "pending" : "confirmed"}`}>
      {status === "pendiente" ? "Por cobrar" : "Pagado"}
    </span>
  );
}

function formatDate(dateString?: string) {
  if (!dateString) return "N/A";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);
  } catch {
    return dateString;
  }
}

export default function PaymentsClient({ initialPayments }: PaymentsClientProps) {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [newPayment, setNewPayment] = useState<CreatePaymentDtoReq>({ 
    clientName: "", 
    businessName: "", 
    amount: 0, 
    type: "tarjeta", 
    status: "pagado" 
  });

  const kpis = useMemo(() => {
    let cobrado = 0;
    let pendiente = 0;
    let pagadosCount = 0;
    let pendientesCount = 0;
    
    payments.forEach(p => {
      const val = Number(p.amount) || 0;
      if (p.status === "pagado") {
        cobrado += val;
        pagadosCount++;
      } else {
        pendiente += val;
        pendientesCount++;
      }
    });

    const conversion = payments.length > 0 ? Math.round((pagadosCount / payments.length) * 100) : 0;

    return { cobrado, pendiente, pagadosCount, pendientesCount, conversion };
  }, [payments]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const date = new Date().toISOString().split('T')[0];
      const payload: CreatePaymentDtoReq = {
        ...newPayment,
        date,
      };
      const created = await createPayment(payload);
      setPayments([created, ...payments]);
      setIsModalOpen(false);
      setNewPayment({ clientName: "", businessName: "", amount: 0, type: "tarjeta", status: "pagado" });
    } catch (err) {
      setError("No se pudo guardar el cobro. Verifica los datos o el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <h2>Payments</h2>
          <p>Seguimiento de cobros realizados y pendientes.</p>
        </div>
        <button className="primary-btn" type="button" onClick={() => setIsModalOpen(true)}>
          Registrar cobro
        </button>
      </section>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false) }}>
          <div className="modal-card">
            <h3 className="modal-title" style={{ marginBottom: 16 }}>Registrar nuevo cobro</h3>
            {error && <div className="message-error" style={{ marginBottom: 12 }}>{error}</div>}
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input required className="input" placeholder="Cliente" value={newPayment.clientName} onChange={e => setNewPayment({...newPayment, clientName: e.target.value})} />
              <input required className="input" placeholder="Comercio" value={newPayment.businessName} onChange={e => setNewPayment({...newPayment, businessName: e.target.value})} />
              <input required type="number" min="0" step="0.01" className="input" placeholder="Importe (€)" value={newPayment.amount || ""} onChange={e => setNewPayment({...newPayment, amount: Number(e.target.value)})} />
              <select className="select" value={newPayment.type} onChange={e => setNewPayment({...newPayment, type: e.target.value as PaymentTypeEnum})}>
                <option value="tarjeta">Tarjeta</option>
                <option value="efectivo">Efectivo</option>
                <option value="bizum">Bizum</option>
                <option value="transferencia">Transferencia</option>
                <option value="pendiente">Pendiente</option>
              </select>
              <select className="select" value={newPayment.status} onChange={e => setNewPayment({...newPayment, status: e.target.value as PaymentStatus})}>
                <option value="pagado">Pagado</option>
                <option value="pendiente">Por cobrar</option>
              </select>
              <div className="modal-actions" style={{ marginTop: 8 }}>
                <button type="button" className="secondary-btn" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="primary-btn" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar cobro"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className="kpi-grid">
        <KpiCard title="Cobrado hoy" value={`${kpis.cobrado} €`} subtitle={`${kpis.pagadosCount} operaciones registradas`} variant="positive" />
        <KpiCard title="Pendiente" value={`${kpis.pendiente} €`} subtitle={`${kpis.pendientesCount} cobros por revisar`} variant="warning" />
        <KpiCard title="Método más usado" value="Tarjeta" subtitle="Mayor volumen del día" />
        <KpiCard title="Conversión" value={`${kpis.conversion}%`} subtitle="Cobros cerrados hoy" />
      </section>

      <section className="section-card">
        <div className="panel-title-row">
          <h3 className="panel-title">Listado de cobros</h3>
          <span style={{ color: "#6b7280", fontSize: 14 }}>{payments.length} resultados</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Comercio</th>
              <th>Importe</th>
              <th>Método</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td style={{ fontWeight: 600 }}>{payment.id}</td>
                <td>{payment.clientName}</td>
                <td>{payment.businessName}</td>
                <td>{payment.amount} €</td>
                <td>{payment.type}</td>
                <td>{formatDate(payment.date)}</td>
                <td><Badge status={payment.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
