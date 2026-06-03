import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Landing.module.css';
import CookieBanner from '@/components/ui/CookieBanner';
import LandingFooter from '@/components/ui/LandingFooter';
import LandingHeader from '@/components/ui/LandingHeader';
import TestimonialSlider from '@/components/ui/TestimonialSlider';

export default function LandingPage() {
  return (
    <div className={styles.landingWrapper}>
      <LandingHeader />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          Software de gestión de reservas líder
        </div>
        <h1 className={styles.heroTitle}>
          Impulsa tu negocio con reservas online inteligentes
        </h1>
        <p className={styles.heroSubtitle}>
          Simplifica la gestión de tus citas, atrae a más clientes y reduce las ausencias con Yoku. La plataforma integral para empresas de servicios que buscan crecer sin complicaciones.
        </p>
        <div className={styles.heroActions}>
          <Link href="/register" className={`${styles.btnPrimary} ${styles.btnLarge}`}>
            Crear cuenta gratis
          </Link>
          <Link href="/login" className={`${styles.btnSecondary} ${styles.btnLarge}`}>
            Acceder al panel
          </Link>
        </div>

        <div className={styles.heroImageContainer}>
          <Image 
            src="/dashboard_mockup.png" 
            alt="Yoku Dashboard Mockup" 
            width={1200} 
            height={675} 
            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            priority
          />
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresInner}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Todo lo que necesitas para tu empresa</h2>
            <p className={styles.sectionSubtitle}>
              Yoku te proporciona las herramientas necesarias para digitalizar y automatizar la gestión de tus clientes y reservas.
            </p>
          </div>

          <div className={styles.featureList}>
            {/* Feature 1 */}
            <div className={styles.featureRow}>
              <div className={styles.featureContent}>
                <span className={styles.featureEyebrow}>Reservas Inteligentes</span>
                <h3 className={styles.featureTitle}>Agenda 24/7 sin interrupciones</h3>
                <p className={styles.featureDesc}>
                  Tus clientes pueden reservar sus citas en cualquier momento desde cualquier dispositivo. Deja que Yoku trabaje por ti incluso cuando tu negocio está cerrado.
                </p>
                <ul className={styles.featureListItems}>
                  <li className={styles.featureListItem}>
                    <span className={styles.featureCheck}>✓</span> Sincronización en tiempo real
                  </li>
                  <li className={styles.featureListItem}>
                    <span className={styles.featureCheck}>✓</span> Página web de reservas propia
                  </li>
                  <li className={styles.featureListItem}>
                    <span className={styles.featureCheck}>✓</span> Prevención de citas dobles
                  </li>
                </ul>
              </div>
              <div className={styles.featureImageWrapper}>
                <div className={styles.featureMockup}>
                  <span style={{ fontSize: '3rem' }}>📅</span>
                  <p>Mockup de Calendario</p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className={styles.featureRowReverse}>
              <div className={styles.featureContent}>
                <span className={styles.featureEyebrow}>Comunicación Automática</span>
                <h3 className={styles.featureTitle}>Recordatorios que reducen ausencias</h3>
                <p className={styles.featureDesc}>
                  Reduce las inasistencias en más de un 50% mediante notificaciones automáticas. Tus clientes recibirán avisos amigables que aseguran su asistencia.
                </p>
                <ul className={styles.featureListItems}>
                  <li className={styles.featureListItem}>
                    <span className={styles.featureCheck}>✓</span> Notificaciones programables
                  </li>
                  <li className={styles.featureListItem}>
                    <span className={styles.featureCheck}>✓</span> Mensajes 100% personalizados
                  </li>
                  <li className={styles.featureListItem}>
                    <span className={styles.featureCheck}>✓</span> Recordatorios por correo electrónico
                  </li>
                </ul>
              </div>
              <div className={styles.featureImageWrapper}>
                <div className={styles.featureMockup}>
                  <span style={{ fontSize: '3rem' }}>🔔</span>
                  <p>Mockup de Notificaciones</p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className={styles.featureRow}>
              <div className={styles.featureContent}>
                <span className={styles.featureEyebrow}>Gestión de Clientes</span>
                <h3 className={styles.featureTitle}>Conoce a tus clientes (CRM)</h3>
                <p className={styles.featureDesc}>
                  Mantén una base de datos organizada con el historial completo de tus clientes, sus reservas pasadas y preferencias para ofrecerles un servicio personalizado de primer nivel.
                </p>
                <ul className={styles.featureListItems}>
                  <li className={styles.featureListItem}>
                    <span className={styles.featureCheck}>✓</span> Historial completo de citas
                  </li>
                  <li className={styles.featureListItem}>
                    <span className={styles.featureCheck}>✓</span> Notas internas y etiquetas
                  </li>
                  <li className={styles.featureListItem}>
                    <span className={styles.featureCheck}>✓</span> Accesible desde cualquier lugar
                  </li>
                </ul>
              </div>
              <div className={styles.featureImageWrapper}>
                <div className={styles.featureMockup}>
                  <span style={{ fontSize: '3rem' }}>👥</span>
                  <p>Mockup de Clientes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
        <TestimonialSlider />
      </section>

      <LandingFooter />

      <CookieBanner />
    </div>
  );
}