import { getBusinesses } from "@/lib/api";
import Link from "next/link";
import { Business } from "@/lib/types";

interface ExtendedBusiness extends Business {
  score?: number;
  isPromoted?: boolean;
  pricePerNight?: number;
  images?: string[];
}

export default async function ClientHome({ searchParams }: { searchParams: { city?: string } }) {
  const cityQuery = searchParams.city || '';
  // Llamamos a getBusinesses con sort=score DESC para que promocionadas salgan primero
  // y aplicamos filtro de city si existe
  const { data: businesses } = await getBusinesses(1, 100, cityQuery, 'score', 'DESC');

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        height: '500px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundImage: 'url(https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }}></div>
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%', padding: '0 20px' }}>
          <h1 style={{ color: '#fff', fontSize: '3.5rem', fontWeight: 800, textShadow: '0 2px 10px rgba(0,0,0,0.3)', marginBottom: '20px' }}>
            Descubre tu próximo alojamiento
          </h1>
          <form method="GET" action="/" style={{ 
            maxWidth: '600px', 
            margin: '0 auto', 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '100px',
            padding: '8px',
            display: 'flex',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
          }}>
            <input 
              name="city"
              defaultValue={cityQuery}
              placeholder="¿A dónde vas? Ej. Alicante"
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                padding: '16px 24px',
                fontSize: '1.1rem',
                outline: 'none',
                color: '#333'
              }}
            />
            <button type="submit" style={{
              background: 'linear-gradient(135deg, #FF385C, #E61E4D)',
              color: 'white',
              border: 'none',
              borderRadius: '100px',
              padding: '0 32px',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}>
              Buscar
            </button>
          </form>
        </div>
      </section>

      {/* Grid */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
        {cityQuery && (
          <h2 style={{ fontSize: '1.5rem', marginBottom: '30px', fontWeight: 600 }}>Resultados para &quot;{cityQuery}&quot;</h2>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: '30px' }}>
          {businesses.map((business: ExtendedBusiness) => (
            <Link 
              key={business.id} 
              href={`/rooms/${business.id}`}
              style={{ 
                display: "block",
                textDecoration: "none",
                color: "inherit",
              }}
              className="airbnb-card"
            >
              <div style={{ 
                width: '100%', 
                aspectRatio: '1 / 1', 
                borderRadius: '16px', 
                overflow: 'hidden', 
                position: 'relative',
                marginBottom: '12px'
              }}>
                <img 
                  src={business.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                  alt={business.nombre}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {business.isPromoted && (
                  <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(255,255,255,0.9)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', color: '#333' }}>
                    Recomendado
                  </div>
                )}
                {(business.score && business.score > 0) ? (
                  <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', color: '#333' }}>
                    ★ {(business.score).toFixed(1)}
                  </div>
                ) : null}
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 2 }}>{business.city || 'Ubicación múltiple'}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: 4 }}>{business.nombre}</p>
              <p style={{ fontWeight: 600, marginTop: 8 }}>
                {business.pricePerNight || 0} € <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>noche</span>
              </p>
            </Link>
          ))}
        </div>
        
        {businesses.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            No encontramos propiedades que coincidan con tu búsqueda.
          </div>
        )}
      </div>
      
      <style>{`
        .airbnb-card:hover img {
          transform: scale(1.05);
        }
        .airbnb-card img {
          transition: transform 0.4s ease;
        }
      `}</style>
    </div>
  );
}
