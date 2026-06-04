import React from 'react';
import Link from 'next/link';
import styles from '@/app/Landing.module.css';

import ThemeToggle from '@/components/ui/ThemeToggle';

export default function LandingHeader({ hideThemeToggle }: { hideThemeToggle?: boolean }) {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        <img src="/favicon.ico" alt="Yoku Logo" style={{ width: 32, height: 32, objectFit: 'contain' }} />
        <span>Yoku</span>
      </Link>
      <div className={styles.navActions} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {!hideThemeToggle && <ThemeToggle />}
        <Link href="/login" className={styles.btnSecondary}>
          Iniciar sesión
        </Link>
        <Link href="/register" className={styles.btnPrimary}>
          Registrarse
        </Link>
      </div>
    </header>
  );
}
