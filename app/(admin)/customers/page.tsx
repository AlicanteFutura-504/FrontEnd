"use client";

/**
 * @fileoverview Página del directorio de clientes.
 * Transformada en Client Component para dar interactividad a los botones.
 * @module app/(admin)/customers/page
 */

import { useState, useMemo, useEffect } from "react";
import { getCustomers, createCustomer } from "@/lib/api";

function CustomerCard({ customer }: { customer: any }) {
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
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado del nuevo cliente
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", email: "", business: "" });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        const mapped = data.map(c => ({
          id: `C-00${c.id}`,
          name: `${c.name} ${c.surname || ''}`.trim(),
          phone: c.phone || 'N/A',
          email: c.email,
          business: "Establecimiento Asociado",
          nextBooking: "Sin reservas"
        }));
        setCustomers(mapped);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    const lower = searchTerm.toLowerCase();
    return customers.filter(c => 
      c.name.toLowerCase().includes(lower) || 
      c.business.toLowerCase().includes(lower) ||
      c.email.toLowerCase().includes(lower)
    );
  }, [customers, searchTerm]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const parts = newCustomer.name.split(" ");
      const name = parts[0];
      const surname = parts.slice(1).join(" ");
      
      const created = await createCustomer({
        name,
        surname,
        email: newCustomer.email,
        phone: newCustomer.phone
      });
      
      setCustomers([{ 
        id: `C-00${created.id}`, 
        name: `${created.name} ${created.surname || ''}`.trim(), 
        phone: created.phone || 'N/A', 
        email: created.email, 
        business: newCustomer.business || "Establecimiento Asociado", 
        nextBooking: "Sin reservas" 
      }, ...customers]);
      
      setIsModalOpen(false);
      setNewCustomer({ name: "", phone: "", email: "", business: "" });
    } catch (err) {
      console.error("Error al crear cliente:", err);
    } finally {
      setIsSubmitting(false);
    }
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