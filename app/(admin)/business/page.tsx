"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { getBusinesses, deleteBusiness } from "@/lib/api";
import { Business } from "@/lib/types";

export default function BusinessListPage() {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const data = await getBusinesses();
      setBusinesses(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm("¿Estás seguro de que quieres eliminar este negocio?")) return;

    try {
      await deleteBusiness(id);
      setBusinesses(businesses.filter(b => b.id !== id));
    } catch (err: any) {
      alert("Error al eliminar: " + err.message);
    }
  };

  if (loading) return <div className="p-8">Cargando negocios...</div>;

  return (
    <div className="page-stack">
      <header className="page-hero">
        <div>
          <h2>Mis Negocios</h2>
          <p>Gestiona y monitoriza todos tus locales desde una vista centralizada.</p>
        </div>
        <Link 
          href="/business/new" 
          className="primary-btn"
        >
          + Añadir Negocio
        </Link>
      </header>

      {error && <div className="message-error" style={{ padding: '12px', background: 'var(--warning-bg)', borderRadius: '12px' }}>{error}</div>}

      {user?.username === 'root' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {Object.entries(
            businesses.reduce((acc, business) => {
              const ownerName = business.usuario?.nombreCompleto || business.usuario?.username || 'Sin Propietario';
              if (!acc[ownerName]) acc[ownerName] = [];
              acc[ownerName].push(business);
              return acc;
            }, {} as Record<string, Business[]>)
          ).map(([owner, ownerBusinesses]) => (
            <div key={owner} style={{ background: 'var(--surface)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <h3 style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: 'var(--primary-soft)', padding: '4px 8px', borderRadius: '6px', fontSize: '14px' }}>👤 Empresario</span> 
                {owner}
              </h3>
              <div className="customer-grid">
                {ownerBusinesses.map((b) => (
                  <div 
                    key={b.id} 
                    className="customer-card"
                    style={{ cursor: 'pointer', position: 'relative' }}
                    onClick={() => window.location.href = `/business/${b.id}`}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontSize: '24px', background: 'var(--primary-soft)', padding: '10px', borderRadius: '12px' }}>🏢</div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link 
                          href={`/business/edit/${b.id}`}
                          className="secondary-btn"
                          style={{ padding: '6px 10px', fontSize: '12px' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          ✎
                        </Link>
                        <button 
                          onClick={(e) => handleDelete(e, b.id)}
                          className="secondary-btn"
                          style={{ padding: '6px 10px', fontSize: '12px', color: '#ef4444' }}
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="customer-name" style={{ marginTop: '16px' }}>{b.nombre}</h3>
                    <p className="customer-meta">{b.direccion || "Sin dirección registrada"}</p>
                    
                    <div className="customer-tag">
                      📞 {b.telefono || "N/A"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {businesses.length === 0 && (
            <div className="section-card" style={{ textAlign: 'center', padding: '60px' }}>
              <p style={{ color: 'var(--muted)' }}>El sistema aún no tiene ningún negocio registrado.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="customer-grid">
          {businesses.map((b) => (
            <div 
              key={b.id} 
              className="customer-card"
              style={{ cursor: 'pointer', position: 'relative' }}
              onClick={() => window.location.href = `/business/${b.id}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '24px', background: 'var(--primary-soft)', padding: '10px', borderRadius: '12px' }}>🏢</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link 
                    href={`/business/edit/${b.id}`}
                    className="secondary-btn"
                    style={{ padding: '6px 10px', fontSize: '12px' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    ✎
                  </Link>
                  <button 
                    onClick={(e) => handleDelete(e, b.id)}
                    className="secondary-btn"
                    style={{ padding: '6px 10px', fontSize: '12px', color: '#ef4444' }}
                  >
                    🗑
                  </button>
                </div>
              </div>
              
              <h3 className="customer-name" style={{ marginTop: '16px' }}>{b.nombre}</h3>
              <p className="customer-meta">{b.direccion || "Sin dirección registrada"}</p>
              
              <div className="customer-tag">
                📞 {b.telefono || "N/A"}
              </div>

              <div className="customer-next" style={{ color: 'var(--accent)', fontWeight: 600, marginTop: '16px' }}>
                Gestionar local →
              </div>
            </div>
          ))}

          {businesses.length === 0 && (
            <div className="section-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px' }}>
              <p style={{ color: 'var(--muted)' }}>Aún no has añadido ningún negocio.</p>
              <Link href="/business/new" className="panel-subtle-link" style={{ marginTop: '12px', display: 'inline-block' }}>
                Empezar ahora
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
