"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loading from "@/components/ui/Loading";
import { getBookingsByBusiness, createBooking, createClient, getClientByEmail, updateBooking, deleteBooking, getAppointmentsByRange, getBusinessDashboardSummary } from "@/lib/api";
import type { User } from "@/lib/types";
import { Booking, CreateBookingDto, BookingStatus } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import { useSortableData, SortableHeader } from "@/lib/useSortableData";
import BookingDetailsModal from "@/components/BookingDetailsModal";

// --- Calendar Helpers ---
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

function toYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const DAY_NAMES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function buildCalendarGrid(year: number, month: number) {
  const todayYmd = toYMD(new Date());
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const cells: { ymd: string; currentMonth: boolean; today: boolean }[] = [];

  for (let i = startOffset - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    cells.push({ ymd: toYMD(d), currentMonth: false, today: false });
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const ymd = toYMD(new Date(year, month, d));
    cells.push({ ymd, currentMonth: true, today: ymd === todayYmd });
  }

  let nextDay = 1;
  while (cells.length < 42) {
    const d = new Date(year, month + 1, nextDay++);
    cells.push({ ymd: toYMD(d), currentMonth: false, today: false });
  }

  return cells;
}

const STATUS_DOT: Record<string, string> = {
  pending: "var(--warning)",
  confirmed: "var(--info)",
  modified: "var(--accent-2)",
  cancelled: "var(--danger)",
  terminada: "var(--success)",
};


