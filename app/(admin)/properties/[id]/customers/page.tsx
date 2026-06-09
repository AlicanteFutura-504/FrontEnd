"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Loading from "@/components/ui/Loading";
import { getClientsByBusiness, getBookingsByCustomer, updateClient, createClient, getBusinessDashboardSummary } from "@/lib/api";
import { User, Booking } from "@/lib/types";
import Link from "next/link";

export default function BusinessCustomersPage() {
  const params = useParams();
  const businessId = params.id as string;
  const [customers, setCustomers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 50;

  // Modal states para creacion
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({ nombreCompleto: "", email: "", phone: "" });

  // Modal states
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [customerBookings, setCustomerBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState({ nombreCompleto: "" });

  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    if (!businessId) return;
    const fetchSummary = async () => {
      try {
        const res = await getBusinessDashboardSummary(businessId);
        setSummary(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSummary();
  }, [businessId]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const res = await getClientsByBusiness(businessId, page, LIMIT, searchTerm);
        setCustomers(res.data || []);
        setTotal(res.total || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      const timeoutId = setTimeout(() => fetchCustomers(), 300);
      return () => clearTimeout(timeoutId);
    }
  }, [businessId, searchTerm, page]);

  const filteredCustomers = customers; // Eliminado filtro local, ahora es Server-Side

  const handleViewHistory = async (customer: User) => {
    setSelectedCustomer(customer);
    setLoadingBookings(true);
    try {
      const bookings = await getBookingsByCustomer(customer.id);
      // Filter bookings that belong to this business if needed, though they are fetched by customer.
      // If we only want bookings for THIS business:
      const businessBookings = bookings.filter(b => b.businessId === parseInt(businessId, 10));
      setCustomerBookings(businessBookings);
    } catch (err) {
      console.error(err);
      setCustomerBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  const closeHistoryModal = () => {
    setSelectedCustomer(null);
    setCustomerBookings([]);
  };

  if (loading) return <Loading />;

  return (
    <div className="page-stack">
      <header className="page-hero">
        <div>
          <h2>Clientes Vinculados</h2>
          <p>Base de datos de clientes registrados en el sistema. {total > 0 && <strong>({total} en total)</strong>}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setIsAddModalOpen(true)} className="primary-btn">
            + Añadir Cliente
          </button>
          <Link href={`/properties/${businessId}`} className="secondary-btn">Volver al Panel</Link>
        </div>
      </header>

      {summary && (
        <div className="kpi-grid" style={{ marginBottom: '24px' }}>
          <div className="kpi-card">
            <div className="kpi-card__label">Total Clientes</div>
            <div className="kpi-card__value">{summary.totalCustomers}</div>
            <div className="kpi-card__meta kpi-card__meta--positive">
              <span role="img" aria-label="users">👥</span> Registrados
            </div>
          </div>
        </div>
      )}

      <section className="section-card" style={{ padding: '16px' }}>
        <div className="search-row sticky-search" style={{ display: 'flex', alignItems: 'center', background: 'var(--surface-2)', padding: '12px 20px', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--muted)', marginRight: '12px' }}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            className="input search-input" 
            style={{ border: 'none', background: 'transparent', boxShadow: 'none', padding: 0, flex: 1, outline: 'none', fontSize: '15px' }}
            placeholder="Buscar por nombre, email o teléfono..." 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </div>
      </section>

      <div className="customer-grid">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((c) => (
            <div key={c.id} className="customer-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="admin-avatar" style={{ width: '48px', height: '48px' }}>
                  {c.nombreCompleto?.charAt(0) || c.email?.charAt(0)}
                </div>
                <div className="customer-tag">ID #{c.id}</div>
              </div>
              <h3 className="customer-name" style={{ marginTop: '16px' }}>{c.nombreCompleto || 'Sin nombre'}</h3>
              <p className="customer-meta">{c.email}</p>
              <p className="customer-meta" style={{ fontSize: '13px' }}>📞 {c.phone || 'N/A'}</p>
              
              <div className="customer-next" style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link
                  href={`/properties/${businessId}/customers/${c.id}`}
                  className="primary-btn"
                  style={{ width: '100%', textAlign: 'center' }}
                >
                  Ver Perfil de Cliente
                </Link>
                <button 
                  className="panel-subtle-link" 
                  style={{ width: '100%', textAlign: 'center' }}
                  onClick={() => {
                    setEditingCustomer(c);
                    setEditFormData({ nombreCompleto: c.nombreCompleto || "" });
                  }}
                >
                  Editar Cliente
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "#6b7280", gridColumn: "1 / -1", textAlign: "center", padding: "2rem" }}>
            No se encontraron clientes con "{searchTerm}"
          </p>
        )}
      </div>

      {/* Paginación */}
      {total > LIMIT && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '32px', paddingBottom: '32px' }}>
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
              max={Math.ceil(total / LIMIT)}
              value={page}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val >= 1 && val <= Math.ceil(total / LIMIT)) setPage(val);
              }}
              style={{ width: '70px', padding: '8px', textAlign: 'center', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--surface)' }}
            />
            <span style={{ fontSize: '14px', color: 'var(--muted)' }}>de {Math.ceil(total / LIMIT)} ({total} clientes)</span>
          </div>
          <button
            disabled={page >= Math.ceil(total / LIMIT)}
            onClick={() => setPage(p => p + 1)}
            className="secondary-btn"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Modal for Appointment History */}
      {selectedCustomer && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                Historial de citas
              </h3>
              <button 
                onClick={closeHistoryModal}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--muted)' }}
              >
                &times;
              </button>
            </div>
            
            <p style={{ color: 'var(--muted)', marginBottom: '20px' }}>
              Cliente: <strong>{selectedCustomer.nombreCompleto || selectedCustomer.email}</strong>
            </p>

            {loadingBookings ? (
              <p>Cargando citas...</p>
            ) : customerBookings.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {customerBookings.map(b => (
                  <div key={b.id} style={{ 
                    padding: '12px', 
                    border: '1px solid var(--border)', 
                    borderRadius: '8px',
                    background: 'var(--surface-2)' 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 600 }}>{b.serviceName || 'Servicio General'}</span>
                      <span className="status-badge status-confirmed" style={{ fontSize: '12px', padding: '2px 8px' }}>
                        {b.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--muted)', display: 'flex', gap: '12px' }}>
                      <span>📅 {b.date}</span>
                      <span>⏰ {b.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', padding: '20px', color: 'var(--muted)', background: 'var(--surface-2)', borderRadius: '8px' }}>
                Este cliente no tiene citas registradas en tu local.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Modal for Editing Customer */}
      {editingCustomer && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                Editar Cliente
              </h3>
              <button 
                onClick={() => setEditingCustomer(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--muted)' }}
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const updated = await updateClient(editingCustomer.id, {
                  nombreCompleto: editFormData.nombreCompleto
                });
                setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...c, nombreCompleto: updated.nombreCompleto } : c));
                setEditingCustomer(null);
              } catch (error) {
                alert("Error al actualizar cliente");
              }
            }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Nombre Completo</label>
                <input required className="input" value={editFormData.nombreCompleto} onChange={e => setEditFormData({...editFormData, nombreCompleto: e.target.value})} placeholder="Nombre completo" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setEditingCustomer(null)} className="secondary-btn">Cancelar</button>
                <button type="submit" className="primary-btn">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Add Customer */}
      {isAddModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                Añadir Nuevo Cliente
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--muted)' }}
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const newCustomer = await createClient({
                  ...addFormData,
                  // @ts-ignore
                  businessId: parseInt(businessId, 10)
                });
                setCustomers([...customers, newCustomer]);
                setIsAddModalOpen(false);
                setAddFormData({ nombreCompleto: "", email: "", phone: "" });
              } catch (error) {
                alert("Error al añadir cliente. Revisa si el email ya existe.");
              }
            }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Nombre Completo</label>
                <input required className="input" value={addFormData.nombreCompleto} onChange={e => setAddFormData({...addFormData, nombreCompleto: e.target.value})} placeholder="Nombre Completo" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Email</label>
                <input required type="email" className="input" value={addFormData.email} onChange={e => setAddFormData({...addFormData, email: e.target.value})} placeholder="correo@ejemplo.com" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Teléfono</label>
                <input className="input" value={addFormData.phone} onChange={e => setAddFormData({...addFormData, phone: e.target.value})} placeholder="600123456" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="secondary-btn">Cancelar</button>
                <button type="submit" className="primary-btn">Añadir Cliente</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
