"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";

/**
 * Componente Header.
 * Renderiza la barra superior con el perfil del usuario y un menú desplegable.
 */
export default function Header() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const initial = (user?.nombreCompleto || user?.username || 'U').charAt(0).toUpperCase();

  const UserIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  return (
    <header className="admin-header">
      <div>
        <h1 className="admin-header__title">BookFlow Admin</h1>
        <p className="admin-header__subtitle">Panel de gestión consolidado</p>
      </div>

      <div className="admin-header__actions" style={{ position: 'relative' }}>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="secondary-btn"
          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px', borderRadius: '18px' }}
        >
          <div style={{ textAlign: 'right', lineHeight: '1.2' }} className="hidden sm:block">
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 700 }}>{user?.nombreCompleto || user?.username}</p>
            <p style={{ margin: 0, fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 800 }}>{user?.role}</p>
          </div>
          <div className="admin-avatar" style={{ width: '32px', height: '32px', fontSize: '14px' }}>
            {initial}
          </div>
        </button>

        {isMenuOpen && (
          <>
            <div 
              style={{ position: 'fixed', inset: 0, zIndex: 10 }}
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="section-card" style={{ 
              position: 'absolute', 
              right: 0, 
              top: 'calc(100% + 10px)', 
              width: '220px', 
              zIndex: 20, 
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <Link 
                href="/settings/profile" 
                className="admin-sidebar__link"
                style={{ fontSize: '14px' }}
                onClick={() => setIsMenuOpen(false)}
              >
                <UserIcon /> Ver perfil
              </Link>
              <Link 
                href="/settings" 
                className="admin-sidebar__link"
                style={{ fontSize: '14px' }}
                onClick={() => setIsMenuOpen(false)}
              >
                <span>⚙️</span> Configuración
              </Link>
              <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
                className="admin-sidebar__link"
                style={{ fontSize: '14px', color: '#ef4444', width: '100%', textAlign: 'left' }}
              >
                <span>🚪</span> Cerrar sesión
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}