export default function BusinessBookingsPage() {
  const params = useParams();
  const businessId = params.id as string;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { items: sortedBookings, requestSort, sortConfig } = useSortableData(bookings);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  
  // View mode
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  
  // Calendar state
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [calendarBookings, setCalendarBookings] = useState<Booking[]>([]);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  
  // Modal and form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    checkInDate: "",
    checkOutDate: "",
    customerEmail: "",
    customerNombreCompleto: "",
    customerPhone: "",
  });
  const [foundCustomer, setFoundCustomer] = useState<User | null | undefined>(undefined);
  const [searchingCustomer, setSearchingCustomer] = useState(false);
  
  // Edit and Delete state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editBookingId, setEditBookingId] = useState<number | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editStatus, setEditStatus] = useState<BookingStatus>("pending");
  const [rowActionsId, setRowActionsId] = useState<number | null>(null);
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);

  const isReadOnly = selectedBooking?.status === 'terminada' && selectedBooking?.payment?.status === 'pagado';

  // Summary state
  const [summaryRange, setSummaryRange] = useState<"all" | "month" | "week">("all");
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    if (!businessId) return;
    const fetchSummary = async () => {
      try {
        const res = await getBusinessDashboardSummary(businessId, summaryRange);
        setSummary(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSummary();
  }, [businessId, summaryRange]);

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
    if (viewMode === 'list') {
      const timer = setTimeout(() => {
        fetchBookings(page, search);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [businessId, page, search, viewMode]);

  useEffect(() => {
    if (!businessId || viewMode !== 'calendar') return;
    const fetchCalendar = async () => {
      setLoadingCalendar(true);
      try {
        const fromDate = toYMD(new Date(viewYear, viewMonth, 1));
        const toDate = toYMD(new Date(viewYear, viewMonth + 1, 0));
        const result = await getAppointmentsByRange(fromDate, toDate, businessId);
        setCalendarBookings(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCalendar(false);
      }
    };
    fetchCalendar();
  }, [businessId, viewYear, viewMonth, viewMode]);

  const handleSaveBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let usuarioId: number;
      if (foundCustomer) {
        usuarioId = foundCustomer.id;
      } else {
        const newCust = await createClient({
          nombreCompleto: formData.customerNombreCompleto || undefined,
          email: formData.customerEmail,
          phone: formData.customerPhone || undefined,
          // @ts-ignore
          businessId: Number(businessId),
        });
        usuarioId = newCust.id;
      }

      if (editBookingId && isModalOpen) {
        await updateBooking(editBookingId, {
          checkInDate: formData.checkInDate,
          checkOutDate: formData.checkOutDate,
          usuarioId,
        });
      } else {
        await createBooking({
          checkInDate: formData.checkInDate,
          checkOutDate: formData.checkOutDate,
          status: "pending",
          usuarioId,
          propertyId: Number(businessId),
        });
      }

      if (viewMode === 'list') {
        await fetchBookings(page, search);
      } else {
        const fromDate = toYMD(new Date(viewYear, viewMonth, 1));
        const toDate = toYMD(new Date(viewYear, viewMonth + 1, 0));
        const result = await getAppointmentsByRange(fromDate, toDate, businessId);
        setCalendarBookings(result);
      }
      setIsModalOpen(false);
      setEditBookingId(null);
      setSelectedBooking(null);
      setFormData({ checkInDate: "", checkOutDate: "", customerEmail: "", customerNombreCompleto: "", customerPhone: "" });
      setFoundCustomer(undefined);
    } catch (err) {
      console.error("Error saving booking", err);
      alert("Error al guardar la reserva. Puede que haya un solapamiento de fechas.");
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
      setSelectedBooking(null);
      setRowActionsId(null);
    } catch (err: any) {
      console.error("Error updating booking", err);
      alert("Error al actualizar la reserva: " + err.message);
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
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
            <button 
              className={`secondary-btn ${viewMode === 'list' ? 'active' : ''}`} 
              style={{ border: 'none', borderRadius: 0, background: viewMode === 'list' ? 'var(--primary-bg)' : 'transparent', color: viewMode === 'list' ? 'var(--primary)' : 'var(--text)' }}
              onClick={() => setViewMode('list')}
            >
              <span role="img" aria-label="list">📋</span> Lista
            </button>
            <button 
              className={`secondary-btn ${viewMode === 'calendar' ? 'active' : ''}`} 
              style={{ border: 'none', borderRadius: 0, background: viewMode === 'calendar' ? 'var(--primary-bg)' : 'transparent', color: viewMode === 'calendar' ? 'var(--primary)' : 'var(--text)' }}
              onClick={() => setViewMode('calendar')}
            >
              <span role="img" aria-label="calendar">📅</span> Calendario
            </button>
          </div>
          <button className="primary-btn" onClick={() => { setFormData(f => ({ ...f, checkInDate: toYMD(new Date()) })); setIsModalOpen(true); }}>+ Añadir Reserva</button>
          <Link href={`/properties/${businessId}`} className="secondary-btn">Volver al Panel</Link>
        </div>
      </header>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: 520, width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="modal-title" style={{ margin: 0 }}>{editBookingId ? "Editar Reserva" : "Nueva Reserva"}</h3>
              <button 
                onClick={() => { setIsModalOpen(false); setFoundCustomer(undefined); setSelectedBooking(null); }}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--muted)' }}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveBooking} style={{ display: "flex", flexDirection: "column", gap: 12 }}>

              {/* ── Datos del cliente ── */}
              <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Datos del cliente</p>

              <div style={{ position: 'relative' }}>
                <input
                  required
                  type="email"
                  className="input"
                  placeholder="Email del cliente *"
                  value={formData.customerEmail}
                  disabled={isReadOnly}
                  style={{ width: '100%' }}
                  onChange={e => {
                    const email = e.target.value;
                    setFormData(f => ({ ...f, customerEmail: email }));
                    setFoundCustomer(undefined);
                    const t = setTimeout(async () => {
                      if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) return;
                      setSearchingCustomer(true);
                      try {
                        const c = await getClientByEmail(email);
                        setFoundCustomer(c);
                        if (c) setFormData(f => ({ ...f, customerNombreCompleto: c.nombreCompleto ?? '', customerPhone: c.phone ?? '' }));
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
                  ✓ Cliente encontrado: <strong>{foundCustomer.nombreCompleto || foundCustomer.email}</strong> (ID #{foundCustomer.id})
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
                  placeholder="Nombre Completo *"
                  value={formData.customerNombreCompleto}
                  readOnly={!!foundCustomer || isReadOnly}
                  disabled={isReadOnly}
                  style={foundCustomer ? { background: '#f0fdf4' } : {}}
                  onChange={e => setFormData(f => ({ ...f, customerNombreCompleto: e.target.value }))}
                />
                <input
                  className="input"
                  placeholder="Teléfono"
                  type="tel"
                  value={formData.customerPhone}
                  readOnly={!!foundCustomer || isReadOnly}
                  disabled={isReadOnly}
                  style={foundCustomer ? { background: '#f0fdf4' } : {}}
                  onChange={e => setFormData(f => ({ ...f, customerPhone: e.target.value }))}
                />
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '4px 0' }} />

              {/* ── Datos de la reserva ── */}
              <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Datos de la reserva</p>

              <input required type="date" className="input" disabled={isReadOnly} value={formData.checkInDate} onChange={e => setFormData(f => ({ ...f, checkInDate: e.target.value }))} />
              <input required type="date" className="input" disabled={isReadOnly} value={formData.checkOutDate} onChange={e => setFormData(f => ({ ...f, checkOutDate: e.target.value }))} />

              <div style={{ fontSize: 12, color: '#6b7280', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 6, padding: '8px 10px', marginTop: '4px' }}>
                <span style={{ display: 'block', fontWeight: 600, marginBottom: '2px' }}>Aviso de Limpieza</span>
                Recuerde que el Check-in se realiza a partir de las 15:00 y el Check-out antes de las 11:00. Esto garantiza 4 horas de margen para los servicios de limpieza el mismo día.
              </div>

              <div className="modal-actions" style={{ marginTop: 8 }}>
                <button type="button" className="secondary-btn" onClick={() => { setIsModalOpen(false); setFoundCustomer(undefined); setSelectedBooking(null); }}>Cerrar</button>
                {!isReadOnly && (
                  <button type="submit" className="primary-btn" disabled={isSubmitting || foundCustomer === undefined}>
                    {isSubmitting ? 'Guardando...' : editBookingId ? 'Actualizar reserva' : foundCustomer ? 'Crear reserva (cliente existente)' : 'Crear reserva (cliente nuevo)'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {viewMode === 'calendar' && (
        <section className="section-card">
          <div className="panel-title-row" style={{ marginBottom: '24px' }}>
            <h3 className="panel-title">Calendario de Reservas</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button 
                className="secondary-btn" 
                onClick={() => {
                  if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); } 
                  else { setViewMonth(viewMonth - 1); }
                }}
              >
                &larr; Anterior
              </button>
              <span style={{ fontWeight: 600, minWidth: 140, textAlign: 'center' }}>
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
              <button 
                className="secondary-btn" 
                onClick={() => {
                  if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); } 
                  else { setViewMonth(viewMonth + 1); }
                }}
              >
                Siguiente &rarr;
              </button>
            </div>
          </div>

          {loadingCalendar ? (
            <div style={{ padding: '60px', textAlign: 'center' }}><Loading /></div>
          ) : (
            <div className="calendar-grid">
              {DAY_NAMES.map(d => (
                <div key={d} className="calendar-header-cell">{d}</div>
              ))}
              {buildCalendarGrid(viewYear, viewMonth).map((cell, idx) => {
                const dayBookings = calendarBookings.filter(b => b.checkInDate && b.checkOutDate && cell.ymd >= b.checkInDate && cell.ymd < b.checkOutDate);
                return (
                  <div 
                    key={`${cell.ymd}-${idx}`} 
                    className={`calendar-cell ${!cell.currentMonth ? 'calendar-cell--other-month' : ''} ${cell.today ? 'calendar-cell--today' : ''}`}
                    onClick={() => {
                      setEditBookingId(null);
                      setSelectedBooking(null);
                      setFormData(f => ({ ...f, checkInDate: cell.ymd }));
                      setFoundCustomer(undefined);
                      setIsModalOpen(true);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="calendar-cell-date">{parseInt(cell.ymd.split('-')[2], 10)}</div>
                    <div className="calendar-cell-events">
                      {dayBookings.slice(0, 3).map(b => (
                        <div
                          key={b.id}
                          className="calendar-event-bar"
                          title={`Reserva #${b.id}`}
                          style={{ backgroundColor: STATUS_DOT[b.status] || STATUS_DOT.pending }}
                          onClick={e => {
                            e.stopPropagation();
                            setViewingBooking(b);
                          }}
                        >
                          {b.usuario?.nombreCompleto || b.usuario?.email || `Reserva #${b.id}`}
                        </div>
                      ))}
                      {dayBookings.length > 3 && (
                        <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 600 }}>+{dayBookings.length - 3}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px', fontSize: '12px', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div className="calendar-event-dot" style={{ backgroundColor: STATUS_DOT.pending }} /> Pendiente</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div className="calendar-event-dot" style={{ backgroundColor: STATUS_DOT.confirmed }} /> Confirmada</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div className="calendar-event-dot" style={{ backgroundColor: STATUS_DOT.modified }} /> Modificada</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div className="calendar-event-dot" style={{ backgroundColor: STATUS_DOT.cancelled }} /> Cancelada</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div className="calendar-event-dot" style={{ backgroundColor: STATUS_DOT.terminada }} /> Terminada</div>
          </div>
        </section>
      )}

      {viewMode === 'list' && (
      <section className="section-card">
        <div className="panel-title-row" style={{ marginBottom: '16px' }}>
          <h3 className="panel-title">Historial de Citas</h3>
          <span style={{ color: "var(--muted)", fontSize: '14px' }}>{total} registros en total</span>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <button className={`secondary-btn ${summaryRange === 'all' ? 'active' : ''}`} style={summaryRange === 'all' ? { background: 'var(--accent-1)', color: 'white', borderColor: 'var(--accent-1)' } : {}} onClick={() => setSummaryRange('all')}>Histórico</button>
          <button className={`secondary-btn ${summaryRange === 'month' ? 'active' : ''}`} style={summaryRange === 'month' ? { background: 'var(--accent-1)', color: 'white', borderColor: 'var(--accent-1)' } : {}} onClick={() => setSummaryRange('month')}>Mes Actual</button>
          <button className={`secondary-btn ${summaryRange === 'week' ? 'active' : ''}`} style={summaryRange === 'week' ? { background: 'var(--accent-1)', color: 'white', borderColor: 'var(--accent-1)' } : {}} onClick={() => setSummaryRange('week')}>Semana Actual</button>
        </div>

        {summary && (
          <div className="kpi-grid" style={{ marginBottom: '32px' }}>
            <div className="kpi-card">
              <div className="kpi-card__label">Ingresos Totales</div>
              <div className="kpi-card__value">{summary.totalRevenue?.toFixed(2)} €</div>
              <div className="kpi-card__meta kpi-card__meta--warning">
                <span role="img" aria-label="pending">⏳</span> {summary.pendingRevenue?.toFixed(2)} € pendientes
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-card__label">Total Reservas</div>
              <div className="kpi-card__value">{summary.totalBookings}</div>
              <div className="kpi-card__meta kpi-card__meta--positive">
                <span role="img" aria-label="chart">📈</span> Registradas
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-card__label">Reservas Pendientes</div>
              <div className="kpi-card__value">{summary.pendingBookings}</div>
              <div className="kpi-card__meta">
                <span role="img" aria-label="users">👤</span> Faltan por confirmar
              </div>
            </div>
          </div>
        )}

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
              <SortableHeader label="Entrada" sortKey="checkInDate" currentSort={sortConfig} requestSort={requestSort} />
              <SortableHeader label="Salida" sortKey="checkOutDate" currentSort={sortConfig} requestSort={requestSort} />
              <SortableHeader label="Importe" sortKey="payment.amount" isNumeric={true} currentSort={sortConfig} requestSort={requestSort} />
              <SortableHeader label="Cliente" sortKey="usuario.nombreCompleto" currentSort={sortConfig} requestSort={requestSort} />
              <SortableHeader label="Estado" sortKey="status" currentSort={sortConfig} requestSort={requestSort} />
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedBookings.map(b => (
              <tr key={b.id}>
                <td style={{ fontWeight: 600 }}>{formatDate(b.checkInDate)}</td>
                <td>{formatDate(b.checkOutDate)}</td>
                <td>
                  {b.payment?.amount ? (
                    <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                      {b.payment.amount.toFixed(2)} €
                    </span>
                  ) : (
                    <span style={{ color: 'var(--muted)' }}>--</span>
                  )}
                </td>
                <td>{b.usuario?.nombreCompleto || b.usuario?.username || `#${b.usuarioId}`}</td>
                <td>
                  <Badge status={b.status as any} />
                </td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button 
                      type="button" 
                      className="secondary-btn" 
                      style={{ padding: '6px 12px', minHeight: 'auto', fontSize: '13px' }}
                      onClick={() => setViewingBooking(b)}
                    >
                      Detalles
                    </button>
                    {rowActionsId === b.id ? (
                      <>
                        {!((b.status === 'terminada' && b.payment?.status === 'pagado')) && (
                          <>
                            <button 
                              type="button" 
                              className="secondary-btn" 
                              style={{ padding: '6px 12px', minHeight: 'auto', fontSize: '13px' }}
                              onClick={() => {
                                setEditBookingId(b.id);
                                setSelectedBooking(b);
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
                          </>
                        )}
                        <button 
                          type="button" 
                          className="secondary-btn" 
                          style={{ padding: '6px 12px', minHeight: 'auto', fontSize: '13px', background: 'transparent', border: 'none' }}
                          onClick={() => setRowActionsId(null)}
                        >
                          ✕
                        </button>
                      </>
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
                  </div>
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
      )}

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
                <option value="modified">Modificada</option>
                <option value="cancelled">Cancelada</option>
                <option value="terminada">Terminada</option>
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

      {viewingBooking && (
        <BookingDetailsModal
          booking={viewingBooking}
          businessName={viewingBooking.propertyName || `Propiedad #${viewingBooking.propertyId}`}
          customerName={viewingBooking.usuario?.nombreCompleto || viewingBooking.usuario?.email || `Huésped #${viewingBooking.usuarioId}`}
          onClose={() => setViewingBooking(null)}
        />
      )}
    </div>
  );
}
