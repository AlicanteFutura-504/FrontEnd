"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Loading from "@/components/ui/Loading";
import { getBookingsByCustomer } from "@/lib/api";
import type { Booking, User } from "@/lib/types";
import Badge from "@/components/ui/Badge";

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

export default function CustomerProfilePage() {
  const params = useParams();
  const businessId = params.id as string;
  const customerId = parseInt(params.customerId as string, 10);

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customerInfo, setCustomerInfo] = useState<User | null>(null);

  useEffect(() => {
    if (!customerId) return;
    const fetchCustomerData = async () => {
      setLoading(true);
      try {
        const data = await getBookingsByCustomer(customerId);
        // Filtrar reservas que pertenezcan solo a este local
        const businessBookings = data.filter(b => b.propertyId === Number(businessId));
        setBookings(businessBookings);

        if (data.length > 0 && data[0].usuario) {
          setCustomerInfo(data[0].usuario);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomerData();
  }, [customerId, businessId]);

  if (loading) return <Loading />;

  const paidBookings = bookings.filter(b => b.payment?.status === 'pagado' || b.status === 'confirmed');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');
  const totalSpent = paidBookings.reduce((sum, b) => sum + (b.payment?.amount || 0), 0);

  // Lógica dinámica de lealtad (Promotor / Detractor)
  let loyaltyStatus = "Normal";
  let loyaltyBadgeClass = "badge--pending"; // Gris/Neutro
  
  if (cancelledBookings.length > 2 || (cancelledBookings.length > 0 && paidBookings.length === 0)) {
    loyaltyStatus = "Detractor (Riesgo)";
    loyaltyBadgeClass = "badge--cancelled";
  } else if (paidBookings.length >= 3 || totalSpent > 500) {
    loyaltyStatus = "Promotor (VIP)";
    loyaltyBadgeClass = "badge--confirmed";
  }

  return (
    <div className="page-stack">
      <header className="page-hero" style={{ background: loyaltyStatus.includes('VIP') ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)' : loyaltyStatus.includes('Detractor') ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)' : '' }}>
        <div>
          <h2>Perfil del Cliente</h2>
          <p style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
            <span style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)' }}>
              {customerInfo?.nombreCompleto || customerInfo?.email || `Cliente #${customerId}`}
            </span>
            <span className={`badge ${loyaltyBadgeClass}`} style={{ fontSize: '13px' }}>
              {loyaltyStatus}
            </span>
          </p>
          {customerInfo?.email && <p style={{ marginTop: '8px', color: 'var(--text-muted)' }}>✉️ {customerInfo.email}</p>}
          {customerInfo?.phone && <p style={{ color: 'var(--text-muted)' }}>📞 {customerInfo.phone}</p>}
        </div>
        <div>
          <Link href={`/properties/${businessId}/customers`} className="secondary-btn">Volver a Clientes</Link>
        </div>
      </header>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-card__label">Total Gastado</div>
          <div className="kpi-card__value">{totalSpent.toFixed(2)} €</div>
          <div className="kpi-card__meta kpi-card__meta--positive">En reservas pagadas</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card__label">Reservas Exitosas</div>
          <div className="kpi-card__value">{paidBookings.length}</div>
          <div className="kpi-card__meta">Citas confirmadas o pagadas</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card__label">Cancelaciones</div>
          <div className="kpi-card__value">{cancelledBookings.length}</div>
          <div className="kpi-card__meta kpi-card__meta--warning">Reservas anuladas</div>
        </div>
      </div>

      <section className="section-card">
        <h3 className="panel-title" style={{ marginBottom: '24px' }}>Historial de Reservas en esta Propiedad</h3>
        
        {bookings.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>Este cliente aún no tiene reservas en este local.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Importe</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>#{b.id}</td>
                  <td style={{ fontWeight: 600 }}>{formatDate(b.checkInDate)}</td>
                  <td>{formatDate(b.checkOutDate)}</td>
                  <td style={{ fontWeight: 600 }}>{b.payment?.amount ? `${b.payment.amount.toFixed(2)} €` : '--'}</td>
                  <td><Badge status={b.status as any} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
