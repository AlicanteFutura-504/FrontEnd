"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAppointments, createAppointment } from "@/lib/api";
import { Booking, CreateBookingDto, BookingStatus } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

export default function BusinessBookingsPage() {
  const params = useParams();
  const businessId = params.id as string;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Estado del formulario de creación ---
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const emptyForm: CreateBookingDto = {
    date: "",
    time: "",
    status: "pending",
    customerId: 1,
    businessId: Number(businessId) || 1,
    serviceName: "",
  };

  const [createForm, setCreateForm] = useState<CreateBookingDto>(emptyForm);

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

  // --- Helpers ---
  function updateCreateForm<K extends keyof CreateBookingDto>(
    key: K,
    value: CreateBookingDto[K]
  ) {
    setCreateForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetCreateForm() {
    setCreateForm(emptyForm);
  }

  function openCreateForm() {
    setErrorMessage("");
    setSuccessMessage("");
    setIsCreateOpen(true);
  }

  function closeCreateForm() {
    setErrorMessage("");
    resetCreateForm();
    setIsCreateOpen(false);
  }

  async function handleCreateSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoadingCreate(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const created = await createAppointment({
        ...createForm,
        businessId: Number(businessId),
      });
      setBookings((prev) => [created, ...prev]);
      resetCreateForm();
      setIsCreateOpen(false);
      setSuccessMessage("Reserva creada correctamente.");
    } catch {
      setErrorMessage("No se pudo crear la reserva. Revisa los datos o el backend.");
    } finally {
      setLoadingCreate(false);
    }
  }

  if (loading) return <div className="p-8">Cargando reservas...</div>;

  return (
    <div className="page-stack">
      <header className="page-hero">
        <div>
          <h2>Gestión de Reservas</h2>
          <p>Listado completo de citas para este establecimiento.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="primary-btn" type="button" onClick={openCreateForm}>
            + Añadir Reserva
          </button>
          <Link href={`/business/${businessId}`} className="secondary-btn">Volver al Panel</Link>
        </div>
      </header>

      {/* Mensajes de éxito / error */}
      {successMessage && <div className="message-success">{successMessage}</div>}
      {errorMessage && !isCreateOpen && <div className="message-error">{errorMessage}</div>}

      {/* Panel de creación — visible solo cuando isCreateOpen === true */}
      {isCreateOpen && (
        <section className="section-card">
          <div className="panel-title-row">
            <h3 className="panel-title">Nueva reserva</h3>
            <button type="button" className="secondary-btn" onClick={closeCreateForm}>
              Cancelar
            </button>
          </div>

          <form onSubmit={handleCreateSubmit} className="page-stack" style={{ gap: 16 }}>
            <div className="form-grid">
              <input
                className="input"
                type="date"
                value={createForm.date}
                onChange={(e) => updateCreateForm("date", e.target.value)}
                required
              />
              <input
                className="input"
                type="time"
                value={createForm.time}
                onChange={(e) => updateCreateForm("time", e.target.value)}
                required
              />
              <select
                className="select"
                value={createForm.status}
                onChange={(e) =>
                  updateCreateForm("status", e.target.value as BookingStatus)
                }
              >
                <option value="pending">Pendiente</option>
                <option value="confirmed">Confirmada</option>
                <option value="paid">Pagada</option>
              </select>
              <input
                className="input"
                type="number"
                min={1}
                value={createForm.customerId}
                onChange={(e) =>
                  updateCreateForm("customerId", Number(e.target.value))
                }
                placeholder="Customer ID"
                required
              />
              <input
                className="input input--full"
                type="text"
                value={createForm.serviceName}
                onChange={(e) => updateCreateForm("serviceName", e.target.value)}
                placeholder="Servicio"
                required
              />
            </div>

            {errorMessage ? <div className="message-error">{errorMessage}</div> : null}

            <div className="message-row">
              <button className="primary-btn" type="submit" disabled={loadingCreate}>
                {loadingCreate ? "Guardando..." : "Crear reserva"}
              </button>
            </div>
          </form>
        </section>
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
