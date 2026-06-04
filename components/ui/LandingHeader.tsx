"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from '@/app/Landing.module.css';
import { useAuth } from '@/components/AuthProvider';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function LandingHeader({ hideThemeToggle }: { hideThemeToggle?: boolean }) {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const initial = (user?.nombreCompleto || user?.username || 'U').charAt(0).toUpperCase();

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        <img src="/favicon.ico" alt="Yoku Logo" style={{ width: 32, height: 32, objectFit: 'contain' }} />
        <span>Yoku</span>
      </Link>
      <div className={styles.navActions} style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
        {!hideThemeToggle && <ThemeToggle />}
        
        {user ? (
          <>
            <Link href="/dashboard" className={styles.btnSecondary} style={{ textDecoration: 'none' }}>
              Dashboard
            </Link>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '6px 12px', borderRadius: '24px', background: 'var(--surface-hover)', border: '1px solid var(--border)', cursor: 'pointer' }}
            >
              <div style={{ textAlign: 'right', lineHeight: '1.2' }} className="hidden sm:block">
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>{user.nombreCompleto || user.username}</p>
              </div>
              <div className="admin-avatar" style={{ width: '32px', height: '32px', fontSize: '14px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary)', color: 'white', borderRadius: '50%' }}>
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture.startsWith('http') ? user.profilePicture : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${user.profilePicture}`}
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
                <div className="section-card" style={{ position: 'absolute', right: '0', top: '50px', width: '200px', zIndex: 20, padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
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
          </>
        ) : (
          <>
            <Link href="/login" className={styles.btnSecondary}>
              Iniciar sesión
            </Link>
            <Link href="/register" className={styles.btnPrimary}>
              Registrarse
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
