"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/app/Landing.module.css';
import LandingHeader from '@/components/ui/LandingHeader';
import LandingFooter from '@/components/ui/LandingFooter';
import CookieBanner from '@/components/ui/CookieBanner';

export default function AboutPage() {
  const timelineRef = useRef<HTMLDivElement>(null);

  const scrollTimeline = (direction: 'left' | 'right') => {
    if (timelineRef.current) {
      const scrollAmount = 350; // Approximated card width + gap
      timelineRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

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
          // Optional: Stop observing once animated
          // observer.unobserve(entry.target); 
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

      {/* 1. Hero Section (2 Columns, Gradient Background) */}
      <section className={styles.aboutHeroWrapper}>
        <div className={styles.aboutHero}>
          <div className={`${styles.aboutHeroContent} ${styles.reveal}`}>
            <h1 className={styles.aboutHeroTitle}>Nuestra misión es ayudar a que los negocios crezcan</h1>
            <p className={styles.aboutHeroSubtitle}>
              En Yoku, proporcionamos a las empresas de servicios las herramientas necesarias para automatizar su agenda, conectar con sus clientes de manera innovadora y alcanzar su máximo potencial.
            </p>
          </div>
          <div className={`${styles.aboutHeroImage} ${styles.reveal} ${styles.revealDelay2}`}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '500px', aspectRatio: '4/3', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
              <Image 
                src="/dashboard_mockup.png" 
                alt="Yoku Team" 
                fill 
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats Section (4 Columns) */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={`${styles.statItem} ${styles.reveal}`}>
            <span className={styles.statNumber}>20M+</span>
            <span className={styles.statLabel}>Usuarios registrados</span>
          </div>
          <div className={`${styles.statItem} ${styles.reveal} ${styles.revealDelay1}`}>
            <span className={styles.statNumber}>130+</span>
            <span className={styles.statLabel}>Países en todo el mundo</span>
          </div>
          <div className={`${styles.statItem} ${styles.reveal} ${styles.revealDelay2}`}>
            <span className={styles.statNumber}>3M+</span>
            <span className={styles.statLabel}>Negocios activos</span>
          </div>
          <div className={`${styles.statItem} ${styles.reveal} ${styles.revealDelay3}`}>
            <span className={styles.statNumber}>24/7</span>
            <span className={styles.statLabel}>Soporte especializado</span>
          </div>
        </div>
      </section>

      {/* 3. Values Section (2x2 Grid) */}
      <section className={styles.valuesSection}>
        <h2 className={`${styles.sectionTitle} ${styles.reveal}`} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          Nuestros Valores
        </h2>
        
        <div className={styles.valuesGrid}>
          <div className={`${styles.valueCard} ${styles.reveal}`}>
            <div className={styles.valueIconWrapper}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </div>
            <h3 className={styles.valueTitle}>Innovación</h3>
            <p className={styles.valueDesc}>
              Buscamos constantemente nuevas formas de mejorar e innovar. Nuestro enfoque se basa en crear, sopesar y aprender. Nos centramos en las necesidades de nuestros clientes con el objetivo de aportarles valor.
            </p>
          </div>

          <div className={`${styles.valueCard} ${styles.reveal} ${styles.revealDelay1}`}>
            <div className={styles.valueIconWrapper}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <h3 className={styles.valueTitle}>Colaboración abierta</h3>
            <p className={styles.valueDesc}>
              Creemos que expresarse de forma honesta, compartir ideas y respetar las opiniones de los demás es el mejor punto de partida. Nuestro éxito se basa en la colaboración y la comunicación directa.
            </p>
          </div>

          <div className={`${styles.valueCard} ${styles.reveal} ${styles.revealDelay2}`}>
            <div className={styles.valueIconWrapper}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            </div>
            <h3 className={styles.valueTitle}>Trabajo inteligente</h3>
            <p className={styles.valueDesc}>
              Hacemos uso de inteligencia artificial, sistemas de automatización y procesos para aumentar nuestra eficacia. Nos esforzamos al máximo en aquello que reporta un valor añadido real.
            </p>
          </div>

          <div className={`${styles.valueCard} ${styles.reveal} ${styles.revealDelay3}`}>
            <div className={styles.valueIconWrapper}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <h3 className={styles.valueTitle}>Responsabilidad</h3>
            <p className={styles.valueDesc}>
              Asumimos la responsabilidad de nuestras acciones y del impacto que tienen en nuestro equipo y nuestros clientes. Nuestra fiabilidad y transparencia generan confianza a largo plazo.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Horizontal Timeline Section */}
      <section className={styles.historySection}>
        <div className={styles.historyContainer}>
          <div className={`${styles.timelineHeader} ${styles.reveal}`}>
            <div>
              <h2 className={styles.sectionTitle} style={{ marginBottom: '1rem' }}>
                Historia de Yoku
              </h2>
              <p className={styles.featureDesc} style={{ maxWidth: '600px' }}>
                Descubre cómo hemos evolucionado desde una idea en un papel hasta convertirnos en la plataforma líder para negocios de servicios.
              </p>
            </div>
            <div className={styles.timelineNav}>
              <button onClick={() => scrollTimeline('left')} className={styles.timelineBtn} aria-label="Desplazar a la izquierda">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              </button>
              <button onClick={() => scrollTimeline('right')} className={styles.timelineBtn} aria-label="Desplazar a la derecha">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
          </div>
          
          <div ref={timelineRef} className={`${styles.timelineWrapper} ${styles.reveal} ${styles.revealDelay1}`}>
            <div className={styles.timelineCard}>
              <span className={styles.timelineYear}>2023</span>
              <ul className={styles.timelineList}>
                <li>Nace la idea de Yoku en un pequeño estudio.</li>
                <li>Desarrollo del primer prototipo de agenda online.</li>
                <li>Primeros 100 clientes de prueba.</li>
              </ul>
            </div>

            <div className={styles.timelineCard}>
              <span className={styles.timelineYear}>2024</span>
              <ul className={styles.timelineList}>
                <li>Lanzamiento oficial de la plataforma pública.</li>
                <li>Implementación de recordatorios automáticos por SMS.</li>
                <li>Alcanzamos los 5.000 negocios activos.</li>
              </ul>
            </div>

            <div className={styles.timelineCard}>
              <span className={styles.timelineYear}>2025</span>
              <ul className={styles.timelineList}>
                <li>Expansión internacional a más de 10 países.</li>
                <li>Integración del módulo de pagos y TPV.</li>
                <li>Crecimiento del equipo a más de 50 empleados.</li>
              </ul>
            </div>

            <div className={styles.timelineCard}>
              <span className={styles.timelineYear}>2026</span>
              <ul className={styles.timelineList}>
                <li>Implementación de IA para programación predictiva.</li>
                <li>Lanzamiento de la aplicación nativa para iOS y Android.</li>
                <li>Más de 20 millones de citas gestionadas anualmente.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Location Section (2 Columns) */}
      <section className={styles.locationSection}>
        <div className={styles.locationContainer}>
          <div className={`${styles.locationContent} ${styles.reveal}`}>
            <h2 className={styles.sectionTitle} style={{ fontSize: '2.5rem' }}>Dónde estamos</h2>
            <p className={styles.featureDesc} style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>
              Nuestra sede central está ubicada en Alicante, un centro neurálgico de tecnología e innovación en pleno crecimiento, aunque nuestro equipo trabaja de forma remota en todo el mundo.
            </p>
            <p style={{ color: '#0066FF', fontWeight: 600, fontSize: '1.125rem' }}>
              📍 Alicante Futura, Alicante, España
            </p>
          </div>
          <div className={`${styles.locationImageWrapper} ${styles.reveal} ${styles.revealDelay2}`}>
            {/* Usando un placeholder o color si no hay imagen de oficina */}
            <div style={{ width: '100%', height: '100%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '4rem' }}>🏢</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Careers Banner (Full width dark blue) */}
      <section className={styles.careersSection}>
        <div className={`${styles.careersBanner} ${styles.reveal}`}>
          <h2 className={styles.careersTitle}>¿Quieres unirte a nuestro equipo?</h2>
          <p className={styles.careersDesc}>
            Echa un vistazo a los puestos vacantes y da el siguiente paso en tu carrera con nosotros.
          </p>
          <Link href="/register" className={styles.careersButton}>
            Explorar las vacantes
          </Link>
        </div>
      </section>

      <LandingFooter />
      <CookieBanner />
    </div>
  );
}
