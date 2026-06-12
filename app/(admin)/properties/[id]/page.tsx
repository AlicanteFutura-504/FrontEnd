"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loading from "@/components/ui/Loading";
import { getBusiness, getBusinessDashboardSummary, getAllBookingsByBusiness, getAllClientsByBusiness, getReviewsByProperty } from "@/lib/api";
import { Booking, Business, Review } from "@/lib/types";
import KpiCard from "@/components/ui/KpiCard";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import Badge from "@/components/ui/Badge";
import { Building2 } from "lucide-react";

interface BusinessSummary {
  totalBookings: number;
  pendingBookings: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingRevenue: number;
  latestBookings: Booking[];
}

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

export default function BusinessDashboardPage() {
  const params = useParams();
  const businessId = params.id as string;
  const [business, setBusiness] = useState<Business | null>(null);
  const [summary, setSummary] = useState<BusinessSummary | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
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
        const [businessResp, summaryResp, reviewsResp] = await Promise.all([
          getBusiness(Number(businessId)).catch((e) => {
            console.error('getBusiness error:', e);
            return null;
          }),
          getBusinessDashboardSummary(businessId).catch((e) => {
            console.error('getBusinessDashboardSummary error:', e);
            return null;
          }),
          getReviewsByProperty(Number(businessId)).catch((e) => {
            console.error('getReviewsByProperty error:', e);
            return [];
          }),
        ]);

        setBusiness(businessResp);
        setSummary(summaryResp);
        setReviews(reviewsResp);
      } catch (err: any) {
        console.error('Error fetching business dashboard:', err);
        setError(err?.message || 'Error al cargar los datos del propiedad');
      } finally {
        setLoading(false);
      }
    };

    if (businessId) fetchData();
  }, [businessId]);

  if (loading) return <Loading />;
  if (error) return <div className="p-8" style={{ color: 'var(--danger)' }}>Error: {error}</div>;
  if (!business) return <div className="p-8" style={{ color: 'var(--danger)' }}>Propiedad no encontrado o sin acceso. ID: {businessId}</div>;

  const avgPerService = summary && summary.totalBookings > 0
    ? (summary.totalRevenue / summary.totalBookings).toFixed(2)
    : '0.00';

  async function handleExport() {
    if (!summary || !business) return;
    setExporting(true);

    try {
      const bookings = await getAllBookingsByBusiness(businessId);
      const customers = await getAllClientsByBusiness(businessId);
      const customerNamesById = new Map(customers.map((user: any) => [
        user.id,
        (user.nombreCompleto || user.email || user.username || '').trim(),
      ]));

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
          <tr><td>Huéspedes Registrados</td><td>${summary.totalCustomers}</td></tr>
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
              <td>${b.propertyName ?? business.nombre ?? ''}</td>
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
      console.error('Error exportando reporte del propiedad:', error);
      alert('No se pudo exportar el reporte del propiedad. Revisa la consola para más detalles.');
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="page-stack">
      <header className="page-hero">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {(business as any).images && (business as any).images.length > 0 ? (
            <img src={(business as any).images[0]} alt={business.nombre} style={{ width: '80px', height: '80px', borderRadius: '20px', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '80px', height: '80px', background: 'var(--primary-soft)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={40} color="var(--accent-1)" />
            </div>
          )}
          <div>
            <h2>Dashboard: {business.nombre}</h2>
            <p>{business.city || 'Sin ciudad'}, {business.address || ''} · {business.telefono || 'Sin teléfono'}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {user?.role === 'host' ? (
            <button className="primary-btn" type="button" onClick={handleExport} disabled={exporting}>
              {exporting ? 'Exportando...' : 'Exportar Reporte Global'}
            </button>
          ) : (
            <>
              <Link href={`/properties/${businessId}/bookings`} className="primary-btn">Nueva Reserva</Link>
              <Link href="/properties" className="secondary-btn">Volver al listado</Link>
            </>
          )}
        </div>
      </header>

      <section className="kpi-grid">
        <KpiCard title="Ingresos Totales" value={`${summary?.totalRevenue ?? 0} €`} subtitle="Cobros confirmados" variant="positive" />
        <KpiCard title="Pendiente de Cobro" value={`${summary?.pendingRevenue ?? 0} €`} subtitle="Acción requerida" variant="warning" />
        <KpiCard title="Total Reservas" value={(summary?.totalBookings ?? 0).toString()} subtitle="Histórico acumulado" />
        <KpiCard title="Huéspedes" value={(summary?.totalCustomers ?? 0).toString()} subtitle="Registrados en este local" />
      </section>

      <div className="dashboard-grid">
        <section className="section-card">
          <div className="panel-title-row">
            <h3 className="panel-title">Actividad Reciente</h3>
            <Link href={`/properties/${businessId}/bookings`} className="panel-subtle-link">Ver todas</Link>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Huésped</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {(summary?.latestBookings ?? []).map(b => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 600 }}>{formatDate(b.checkInDate)}</td>
                  <td>{formatDate(b.checkOutDate)}</td>
                  <td>{b.customerName}</td>
                  <td>
                    <Badge status={b.status as any} />
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
            <p className="info-box__eyebrow">Próxima Estancia</p>
            {summary?.latestBookings?.[0] ? (
              <>
                <p className="info-box__title">Reserva #{summary.latestBookings[0].id}</p>
                <p className="info-box__text">Entrada: {formatDate(summary.latestBookings[0].checkInDate)}</p>
              </>
            ) : (
              <p className="info-box__text">Sin estancias próximas</p>
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
            <Link href={`/properties/${businessId}/bookings`} className="panel-subtle-link" style={{ fontSize: '13px' }}>
              Gestionar →
            </Link>
          </div>
        </section>
      </div>

      <section className="section-card" style={{ marginTop: '24px' }}>
        <div className="panel-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="panel-title">Reseñas y Valoración</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[0, 1, 2, 3, 4].map(index => {
                const score = (business as any).score || 0;
                const fillPercentage = Math.max(0, Math.min(100, (score - index) * 100));
                return (
                  <span key={index} style={{
                    background: `linear-gradient(90deg, #b8860b ${fillPercentage}%, var(--border-strong) ${fillPercentage}%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block',
                    fontSize: '1.3rem',
                    lineHeight: 1
                  }}>
                    ★
                  </span>
                );
              })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                ★ {((business as any).score || 0).toFixed(1)}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>({reviews.length} reseñas)</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
          {reviews.length > 0 ? reviews.map(r => (
            <div key={r.id} style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong style={{ fontSize: '1rem' }}>{r.guest?.nombreCompleto || r.guest?.username || 'Huésped Anónimo'}</strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[0, 1, 2, 3, 4].map(index => {
                      const fillPercentage = Math.max(0, Math.min(100, (r.score - index) * 100));
                      return (
                        <span key={index} style={{
                          background: `linear-gradient(90deg, #b8860b ${fillPercentage}%, var(--border-strong) ${fillPercentage}%)`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          display: 'inline-block',
                          fontSize: '1.1rem',
                          lineHeight: 1
                        }}>
                          ★
                        </span>
                      );
                    })}
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
                    {r.score.toFixed(1)}
                  </span>
                </div>
              </div>
              <p style={{ color: 'var(--text)', fontSize: '0.95rem' }}>{r.comment || <em style={{ color: 'var(--text-muted)' }}>Sin comentario</em>}</p>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                {formatDate(r.createdAt)}
              </div>
            </div>
          )) : (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>Aún no hay reseñas para esta propiedad.</p>
          )}
        </div>
      </section>
    </div>
  );
}
