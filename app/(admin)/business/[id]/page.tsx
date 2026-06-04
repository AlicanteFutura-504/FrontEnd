"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loading from "@/components/ui/Loading";
import { getBusiness, getBusinessDashboardSummary, getAllBookingsByBusiness } from "@/lib/api";
import { Booking, Business } from "@/lib/types";
import KpiCard from "@/components/ui/KpiCard";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

interface BusinessSummary {
  totalBookings: number;
  pendingBookings: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingRevenue: number;
  latestBookings: Booking[];
}

export default function BusinessDashboardPage() {
  const params = useParams();
  const businessId = params.id as string;
  const [business, setBusiness] = useState<Business | null>(null);
  const [summary, setSummary] = useState<BusinessSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        // Two parallel requests: business info + aggregated KPIs from backend
        // No rows downloaded — all counts computed server-side in SQL
        const [businessResp, summaryResp] = await Promise.all([
          getBusiness(Number(businessId)).catch((e) => {
            console.error('getBusiness error:', e);
            return null;
          }),
          getBusinessDashboardSummary(businessId).catch((e) => {
            console.error('getBusinessDashboardSummary error:', e);
            return null;
          }),
        ]);

        setBusiness(businessResp);
        setSummary(summaryResp);
      } catch (err: any) {
        console.error('Error fetching business dashboard:', err);
        setError(err?.message || 'Error al cargar los datos del negocio');
      } finally {
        setLoading(false);
      }
    };

    if (businessId) fetchData();
  }, [businessId]);

  if (loading) return <Loading />;
  if (error) return <div className="p-8" style={{ color: 'var(--danger)' }}>Error: {error}</div>;
  if (!business) return <div className="p-8" style={{ color: 'var(--danger)' }}>Negocio no encontrado o sin acceso. ID: {businessId}</div>;

  const avgPerService = summary && summary.totalBookings > 0
    ? (summary.totalRevenue / summary.totalBookings).toFixed(2)
    : '0.00';

  async function handleExport() {
    if (!summary || !business) return;
    setExporting(true);

    try {
      const bookings = await getAllBookingsByBusiness(businessId);

      const tableHtml = `
      <table border="1">
        <thead>
          <tr><th colspan="2" style="font-size: 20px; background-color: #f3f4f6; text-align: center;">Resumen de KPIs - ${business.nombre}</th></tr>
          <tr><th style="background-color: #e5e7eb;">Indicador</th><th style="background-color: #e5e7eb;">Valor</th></tr>
        </thead>
        <tbody>
          <tr><td>Reservas Totales</td><td>${summary.totalBookings}</td></tr>
          <tr><td>Ingresos Totales (€)</td><td>${summary.totalRevenue}</td></tr>
          <tr><td>Reservas Pendientes</td><td>${summary.pendingBookings}</td></tr>
          <tr><td>Clientes Registrados</td><td>${summary.totalCustomers}</td></tr>
        </tbody>
      </table>
      <br/>
      <table border="1">
        <thead>
          <tr><th colspan="5" style="font-size: 20px; background-color: #f3f4f6; text-align: center;">Reservas Exportadas</th></tr>
          <tr>
            <th style="background-color: #e5e7eb;">ID</th>
            <th style="background-color: #e5e7eb;">Fecha</th>
            <th style="background-color: #e5e7eb;">Hora</th>
            <th style="background-color: #e5e7eb;">Servicio</th>
            <th style="background-color: #e5e7eb;">Estado</th>
          </tr>
        </thead>
        <tbody>
          ${bookings.length > 0 ? bookings.map((b: any) => `
            <tr>
              <td>${b.id}</td>
              <td>${b.date}</td>
              <td>${b.time ?? ''}</td>
              <td>${b.serviceName}</td>
              <td>${b.status}</td>
            </tr>
          `).join('') : `
            <tr><td colspan="5" style="text-align:center;">No hay reservas para exportar</td></tr>
          `}
        </tbody>
      </table>
    `;

      const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Reporte ${business.nombre}</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
      </head>
      <body>
        ${tableHtml}
      </body>
      </html>
    `;

      const blob = new Blob([htmlContent], { type: "application/vnd.ms-excel" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = 'none';
      a.href = url;
      a.download = `reporte_${business.nombre.replace(/\s+/g, '_').toLowerCase()}.xls`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exportando reporte del negocio:', error);
      alert('No se pudo exportar el reporte del negocio. Revisa la consola para más detalles.');
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="page-stack">
      <header className="page-hero">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '40px', background: 'var(--primary-soft)', padding: '15px', borderRadius: '20px' }}>🏢</div>
          <div>
            <h2>Dashboard: {business.nombre}</h2>
            <p>{business.direccion || 'Sin dirección'} · {business.telefono || 'Sin teléfono'}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {user?.role === 'business' ? (
            <button className="primary-btn" type="button" onClick={handleExport} disabled={exporting}>
              {exporting ? 'Exportando...' : 'Exportar Reporte Global'}
            </button>
          ) : (
            <>
              <Link href={`/business/${businessId}/bookings`} className="primary-btn">Nueva Reserva</Link>
              <Link href="/business" className="secondary-btn">Volver al listado</Link>
            </>
          )}
        </div>
      </header>

      <section className="kpi-grid">
        <KpiCard title="Ingresos Totales" value={`${summary?.totalRevenue ?? 0} €`} subtitle="Cobros confirmados" variant="positive" />
        <KpiCard title="Pendiente de Cobro" value={`${summary?.pendingRevenue ?? 0} €`} subtitle="Acción requerida" variant="warning" />
        <KpiCard title="Total Reservas" value={(summary?.totalBookings ?? 0).toString()} subtitle="Histórico acumulado" />
        <KpiCard title="Clientes" value={(summary?.totalCustomers ?? 0).toString()} subtitle="Registrados en este local" />
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
              {(summary?.latestBookings ?? []).map(b => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 600 }}>{b.date}</td>
                  <td>{b.serviceName}</td>
                  <td>
                    <span className={`badge badge--${b.status}`}>{b.status}</span>
                  </td>
                </tr>
              ))}
              {(summary?.latestBookings?.length ?? 0) === 0 && (
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
            {summary?.latestBookings?.[0] ? (
              <>
                <p className="info-box__title">{summary.latestBookings[0].serviceName}</p>
                <p className="info-box__text">{summary.latestBookings[0].date} a las {summary.latestBookings[0].time}</p>
              </>
            ) : (
              <p className="info-box__text">Sin citas próximas</p>
            )}
          </div>

          <div className="info-box" style={{ borderLeft: '4px solid var(--success)' }}>
            <p className="info-box__eyebrow">Rendimiento Financiero</p>
            <p className="info-box__title">Promedio por Servicio</p>
            <p className="info-box__text">{avgPerService} € / servicio</p>
          </div>

          <div className="info-box" style={{ borderLeft: '4px solid var(--warning)' }}>
            <p className="info-box__eyebrow">Pendientes</p>
            <p className="info-box__title">{summary?.pendingBookings ?? 0} reservas sin confirmar</p>
            <Link href={`/business/${businessId}/bookings`} className="panel-subtle-link" style={{ fontSize: '13px' }}>
              Gestionar →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
