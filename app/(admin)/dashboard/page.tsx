"use client";

/**
 * @fileoverview Página del Dashboard (resumen general del panel de administración).
 * Conectada a la base de datos manteniendo el diseño clásico.
 * @module app/(admin)/dashboard/page
 */

import { useEffect, useState } from "react";
import KpiCard from "@/components/ui/KpiCard";
import Badge from "@/components/ui/Badge";
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

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [bookings, payments, customers, businesses] = await Promise.all([
          getAppointments(),
          getPayments(),
          getCustomers(),
          getBusinesses()
        ]);
        setData({ bookings, payments, customers, businesses });
      } catch (err) {
        console.error("Error al cargar datos del dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const totalEarnings = data.payments.reduce((acc, p) => acc + (p.status === 'pagado' ? p.amount : 0), 0);
  const pendingBookings = data.bookings.filter(b => b.status === 'pending').length;

  function handleExport() {
    const headers = ["ID", "Fecha", "Cliente ID", "Comercio", "Servicio", "Estado"];
    const rows = data.bookings.map(b => [
      b.id,
      b.date,
      b.customerId || "N/A",
      data.businesses.find(bus => bus.id === b.businessId)?.nombre || 'Desconocido',
      b.serviceName,
      b.status
    ]);

    let csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "dashboard_report_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (loading) return <div className="p-8 text-gray-500">Cargando base de datos...</div>;

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <h2>Dashboard overview</h2>
          <p>Control diario de reservas, actividad y pagos.</p>
        </div>
        <button className="primary-btn" type="button" onClick={handleExport}>
          Export report
        </button>
      </section>

      <section className="kpi-grid">
        <KpiCard title="Reservas totales" value={data.bookings.length.toString()} subtitle="Registradas en DB" variant="positive" />
        <KpiCard title="Cobrado histórico" value={`${totalEarnings} €`} subtitle={`${data.payments.filter(p => p.status === 'pagado').length} pagos registrados`} />
        <KpiCard title="Pendientes" value={pendingBookings.toString()} subtitle="Seguimiento necesario" variant="warning" />
        <KpiCard title="Clientes activos" value={data.customers.length.toString()} subtitle="En sistema" />
      </section>

      <section className="dashboard-grid">
        <div className="section-card">
          <div className="panel-title-row">
            <h3 className="panel-title">Próximas reservas</h3>
            <Link href="/business">Ver negocios</Link>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Fecha/Hora</th>
                <th>Cliente (ID)</th>
                <th>Comercio</th>
                <th>Servicio</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.bookings.slice(0, 5).map((booking) => {
                const businessName = data.businesses.find(b => b.id === booking.businessId)?.nombre || 'Local genérico';
                const customer = data.customers.find(c => c.id === booking.customerId);
                return (
                  <tr key={booking.id}>
                    <td style={{ fontWeight: 600 }}>{booking.date}</td>
                    <td>{customer ? customer.name : `ID: ${booking.customerId}`}</td>
                    <td>{businessName}</td>
                    <td>{booking.serviceName}</td>
                    <td><Badge status={booking.status} /></td>
                  </tr>
                );
              })}
              {data.bookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-500">No hay reservas en la base de datos.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="info-stack">
          <div className="info-box border-l-4 border-blue-500">
            <p className="info-box__eyebrow">Estado de Red</p>
            <p className="info-box__title">{data.businesses.length} Negocios Activos</p>
            <p className="info-box__text">Conectado a la API principal</p>
          </div>
          <div className="info-box border-l-4 border-green-500">
            <p className="info-box__eyebrow">Rendimiento</p>
            <p className="info-box__title">Crecimiento Constante</p>
            <p className="info-box__text">Sincronización en tiempo real habilitada</p>
          </div>
          <div className="info-box border-l-4 border-purple-500">
            <p className="info-box__eyebrow">Aviso del Sistema</p>
            <p className="info-box__title">Seguridad Reforzada</p>
            <p className="info-box__text">Peticiones autenticadas con JWT</p>
          </div>
        </div>
      </section>
    </div>
  );
}