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
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [filterField, setFilterField] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Debounce simple para la búsqueda
    const timer = setTimeout(() => {
      fetchBusinesses(page, search);
    }, 300);
    return () => clearTimeout(timer);
  }, [page, search, sortBy, sortOrder, filterField, filterValue]);

  const fetchBusinesses = async (p: number, s: string) => {
    setLoading(true);
    try {
      const result = await getBusinesses(p, 20, s, sortBy, sortOrder, filterField, filterValue);
      if (Array.isArray(result)) {
        // Fallback local en caso de que el backend envíe todo el array
        const start = (p - 1) * 20;
        setBusinesses(result.slice(start, start + 20));
        setTotal(result.length);
      } else {
        setBusinesses(result?.data || []);
        setTotal(result?.total || 0);
      }
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
        {user?.role === 'admin' && (
          <Link 
            href="/business/new" 
            className="primary-btn"
          >
            + Añadir Negocio
          </Link>
        )}
      </header>

      <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <input 
            type="text" 
            placeholder="Búsqueda inteligente: nombre, dirección, teléfono o propietario..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ padding: '12px', flex: 1, borderRadius: '8px', border: '1px solid var(--border)' }}
          />
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="secondary-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            Filtros y Ordenación
          </button>
        </div>

        {showFilters && (
          <div style={{ padding: '20px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: '200px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600 }}>Ordenar por</label>
              <select 
                value={sortBy} 
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
              >
                <option value="id">Fecha de creación (ID)</option>
                <option value="nombre">Nombre de la empresa</option>
                <option value="direccion">Dirección</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: '150px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600 }}>Dirección del orden</label>
              <select 
                value={sortOrder} 
                onChange={(e) => { setSortOrder(e.target.value); setPage(1); }}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
              >
                <option value="DESC">Descendente (Nuevos / Z-A)</option>
                <option value="ASC">Ascendente (Antiguos / A-Z)</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: '200px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600 }}>Filtro Específico</label>
              <select 
                value={filterField} 
                onChange={(e) => { setFilterField(e.target.value); setFilterValue(""); setPage(1); }}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
              >
                <option value="">Ninguno</option>
                <option value="has_phone">Tiene Teléfono Registrado</option>
                <option value="has_address">Tiene Dirección Registrada</option>
              </select>
            </div>

            {filterField && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: '150px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600 }}>Valor</label>
                <select 
                  value={filterValue} 
                  onChange={(e) => { setFilterValue(e.target.value); setPage(1); }}
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                >
                  <option value="">Seleccionar...</option>
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {error && <div className="message-error" style={{ padding: '12px', background: 'var(--warning-bg)', borderRadius: '12px', marginBottom: '16px' }}>{error}</div>}

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
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <div className="customer-tag">
                📞 {b.telefono || "N/A"}
              </div>
              {user?.username === 'root' && (
                <div className="customer-tag" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-1)' }}>
                  👤 {b.usuario?.nombreCompleto || b.usuario?.username || 'Sin Propietario'}
                </div>
              )}
            </div>

            <div className="customer-next" style={{ color: 'var(--accent)', fontWeight: 600, marginTop: '16px' }}>
              Gestionar local →
            </div>
          </div>
        ))}

        {businesses.length === 0 && (
          <div className="section-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px' }}>
            <p style={{ color: 'var(--muted)' }}>Aún no hay ningún negocio para mostrar.</p>
            {user?.role === 'admin' && (
              <Link href="/business/new" className="panel-subtle-link" style={{ marginTop: '12px', display: 'inline-block' }}>
                Añadir el primero
              </Link>
            )}
          </div>
        )}
      </div>

      {total > 20 && (
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
              max={Math.ceil(total / 20)} 
              value={page}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val >= 1 && val <= Math.ceil(total / 20)) {
                  setPage(val);
                }
              }}
              style={{ width: '70px', padding: '8px', textAlign: 'center', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--surface)' }}
            />
            <span style={{ fontSize: '14px', color: 'var(--muted)' }}>de {Math.ceil(total / 20)}</span>
          </div>

          <button 
            disabled={page >= Math.ceil(total / 20)} 
            onClick={() => setPage(p => p + 1)}
            className="secondary-btn"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
