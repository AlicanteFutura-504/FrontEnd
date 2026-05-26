"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { getCustomers, getBookingsByCustomer, getBookingsByBusiness, getPayments, updateCustomer } from "@/lib/api";
import { Customer, Booking } from "@/lib/types";
import Link from "next/link";

export default function BusinessCustomersPage() {
  const params = useParams();
  const businessId = params.id as string;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal states
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerBookings, setCustomerBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editFormData, setEditFormData] = useState({ name: "", surname: "" });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const [allCustomers, businessBookings, allPayments] = await Promise.all([
          getCustomers(),
          getBookingsByBusiness(businessId),
          getPayments()
        ]);

        const businessPayments = allPayments.filter(p => String(p.businessId) === businessId);

        const validCustomerIds = new Set<number>();
        businessBookings.forEach(b => {
          if (b.customerId) validCustomerIds.add(b.customerId);
        });
        businessPayments.forEach(p => {
          if (p.customerId) validCustomerIds.add(p.customerId);
        });

        const filteredCustomers = allCustomers.filter(c => validCustomerIds.has(c.id));
        setCustomers(filteredCustomers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      fetchCustomers();
    }
  }, [businessId]);

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    const lower = searchTerm.toLowerCase();
    return customers.filter(c => 
      c.name.toLowerCase().includes(lower) || 
      (c.surname && c.surname.toLowerCase().includes(lower)) ||
      c.email.toLowerCase().includes(lower) ||
      (c.phone && c.phone.includes(lower))
    );
  }, [customers, searchTerm]);

  const handleViewHistory = async (customer: Customer) => {
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

  if (loading) return <div className="p-8">Cargando clientes...</div>;

  return (
    <div className="page-stack">
      <header className="page-hero">
        <div>
          <h2>Clientes Vinculados</h2>
          <p>Base de datos de clientes registrados en el sistema.</p>
        </div>
        <Link href={`/business/${businessId}`} className="secondary-btn">Volver al Panel</Link>
      </header>

      <section className="section-card" style={{ padding: '16px' }}>
        <div className="search-row" style={{ display: 'flex', alignItems: 'center', background: 'var(--surface-2)', padding: '12px 20px', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--muted)', marginRight: '12px' }}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            className="input search-input" 
            style={{ border: 'none', background: 'transparent', boxShadow: 'none', padding: 0, flex: 1, outline: 'none', fontSize: '15px' }}
            placeholder="Buscar por nombre, email o teléfono..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      <div className="customer-grid">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((c) => (
            <div key={c.id} className="customer-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="admin-avatar" style={{ width: '48px', height: '48px' }}>
                  {c.name.charAt(0)}
                </div>
                <div className="customer-tag">ID #{c.id}</div>
              </div>
              <h3 className="customer-name" style={{ marginTop: '16px' }}>{c.name} {c.surname}</h3>
              <p className="customer-meta">{c.email}</p>
              <p className="customer-meta" style={{ fontSize: '13px' }}>📞 {c.phone || 'N/A'}</p>
              
              <div className="customer-next" style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button 
                  className="panel-subtle-link" 
                  style={{ width: '100%', textAlign: 'center' }}
                  onClick={() => {
                    setEditingCustomer(c);
                    setEditFormData({ name: c.name || "", surname: c.surname || "" });
                  }}
                >
                  Editar Cliente
                </button>
                <button 
                  className="panel-subtle-link" 
                  style={{ width: '100%', textAlign: 'center' }}
                  onClick={() => handleViewHistory(c)}
                >
                  Ver historial de citas
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

      {/* Modal for Appointment History */}
      {selectedCustomer && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
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
              Cliente: <strong>{selectedCustomer.name} {selectedCustomer.surname}</strong>
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
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
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
                const updated = await updateCustomer(editingCustomer.id, {
                  name: editFormData.name,
                  surname: editFormData.surname
                });
                setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...c, name: updated.name, surname: updated.surname } : c));
                setEditingCustomer(null);
              } catch (error) {
                alert("Error al actualizar cliente");
              }
            }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Nombre</label>
                <input required className="input" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} placeholder="Nombre" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Apellidos</label>
                <input className="input" value={editFormData.surname} onChange={e => setEditFormData({...editFormData, surname: e.target.value})} placeholder="Apellidos" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setEditingCustomer(null)} className="secondary-btn">Cancelar</button>
                <button type="submit" className="primary-btn">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
