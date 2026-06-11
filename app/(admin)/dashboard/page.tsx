"use client";

import { useEffect, useState } from "react";
import KpiCard from "@/components/ui/KpiCard";
import Badge from "@/components/ui/Badge";
import Loading from "@/components/ui/Loading";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getDashboardSummary, getAllBookings, getAllBusinesses, getAllClients } from "@/lib/api";

function formatDate(dateString: string) {
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

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return; // Prevent Unauthorized errors before auth is fully initialized

    if (user.role === 'host' && user.businessId) {
      router.replace(`/properties/${user.businessId}`);
      return;
    }

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

  async function handleExport() {
    if (!data) return;
    setExporting(true);

    try {
      const bookings = await getAllBookings();
      const businesses = await getAllBusinesses();
      const customers = await getAllClients();

      const businessNamesById = new Map(businesses.map((business: any) => [business.id, business.nombre]));
      const customerNamesById = new Map(customers.map((user: any) => [
        user.id,
        (user.nombreCompleto || user.email || user.username || '').trim(),
      ]));

      const tableHtml = `
      <table border="1">
        <thead>
          <tr><th colspan="2" style="font-size: 20px; background-color: #f3f4f6; text-align: center;">Resumen de KPIs</th></tr>
          <tr><th style="background-color: #e5e7eb;">Indicador</th><th style="background-color: #e5e7eb;">Valor</th></tr>
        </thead>
        <tbody>
          <tr><td>Locales Activos</td><td>${data.totalBusinesses}</td></tr>
          <tr><td>Reservas Totales</td><td>${data.totalBookings}</td></tr>
          <tr><td>Ingresos Totales (€)</td><td>${data.totalEarnings}</td></tr>
          <tr><td>Reservas Pendientes</td><td>${data.pendingBookings}</td></tr>
          <tr><td>Huéspedes Base</td><td>${data.totalCustomers}</td></tr>
        </tbody>
      </table>
      <br/>
      <table border="1">
        <thead>
          <tr><th colspan="7" style="font-size: 20px; background-color: #f3f4f6; text-align: center;">Reservas Exportadas</th></tr>
          <tr>
            <th style="background-color: #e5e7eb;">ID</th>
            <th style="background-color: #e5e7eb;">Entrada</th>
            <th style="background-color: #e5e7eb;">Salida</th>
            <th style="background-color: #e5e7eb;">Precio</th>
            <th style="background-color: #e5e7eb;">Huésped</th>
            <th style="background-color: #e5e7eb;">Propiedad</th>
            <th style="background-color: #e5e7eb;">Estado</th>
          </tr>
        </thead>
        <tbody>
          ${bookings.length > 0 ? bookings.map((b: any) => `
            <tr>
              <td>${b.id}</td>
              <td>${formatDate(b.checkInDate)}</td>
              <td>${formatDate(b.checkOutDate)}</td>
              <td>${b.payment?.amount ?? ''}</td>
              <td>${b.customerName ?? customerNamesById.get(b.usuarioId) ?? ''}</td>
              <td>${b.propertyName ?? businessNamesById.get(b.propertyId) ?? ''}</td>
              <td>${b.status}</td>
            </tr>
          `).join('') : `
            <tr><td colspan="8" style="text-align:center;">No hay reservas para exportar</td></tr>
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
                <x:Name>Reporte Global</x:Name>
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
      a.download = "reporte_global.xls";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exportando reporte global:', error);
      alert('No se pudo exportar el reporte global. Revisa la consola para más detalles.');
    } finally {
      setExporting(false);
    }
  }

  if (loading || !data) return <Loading />;

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <h2 className="text-3xl font-bold">Visión Global del Propiedad</h2>
          <p className="text-gray-500">Resumen consolidado de tus {data.totalBusinesses} establecimientos.</p>
        </div>
        <button className="primary-btn" type="button" onClick={handleExport} disabled={exporting}>
          {exporting ? 'Exportando...' : 'Exportar Reporte Global'}
        </button>
      </section>

      <section className="kpi-grid">
        <KpiCard title="Reservas Totales" value={data.totalBookings.toString()} subtitle="En todos los locales" variant="positive" />
        <KpiCard title="Ingresos Totales" value={`${data.totalEarnings} €`} subtitle="Pagos confirmados" />
        <KpiCard title="Pendientes" value={data.pendingBookings.toString()} subtitle="Acción requerida" variant="warning" />
        <KpiCard title="Huéspedes Base" value={data.totalCustomers.toString()} subtitle="Fidelizados" />
      </section>

      <section className="dashboard-grid">
        <div className="section-card">
          <div className="panel-title-row">
            <h3 className="panel-title">Últimas Reservas (Consolidado)</h3>
            <Link href="/properties" className="text-blue-600 font-bold hover:underline">Ver Propiedads</Link>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Huésped</th>
                <th>Propiedad</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.latestBookings.map((booking: any) => (
                <tr key={booking.id}>
                  <td style={{ fontWeight: 600 }}>{formatDate(booking.checkInDate)}</td>
                  <td>{formatDate(booking.checkOutDate)}</td>
                  <td>{booking.customerName}</td>
                  <td className="text-blue-600 font-medium">
                    {booking.propertyName}
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