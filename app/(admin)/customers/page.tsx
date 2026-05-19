"use client";

/**
 * @fileoverview Página del directorio de clientes.
 * Transformada en Client Component para dar interactividad a los botones.
 * @module app/(admin)/customers/page
 */

import { useState, useMemo } from "react";

// Datos iniciales
const initialCustomers = [
  { id: "C-001", name: "María López", phone: "600 123 456", email: "maria@email.com", business: "Peluquería Nova", nextBooking: "Hoy · 09:00" },
  { id: "C-002", name: "Carlos Pérez", phone: "611 456 789", email: "carlos@email.com", business: "Restaurante Marea", nextBooking: "Hoy · 10:30" },
  { id: "C-003", name: "Lucía Sánchez", phone: "622 987 654", email: "lucia@email.com", business: "Barber Studio", nextBooking: "Mañana · 12:00" },
];

function CustomerCard({ customer }: { customer: typeof initialCustomers[0] }) {
  return (
    <div className="customer-card">
      <p className="customer-name">{customer.name}</p>
      <p className="customer-meta">{customer.phone}</p>
      <p className="customer-meta">{customer.email}</p>
      <div className="customer-tag">{customer.business}</div>
      <div className="customer-next">
        <strong>Próxima reserva:</strong> {customer.nextBooking}
      </div>
    </div>
  );
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado del nuevo cliente
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", email: "", business: "" });

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    const lower = searchTerm.toLowerCase();
    return customers.filter(c => 
      c.name.toLowerCase().includes(lower) || 
      c.business.toLowerCase().includes(lower) ||
      c.email.toLowerCase().includes(lower)
    );
  }, [customers, searchTerm]);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const id = `C-${crypto.randomUUID().split("-")[0]}`;
    setCustomers([{ ...newCustomer, id, nextBooking: "Sin reservas" }, ...customers]);
    setIsModalOpen(false);
    setNewCustomer({ name: "", phone: "", email: "", business: "" });
  }

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <h2>Customer directory</h2>
          <p>Gestión visual de clientes y próximas reservas.</p>
        </div>
        <button className="primary-btn" type="button" onClick={() => setIsModalOpen(true)}>
          Nuevo cliente
        </button>
      </section>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false) }}>
          <div className="modal-card">
            <h3 className="modal-title" style={{ marginBottom: 16 }}>Crear nuevo cliente</h3>
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input required className="input" placeholder="Nombre completo" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
              <input required className="input" placeholder="Teléfono" value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} />
              <input required type="email" className="input" placeholder="Email" value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} />
              <input required className="input" placeholder="Negocio" value={newCustomer.business} onChange={e => setNewCustomer({...newCustomer, business: e.target.value})} />
              
              <div className="modal-actions" style={{ marginTop: 8 }}>
                <button type="button" className="secondary-btn" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="primary-btn">Guardar cliente</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className="section-card" style={{ padding: '16px' }}>
        <div className="search-row" style={{ display: 'flex', alignItems: 'center', background: 'var(--surface-2)', padding: '12px 20px', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--muted)', marginRight: '12px' }}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            className="input search-input" 
            style={{ border: 'none', background: 'transparent', boxShadow: 'none', padding: 0, flex: 1, outline: 'none', fontSize: '15px' }}
            placeholder="Buscar por nombre, email o negocio..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      <section className="customer-grid">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))
        ) : (
          <p style={{ color: "#6b7280", gridColumn: "1 / -1", textAlign: "center", padding: "2rem" }}>
            No se encontraron clientes con "{searchTerm}"
          </p>
        )}
      </section>
    </div>
  );
}