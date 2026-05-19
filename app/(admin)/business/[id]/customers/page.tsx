"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { getCustomers } from "@/lib/api";
import { Customer } from "@/lib/types";
import Link from "next/link";

export default function BusinessCustomersPage() {
  const params = useParams();
  const businessId = params.id as string;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        // Nota: En este MVP los clientes son globales, pero mostramos el listado con el estilo adecuado
        setCustomers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

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
              
              <div className="customer-next" style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <button className="panel-subtle-link" style={{ width: '100%', textAlign: 'center' }}>
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
    </div>
  );
}
