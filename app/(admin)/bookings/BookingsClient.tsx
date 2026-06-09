"use client";

/**
 * @fileoverview Componente cliente del módulo de Bookings.
 * Gestiona el estado local de la lista de reservas y expone la interfaz
 * completa de CRUD (crear, editar, eliminar) conectada a la API del backend.
 * @module app/(admin)/bookings/BookingsClient
 */

import { useMemo, useState } from "react";
import Badge from "@/components/ui/Badge";
import { useSortableData, SortableHeader } from "@/lib/useSortableData";
import type {
  Booking,
  BookingStatus,
  CreateBookingDto,
  UpdateBookingDto,
} from "@/lib/api";
import {
  createAppointment,
  deleteAppointment,
  updateAppointment,
} from "@/lib/api";

// ---------------------------------------------------------------------------
// Subcomponentes internos
// ---------------------------------------------------------------------------



/**
 * Formatea una cadena de fecha ISO al formato `DD/MM/AAAA` en español.
 * Si la fecha no es válida, devuelve la cadena original sin transformar.
 *
 * @param {string} date - Fecha en formato ISO 8601 (ej: `"2026-05-11"`).
 * @returns {string} Fecha formateada (ej: `"11/05/2026"`) o la cadena original si falla.
 */
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

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

/**
 * Props del componente `BookingsClient`.
 */
interface BookingsClientProps {
  /**
   * Lista inicial de reservas obtenida por el Server Component padre.
   * Se usa para poblar el estado local sin una llamada fetch adicional en cliente.
   */
  initialBookings: Booking[];
}

/**
 * Componente cliente principal del módulo de reservas.
 *
 * Responsabilidades:
 * - Mantiene el estado reactivo de la lista de reservas.
 * - Gestiona la apertura/cierre del formulario de creación, edición y modal de eliminación.
 * - Llama a los endpoints de la API (`createAppointment`, `updateAppointment`, `deleteAppointment`).
 * - Filtra las reservas visibles por estado mediante `useMemo`.
 * - Muestra contadores KPI (total, pendientes, confirmadas, pagadas).
 *
 * @param {BookingsClientProps} props - Props del componente.
 * @returns {JSX.Element} El panel completo de gestión de reservas.
 */
