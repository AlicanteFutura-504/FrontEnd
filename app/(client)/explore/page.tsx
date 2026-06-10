"use client";

import { useEffect, useState } from "react";
import { getBusinesses } from "@/lib/api";
import { Business } from "@/lib/types";

export default function ClientExplorePage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchBiz = async () => {
      try {
        setLoading(true);
        const res = await getBusinesses(1, 20);
        setBusinesses(res.data || []);
        setTotal(res.total || 0);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchBiz();
  }, []);

  const handleLoadMore = async () => {
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const res = await getBusinesses(nextPage, 20);
      setBusinesses(prev => [...prev, ...(res.data || [])]);
      setPage(nextPage);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <>
      <aside className="client-sidebar">
        <h3 className="client-filter-title">Filtros Avanzados</h3>
        
        <div className="client-filter-section">
          <h4 style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 8 }}>Precio</h4>
          <input type="range" min="10" max="200" style={{ width: "100%", accentColor: "var(--accent-1)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
            <span>10€</span>
            <span>200€+</span>
          </div>
        </div>

        <div className="client-filter-section">
          <h4 style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 12 }}>Valoración</h4>
          {[5, 4, 3, 2].map(star => (
            <label key={star} className="client-filter-item">
              <input type="checkbox" />
              <span>{star} ⭐</span>
            </label>
          ))}
        </div>

        <div className="client-filter-section">
          <h4 style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 12 }}>Tipo de Servicio</h4>
          {["Corte", "Color", "Peinado", "Maquillaje"].map(type => (
            <label key={type} className="client-filter-item">
              <input type="checkbox" />
              <span>{type}</span>
            </label>
          ))}
        </div>

        <div className="client-filter-section">
          <h4 style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 12 }}>Amenidades</h4>
          {["WiFi", "Café", "Estacionamiento"].map(amenity => (
            <label key={amenity} className="client-filter-item">
              <input type="checkbox" />
              <span>{amenity}</span>
            </label>
          ))}
        </div>
      </aside>

      <section className="client-content">
        <div>
          <h1 className="client-page-title">Salones y Servicios</h1>
          <p className="client-page-subtitle">Alicante | {total} resultados</p>
        </div>

        {loading ? (
          <>
            <div className="client-business-card skeleton" style={{ height: 212 }}></div>
            <div className="client-business-card skeleton" style={{ height: 212 }}></div>
            <div className="client-business-card skeleton" style={{ height: 212 }}></div>
          </>
        ) : businesses.length > 0 ? (
          businesses.map(b => (
            <div key={b.id} className="client-business-card">
              <div className="client-business-image-placeholder">
                💈
              </div>
              
              <div className="client-business-info">
                <h2 className="client-business-title">{b.nombre}</h2>
                <div className="client-business-meta">
                  <span>{b.city ? `${b.city}, ${b.address || ''}` : "Alicante Centro"}</span>
                  <span style={{ color: "var(--border-strong)" }}>|</span>
                  <span className="client-rating">4.8 ⭐ <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(215 reseñas)</span></span>
                </div>
                
                <p className="client-business-desc">
                  Salón premium con expertos estilistas. {b.nombre} ofrece un servicio personalizado y de alta calidad para que encuentres tu mejor estilo.
                </p>

                <div className="client-business-footer">
                  <div className="client-business-features">
                    <span title="WiFi">📶</span>
                    <span title="Café">☕</span>
                    <span title="Estacionamiento">🚘</span>
                  </div>
                  <div>
                    <div className="client-business-price">
                      35€ <span style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 400 }}>/ sesión</span>
                    </div>
                    <button className="client-book-btn">Reservar Ahora</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
            No se encontraron propiedads.
          </div>
        )}

        {businesses.length > 0 && businesses.length < total && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
            <button 
              className="secondary-btn" 
              onClick={handleLoadMore} 
              disabled={loadingMore}
            >
              {loadingMore ? 'Cargando...' : 'Cargar más resultados'}
            </button>
          </div>
        )}
      </section>
    </>
  );
}
