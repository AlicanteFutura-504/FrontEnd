import React from 'react';
import Link from 'next/link';
import styles from '@/app/Landing.module.css';

export default function LandingHeader() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        <img src="/favicon.ico" alt="Yoku Logo" style={{ width: 32, height: 32, objectFit: 'contain' }} />
        <span>Yoku</span>
      </Link>
      <div className={styles.navActions}>
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
