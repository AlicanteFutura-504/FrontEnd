"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPayments, updatePayment, deletePayment, createPayment } from "@/lib/api";
import { Payment, PaymentStatus, PaymentTypeEnum } from "@/lib/types";
import KpiCard from "@/components/ui/KpiCard";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

export default function BusinessPaymentsPage() {
  const params = useParams();
  const businessId = params.id as string;
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  // States para edicion inline
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Payment>>({});

  // States para modal de creacion
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    clientName: '',
    amount: 0,
    type: 'tarjeta' as PaymentTypeEnum,
    status: 'pagado' as PaymentStatus,
    date: new Date().toISOString().split('T')[0]
  });

  const handleEditClick = (p: Payment) => {
    setEditingId(p.id);
    setEditFormData(p);
  };

  const handleConfirmEdit = async () => {
    if (!editingId) return;
    try {
      const updated = await updatePayment(editingId, {
        clientName: editFormData.clientName,
        amount: editFormData.amount,
        type: editFormData.type,
        status: editFormData.status,
        date: editFormData.date,
      });
      setPayments(payments.map(p => p.id === editingId ? { ...p, ...editFormData } : p));
      setEditingId(null);
    } catch (err) {
      alert("Error al modificar pago");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que quieres eliminar este pago?")) return;
    try {
      await deletePayment(id);
      setPayments(payments.filter(p => p.id !== id));
      setEditingId(null);
    } catch (err) {
      alert("Error al eliminar pago");
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newPayment = await createPayment({
        ...addFormData,
        businessName: "Negocio Actual",
        businessId: parseInt(businessId, 10),
      });
      setPayments([...payments, newPayment]);
      setIsAddModalOpen(false);
      setAddFormData({
        clientName: '',
        amount: 0,
        type: 'tarjeta',
        status: 'pagado',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      alert("Error al crear pago");
    }
  };

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getPayments();
        const filtered = data.filter(p => String(p.businessId) === businessId);
        setPayments(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (businessId) fetchPayments();
  }, [businessId]);

  if (loading) return <div className="p-8">Cargando pagos...</div>;

  const stats = {
    total: payments.reduce((acc, p) => acc + (p.status === 'pagado' ? p.amount : 0), 0),
    pending: payments.reduce((acc, p) => acc + (p.status === 'pendiente' ? p.amount : 0), 0),
  };

  return (
    <div className="page-stack">
      <header className="page-hero">
        <div>
          <h2>Pagos e Ingresos</h2>
          <p>Control financiero detallado de este local.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setIsAddModalOpen(true)} className="primary-btn">
            + Añadir pago
          </button>
          <Link href={`/business/${businessId}`} className="secondary-btn">Volver al Panel</Link>
        </div>
      </header>

      <section className="kpi-grid">
        <KpiCard title="Cobrado" value={`${stats.total} €`} variant="positive" subtitle="Pagos liquidados" />
        <KpiCard title="Pendiente" value={`${stats.pending} €`} variant="warning" subtitle="Cuentas abiertas" />
        <KpiCard title="Operaciones" value={payments.length.toString()} subtitle="Total de registros" />
        <KpiCard title="Ticket Medio" value={`${payments.length > 0 ? (stats.total / payments.length).toFixed(2) : 0} €`} subtitle="Basado en cobros" />
      </section>

      <section className="section-card">
        <div className="panel-title-row">
          <h3 className="panel-title">Histórico Financiero</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Importe</th>
              <th>Método</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id}>
                {editingId === p.id ? (
                  <>
                    <td style={{ fontWeight: 600 }}>
                      <input className="input" type="text" style={{ padding: '8px', fontSize: '14px', width: '150px' }} value={editFormData.clientName || ''} onChange={(e) => setEditFormData({...editFormData, clientName: e.target.value})} />
                    </td>
                    <td>
                      <input className="input" type="number" style={{ padding: '8px', fontSize: '14px', width: '80px' }} value={editFormData.amount || 0} onChange={(e) => setEditFormData({...editFormData, amount: parseFloat(e.target.value)})} /> €
                    </td>
                    <td>
                      <select className="select" style={{ padding: '8px', fontSize: '14px' }} value={editFormData.type || 'tarjeta'} onChange={(e) => setEditFormData({...editFormData, type: e.target.value as PaymentTypeEnum})}>
                        <option value="tarjeta">Tarjeta</option>
                        <option value="efectivo">Efectivo</option>
                        <option value="bizum">Bizum</option>
                        <option value="transferencia">Transferencia</option>
                        <option value="pendiente">Pendiente</option>
                      </select>
                    </td>
                    <td>
                      <input className="input" type="date" style={{ padding: '8px', fontSize: '14px' }} value={editFormData.date || ''} onChange={(e) => setEditFormData({...editFormData, date: e.target.value})} />
                    </td>
                    <td style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <select className="select" style={{ padding: '8px', fontSize: '14px' }} value={editFormData.status || 'pendiente'} onChange={(e) => setEditFormData({...editFormData, status: e.target.value as PaymentStatus})}>
                        <option value="pagado">Pagado</option>
                        <option value="pendiente">Pendiente</option>
                      </select>
                      <button onClick={handleConfirmEdit} className="primary-btn" style={{ padding: '6px 12px', fontSize: '13px' }}>Confirmar</button>
                      <button onClick={() => handleDelete(p.id)} className="secondary-btn" style={{ padding: '6px 12px', fontSize: '13px', color: 'var(--danger)', borderColor: 'var(--danger-bg)' }}>Eliminar</button>
                      <button onClick={() => setEditingId(null)} className="panel-subtle-link" style={{ marginLeft: '4px' }}>✕</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ fontWeight: 600 }}>{p.clientName}</td>
                    <td>{p.amount} €</td>
                    <td style={{ textTransform: 'capitalize' }}>{p.type}</td>
                    <td>{p.date || 'N/A'}</td>
                    <td style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <Badge status={p.status === 'pagado' ? 'paid' : 'pending'} label={p.status} />
                      <button onClick={() => handleEditClick(p)} className="panel-subtle-link" style={{ fontSize: '13px' }}>Modificar</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
                  No hay movimientos financieros en este local.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {isAddModalOpen && (
        <div className="modal-backdrop" style={{ display: 'flex' }}>
          <div className="modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Añadir nuevo pago</h3>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--muted)' }}>&times;</button>
            </div>
            
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Cliente</label>
                <input required className="input" value={addFormData.clientName} onChange={e => setAddFormData({...addFormData, clientName: e.target.value})} placeholder="Nombre del cliente" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Importe (€)</label>
                  <input required type="number" step="0.01" className="input" value={addFormData.amount} onChange={e => setAddFormData({...addFormData, amount: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Fecha</label>
                  <input required type="date" className="input" value={addFormData.date} onChange={e => setAddFormData({...addFormData, date: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Método</label>
                  <select className="select" value={addFormData.type} onChange={e => setAddFormData({...addFormData, type: e.target.value as PaymentTypeEnum})}>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="bizum">Bizum</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="pendiente">Pendiente</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Estado</label>
                  <select className="select" value={addFormData.status} onChange={e => setAddFormData({...addFormData, status: e.target.value as PaymentStatus})}>
                    <option value="pagado">Pagado</option>
                    <option value="pendiente">Pendiente</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="secondary-btn">Cancelar</button>
                <button type="submit" className="primary-btn">Guardar Pago</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