export default function BookingsClient({
  initialBookings,
}: BookingsClientProps) {
  /** Lista reactiva de reservas; se actualiza optimistamente tras cada operación CRUD. */
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  /** Valores en blanco usados para resetear los formularios. */
  const emptyForm: CreateBookingDto = {
    checkInDate: "",
    checkOutDate: "",
    status: "pending",
    usuarioId: 1,
    propertyId: 1,
  };

  /** Estado del formulario de creación de nueva reserva. */
  const [createForm, setCreateForm] = useState<CreateBookingDto>(emptyForm);
  /** Estado del formulario de edición de una reserva existente. */
  const [editForm, setEditForm] = useState<CreateBookingDto>(emptyForm);

  /** Filtro activo por estado; `"all"` muestra todas las reservas. */
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>("all");
  /** Indica si la petición de creación está en curso (deshabilita el botón submit). */
  const [loadingCreate, setLoadingCreate] = useState(false);
  /** Indica si la petición de edición está en curso. */
  const [loadingEdit, setLoadingEdit] = useState(false);
  /** ID de la reserva que se está eliminando actualmente (para mostrar estado de carga). */
  const [deletingBookingId, setDeletingBookingId] = useState<number | null>(null);
  /** Mensaje de éxito mostrado tras una operación completada correctamente. */
  const [successMessage, setSuccessMessage] = useState("");
  /** Mensaje de error mostrado cuando una operación de API falla. */
  const [errorMessage, setErrorMessage] = useState("");
  /** Controla la visibilidad del formulario de creación. */
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  /** ID de la reserva siendo editada; `null` cuando no hay edición activa. */
  const [editingBookingId, setEditingBookingId] = useState<number | null>(null);
  /** ID de la reserva sobre la que se ha pedido confirmación de borrado. */
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  /**
   * Lista de reservas filtradas por `statusFilter`.
   * Se recalcula solo cuando cambia `bookings` o `statusFilter`.
   */
  const filteredBookings = useMemo(() => {
    if (statusFilter === "all") return bookings;
    return bookings.filter((booking) => booking.status === statusFilter);
  }, [bookings, statusFilter]);

  const { items: sortedFilteredBookings, requestSort, sortConfig } = useSortableData(filteredBookings);

  /** Número total de reservas en el estado local. */
  const totalCount = bookings.length;
  /** Número de reservas con estado `"pending"`. */
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  /** Número de reservas con estado `"confirmed"`. */
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
  /** Número de reservas con estado `"modified"`. */
  const modifiedCount = bookings.filter((b) => b.status === "modified").length;
  /** Número de reservas con estado `"cancelled"`. */
  const cancelledCount = bookings.filter((b) => b.status === "cancelled").length;

  // ---------------------------------------------------------------------------
  // Helpers de formulario
  // ---------------------------------------------------------------------------

  /**
   * Actualiza un campo específico del formulario de creación de forma tipada.
   *
   * @template K - Clave del objeto `CreateBookingDto`.
   * @param {K} key   - Nombre del campo a actualizar.
   * @param {CreateBookingDto[K]} value - Nuevo valor para ese campo.
   */
  function updateCreateForm<K extends keyof CreateBookingDto>(
    key: K,
    value: CreateBookingDto[K]
  ) {
    setCreateForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  /**
   * Actualiza un campo específico del formulario de edición de forma tipada.
   *
   * @template K - Clave del objeto `CreateBookingDto`.
   * @param {K} key   - Nombre del campo a actualizar.
   * @param {CreateBookingDto[K]} value - Nuevo valor para ese campo.
   */
  function updateEditForm<K extends keyof CreateBookingDto>(
    key: K,
    value: CreateBookingDto[K]
  ) {
    setEditForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  /** Restaura el formulario de creación a sus valores vacíos. */
  function resetCreateForm() {
    setCreateForm(emptyForm);
  }

  /** Restaura el formulario de edición a sus valores vacíos. */
  function resetEditForm() {
    setEditForm(emptyForm);
  }

  // ---------------------------------------------------------------------------
  // Gestión de paneles / modales
  // ---------------------------------------------------------------------------

  /**
   * Abre el panel de creación y cierra cualquier otro panel activo.
   * Limpia los mensajes de estado anteriores.
   */
  function openCreateForm() {
    setErrorMessage("");
    setSuccessMessage("");
    setEditingBookingId(null);
    setDeleteTargetId(null);
    resetEditForm();
    setIsCreateOpen(true);
  }

  /**
   * Cierra el panel de creación y limpia su formulario y mensajes de error.
   */
  function closeCreateForm() {
    setErrorMessage("");
    resetCreateForm();
    setIsCreateOpen(false);
  }

  /**
   * Abre el panel de edición precargado con los datos de la reserva indicada.
   * Cierra el panel de creación y el modal de borrado si estuvieran abiertos.
   *
   * @param {Booking} booking - Reserva cuyos datos se cargan en el formulario de edición.
   */
  function openEditForm(booking: Booking) {
    setErrorMessage("");
    setSuccessMessage("");
    setIsCreateOpen(false);
    setDeleteTargetId(null);
    setEditingBookingId(booking.id);
    setEditForm({
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      status: booking.status,
      usuarioId: booking.usuarioId,
      propertyId: booking.propertyId,
    });
  }

  /**
   * Cierra el panel de edición y limpia su formulario y mensajes de error.
   */
  function closeEditForm() {
    setErrorMessage("");
    setEditingBookingId(null);
    resetEditForm();
  }

  /**
   * Abre el modal de confirmación de borrado para la reserva indicada.
   * Limpia los mensajes de estado anteriores.
   *
   * @param {number} id - ID de la reserva a eliminar.
   */
  function openDeleteModal(id: number) {
    setErrorMessage("");
    setSuccessMessage("");
    setDeleteTargetId(id);
  }

  /**
   * Cierra el modal de confirmación de borrado sin realizar ninguna acción.
   */
  function closeDeleteModal() {
    setDeleteTargetId(null);
  }

  // ---------------------------------------------------------------------------
  // Handlers de operaciones CRUD
  // ---------------------------------------------------------------------------

  /**
   * Maneja el envío del formulario de creación de reserva.
   * Llama a `createAppointment` y actualiza el estado local añadiendo
   * la nueva reserva al inicio de la lista.
   *
   * @async
   * @param {React.FormEvent<HTMLFormElement>} e - Evento de submit del formulario.
   * @returns {Promise<void>}
   */
  async function handleCreateSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoadingCreate(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const created = await createAppointment(createForm);
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

  /**
   * Maneja el envío del formulario de edición de reserva.
   * Llama a `updateAppointment` con el ID activo y reemplaza la reserva
   * modificada en el estado local.
   *
   * @async
   * @param {React.FormEvent<HTMLFormElement>} e - Evento de submit del formulario.
   * @returns {Promise<void>}
   */
  async function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!editingBookingId) return;

    setLoadingEdit(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const payload: UpdateBookingDto = {
        checkInDate: editForm.checkInDate,
        checkOutDate: editForm.checkOutDate,
        status: editForm.status,
        usuarioId: editForm.usuarioId,
        propertyId: editForm.propertyId,
      };

      const updated = await updateAppointment(editingBookingId, payload);

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === editingBookingId ? updated : booking
        )
      );

      setEditingBookingId(null);
      resetEditForm();
      setSuccessMessage("Reserva actualizada correctamente.");
    } catch {
      setErrorMessage("No se pudo actualizar la reserva.");
    } finally {
      setLoadingEdit(false);
    }
  }

  /**
   * Confirma y ejecuta el borrado de la reserva objetivo (`deleteTargetId`).
   * Llama a `deleteAppointment` y elimina la reserva del estado local.
   * Si la reserva eliminada estaba siendo editada, cierra también ese panel.
   *
   * @async
   * @returns {Promise<void>}
   */
  async function confirmDelete() {
    if (deleteTargetId === null) return;

    setDeletingBookingId(deleteTargetId);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await deleteAppointment(deleteTargetId);
      setBookings((prev) => prev.filter((booking) => booking.id !== deleteTargetId));

      if (editingBookingId === deleteTargetId) {
        closeEditForm();
      }

      setSuccessMessage("Reserva eliminada correctamente.");
      closeDeleteModal();
    } catch {
      setErrorMessage("No se pudo eliminar la reserva.");
    } finally {
      setDeletingBookingId(null);
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="page-stack">
      {/* Hero: título de sección + botón de acción principal */}
      <section className="page-hero">
        <div>
          <h2>Bookings list</h2>
          <p>Gestión de reservas conectada con la API.</p>
        </div>

        <button className="primary-btn" type="button" onClick={openCreateForm}>
          Nueva reserva
        </button>
      </section>

      {/* KPIs: contadores de reservas por estado */}
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
          <p className="kpi-card__label">Modificadas</p>
          <h3 className="kpi-card__value">{modifiedCount}</h3>
          <p className="kpi-card__meta">Con cambios recientes</p>
        </div>

        <div className="kpi-card">
          <p className="kpi-card__label">Canceladas</p>
          <h3 className="kpi-card__value">{cancelledCount}</h3>
          <p className="kpi-card__meta" style={{ color: 'var(--danger)' }}>Reservas anuladas</p>
        </div>
      </section>

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
                value={createForm.checkInDate}
                onChange={(e) => updateCreateForm("checkInDate", e.target.value)}
                required
              />
              <input
                className="input"
                type="date"
                value={createForm.checkOutDate}
                onChange={(e) => updateCreateForm("checkOutDate", e.target.value)}
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
                <option value="cancelled">Cancelada</option>
              </select>
              <input
                className="input"
                type="number"
                min={1}
                value={createForm.usuarioId}
                onChange={(e) =>
                  updateCreateForm("usuarioId", Number(e.target.value))
                }
                placeholder="Huésped ID"
                required
              />
              <input
                className="input"
                type="number"
                min={1}
                value={createForm.propertyId}
                onChange={(e) =>
                  updateCreateForm("propertyId", Number(e.target.value))
                }
                placeholder="Propiedad ID"
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

      {/* Panel de edición — visible solo cuando hay un editingBookingId activo */}
      {editingBookingId !== null && (
        <section className="section-card">
          <div className="panel-title-row">
            <h3 className="panel-title">Editar reserva #{editingBookingId}</h3>
            <button type="button" className="secondary-btn" onClick={closeEditForm}>
              Cancelar
            </button>
          </div>

          <form onSubmit={handleEditSubmit} className="page-stack" style={{ gap: 16 }}>
            <div className="form-grid">
              <input
                className="input"
                type="date"
                value={editForm.checkInDate}
                onChange={(e) => updateEditForm("checkInDate", e.target.value)}
                required
              />
              <input
                className="input"
                type="date"
                value={editForm.checkOutDate}
                onChange={(e) => updateEditForm("checkOutDate", e.target.value)}
                required
              />
              <select
                className="select"
                value={editForm.status}
                onChange={(e) =>
                  updateEditForm("status", e.target.value as BookingStatus)
                }
              >
                <option value="pending">Pendiente</option>
                <option value="confirmed">Confirmada</option>
                <option value="paid">Pagada</option>
                <option value="cancelled">Cancelada</option>
              </select>
              <input
                className="input"
                type="number"
                min={1}
                value={editForm.usuarioId}
                onChange={(e) =>
                  updateEditForm("usuarioId", Number(e.target.value))
                }
                placeholder="Huésped ID"
                required
              />
              <input
                className="input"
                type="number"
                min={1}
                value={editForm.propertyId}
                onChange={(e) =>
                  updateEditForm("propertyId", Number(e.target.value))
                }
                placeholder="Propiedad ID"
                required
              />
            </div>

            {errorMessage ? <div className="message-error">{errorMessage}</div> : null}

            <div className="message-row">
              <button className="primary-btn" type="submit" disabled={loadingEdit}>
                {loadingEdit ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Modal de confirmación de borrado — visible cuando deleteTargetId tiene valor */}
      {deleteTargetId !== null && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          aria-describedby="delete-modal-description"
          onClick={(e) => {
            // Cierra el modal al hacer clic en el fondo semitransparente
            if (e.target === e.currentTarget) closeDeleteModal();
          }}
        >
          <div className="modal-card">
            <div className="modal-icon">!</div>
            <h3 id="delete-modal-title" className="modal-title">
              Eliminar reserva
            </h3>
            <p id="delete-modal-description" className="modal-text">
              ¿Seguro que quieres eliminar la reserva #{deleteTargetId}? Esta acción no se puede deshacer.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={closeDeleteModal}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="danger-btn"
                onClick={confirmDelete}
                disabled={deletingBookingId === deleteTargetId}
              >
                {deletingBookingId === deleteTargetId ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de reservas con filtros por estado */}
      <section className="section-card">
        <div className="panel-title-row">
          <h3 className="panel-title">Reservas registradas</h3>
          <div className="filter-row">
            {(["all", "pending", "confirmed", "modified", "cancelled"] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                className={`filter-pill${statusFilter === filter ? " filter-pill--active" : ""}`}
                onClick={() => setStatusFilter(filter)}
              >
                {filter === "all" ? "Todas" :
                 filter === "pending" ? "Pendientes" :
                 filter === "confirmed" ? "Confirmadas" :
                 filter === "cancelled" ? "Canceladas" : "Modificadas"}
              </button>
            ))}
          </div>
        </div>

        {successMessage ? <div className="message-success" style={{ marginBottom: 12 }}>{successMessage}</div> : null}
        {errorMessage ? <div className="message-error" style={{ marginBottom: 12 }}>{errorMessage}</div> : null}

        <table className="data-table">
          <thead>
            <tr>
              <SortableHeader label="ID" sortKey="id" isNumeric={true} currentSort={sortConfig} requestSort={requestSort} />
              <SortableHeader label="Check-In" sortKey="checkInDate" currentSort={sortConfig} requestSort={requestSort} />
              <SortableHeader label="Check-Out" sortKey="checkOutDate" currentSort={sortConfig} requestSort={requestSort} />
              <SortableHeader label="Huésped" sortKey="usuarioId" isNumeric={true} currentSort={sortConfig} requestSort={requestSort} />
              <SortableHeader label="Propiedad" sortKey="propertyId" isNumeric={true} currentSort={sortConfig} requestSort={requestSort} />
              <SortableHeader label="Estado" sortKey="status" currentSort={sortConfig} requestSort={requestSort} />
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
                  {statusFilter === "all"
                    ? "No hay reservas registradas. Crea una nueva con el botón superior."
                    : `No hay reservas con estado "${statusFilter}".`}
                </td>
              </tr>
            ) : (
              sortedFilteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td style={{ fontWeight: 600 }}>{booking.id}</td>
                  <td>{formatDate(booking.checkInDate)}</td>
                  <td>{formatDate(booking.checkOutDate)}</td>
                  <td>{booking.usuarioId}</td>
                  <td>{booking.propertyId}</td>
                  <td><Badge status={booking.status} /></td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button type="button" className="secondary-btn" onClick={() => openEditForm(booking)}>
                        Editar
                      </button>
                      <button type="button" className="secondary-btn" onClick={() => openDeleteModal(booking.id)}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}