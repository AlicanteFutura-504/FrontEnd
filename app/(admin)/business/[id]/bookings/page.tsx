"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loading from "@/components/ui/Loading";
import { getBookingsByBusiness, createBooking, createCustomer, getCustomerByEmail, updateBooking, deleteBooking } from "@/lib/api";
import type { Customer } from "@/lib/api";
import { Booking, CreateBookingDto, BookingStatus } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

export default function BusinessBookingsPage() {
  const params = useParams();
  const businessId = params.id as string;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  
  // Modal and form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    serviceName: "",
    customerEmail: "",
    customerName: "",
    customerSurname: "",
    customerPhone: "",
  });
  const [foundCustomer, setFoundCustomer] = useState<Customer | null | undefined>(undefined);
  const [searchingCustomer, setSearchingCustomer] = useState(false);
  
  // Edit and Delete state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editBookingId, setEditBookingId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<BookingStatus>("pending");
  const [rowActionsId, setRowActionsId] = useState<number | null>(null);

  const fetchBookings = async (p: number, s: string) => {
    setLoading(true);
    try {
      const result = await getBookingsByBusiness(businessId, p, 20, s);
      if (Array.isArray(result)) {
        // Fallback local en caso de que el backend envíe todo el array
        const start = (p - 1) * 20;
        setBookings(result.slice(start, start + 20));
        setTotal(result.length);
      } else {
        setBookings(result?.data || []);
        setTotal(result?.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!businessId) return;
    const timer = setTimeout(() => {
      fetchBookings(page, search);
    }, 300);
    return () => clearTimeout(timer);
  }, [businessId, page, search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let customerId: number;
      if (foundCustomer) {
        customerId = foundCustomer.id;
      } else {
        const newCust = await createCustomer({
          name: formData.customerName,
          surname: formData.customerSurname || undefined,
          email: formData.customerEmail,
          phone: formData.customerPhone || undefined,
          businessId: Number(businessId),
        });
        customerId = newCust.id;
      }

      await createBooking({
        date: formData.date,
        time: formData.time,
        serviceName: formData.serviceName,
        status: "pending",
        customerId,
        businessId: Number(businessId),
      });
      await fetchBookings(page, search);
      setIsModalOpen(false);
      setFormData({ date: "", time: "", serviceName: "", customerEmail: "", customerName: "", customerSurname: "", customerPhone: "" });
      setFoundCustomer(undefined);
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
      await fetchBookings(page, search);
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
      await fetchBookings(page, search);
      setRowActionsId(null);
    } catch (err) {
      console.error("Error deleting booking", err);
    }
  };

  if (loading) return <Loading />;

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
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: 520, width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="modal-title" style={{ margin: 0 }}>Nueva Reserva</h3>
              <button 
                onClick={() => { setIsModalOpen(false); setFoundCustomer(undefined); }}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--muted)' }}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 12 }}>

              {/* ── Datos del cliente ── */}
              <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Datos del cliente</p>

              <div style={{ position: 'relative' }}>
                <input
                  required
                  type="email"
                  className="input"
                  placeholder="Email del cliente *"
                  value={formData.customerEmail}
                  style={{ width: '100%' }}
                  onChange={e => {
                    const email = e.target.value;
                    setFormData(f => ({ ...f, customerEmail: email }));
                    setFoundCustomer(undefined);
                    const t = setTimeout(async () => {
                      if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) return;
                      setSearchingCustomer(true);
                      try {
                        const c = await getCustomerByEmail(email);
                        setFoundCustomer(c);
                        if (c) setFormData(f => ({ ...f, customerName: c.name, customerSurname: c.surname ?? '', customerPhone: c.phone ?? '' }));
                      } catch { setFoundCustomer(null); }
                      finally { setSearchingCustomer(false); }
                    }, 600);
                    return () => clearTimeout(t);
                  }}
                />
                {searchingCustomer && <span style={{ position: 'absolute', right: 10, top: 10, fontSize: 12, color: '#9ca3af' }}>Buscando…</span>}
              </div>

              {foundCustomer && (
                <div style={{ fontSize: 12, color: '#065f46', background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: 6, padding: '6px 10px' }}>
                  ✓ Cliente encontrado: <strong>{foundCustomer.name} {foundCustomer.surname ?? ''}</strong> (ID #{foundCustomer.id})
                </div>
              )}
              {foundCustomer === null && formData.customerEmail && !searchingCustomer && (
                <div style={{ fontSize: 12, color: '#6b7280', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 6, padding: '6px 10px' }}>
                  ✦ Cliente nuevo — se creará al guardar.
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input
                  required
                  className="input"
                  placeholder="Nombre *"
                  value={formData.customerName}
                  readOnly={!!foundCustomer}
                  style={foundCustomer ? { background: '#f0fdf4' } : {}}
                  onChange={e => setFormData(f => ({ ...f, customerName: e.target.value }))}
                />
                <input
                  className="input"
                  placeholder="Apellido"
                  value={formData.customerSurname}
                  readOnly={!!foundCustomer}
                  style={foundCustomer ? { background: '#f0fdf4' } : {}}
                  onChange={e => setFormData(f => ({ ...f, customerSurname: e.target.value }))}
                />
                <input
                  className="input"
                  placeholder="Teléfono"
                  type="tel"
                  value={formData.customerPhone}
                  readOnly={!!foundCustomer}
                  style={foundCustomer ? { background: '#f0fdf4' } : {}}
                  onChange={e => setFormData(f => ({ ...f, customerPhone: e.target.value }))}
                />
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '4px 0' }} />

              {/* ── Datos de la reserva ── */}
              <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Datos de la reserva</p>

              <input required type="date" className="input" value={formData.date} onChange={e => setFormData(f => ({ ...f, date: e.target.value }))} />
              <input required type="time" className="input" value={formData.time} onChange={e => setFormData(f => ({ ...f, time: e.target.value }))} />
              <input required className="input" placeholder="Servicio *" value={formData.serviceName} onChange={e => setFormData(f => ({ ...f, serviceName: e.target.value }))} />

              <div className="modal-actions" style={{ marginTop: 8 }}>
                <button type="button" className="secondary-btn" onClick={() => { setIsModalOpen(false); setFoundCustomer(undefined); }}>Cancelar</button>
                <button type="submit" className="primary-btn" disabled={isSubmitting || foundCustomer === undefined}>
                  {isSubmitting ? 'Guardando...' : foundCustomer ? 'Crear reserva (cliente existente)' : 'Crear reserva (cliente nuevo)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className="section-card">
        <div className="panel-title-row">
          <h3 className="panel-title">Historial de Citas</h3>
          <span style={{ color: "var(--muted)", fontSize: '14px' }}>{total} registros en total</span>
        </div>

        <div className="sticky-search" style={{ marginBottom: '24px', display: 'flex', gap: '16px', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <input 
            type="text" 
            placeholder="Buscar por servicio..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ padding: '12px', flex: 1, borderRadius: '8px', border: '1px solid var(--border)' }}
          />
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Servicio</th>
              <th>Importe</th>
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
                <td>
                  {b.payment?.amount ? (
                    <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                      {b.payment.amount.toFixed(2)} €
                    </span>
                  ) : (
                    <span style={{ color: 'var(--muted)' }}>--</span>
                  )}
                </td>
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

        {total > 20 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '32px' }}>
            <button 
              disabled={page === 1} 
              onClick={() => setPage(p => p - 1)}
              className="secondary-btn"
            >
              Anterior
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', color: 'var(--muted)' }}>Página</span>
              <input 
                type="number" 
                min={1} 
                max={Math.ceil(total / 20)} 
                value={page}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val >= 1 && val <= Math.ceil(total / 20)) {
                    setPage(val);
                  }
                }}
                style={{ width: '70px', padding: '8px', textAlign: 'center', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--surface)' }}
              />
              <span style={{ fontSize: '14px', color: 'var(--muted)' }}>de {Math.ceil(total / 20)}</span>
            </div>

            <button 
              disabled={page >= Math.ceil(total / 20)} 
              onClick={() => setPage(p => p + 1)}
              className="secondary-btn"
            >
              Siguiente
            </button>
          </div>
        )}
      </section>

      {/* Edit Status Modal */}
      {isEditOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="modal-title" style={{ margin: 0 }}>Editar Estado de Reserva</h3>
              <button 
                onClick={() => setIsEditOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--muted)' }}
              >
                &times;
              </button>
            </div>
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
