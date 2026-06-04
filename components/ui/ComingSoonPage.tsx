import React from 'react';
import Link from 'next/link';
import styles from '@/app/Landing.module.css';
import LandingHeader from '@/components/ui/LandingHeader';
import LandingFooter from '@/components/ui/LandingFooter';
import CookieBanner from '@/components/ui/CookieBanner';

export default function ComingSoonPage({ title, description, icon }: { title: string, description?: string, icon?: string }) {
  return (
    <div className={styles.landingWrapper}>
      <LandingHeader hideThemeToggle={true} />

      <section style={{
        backgroundColor: '#f8fafc',
        padding: '8rem 2rem',
        textAlign: 'center',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <span>{icon}</span>
            <span>🚀</span>
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem' }}>
            {title}
          </h1>
          <div style={{ 
            display: 'inline-block', 
            backgroundColor: 'rgba(0, 102, 255, 0.1)', 
            color: 'var(--primary)', 
            padding: '8px 16px', 
            borderRadius: '999px',
            fontWeight: 700,
            fontSize: '1rem',
            marginBottom: '2rem'
          }}>
            Próximamente
          </div>
          <p style={{ fontSize: '1.25rem', color: '#64748b', lineHeight: '1.6', marginBottom: '3rem' }}>
            {description || `Estamos trabajando duro para adaptar todas las funcionalidades de Yoku específicamente para tu ${title.toLowerCase()}. Muy pronto podrás descubrir cómo podemos ayudarte a automatizar y hacer crecer tu negocio.`}
          </p>
          <Link href="/" className={styles.btnPrimary} style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
            Volver al inicio
          </Link>
        </div>
      </section>

      <LandingFooter />
      <CookieBanner />
    </div>
  );
}
