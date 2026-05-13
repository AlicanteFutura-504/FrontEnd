"use client";

/**
 * @fileoverview Página del directorio de clientes.
 * Conectada al backend mediante la API para persistir los datos.
 * @module app/(admin)/customers/page
 */

import { useState, useMemo, useEffect } from "react";
import { getCustomers, createCustomer } from "@/lib/api";
import type { Customer, CreateCustomerDto } from "@/lib/api";

function CustomerCard({ customer }: { customer: Customer }) {
  return (
    <div className="customer-card">
      <p className="customer-name">{customer.name}</p>
      <p className="customer-meta">{customer.phone}</p>
      <p className="customer-meta">{customer.email}</p>
      {customer.notes && (
        <div className="customer-tag">{customer.notes}</div>
      )}
      <div className="customer-next">
        <strong>Registrado:</strong> {customer.createdAt}
      </div>
    </div>
  );
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newCustomer, setNewCustomer] = useState<CreateCustomerDto>({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });

  // Carga los clientes desde el backend al montar la página
  useEffect(() => {
    getCustomers()
      .then(setCustomers)
      .catch(() => setError("No se pudieron cargar los clientes."))
      .finally(() => setLoading(false));
  }, []);

  const filteredCustomers = useMemo(() => {
    if (!appliedSearch) return customers;
    const lower = appliedSearch.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.email.toLowerCase().includes(lower)
    );
  }, [customers, appliedSearch]);

  function handleFilter() {
    setAppliedSearch(searchTerm);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await createCustomer(newCustomer);
      setCustomers([created, ...customers]);
      setIsModalOpen(false);
      setNewCustomer({ name: "", phone: "", email: "", notes: "" });
    } catch {
      alert("Error al guardar el cliente. Comprueba que el email no esté repetido.");
    } finally {
      setSaving(false);
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
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="modal-card">
            <h3 className="modal-title" style={{ marginBottom: 16 }}>
              Crear nuevo cliente
            </h3>
            <form
              onSubmit={handleCreate}
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              <input
                required
                className="input"
                placeholder="Nombre completo"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              />
              <input
                required
                className="input"
                placeholder="Teléfono"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              />
              <input
                required
                type="email"
                className="input"
                placeholder="Email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              />
              <input
                className="input"
                placeholder="Notas (opcional)"
                value={newCustomer.notes ?? ""}
                onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
              />

              <div className="modal-actions" style={{ marginTop: 8 }}>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="primary-btn" disabled={saving}>
                  {saving ? "Guardando..." : "Guardar cliente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className="section-card">
        <div className="search-row">
          <input
            className="input"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFilter()}
          />
          <button className="secondary-btn" type="button" onClick={handleFilter}>
            Filtrar
          </button>
        </div>
      </section>

      <section className="customer-grid">
        {loading && (
          <p style={{ color: "#6b7280", gridColumn: "1 / -1", textAlign: "center", padding: "2rem" }}>
            Cargando clientes...
          </p>
        )}
        {error && (
          <p style={{ color: "red", gridColumn: "1 / -1", textAlign: "center", padding: "2rem" }}>
            {error}
          </p>
        )}
        {!loading && filteredCustomers.length > 0 &&
          filteredCustomers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        {!loading && !error && filteredCustomers.length === 0 && (
          <p style={{ color: "#6b7280", gridColumn: "1 / -1", textAlign: "center", padding: "2rem" }}>
            {appliedSearch
              ? `No se encontraron clientes con "${appliedSearch}"`
              : "No hay clientes registrados todavía."}
          </p>
        )}
      </section>
    </div>
  );
}
