"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBookingsByBusiness, createBooking, createCustomer, updateBooking, deleteBooking } from "@/lib/api";
import { Booking, CreateBookingDto, BookingStatus } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

export default function BusinessBookingsPage() {
  const params = useParams();
  const businessId = params.id as string;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal and form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    serviceName: ""
  });
  
  // Edit and Delete state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editBookingId, setEditBookingId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<BookingStatus>("pending");
  const [rowActionsId, setRowActionsId] = useState<number | null>(null);

  const fetchBookings = async () => {
    try {
      const data = await getBookingsByBusiness(businessId);
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) fetchBookings();
  }, [businessId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newCust = await createCustomer({
        name: "Cliente Anónimo",
        email: `anon_${Date.now()}@reserva.local`,
        phone: ""
      });

      const newBooking: CreateBookingDto = {
        date: formData.date,
        time: formData.time,
        serviceName: formData.serviceName,
        status: "pending", 
        customerId: newCust.id,
        businessId: Number(businessId),
      };
      
      await createBooking(newBooking);
      await fetchBookings();
      setIsModalOpen(false);
      setFormData({ date: "", time: "", serviceName: "" });
    } catch (err) {
      console.error("Error creating booking", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBookingId) return;
    setIsSubmitting(true);
    try {
      await updateBooking(editBookingId, { status: editStatus });
      await fetchBookings();
      setIsEditOpen(false);
      setEditBookingId(null);
      setRowActionsId(null);
    } catch (err) {
      console.error("Error updating booking", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que quieres eliminar esta reserva?")) return;
    try {
      await deleteBooking(id);
      await fetchBookings();
      setRowActionsId(null);
    } catch (err) {
      console.error("Error deleting booking", err);
    }
  };

  if (loading) return <div className="p-8">Cargando reservas...</div>;

  return (
    <div className="page-stack">
      <header className="page-hero">
        <div>
          <h2>Gestión de Reservas</h2>
          <p>Listado completo de citas para este establecimiento.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="primary-btn" onClick={() => setIsModalOpen(true)}>+ Añadir Reserva</button>
          <Link href={`/business/${businessId}`} className="secondary-btn">Volver al Panel</Link>
        </div>
      </header>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false) }}>
          <div className="modal-card">
            <h3 className="modal-title" style={{ marginBottom: 16 }}>Nueva Reserva</h3>
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input 
                required 
                type="date" 
                className="input" 
                value={formData.date} 
                onChange={e => setFormData({...formData, date: e.target.value})} 
              />
              <input 
                required 
                type="time" 
                className="input" 
                value={formData.time} 
                onChange={e => setFormData({...formData, time: e.target.value})} 
              />
              <input 
                required 
                className="input" 
                placeholder="Servicio" 
                value={formData.serviceName} 
                onChange={e => setFormData({...formData, serviceName: e.target.value})} 
              />
              
              <div className="modal-actions" style={{ marginTop: 8 }}>
                <button type="button" className="secondary-btn" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="primary-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Guardando..." : "Guardar reserva"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              <th>Acciones</th>
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
                <td>
                  {rowActionsId === b.id ? (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button 
                        type="button" 
                        className="secondary-btn" 
                        style={{ padding: '6px 12px', minHeight: 'auto', fontSize: '13px' }}
                        onClick={() => {
                          setEditBookingId(b.id);
                          setEditStatus(b.status as BookingStatus);
                          setIsEditOpen(true);
                        }}
                      >
                        Editar Estado
                      </button>
                      <button 
                        type="button" 
                        className="danger-btn" 
                        style={{ padding: '6px 12px', minHeight: 'auto', fontSize: '13px' }}
                        onClick={() => handleDelete(b.id)}
                      >
                        Eliminar
                      </button>
                      <button 
                        type="button" 
                        className="secondary-btn" 
                        style={{ padding: '6px 12px', minHeight: 'auto', fontSize: '13px', background: 'transparent', border: 'none' }}
                        onClick={() => setRowActionsId(null)}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button 
                      type="button" 
                      className="secondary-btn" 
                      style={{ padding: '6px 12px', minHeight: 'auto', fontSize: '13px' }}
                      onClick={() => setRowActionsId(b.id)}
                    >
                      Modificar
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
                  No hay reservas en este local.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Edit Status Modal */}
      {isEditOpen && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setIsEditOpen(false) }}>
          <div className="modal-card">
            <h3 className="modal-title" style={{ marginBottom: 16 }}>Editar Estado de Reserva</h3>
            <form onSubmit={handleEditStatus} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <select 
                className="select" 
                value={editStatus} 
                onChange={e => setEditStatus(e.target.value as BookingStatus)}
                required
              >
                <option value="pending">Pendiente (Sin confirmar)</option>
                <option value="confirmed">Confirmada</option>
                <option value="paid">Pagada</option>
              </select>
              
              <div className="modal-actions" style={{ marginTop: 8 }}>
                <button type="button" className="secondary-btn" onClick={() => setIsEditOpen(false)}>Cancelar</button>
                <button type="submit" className="primary-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Guardando..." : "Actualizar Estado"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
