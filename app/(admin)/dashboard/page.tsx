"use client";

import { useEffect, useState } from "react";
import KpiCard from "@/components/ui/KpiCard";
import Badge from "@/components/ui/Badge";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { getDashboardSummary } from "@/lib/api";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return; // Prevent Unauthorized errors before auth is fully initialized

    const fetchAllData = async () => {
      try {
        const summary = await getDashboardSummary();
        setData(summary);
      } catch (err) {
        console.error("Error al cargar datos del dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [user]);

  function handleExport() {
    alert("Exportación de los 30.000 registros no disponible en la vista de resumen global.");
  }

  if (loading || !data) return <div className="p-8">Cargando visión global super rápida...</div>;

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <h2 className="text-3xl font-bold">Visión Global del Negocio</h2>
          <p className="text-gray-500">Resumen consolidado de tus {data.totalBusinesses} establecimientos.</p>
        </div>
        <button className="primary-btn" type="button" onClick={handleExport}>
          Exportar Reporte Global
        </button>
      </section>

      <section className="kpi-grid">
        <KpiCard title="Reservas Totales" value={data.totalBookings.toString()} subtitle="En todos los locales" variant="positive" />
        <KpiCard title="Ingresos Totales" value={`${data.totalEarnings} €`} subtitle="Pagos confirmados" />
        <KpiCard title="Pendientes" value={data.pendingBookings.toString()} subtitle="Acción requerida" variant="warning" />
        <KpiCard title="Clientes Base" value={data.totalCustomers.toString()} subtitle="Fidelizados" />
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
              {data.latestBookings.map((booking: any) => (
                <tr key={booking.id}>
                  <td style={{ fontWeight: 600 }}>{booking.date}</td>
                  <td>{booking.serviceName}</td>
                  <td className="text-blue-600 font-medium">
                    {booking.businessName}
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
            <p className="info-box__title">{data.totalBusinesses} Locales Activos</p>
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