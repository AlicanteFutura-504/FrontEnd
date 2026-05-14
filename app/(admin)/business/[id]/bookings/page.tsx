"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAppointments } from "@/lib/api";
import { Booking } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

export default function BusinessBookingsPage() {
  const params = useParams();
  const businessId = params.id as string;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getAppointments();
        const filtered = data.filter(b => String(b.businessId) === businessId);
        setBookings(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (businessId) fetchBookings();
  }, [businessId]);

  if (loading) return <div className="p-8">Cargando reservas...</div>;

  return (
    <div className="page-stack">
      <header className="page-hero">
        <div>
          <h2>Gestión de Reservas</h2>
          <p>Listado completo de citas para este establecimiento.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="primary-btn">+ Añadir Reserva</button>
          <Link href={`/business/${businessId}`} className="secondary-btn">Volver al Panel</Link>
        </div>
      </header>

      <section className="section-card">
        <div className="panel-title-row">
          <h3 className="panel-title">Historial de Citas</h3>
          <span style={{ color: "var(--muted)", fontSize: '14px' }}>{bookings.length} registros</span>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Servicio</th>
              <th>ID Cliente</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td style={{ fontWeight: 600 }}>{b.date}</td>
                <td>{b.time}</td>
                <td>{b.serviceName}</td>
                <td>#{b.customerId}</td>
                <td>
                  <Badge status={b.status as any} />
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
                  No hay reservas en este local.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
