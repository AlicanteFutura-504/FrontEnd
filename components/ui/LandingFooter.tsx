"use client";

import React from 'react';
import Link from 'next/link';

export default function LandingFooter() {
  return (
    <footer style={{
      backgroundColor: 'var(--surface-hover, #f8fafc)',
      borderTop: '1px solid var(--border, #e5e7eb)',
      padding: '4rem 2rem 2rem',
      color: 'var(--text-muted, #4b5563)',
      fontFamily: "var(--font-outfit), 'Outfit', sans-serif"
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        {/* Logo and Copyright */}
        <div>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '1rem' }}>
            <img src="/favicon.ico" alt="Yoku Logo" style={{ width: 24, height: 24, objectFit: 'contain' }} />
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0066FF' }}>Yoku</span>
          </Link>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            Gestión inteligente de reservas para alquiler vacacional y hoteles. Simplifica tu día a día y maximiza tus ingresos.
          </p>
          <p style={{ fontSize: '0.875rem' }}>
            © {new Date().getFullYear()} Yoku Inc. Todos los derechos reservados.
          </p>
        </div>

        {/* Links Column 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ color: 'var(--text, #111827)', fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem' }}>Producto</h4>
          <Link href="/precios" style={{ color: 'var(--text-muted, #4b5563)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Precios</Link>
        </div>

        {/* Links Column 2: Servicios */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ color: 'var(--text, #111827)', fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem' }}>Servicios</h4>
          <Link href="/apartamentos" style={{ color: 'var(--text-muted, #4b5563)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Alquiler de apartamentos</Link>
          <Link href="/hoteles" style={{ color: 'var(--text-muted, #4b5563)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Hoteles</Link>
          <Link href="/alquiler-vacacional" style={{ color: 'var(--text-muted, #4b5563)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Alquiler vacacional</Link>
        </div>

        {/* Links Column 3 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ color: 'var(--text, #111827)', fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem' }}>Compañía</h4>
          <Link href="/quienes-somos" style={{ color: 'var(--text-muted, #4b5563)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Quiénes somos</Link>
          <Link href="/centro-ayuda" style={{ color: 'var(--text-muted, #4b5563)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Centro de ayuda</Link>
        </div>

        {/* Links Column 3 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ color: 'var(--text, #111827)', fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem' }}>Legal</h4>
          <Link href="/terminos" style={{ color: 'var(--text-muted, #4b5563)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Términos y condiciones</Link>
          <Link href="/privacidad" style={{ color: 'var(--text-muted, #4b5563)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Política de privacidad</Link>
          <button 
            onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}
            style={{ 
              color: 'var(--text-muted, #4b5563)', 
              textDecoration: 'none', 
              fontSize: '0.9rem', 
              transition: 'color 0.2s',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: 'inherit'
            }}>
            Configuración de cookies
          </button>
        </div>
      </div>
    </footer>
  );
}
