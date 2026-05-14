"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAppointments, getPayments, getCustomers, getBusinesses } from "@/lib/api";
import { Booking, Payment, Customer, Business } from "@/lib/types";
import KpiCard from "@/components/ui/KpiCard";
import Link from "next/link";

export default function BusinessDashboardPage() {
  const params = useParams();
  const businessId = params.id as string;
  const [data, setData] = useState<{
    business: Business | null;
    bookings: Booking[];
    payments: Payment[];
    customersCount: number;
  }>({
    business: null,
    bookings: [],
    payments: [],
    customersCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allBookings, allPayments, allCustomers, allBusinesses] = await Promise.all([
          getAppointments(),
          getPayments(),
          getCustomers(),
          getBusinesses()
        ]);

        const currentBusiness = allBusinesses.find(b => String(b.id) === businessId) || null;
        const businessBookings = allBookings.filter(b => String(b.businessId) === businessId);
        const businessPayments = allPayments.filter(p => String(p.businessId) === businessId);
        
        setData({
          business: currentBusiness,
          bookings: businessBookings,
          payments: businessPayments,
          customersCount: allCustomers.length, // Opcional: filtrar si los clientes estuvieran ligados a business
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (businessId) fetchData();
  }, [businessId]);

  if (loading) return <div className="p-8">Cargando panel del negocio...</div>;
  if (!data.business) return <div className="p-8 text-red-600">Negocio no encontrado.</div>;

  const totalRevenue = data.payments.reduce((acc, p) => acc + (p.status === 'pagado' ? p.amount : 0), 0);
  const pendingRevenue = data.payments.reduce((acc, p) => acc + (p.status === 'pendiente' ? p.amount : 0), 0);

  return (
    <div className="page-stack">
      <header className="page-hero">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '40px', background: 'var(--primary-soft)', padding: '15px', borderRadius: '20px' }}>🏢</div>
          <div>
            <h2>Dashboard: {data.business.nombre}</h2>
            <p>{data.business.direccion || 'Sin dirección'} · {data.business.telefono || 'Sin teléfono'}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href={`/business/${businessId}/bookings`} className="primary-btn">Nueva Reserva</Link>
          <Link href="/business" className="secondary-btn">Volver al listado</Link>
        </div>
      </header>

      <section className="kpi-grid">
        <KpiCard title="Ingresos Totales" value={`${totalRevenue} €`} subtitle="Cobros confirmados" variant="positive" />
        <KpiCard title="Pendiente de Cobro" value={`${pendingRevenue} €`} subtitle="Acción requerida" variant="warning" />
        <KpiCard title="Total Reservas" value={data.bookings.length.toString()} subtitle="Histórico acumulado" />
        <KpiCard title="Clientes" value={data.customersCount.toString()} subtitle="Base de datos global" />
      </section>

      <div className="dashboard-grid">
        <section className="section-card">
          <div className="panel-title-row">
            <h3 className="panel-title">Actividad Reciente</h3>
            <Link href={`/business/${businessId}/bookings`} className="panel-subtle-link">Ver todas</Link>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Servicio</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.bookings.slice(0, 5).map(b => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 600 }}>{b.date}</td>
                  <td>{b.serviceName}</td>
                  <td>
                    <span className={`badge badge--${b.status}`}>{b.status}</span>
                  </td>
                </tr>
              ))}
              {data.bookings.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
                    No hay actividad registrada para este local.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <section className="info-stack">
          <div className="info-box" style={{ borderLeft: '4px solid var(--accent)' }}>
            <p className="info-box__eyebrow">Próxima Cita</p>
            {data.bookings[0] ? (
              <>
                <p className="info-box__title">{data.bookings[0].serviceName}</p>
                <p className="info-box__text">{data.bookings[0].date} a las {data.bookings[0].time}</p>
              </>
            ) : (
              <p className="info-box__text">Sin citas próximas</p>
            )}
          </div>

          <div className="info-box" style={{ borderLeft: '4px solid #10b981' }}>
            <p className="info-box__eyebrow">Rendimiento Financiero</p>
            <p className="info-box__title">Promedio por Servicio</p>
            <p className="info-box__text">
              {data.bookings.length > 0 ? (totalRevenue / data.bookings.length).toFixed(2) : 0} € / servicio
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
