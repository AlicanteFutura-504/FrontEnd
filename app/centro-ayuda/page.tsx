"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import styles from '@/app/Landing.module.css';
import LandingHeader from '@/components/ui/LandingHeader';
import LandingFooter from '@/components/ui/LandingFooter';
import CookieBanner from '@/components/ui/CookieBanner';

// Mock data for Help Center Categories
const categories = [
  {
    icon: "🚀",
    title: "Cómo empezar",
    description: "Da los primeros pasos para empezar a usar Yoku. Obtén instrucciones detalladas acerca del sistema y aprende a crear una cuenta.",
    articles: "8 artículos",
    href: "#",
  },
  {
    icon: "📅",
    title: "Gestión del calendario y las reservas",
    description: "Aprende a crear y modificar reservas, enviar notificaciones a clientes y miembros del personal, y ajustar el horario de apertura.",
    articles: "83 artículos",
    href: "#",
  },
  {
    icon: "💳",
    title: "Pagos e ingresos",
    description: "Obtén más información sobre los pagos, sus ventajas, condiciones y descubre cómo configurar el TPV (Terminal Punto de Venta).",
    articles: "25 artículos",
    href: "#",
  },
  {
    icon: "⚙️",
    title: "Configuración de la cuenta",
    description: "Información sobre los pasos básicos de configuración, como restablecer la contraseña o cambiar la dirección de tu propiedad.",
    articles: "15 artículos",
    href: "#",
  },
  {
    icon: "👥",
    title: "Gestión del personal",
    description: "Descubre cómo gestionar a tus empleados, así como sus perfiles, agendas y derechos de acceso al sistema.",
    articles: "9 artículos",
    href: "#",
  },
  {
    icon: "🤝",
    title: "Gestión de clientes",
    description: "Administra la base de datos de tu clientela. Aprende a importar, editar o bloquear perfiles de clientes.",
    articles: "10 artículos",
    href: "#",
  },
  {
    icon: "📈",
    title: "Marketing y Fidelización",
    description: "Lee consejos acerca de cómo utilizar Yoku para promocionar tu propiedad, crear vales y mejorar la experiencia de tus clientes.",
    articles: "39 artículos",
    href: "#",
  },
  {
    icon: "🧾",
    title: "Facturación y suscripción",
    description: "Consulta toda la información necesaria sobre tu suscripción. Descubre cómo renovarla o cambiar de plan.",
    articles: "24 artículos",
    href: "#",
  },
  {
    icon: "📱",
    title: "Reservas en línea para clientes",
    description: "Explora el proceso de creación y gestión de reservas desde el punto de vista del cliente. Cómo cancelar o reagendar citas.",
    articles: "16 artículos",
    href: "#",
  }
];

export default function CentroAyudaPage() {
  useEffect(() => {
    // Implement scroll reveal animations using IntersectionObserver
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.revealVisible);
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll(`.${styles.reveal}`);
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.landingWrapper}>
      <LandingHeader hideThemeToggle={true} />

      {/* Hero Search Section (Intercom Style) */}
      <section className={styles.reveal} style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #93c5fd 100%)',
        padding: '5rem 2rem',
        textAlign: 'center',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decoración geométrica sutil para darle un toque más premium */}
        <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-50%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }} />
        
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem' }}>
            ¿Cómo podemos ayudarle?
          </h1>
          
          <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
            <span style={{ 
              position: 'absolute', 
              left: '20px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              fontSize: '1.25rem',
              color: '#6b7280'
            }}>
              🔍
            </span>
            <input 
              type="text" 
              placeholder="Buscar respuestas..." 
              style={{
                width: '100%',
                padding: '1.25rem 1.25rem 1.25rem 3.5rem',
                fontSize: '1.125rem',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                outline: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'box-shadow 0.2s ease',
                color: '#111827'
              }}
            />
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section style={{ 
        backgroundColor: '#f8fafc', // Very light gray background like help centers
        padding: '4rem 2rem',
        minHeight: '60vh'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {categories.map((category, idx) => {
            // Apply a staggered delay based on index (0 to 3)
            const delayClass = idx % 4 === 1 ? styles.revealDelay1 : 
                               idx % 4 === 2 ? styles.revealDelay2 : 
                               idx % 4 === 3 ? styles.revealDelay3 : '';
            return (
              <Link key={idx} href={category.href} style={{ textDecoration: 'none' }} className={`${styles.reveal} ${delayClass}`}>
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                }}
                className="hover:shadow-md hover:-translate-y-1"
                >
                <div style={{ 
                  fontSize: '2rem', 
                  marginBottom: '16px' 
                }}>
                  {category.icon}
                </div>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: 600, 
                  color: '#1e293b',
                  marginBottom: '12px' 
                }}>
                  {category.title}
                </h3>
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: '#64748b', 
                  lineHeight: '1.5',
                  flexGrow: 1,
                  marginBottom: '16px'
                }}>
                  {category.description}
                </p>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: 'var(--primary, #0066FF)', 
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {category.articles} <span style={{ fontSize: '1.2em' }}>→</span>
                </div>
              </div>
            </Link>
            );
          })}
        </div>
      </section>

      <LandingFooter />
      <CookieBanner />
    </div>
  );
}
