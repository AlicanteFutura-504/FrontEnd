"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { usePathname } from "next/navigation";
import { getBusiness } from "@/lib/api";

/**
 * Componente Header.
 * Renderiza la barra superior con el perfil del usuario y un menú desplegable.
 */
export default function Header() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const [businessName, setBusinessName] = useState<string | null>(null);

  useEffect(() => {
    if (pathname?.startsWith("/business/")) {
      const parts = pathname.split("/");
      const id = parts[2];
      if (id && id !== "new") {
        getBusiness(Number(id))
          .then(b => setBusinessName(b?.nombre || null))
          .catch(() => setBusinessName(null));
      } else {
        setBusinessName(null);
      }
    } else {
      setBusinessName(null);
    }
  }, [pathname]);
  const initial = (user?.nombreCompleto || user?.username || 'U').charAt(0).toUpperCase();

  const UserIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  const LogoutIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "4px" }}>
      <path d="M10 22H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h5"></path>
      <polyline points="17 16 21 12 17 8"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  );

  return (
    <header className="admin-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <img src="/favicon.ico" alt="Yoku Logo" style={{ width: 40, height: 40, objectFit: 'contain' }} />
        <div>
          <h1 className="admin-header__title">{businessName ? businessName : "Yoku Admin"}</h1>
          <p className="admin-header__subtitle">{businessName ? "Gestión de Empresa" : "Panel de gestión consolidado"}</p>
        </div>
      </div>

      <div className="admin-header__actions" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <ThemeToggle />

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="secondary-btn"
          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px', borderRadius: '18px' }}
        >
          <div style={{ textAlign: 'right', lineHeight: '1.2' }} className="hidden sm:block">
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 700 }}>{user?.nombreCompleto || user?.username}</p>
            <p style={{ margin: 0, fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 800 }}>{user?.role}</p>
          </div>
          <div className="admin-avatar" style={{ width: '32px', height: '32px', fontSize: '14px', overflow: 'hidden' }}>
            {user?.profilePicture ? (
              <img
                src={user.profilePicture?.startsWith('http') ? user.profilePicture : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${user.profilePicture}`}
                alt="Perfil"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              initial
            )}
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
                style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={() => setIsMenuOpen(false)}
              >
                <UserIcon /> Ver perfil
              </Link>

              <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
                className="admin-sidebar__link"
                style={{ fontSize: '14px', color: '#ef4444', width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <LogoutIcon /> Cerrar sesión
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}