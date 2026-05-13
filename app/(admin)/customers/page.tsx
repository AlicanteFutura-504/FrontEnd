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
  const [appliedSearch, setAppliedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado del nuevo cliente
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", email: "", business: "" });

  const filteredCustomers = useMemo(() => {
    if (!appliedSearch) return customers;
    const lower = appliedSearch.toLowerCase();
    return customers.filter(c => 
      c.name.toLowerCase().includes(lower) || 
      c.business.toLowerCase().includes(lower) ||
      c.email.toLowerCase().includes(lower)
    );
  }, [customers, appliedSearch]);

  function handleFilter() {
    setAppliedSearch(searchTerm);
  }

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

      <section className="section-card">
        <div className="search-row">
          <input 
            className="input" 
            placeholder="Buscar por nombre, email o negocio..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
          />
          <button className="secondary-btn" type="button" onClick={handleFilter}>
            Filtrar
          </button>
        </div>
      </section>

      <section className="customer-grid">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))
        ) : (
          <p style={{ color: "#6b7280", gridColumn: "1 / -1", textAlign: "center", padding: "2rem" }}>
            No se encontraron clientes con "{appliedSearch}"
          </p>
        )}
      </section>
    </div>
  );
}