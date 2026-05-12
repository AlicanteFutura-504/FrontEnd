"use client";

/**
 * @fileoverview Página del módulo de Payments (cobros).
 * Transformada en Client Component para permitir la interactividad local.
 * @module app/(admin)/payments/page
 */

import { useState, useMemo } from "react";

type PaymentStatus = "pending" | "paid";

type Payment = {
  id: string;
  client: string;
  business: string;
  amount: string;
  method: string;
  date: string;
  status: PaymentStatus;
};

const initialPayments: Payment[] = [
  { id: "COB-001", client: "María López", business: "Peluquería Nova", amount: "28", method: "Tarjeta", date: "15/04/2026", status: "paid" },
  { id: "COB-002", client: "Carlos Pérez", business: "Restaurante Marea", amount: "80", method: "Pendiente", date: "15/04/2026", status: "pending" },
  { id: "COB-003", client: "Lucía Sánchez", business: "Barber Studio", amount: "18", method: "Bizum", date: "15/04/2026", status: "paid" },
  { id: "COB-004", client: "Pedro Ruiz", business: "Peluquería Nova", amount: "45", method: "Efectivo", date: "16/04/2026", status: "paid" },
];

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
    <span className={`badge badge--${status === "pending" ? "pending" : "confirmed"}`}>
      {status === "pending" ? "Por cobrar" : "Pagado"}
    </span>
  );
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newPayment, setNewPayment] = useState({ client: "", business: "", amount: "", method: "Tarjeta", status: "paid" as PaymentStatus });

  // Cálculos dinámicos para los KPIs
  const kpis = useMemo(() => {
    let cobrado = 0;
    let pendiente = 0;
    let pagadosCount = 0;
    let pendientesCount = 0;
    
    payments.forEach(p => {
      const val = parseFloat(p.amount) || 0;
      if (p.status === "paid") {
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

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const date = new Date().toLocaleDateString("es-ES");
    const id = `COB-00${payments.length + 1}`;
    setPayments([{ ...newPayment, id, date, amount: newPayment.amount }, ...payments]);
    setIsModalOpen(false);
    setNewPayment({ client: "", business: "", amount: "", method: "Tarjeta", status: "paid" });
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
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input required className="input" placeholder="Cliente" value={newPayment.client} onChange={e => setNewPayment({...newPayment, client: e.target.value})} />
              <input required className="input" placeholder="Comercio" value={newPayment.business} onChange={e => setNewPayment({...newPayment, business: e.target.value})} />
              <input required type="number" min="0" step="0.01" className="input" placeholder="Importe (€)" value={newPayment.amount} onChange={e => setNewPayment({...newPayment, amount: e.target.value})} />
              <select className="select" value={newPayment.method} onChange={e => setNewPayment({...newPayment, method: e.target.value})}>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Bizum">Bizum</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Pendiente">Pendiente</option>
              </select>
              <select className="select" value={newPayment.status} onChange={e => setNewPayment({...newPayment, status: e.target.value as PaymentStatus})}>
                <option value="paid">Pagado</option>
                <option value="pending">Por cobrar</option>
              </select>
              <div className="modal-actions" style={{ marginTop: 8 }}>
                <button type="button" className="secondary-btn" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="primary-btn">Guardar cobro</button>
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
                <td>{payment.client}</td>
                <td>{payment.business}</td>
                <td>{payment.amount} €</td>
                <td>{payment.method}</td>
                <td>{payment.date}</td>
                <td><Badge status={payment.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}