"use client";

import { useMemo, useState } from "react";
import type { Booking, BookingStatus, CreateBookingDto } from "@/lib/api";
import { createAppointment } from "@/lib/api";

function StatusBadge({ status }: { status: BookingStatus }) {
  const label =
    status === "pending"
      ? "Pendiente"
      : status === "confirmed"
        ? "Confirmada"
        : "Pagada";

  return <span className={`badge badge--${status}`}>{label}</span>;
}

function formatDate(date: string) {
  try {
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return date;
  }
}

export default function BookingsClient({
  initialBookings,
}: {
  initialBookings: Booking[];
}) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const [form, setForm] = useState<CreateBookingDto>({
    appointmentDate: "",
    appointmentTime: "",
    status: "pending",
    customerId: 1,
    businessId: 1,
    serviceName: "",
  });

  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>("all");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredBookings = useMemo(() => {
    if (statusFilter === "all") return bookings;
    return bookings.filter((booking) => booking.status === statusFilter);
  }, [bookings, statusFilter]);

  const totalCount = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
  const paidCount = bookings.filter((b) => b.status === "paid").length;

  function updateForm<K extends keyof CreateBookingDto>(
    key: K,
    value: CreateBookingDto[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function resetForm() {
    setForm({
      appointmentDate: "",
      appointmentTime: "",
      status: "pending",
      customerId: 1,
      businessId: 1,
      serviceName: "",
    });
  }

  function openCreateForm() {
    setErrorMessage("");
    setSuccessMessage("");
    setIsCreateOpen(true);
  }

  function closeCreateForm() {
    setErrorMessage("");
    resetForm();
    setIsCreateOpen(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const created = await createAppointment(form);

      setBookings((prev) => [created, ...prev]);
      resetForm();
      setIsCreateOpen(false);
      setSuccessMessage("Reserva creada correctamente.");
    } catch {
      setErrorMessage("No se pudo crear la reserva. Revisa los datos o el backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <h2>Bookings list</h2>
          <p>Gestión de reservas conectada con la API.</p>
        </div>

        <button className="primary-btn" type="button" onClick={openCreateForm}>
          Nueva reserva
        </button>
      </section>

      <section className="kpi-grid">
        <div className="kpi-card">
          <p className="kpi-card__label">Total reservas</p>
          <h3 className="kpi-card__value">{totalCount}</h3>
          <p className="kpi-card__meta">Registros disponibles</p>
        </div>

        <div className="kpi-card">
          <p className="kpi-card__label">Pendientes</p>
          <h3 className="kpi-card__value">{pendingCount}</h3>
          <p className="kpi-card__meta kpi-card__meta--warning">
            Requieren seguimiento
          </p>
        </div>

        <div className="kpi-card">
          <p className="kpi-card__label">Confirmadas</p>
          <h3 className="kpi-card__value">{confirmedCount}</h3>
          <p className="kpi-card__meta kpi-card__meta--positive">
            Estado activo
          </p>
        </div>

        <div className="kpi-card">
          <p className="kpi-card__label">Pagadas</p>
          <h3 className="kpi-card__value">{paidCount}</h3>
          <p className="kpi-card__meta">Reservas cerradas</p>
        </div>
      </section>

      {isCreateOpen && (
        <section className="section-card">
          <div className="panel-title-row">
            <h3 className="panel-title">Nueva reserva</h3>

            <button
              type="button"
              className="secondary-btn"
              onClick={closeCreateForm}
            >
              Cancelar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="page-stack" style={{ gap: 16 }}>
            <div className="form-grid">
              <input
                className="input"
                type="date"
                value={form.appointmentDate}
                onChange={(e) => updateForm("appointmentDate", e.target.value)}
                required
              />

              <input
                className="input"
                type="time"
                value={form.appointmentTime}
                onChange={(e) => updateForm("appointmentTime", e.target.value)}
                required
              />

              <select
                className="select"
                value={form.status}
                onChange={(e) => updateForm("status", e.target.value as BookingStatus)}
              >
                <option value="pending">Pendiente</option>
                <option value="confirmed">Confirmada</option>
                <option value="paid">Pagada</option>
              </select>

              <input
                className="input"
                type="number"
                min={1}
                value={form.customerId}
                onChange={(e) => updateForm("customerId", Number(e.target.value))}
                placeholder="Customer ID"
                required
              />

              <input
                className="input"
                type="number"
                min={1}
                value={form.businessId}
                onChange={(e) => updateForm("businessId", Number(e.target.value))}
                placeholder="Business ID"
                required
              />

              <input
                className="input input--full"
                type="text"
                value={form.serviceName}
                onChange={(e) => updateForm("serviceName", e.target.value)}
                placeholder="Servicio"
                required
              />
            </div>

            {errorMessage ? (
              <div className="message-error">{errorMessage}</div>
            ) : null}

            <div className="message-row">
              <button className="primary-btn" type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Crear reserva"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="section-card">
        <div className="panel-title-row">
          <h3 className="panel-title">Reservas registradas</h3>

          <div className="filter-row">
            <button
              type="button"
              className="filter-pill"
              onClick={() => setStatusFilter("all")}
            >
              Todas
            </button>
            <button
              type="button"
              className="filter-pill"
              onClick={() => setStatusFilter("pending")}
            >
              Pendientes
            </button>
            <button
              type="button"
              className="filter-pill"
              onClick={() => setStatusFilter("confirmed")}
            >
              Confirmadas
            </button>
            <button
              type="button"
              className="filter-pill"
              onClick={() => setStatusFilter("paid")}
            >
              Pagadas
            </button>
          </div>
        </div>

        {successMessage ? (
          <div className="message-success" style={{ marginBottom: 12 }}>
            {successMessage}
          </div>
        ) : null}

        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Servicio</th>
              <th>Customer</th>
              <th>Business</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id}>
                <td style={{ fontWeight: 600 }}>{booking.id}</td>
                <td>{formatDate(booking.appointmentDate)}</td>
                <td>{booking.appointmentTime}</td>
                <td>{booking.serviceName}</td>
                <td>{booking.customerId}</td>
                <td>{booking.businessId}</td>
                <td>
                  <StatusBadge status={booking.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}