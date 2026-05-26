"use client";

import { useEffect, useState } from "react";
import KpiCard from "@/components/ui/KpiCard";
import Badge from "@/components/ui/Badge";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { getAppointments, getPayments, getCustomers, getBusinesses } from "@/lib/api";
import { Booking, Payment, Customer, Business } from "@/lib/types";

export default function DashboardPage() {
  const [data, setData] = useState<{
    bookings: Booking[];
    payments: Payment[];
    customers: Customer[];
    businesses: Business[];
  }>({
    bookings: [],
    payments: [],
    customers: [],
    businesses: [],
  });
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return; // Prevent Unauthorized errors before auth is fully initialized

    const fetchAllData = async () => {
      try {
        const [allBookings, allPayments, allCustomers, businesses] = await Promise.all([
          getAppointments(),
          getPayments(),
          getCustomers(),
          getBusinesses()
        ]);
        
        const businessIds = businesses.map(b => b.id);
        const bookings = allBookings.filter(b => businessIds.includes(b.businessId));
        const payments = allPayments.filter(p => p.businessId && businessIds.includes(p.businessId));
        const customers = allCustomers.filter(c => c.businessId && businessIds.includes(c.businessId));

        setData({ bookings, payments, customers, businesses });
      } catch (err) {
        console.error("Error al cargar datos del dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [user]);

  const totalEarnings = data.payments.reduce((acc, p) => acc + (p.status === 'pagado' ? p.amount : 0), 0);
  const pendingBookings = data.bookings.filter(b => b.status === 'pending').length;

  function handleExport() {
    const headers = ["ID", "Fecha", "Servicio", "Negocio", "Estado"];
    const rows = data.bookings.map(b => [
      b.id, 
      b.date, 
      b.serviceName, 
      data.businesses.find(bus => bus.id === b.businessId)?.nombre || 'Desconocido', 
      b.status
    ]);

    let csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reporte_global_negocios.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (loading) return <div className="p-8">Cargando visión global...</div>;

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <h2 className="text-3xl font-bold">Visión Global del Negocio</h2>
          <p className="text-gray-500">Resumen consolidado de tus {data.businesses.length} establecimientos.</p>
        </div>
        <button className="primary-btn" type="button" onClick={handleExport}>
          Exportar Reporte Global
        </button>
      </section>

      <section className="kpi-grid">
        <KpiCard title="Reservas Totales" value={data.bookings.length.toString()} subtitle="En todos los locales" variant="positive" />
        <KpiCard title="Ingresos Totales" value={`${totalEarnings} €`} subtitle="Pagos confirmados" />
        <KpiCard title="Pendientes" value={pendingBookings.toString()} subtitle="Acción requerida" variant="warning" />
        <KpiCard title="Clientes Base" value={data.customers.length.toString()} subtitle="Fidelizados" />
      </section>

      <section className="dashboard-grid">
        <div className="section-card">
          <div className="panel-title-row">
            <h3 className="panel-title">Últimas Reservas (Consolidado)</h3>
            <Link href="/business" className="text-blue-600 font-bold hover:underline">Ver Negocios</Link>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Servicio</th>
                <th>Negocio</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.bookings.slice(0, 5).map((booking) => (
                <tr key={booking.id}>
                  <td style={{ fontWeight: 600 }}>{booking.date}</td>
                  <td>{booking.serviceName}</td>
                  <td className="text-blue-600 font-medium">
                    {data.businesses.find(b => b.id === booking.businessId)?.nombre || 'Local'}
                  </td>
                  <td><Badge status={booking.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="info-stack">
          <div className="info-box" style={{ borderLeft: '4px solid var(--info)' }}>
            <p className="info-box__eyebrow">Estado de Red</p>
            <p className="info-box__title">{data.businesses.length} Locales Activos</p>
            <p className="info-box__text">Sincronización en tiempo real activa</p>
          </div>
          <div className="info-box" style={{ borderLeft: '4px solid var(--success)' }}>
            <p className="info-box__eyebrow">Rendimiento</p>
            <p className="info-box__title">Crecimiento Constante</p>
            <p className="info-box__text">Datos consolidados de la última semana</p>
          </div>
          <div className="info-box" style={{ borderLeft: '4px solid var(--accent-2)' }}>
            <p className="info-box__eyebrow">Aviso del Sistema</p>
            <p className="info-box__title">Seguridad Reforzada</p>
            <p className="info-box__text">Todas las conexiones usan cifrado JWT</p>
          </div>
        </div>
      </section>
    </div>
  );
}