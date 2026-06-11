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


  const isInsideBusiness = pathname?.startsWith("/properties/") && pathname !== "/properties";
  const urlBusinessId = isInsideBusiness ? pathname.split("/")[2] : null;

  const isBusinessRole = user?.role === 'host';
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
        Promise.resolve().then(() => setBusinesses([]));
      }
    }
  }, [user]);

  const initial = (user?.nombreCompleto || user?.username || 'U').charAt(0).toUpperCase();

  return (
    <header className={styles.header} style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--border)', background: 'var(--surface)', backdropFilter: 'blur(24px)' }}>
      <Link href="/dashboard" className={styles.brand} style={{ flex: 1 }}>
        <img src="/favicon.ico" alt="Yoku Logo" style={{ width: 32, height: 32, objectFit: 'contain' }} />
        <span style={{ color: 'var(--text)' }}>Yoku</span>
      </Link>

      <nav style={{ display: 'flex', gap: '40px', alignItems: 'center', justifyContent: 'center' }}>
        {showGlobalMenu && (
          <>
            <Link href="/dashboard" className={`admin-nav-link ${pathname === "/dashboard" ? "active" : ""}`}>Dashboard</Link>

            <Link href="/properties" className={`admin-nav-link ${pathname === "/properties" ? "active" : ""}`}>Propiedades</Link>
          </>
        )}
        {showBusinessMenu && effectiveBusinessId && (
          <>
            {/* Separator */}
            <span style={{ width: '1px', height: '20px', background: 'var(--border)', borderRadius: '2px', opacity: 0.7 }} />

            {/* Business context pill container */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'var(--surface-2, rgba(99,102,241,0.06))',
              border: '1px solid var(--accent-1, #6366f1)',
              borderRadius: '12px',
              padding: '4px 6px',
            }}>
              <span style={{
                fontWeight: 700,
                color: 'var(--accent-1)',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '0 8px',
                borderRight: '1px solid var(--border)',
                marginRight: '2px',
                whiteSpace: 'nowrap',
              }}>
                {businesses.find(b => String(b.id) === effectiveBusinessId)?.nombre || 'Gestión'}
              </span>
              <Link
                href={`/properties/${effectiveBusinessId}`}
                style={{
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: pathname === `/properties/${effectiveBusinessId}` ? 'var(--accent-1)' : 'var(--text)',
                  background: pathname === `/properties/${effectiveBusinessId}` ? 'var(--accent-1-bg, rgba(99,102,241,0.12))' : 'transparent',
                  textDecoration: 'none',
                  transition: 'background 0.15s',
                }}
              >Dashboard</Link>
              <Link
                href={`/properties/${effectiveBusinessId}/bookings`}
                style={{
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: pathname.includes('/bookings') ? 'var(--accent-1)' : 'var(--text)',
                  background: pathname.includes('/bookings') ? 'var(--accent-1-bg, rgba(99,102,241,0.12))' : 'transparent',
                  textDecoration: 'none',
                  transition: 'background 0.15s',
                }}
              >Reservas</Link>
              <Link
                href={`/properties/${effectiveBusinessId}/customers`}
                style={{
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: pathname.includes('/customers') ? 'var(--accent-1)' : 'var(--text)',
                  background: pathname.includes('/customers') ? 'var(--accent-1-bg, rgba(99,102,241,0.12))' : 'transparent',
                  textDecoration: 'none',
                  transition: 'background 0.15s',
                }}
              >Clientes</Link>
              <Link
                href={`/properties/${effectiveBusinessId}/payments`}
                style={{
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: pathname.includes('/payments') ? 'var(--accent-1)' : 'var(--text)',
                  background: pathname.includes('/payments') ? 'var(--accent-1-bg, rgba(99,102,241,0.12))' : 'transparent',
                  textDecoration: 'none',
                  transition: 'background 0.15s',
                }}
              >Pagos</Link>
            </div>
          </>
        )}
      </nav>

      <div className={styles.navActions} style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, justifyContent: 'flex-end' }}>
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