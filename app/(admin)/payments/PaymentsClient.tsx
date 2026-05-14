"use client";

import { useState, useMemo, useEffect } from "react";
import type { Payment, PaymentStatus, PaymentTypeEnum, CreatePaymentDtoReq, UpdatePaymentDtoReq } from "@/lib/api";
import { createPayment, updatePayment, deletePayment, getAppointments, getPayments } from "@/lib/api";
import KpiCard from "@/components/ui/KpiCard";
import Badge from "@/components/ui/Badge";
import type { BadgeStatus } from "@/components/ui/Badge";

interface PaymentsClientProps {
  initialPayments: Payment[];
}

/** Convierte el PaymentStatus del backend al BadgeStatus del componente compartido */
function paymentStatusToBadge(status: PaymentStatus): { badgeStatus: BadgeStatus; label: string } {
  if (status === "pendiente") return { badgeStatus: "pending", label: "Por cobrar" };
  return { badgeStatus: "paid", label: "Pagado" };
}

function formatDate(dateString?: string) {
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

export default function PaymentsClient({ initialPayments }: PaymentsClientProps) {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getPayments();
        setPayments(data);
      } catch (err) {}
    }
    loadData();
  }, []);
  
  const emptyForm: CreatePaymentDtoReq = { 
    clientName: "", 
    businessName: "", 
    amount: 0, 
    type: "tarjeta", 
    status: "pagado" 
  };

  const [newPayment, setNewPayment] = useState<CreatePaymentDtoReq>(emptyForm);
  const [editForm, setEditForm] = useState<UpdatePaymentDtoReq>({});

  const kpis = useMemo(() => {
    let cobrado = 0;
    let pendiente = 0;
    let pagadosCount = 0;
    let pendientesCount = 0;
    
    payments.forEach(p => {
      const val = Number(p.amount) || 0;
      if (p.status === "pagado") {
        cobrado += val;
        pagadosCount++;
      } else {
        pendiente += val;
        pendientesCount++;
      }
    });

    const conversion = payments.length > 0 ? Math.round((pagadosCount / payments.length) * 100) : 0;

    return { cobrado, pendiente, pagadosCount, pendientesCount, conversion };
  }, [payments]);

  function openEditForm(payment: Payment) {
    setEditingId(payment.id);
    setEditForm({
      clientName: payment.clientName,
      amount: payment.amount,
      type: payment.type,
      status: payment.status,
    });
    setError("");
    setSuccess("");
  }

  function closeEditForm() {
    setEditingId(null);
    setEditForm({});
    setError("");
  }

  function openDeleteModal(id: number) {
    setDeleteTargetId(id);
    setError("");
    setSuccess("");
  }

  function closeDeleteModal() {
    setDeleteTargetId(null);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const created = await createPayment(newPayment);
      setPayments([created, ...payments]);
      setIsModalOpen(false);
      setNewPayment(emptyForm);
      setSuccess("Pago creado correctamente.");
    } catch (err) {
      setError("No se pudo guardar el pago. Verifica los datos o el servidor.");
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const updated = await updatePayment(editingId, editForm);
      setPayments((prev) =>
        prev.map((p) => (p.id === editingId ? updated : p))
      );
      closeEditForm();
      setSuccess("Pago actualizado correctamente.");
    } catch (err) {
      setError("No se pudo actualizar el pago.");
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete() {
    if (deleteTargetId === null) return;

    setDeletingId(deleteTargetId);
    setError("");
    setSuccess("");

    try {
      await deletePayment(deleteTargetId);
      setPayments((prev) => prev.filter((p) => p.id !== deleteTargetId));

      if (editingId === deleteTargetId) {
        closeEditForm();
      }

      setSuccess("Pago eliminado correctamente.");
      closeDeleteModal();
    } catch (err) {
      setError("No se pudo eliminar el pago.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <h2>Payments</h2>
          <p>Seguimiento de cobros realizados y pendientes.</p>
        </div>
        <button className="primary-btn" type="button" onClick={() => setIsModalOpen(true)}>
          Registrar cobro
        </button>
      </section>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false) }}>
          <div className="modal-card">
            <h3 className="modal-title" style={{ marginBottom: 16 }}>Registrar nuevo cobro</h3>
            {error && <div className="message-error" style={{ marginBottom: 12 }}>{error}</div>}
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input required className="input" placeholder="Cliente" value={newPayment.clientName} onChange={e => setNewPayment({...newPayment, clientName: e.target.value})} />
              <input required className="input" placeholder="Comercio" value={newPayment.businessName} onChange={e => setNewPayment({...newPayment, businessName: e.target.value})} />
              <input required type="number" min="0" step="0.01" className="input" placeholder="Importe (€)" value={newPayment.amount || ""} onChange={e => setNewPayment({...newPayment, amount: Number(e.target.value)})} />
              <select className="select" value={newPayment.type} onChange={e => setNewPayment({...newPayment, type: e.target.value as PaymentTypeEnum})}>
                <option value="tarjeta">Tarjeta</option>
                <option value="efectivo">Efectivo</option>
                <option value="bizum">Bizum</option>
                <option value="transferencia">Transferencia</option>
                <option value="pendiente">Pendiente</option>
              </select>
              <select className="select" value={newPayment.status} onChange={e => setNewPayment({...newPayment, status: e.target.value as PaymentStatus})}>
                <option value="pagado">Pagado</option>
                <option value="pendiente">Por cobrar</option>
              </select>
              <div className="modal-actions" style={{ marginTop: 8 }}>
                <button type="button" className="secondary-btn" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="primary-btn" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar cobro"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingId !== null && (
        <section className="section-card">
          <div className="panel-title-row">
            <h3 className="panel-title">Editar pago #{editingId}</h3>
            <button type="button" className="secondary-btn" onClick={closeEditForm}>
              Cancelar
            </button>
          </div>

          <form onSubmit={handleEdit} className="page-stack" style={{ gap: 16 }}>
            <div className="form-grid">
              <input required className="input" placeholder="Cliente" value={editForm.clientName || ""} onChange={e => setEditForm({...editForm, clientName: e.target.value})} />
              <input required className="input" placeholder="Comercio" value={(editForm as any).businessName || ""} onChange={e => setEditForm({...editForm, businessName: e.target.value} as any)} />
              <input required type="number" min="0" step="0.01" className="input" placeholder="Importe (€)" value={editForm.amount || ""} onChange={e => setEditForm({...editForm, amount: Number(e.target.value)})} />
              <select className="select" value={editForm.type || ""} onChange={e => setEditForm({...editForm, type: e.target.value as PaymentTypeEnum})}>
                <option value="">Seleccionar método</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="efectivo">Efectivo</option>
                <option value="bizum">Bizum</option>
                <option value="transferencia">Transferencia</option>
                <option value="pendiente">Pendiente</option>
              </select>
              <select className="select" value={editForm.status || ""} onChange={e => setEditForm({...editForm, status: e.target.value as PaymentStatus})}>
                <option value="">Seleccionar estado</option>
                <option value="pagado">Pagado</option>
                <option value="pendiente">Por cobrar</option>
              </select>
            </div>

            {error ? <div className="message-error">{error}</div> : null}

            <div className="message-row">
              <button className="primary-btn" type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </section>
      )}

      {deleteTargetId !== null && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDeleteModal();
          }}
        >
          <div className="modal-card">
            <div className="modal-icon">!</div>
            <h3 className="modal-title">Eliminar pago</h3>
            <p className="modal-text">
              ¿Seguro que quieres eliminar el pago #{deleteTargetId}? Esta acción no se puede deshacer.
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
                disabled={deletingId === deleteTargetId}
              >
                {deletingId === deleteTargetId ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="kpi-grid">
        <KpiCard title="Cobrado hoy" value={`${kpis.cobrado} €`} subtitle={`${kpis.pagadosCount} operaciones registradas`} variant="positive" />
        <KpiCard title="Pendiente" value={`${kpis.pendiente} €`} subtitle={`${kpis.pendientesCount} cobros por revisar`} variant="warning" />
        <KpiCard title="Método más usado" value="Tarjeta" subtitle="Mayor volumen del día" />
        <KpiCard title="Conversión" value={`${kpis.conversion}%`} subtitle="Cobros cerrados hoy" />
      </section>

      <section className="section-card">
        <div className="panel-title-row">
          <h3 className="panel-title">Listado de cobros</h3>
          <span style={{ color: "#6b7280", fontSize: 14 }}>{payments.length} resultados</span>
        </div>
        {success ? <div className="message-success" style={{ marginBottom: 12 }}>{success}</div> : null}
        {error ? <div className="message-error" style={{ marginBottom: 12 }}>{error}</div> : null}
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Comercio</th>
              <th>Importe</th>
              <th>Método</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td style={{ fontWeight: 600 }}>{payment.id}</td>
                <td>{payment.clientName}</td>
                <td>{payment.businessName}</td>
                <td>{payment.amount} €</td>
                <td>{payment.type}</td>
                <td>{formatDate(payment.date)}</td>
                <td>
                  {(() => {
                    const { badgeStatus, label } = paymentStatusToBadge(payment.status);
                    return <Badge status={badgeStatus} label={label} />;
                  })()}
                </td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button type="button" className="secondary-btn" onClick={() => openEditForm(payment)}>
                      Editar
                    </button>
                    <button type="button" className="secondary-btn" onClick={() => openDeleteModal(payment.id)}>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
