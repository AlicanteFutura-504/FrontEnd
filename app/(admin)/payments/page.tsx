"use client";

/**
 * @fileoverview Página del módulo de Payments (cobros).
 * Conectada al backend mediante la API para persistir los datos.
 * @module app/(admin)/payments/page
 */

import { useState, useMemo, useEffect } from "react";
import { getPayments, createPayment } from "@/lib/api";
import type { Payment, CreatePaymentDto } from "@/lib/api";

type PaymentStatus = "pending" | "paid";

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
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newPayment, setNewPayment] = useState<CreatePaymentDto>({
    client: "",
    business: "",
    amount: 0,
    method: "Tarjeta",
    status: "paid",
  });

  // Carga los cobros desde el backend al montar la página
  useEffect(() => {
    getPayments()
      .then(setPayments)
      .catch(() => setError("No se pudieron cargar los cobros."))
      .finally(() => setLoading(false));
  }, []);

  const kpis = useMemo(() => {
    let cobrado = 0;
    let pendiente = 0;
    let pagadosCount = 0;
    let pendientesCount = 0;

    payments.forEach((p) => {
      const val = Number(p.amount) || 0;
      if (p.status === "paid") {
        cobrado += val;
        pagadosCount++;
      } else {
        pendiente += val;
        pendientesCount++;
      }
    });

    const conversion = payments.length > 0
      ? Math.round((pagadosCount / payments.length) * 100)
      : 0;

    return { cobrado, pendiente, pagadosCount, pendientesCount, conversion };
  }, [payments]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await createPayment(newPayment);
      setPayments([created, ...payments]);
      setIsModalOpen(false);
      setNewPayment({ client: "", business: "", amount: 0, method: "Tarjeta", status: "paid" });
    } catch {
      alert("Error al guardar el cobro. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
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
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
          <div className="modal-card">
            <h3 className="modal-title" style={{ marginBottom: 16 }}>Registrar nuevo cobro</h3>
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input required className="input" placeholder="Cliente" value={newPayment.client}
                onChange={(e) => setNewPayment({ ...newPayment, client: e.target.value })} />
              <input required className="input" placeholder="Comercio" value={newPayment.business}
                onChange={(e) => setNewPayment({ ...newPayment, business: e.target.value })} />
              <input required type="number" min="0" step="0.01" className="input" placeholder="Importe (€)"
                value={newPayment.amount === 0 ? "" : newPayment.amount}
                onChange={(e) => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) || 0 })} />
              <select className="select" value={newPayment.method}
                onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Bizum">Bizum</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Pendiente">Pendiente</option>
              </select>
              <select className="select" value={newPayment.status}
                onChange={(e) => setNewPayment({ ...newPayment, status: e.target.value as PaymentStatus })}>
                <option value="paid">Pagado</option>
                <option value="pending">Por cobrar</option>
              </select>
              <div className="modal-actions" style={{ marginTop: 8 }}>
                <button type="button" className="secondary-btn" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="primary-btn" disabled={saving}>
                  {saving ? "Guardando..." : "Guardar cobro"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className="kpi-grid">
        <KpiCard title="Cobrado hoy" value={`${kpis.cobrado.toFixed(2)} €`} subtitle={`${kpis.pagadosCount} operaciones registradas`} variant="positive" />
        <KpiCard title="Pendiente" value={`${kpis.pendiente.toFixed(2)} €`} subtitle={`${kpis.pendientesCount} cobros por revisar`} variant="warning" />
        <KpiCard title="Total registros" value={`${payments.length}`} subtitle="Cobros en el sistema" />
        <KpiCard title="Conversión" value={`${kpis.conversion}%`} subtitle="Cobros cerrados" />
      </section>

      <section className="section-card">
        <div className="panel-title-row">
          <h3 className="panel-title">Listado de cobros</h3>
          <span style={{ color: "#6b7280", fontSize: 14 }}>{payments.length} resultados</span>
        </div>
        {loading && <p style={{ color: "#6b7280", padding: "2rem", textAlign: "center" }}>Cargando cobros...</p>}
        {error && <p style={{ color: "red", padding: "2rem", textAlign: "center" }}>{error}</p>}
        {!loading && (
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
                  <td style={{ fontWeight: 600 }}>COB-{String(payment.id).padStart(3, "0")}</td>
                  <td>{payment.client}</td>
                  <td>{payment.business}</td>
                  <td>{Number(payment.amount).toFixed(2)} €</td>
                  <td>{payment.method}</td>
                  <td>{payment.date}</td>
                  <td><Badge status={payment.status as PaymentStatus} /></td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", color: "#6b7280", padding: "2rem" }}>
                    No hay cobros registrados todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
