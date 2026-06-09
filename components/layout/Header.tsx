"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { getBusinesses } from "@/lib/api";
import { Business } from "@/lib/types";
import ThemeToggle from "@/components/ui/ThemeToggle";
import styles from '@/app/Landing.module.css';

export default function Header() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isBusinessOpen, setIsBusinessOpen] = useState(false);

  const isInsideBusiness = pathname?.startsWith("/properties/") && pathname !== "/properties";
  const urlBusinessId = isInsideBusiness ? pathname.split("/")[2] : null;

  const isBusinessRole = user?.role === 'business';
  const showGlobalMenu = !isBusinessRole && (!isInsideBusiness || user?.username === 'root');
  const effectiveBusinessId = isBusinessRole && businesses.length > 0 ? String(businesses[0].id) : urlBusinessId;
  const showBusinessMenu = isBusinessRole || (isInsideBusiness && effectiveBusinessId && effectiveBusinessId !== "new");

  useEffect(() => {
    if (user) {
      if (user.username !== 'root') {
        getBusinesses()
          .then(res => {
            if (Array.isArray(res)) setBusinesses(res);
            else setBusinesses(res?.data || []);
          })
          .catch(console.error);
      } else {
        setBusinesses([]);
      }
    }
  }, [user]);

  const initial = (user?.nombreCompleto || user?.username || 'U').charAt(0).toUpperCase();

  return (
    <header className={styles.header} style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--border)', background: 'var(--surface)', backdropFilter: 'blur(24px)' }}>
      <Link href="/dashboard" className={styles.brand}>
        <img src="/favicon.ico" alt="Yoku Logo" style={{ width: 32, height: 32, objectFit: 'contain' }} />
        <span style={{ color: 'var(--text)' }}>Yoku</span>
      </Link>

      <nav style={{ display: 'flex', gap: '40px', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        {showGlobalMenu && (
          <>
            <Link href="/dashboard" className={`admin-nav-link ${pathname === "/dashboard" ? "active" : ""}`}>Dashboard</Link>

            <Link href="/properties" className={`admin-nav-link ${pathname === "/properties" ? "active" : ""}`}>Propiedades</Link>
          </>
        )}
        {showBusinessMenu && effectiveBusinessId && (
          <>
            <span style={{ fontWeight: 700, color: 'var(--accent-1)', marginRight: '16px', background: 'var(--surface-hover)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              {businesses.find(b => String(b.id) === effectiveBusinessId)?.nombre || 'Gestión'}
            </span>
            <Link href={`/properties/${effectiveBusinessId}`} className={`admin-nav-link ${pathname === `/properties/${effectiveBusinessId}` ? "active" : ""}`}>Dashboard</Link>

            <Link href={`/properties/${effectiveBusinessId}/bookings`} className={`admin-nav-link ${pathname.includes("/bookings") ? "active" : ""}`}>Reservas</Link>
            <Link href={`/properties/${effectiveBusinessId}/customers`} className={`admin-nav-link ${pathname.includes("/customers") ? "active" : ""}`}>Clientes</Link>
            <Link href={`/properties/${effectiveBusinessId}/payments`} className={`admin-nav-link ${pathname.includes("/payments") ? "active" : ""}`}>Pagos</Link>
          </>
        )}
      </nav>

      <div className={styles.navActions} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <ThemeToggle />
        
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '6px 12px', borderRadius: '24px', background: 'var(--surface-hover)', border: '1px solid var(--border)', cursor: 'pointer' }}
        >
          <div style={{ textAlign: 'right', lineHeight: '1.2' }} className="hidden sm:block">
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>{user?.nombreCompleto || user?.username}</p>
            <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>{user?.role}</p>
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
            <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setIsMenuOpen(false)} />
            <div className="section-card" style={{ position: 'absolute', right: '32px', top: '70px', width: '200px', zIndex: 20, padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/settings/profile" style={{ padding: '8px', color: 'var(--text)', textDecoration: 'none', fontSize: '14px' }} onClick={() => setIsMenuOpen(false)}>
                Ver perfil
              </Link>
              <div style={{ height: '1px', background: 'var(--border)' }} />
              <button onClick={() => { setIsMenuOpen(false); logout(); }} style={{ padding: '8px', color: '#ef4444', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                Cerrar sesión
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}