"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPayments } from "@/lib/api";
import { Payment } from "@/lib/types";
import KpiCard from "@/components/ui/KpiCard";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

export default function BusinessPaymentsPage() {
  const params = useParams();
  const businessId = params.id as string;
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getPayments();
        const filtered = data.filter(p => String(p.businessId) === businessId);
        setPayments(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (businessId) fetchPayments();
  }, [businessId]);

  if (loading) return <div className="p-8">Cargando pagos...</div>;

  const stats = {
    total: payments.reduce((acc, p) => acc + (p.status === 'pagado' ? p.amount : 0), 0),
    pending: payments.reduce((acc, p) => acc + (p.status === 'pendiente' ? p.amount : 0), 0),
  };

  return (
    <div className="page-stack">
      <header className="page-hero">
        <div>
          <h2>Pagos e Ingresos</h2>
          <p>Control financiero detallado de este local.</p>
        </div>
        <Link href={`/business/${businessId}`} className="secondary-btn">Volver al Panel</Link>
      </header>

      <section className="kpi-grid">
        <KpiCard title="Cobrado" value={`${stats.total} €`} variant="positive" subtitle="Pagos liquidados" />
        <KpiCard title="Pendiente" value={`${stats.pending} €`} variant="warning" subtitle="Cuentas abiertas" />
        <KpiCard title="Operaciones" value={payments.length.toString()} subtitle="Total de registros" />
        <KpiCard title="Ticket Medio" value={`${payments.length > 0 ? (stats.total / payments.length).toFixed(2) : 0} €`} subtitle="Basado en cobros" />
      </section>

      <section className="section-card">
        <div className="panel-title-row">
          <h3 className="panel-title">Histórico Financiero</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Importe</th>
              <th>Método</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>{p.clientName}</td>
                <td>{p.amount} €</td>
                <td style={{ textTransform: 'capitalize' }}>{p.type}</td>
                <td>{p.date || 'N/A'}</td>
                <td>
                  <Badge status={p.status === 'pagado' ? 'paid' : 'pending'} label={p.status} />
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
                  No hay movimientos financieros en este local.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
