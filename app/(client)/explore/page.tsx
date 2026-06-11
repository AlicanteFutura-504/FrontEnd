"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getBusinesses } from "@/lib/api";
import { Business } from "@/lib/types";

interface ExtendedBusiness extends Business {
  score?: number;
  isPromoted?: boolean;
  pricePerNight: number; // Forzado según el nuevo tipado base
  images: string[];      // Forzado según el nuevo tipado base
  description?: string;
  amenities: string[];   // Forzado según el nuevo tipado base
}

export default function ClientExplorePage() {
  const searchParams = useSearchParams();
  const cityParam = searchParams.get("city") || "";

  const [businesses, setBusinesses] = useState<ExtendedBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxPrice, setMaxPrice] = useState(1000); // 🔴 MEJORA: Subido de 300 a 1000 para no bloquear propiedades caras
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (cityParam) {
      setSearchQuery(cityParam);
    }
  }, [cityParam]);

  useEffect(() => {
    const fetchBiz = async () => {
      try {
        setLoading(true);
        // 🔴 CRÍTICO: Ahora se le pasa el query string (cityParam) inicial a la API si existe
        const res = await getBusinesses(1, 100, cityParam || "", "score", "DESC");
        setBusinesses(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchBiz();
  }, [cityParam]); // Ejecutar de nuevo si cambia el parámetro de ciudad de la URL

  const filteredBusinesses = businesses.filter((b) => {
    // 1. Search Query filter (matches name, city, address, description)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const nameMatch = b.nombre?.toLowerCase().includes(q);
      const cityMatch = b.city?.toLowerCase().includes(q);
      const addressMatch = b.address?.toLowerCase().includes(q);
      const descMatch = b.description?.toLowerCase().includes(q);
      if (!nameMatch && !cityMatch && !addressMatch && !descMatch) return false;
    }

    // 2. Price filter
    // 🔴 CRÍTICO: Cast preventivo a Number por si el backend responde con un string numérico
    const actualPrice = b.pricePerNight ? Number(b.pricePerNight) : 0;
    if (actualPrice > maxPrice) {
      return false;
    }

    // 3. Stars filter (average score rounded to closest integer)
    if (selectedStars.length > 0) {
      const rating = b.score || 0;
      const roundedRating = Math.round(rating);
      if (!selectedStars.includes(roundedRating)) {
        return false;
      }
    }

    // 4. Amenities filter
    if (selectedAmenities.length > 0) {
      const bAmenities = b.amenities || [];
      const hasAll = selectedAmenities.every((amenity) =>
        bAmenities.some((bAmenity: string) =>
          bAmenity.toLowerCase().includes(amenity.toLowerCase())
        )
      );
      if (!hasAll) return false;
    }

    return true;
  });

  return (
    <>
      <aside className="client-sidebar">
        <h3 className="client-filter-title">Filtros Avanzados</h3>
        
        <div className="client-filter-section">
          <h4 style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 8 }}>Precio Máximo</h4>
          <input 
            type="range" 
            min="10" 
            max="1000" // 🔴 Actualizado a juego con el estado inicial
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            style={{ width: "100%", accentColor: "var(--accent-1)" }} 
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
            <span>10 €</span>
            <span>{maxPrice} €</span>
          </div>
        </div>

        <div className="client-filter-section">
          <h4 style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 12 }}>Valoración</h4>
          {[5, 4, 3, 2].map(star => (
            <label key={star} className="client-filter-item">
              <input 
                type="checkbox" 
                checked={selectedStars.includes(star)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedStars(prev => [...prev, star]);
                  } else {
                    setSelectedStars(prev => prev.filter(s => s !== star));
                  }
                }}
              />
              <span>{star} ⭐ ({star === 5 ? "Excelente" : star === 4 ? "Muy bueno" : star === 3 ? "Bueno" : "Aceptable"})</span>
            </label>
          ))}
        </div>

        <div className="client-filter-section">
          <h4 style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 12 }}>Comodidades</h4>
          {["Wifi", "Cocina", "TV", "Aire acondicionado", "Piscina"].map(amenity => (
            <label key={amenity} className="client-filter-item">
              <input 
                type="checkbox" 
                checked={selectedAmenities.includes(amenity)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedAmenities(prev => [...prev, amenity]);
                  } else {
                    setSelectedAmenities(prev => prev.filter(a => a !== amenity));
                  }
                }}
              />
              <span>{amenity}</span>
            </label>
          ))}
        </div>
      </aside>

      <section className="client-content">
        <div>
          <h1 className="client-page-title">Explorar Propiedades</h1>
          <p className="client-page-subtitle">Alicante | {filteredBusinesses.length} resultados</p>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <input 
            type="text" 
            placeholder="Buscar por nombre de propiedad, ciudad o descripción..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 20px",
              borderRadius: "12px",
              border: "1px solid var(--border-strong)",
              background: "var(--surface)",
              color: "var(--text)",
              outline: "none",
              fontSize: "1rem"
            }}
          />
        </div>

        {loading ? (
          <>
            <div className="client-business-card skeleton" style={{ height: 212 }}></div>
            <div className="client-business-card skeleton" style={{ height: 212 }}></div>
            <div className="client-business-card skeleton" style={{ height: 212 }}></div>
          </>
        ) : filteredBusinesses.length > 0 ? (
          filteredBusinesses.map(b => (
            <div key={b.id} className="client-business-card">
              <img 
                src={b.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                alt={b.nombre}
                className="client-business-image"
              />
              
              <div className="client-business-info">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <h2 className="client-business-title">{b.nombre}</h2>
                  {b.isPromoted && (
                    <span style={{ background: "rgba(255,56,92,0.1)", color: "#FF385C", padding: "4px 8px", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 700 }}>
                      Recomendado
                    </span>
                  )}
                </div>
                <div className="client-business-meta">
                  <span>📍 {b.city ? `${b.city}${b.address ? `, ${b.address}` : ""}` : "Alicante, España"}</span>
                  <span style={{ color: "var(--border-strong)" }}>|</span>
                  <span className="client-rating">
                    ★ {b.score && b.score > 0 ? b.score.toFixed(1) : "Nueva"} 
                  </span>
                </div>
                
                <p className="client-business-desc">
                  {b.description || "Un alojamiento excepcional con todos los servicios y comodidades para disfrutar de una estancia perfecta."}
                </p>

                <div className="client-business-footer">
                  <div className="client-business-features" style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                    {(b.amenities || []).slice(0, 5).map((amenity, idx) => {
                      let icon = '';
                      const lower = amenity.toLowerCase().trim();
                      if (lower.includes('wifi')) icon = '📶';
                      else if (lower.includes('caf')) icon = '☕';
                      else if (lower.includes('piscina')) icon = '🏊';
                      else if (lower.includes('cocina')) icon = '🍳';
                      else if (lower.includes('aire')) icon = '❄️';
                      else if (lower.includes('tv')) icon = '📺';
                      
                      // 🔴 MEJORA: Si es un amenity no tipado, se muestra el texto completo para que no sea un icono genérico
                      if (icon === '') {
                        return (
                          <span key={idx} style={{ fontSize: "12px", background: "var(--surface-hover)", padding: "4px 8px", borderRadius: "4px" }}>
                            ✨ {amenity}
                          </span>
                        );
                      }
                      
                      return <span key={idx} title={amenity} style={{ fontSize: "18px" }}>{icon}</span>;
                    })}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <div className="client-business-price">
                      {b.pricePerNight || 0} € <span style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 400 }}>/ noche</span>
                    </div>
                    <button 
                      className="client-book-btn"
                      onClick={() => window.location.href = `/rooms/${b.id}`}
                    >
                      Reservar Ahora
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", background: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)" }}>
            No se encontraron propiedades que coincidan con los filtros seleccionados.
          </div>
        )}
      </section>
    </>
  );
}