import React from 'react';
import Link from 'next/link';
import styles from '@/app/Landing.module.css';
import LandingHeader from '@/components/ui/LandingHeader';
import LandingFooter from '@/components/ui/LandingFooter';
import CookieBanner from '@/components/ui/CookieBanner';

export default function PricingPage() {
  return (
    <div className={styles.landingWrapper}>
      <LandingHeader />

      {/* Hero Section */}
      <section className={styles.hero} style={{ paddingBottom: '2rem' }}>
        <h1 className={styles.heroTitle}>Planes sencillos para hacer crecer tu negocio</h1>
        <p className={styles.heroSubtitle}>
          Elige el plan que mejor se adapte a tus necesidades. Sin contratos a largo plazo, cancela cuando quieras.
        </p>
      </section>

      {/* Pricing Cards */}
      <section style={{ backgroundColor: '#f8fafc', padding: '4rem 2rem' }}>
        <div className={styles.pricingGrid}>
          
          {/* Plan Básico */}
          <div className={styles.pricingCard}>
            <h3 className={styles.pricingName}>Básico</h3>
            <p className={styles.pricingDesc}>Para profesionales independientes que empiezan.</p>
            <div className={styles.pricingPrice}>
              <span className={styles.pricingCurrency}>€</span>
              <span>0</span>
              <span className={styles.pricingPeriod}>/mes</span>
            </div>
            
            <div className={styles.pricingFeatures}>
              <div className={styles.pricingFeature}>
                <span className={styles.pricingCheck}>✓</span> 1 Empleado
              </div>
              <div className={styles.pricingFeature}>
                <span className={styles.pricingCheck}>✓</span> Hasta 50 reservas/mes
              </div>
              <div className={styles.pricingFeature}>
                <span className={styles.pricingCheck}>✓</span> Agenda online básica
              </div>
              <div className={styles.pricingFeature}>
                <span className={styles.pricingCross}>✕</span> Recordatorios SMS
              </div>
              <div className={styles.pricingFeature}>
                <span className={styles.pricingCross}>✕</span> Personalización de marca
              </div>
            </div>

            <Link href="/register" className={styles.btnSecondary} style={{ width: '100%' }}>
              Empezar gratis
            </Link>
          </div>

          {/* Plan Pro */}
          <div className={`${styles.pricingCard} ${styles.pricingCardPopular}`}>
            <div className={styles.popularBadge}>Más popular</div>
            <h3 className={styles.pricingName}>Pro</h3>
            <p className={styles.pricingDesc}>Ideal para pequeñas y medianas empresas.</p>
            <div className={styles.pricingPrice}>
              <span className={styles.pricingCurrency}>€</span>
              <span>19</span>
              <span className={styles.pricingPeriod}>/mes</span>
            </div>
            
            <div className={styles.pricingFeatures}>
              <div className={styles.pricingFeature}>
                <span className={styles.pricingCheck}>✓</span> Hasta 5 Empleados
              </div>
              <div className={styles.pricingFeature}>
                <span className={styles.pricingCheck}>✓</span> Reservas ilimitadas
              </div>
              <div className={styles.pricingFeature}>
                <span className={styles.pricingCheck}>✓</span> Recordatorios Email y SMS
              </div>
              <div className={styles.pricingFeature}>
                <span className={styles.pricingCheck}>✓</span> Personalización de marca
              </div>
              <div className={styles.pricingFeature}>
                <span className={styles.pricingCross}>✕</span> Control de pagos online
              </div>
            </div>

            <Link href="/register" className={styles.btnPrimary} style={{ width: '100%' }}>
              Probar 14 días gratis
            </Link>
          </div>

          {/* Plan Premium */}
          <div className={styles.pricingCard}>
            <h3 className={styles.pricingName}>Premium</h3>
            <p className={styles.pricingDesc}>Para negocios en expansión y clínicas.</p>
            <div className={styles.pricingPrice}>
              <span className={styles.pricingCurrency}>€</span>
              <span>49</span>
              <span className={styles.pricingPeriod}>/mes</span>
            </div>
            
            <div className={styles.pricingFeatures}>
              <div className={styles.pricingFeature}>
                <span className={styles.pricingCheck}>✓</span> Empleados ilimitados
              </div>
              <div className={styles.pricingFeature}>
                <span className={styles.pricingCheck}>✓</span> Multi-sucursal
              </div>
              <div className={styles.pricingFeature}>
                <span className={styles.pricingCheck}>✓</span> Control de pagos y facturación
              </div>
              <div className={styles.pricingFeature}>
                <span className={styles.pricingCheck}>✓</span> Integración con pasarelas (Stripe)
              </div>
              <div className={styles.pricingFeature}>
                <span className={styles.pricingCheck}>✓</span> Soporte prioritario 24/7
              </div>
            </div>

            <Link href="/register" className={styles.btnSecondary} style={{ width: '100%' }}>
              Obtener Premium
            </Link>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <h2 className={styles.sectionTitle} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          Preguntas frecuentes
        </h2>
        
        <div className={styles.faqItem}>
          <h4 className={styles.faqQuestion}>¿Puedo cambiar de plan más adelante?</h4>
          <p className={styles.faqAnswer}>
            Sí, puedes subir o bajar de plan en cualquier momento desde tu panel de control. Los cambios se aplicarán inmediatamente y se ajustará la facturación de forma proporcional.
          </p>
        </div>
        
        <div className={styles.faqItem}>
          <h4 className={styles.faqQuestion}>¿Qué incluye la prueba de 14 días?</h4>
          <p className={styles.faqAnswer}>
            La prueba gratuita te da acceso total a todas las funciones del plan Pro, para que puedas experimentar el valor completo de Yoku sin necesidad de introducir tu tarjeta de crédito.
          </p>
        </div>
        
        <div className={styles.faqItem}>
          <h4 className={styles.faqQuestion}>¿Hay algún coste de instalación oculto?</h4>
          <p className={styles.faqAnswer}>
            No, Yoku es un servicio transparente basado en suscripción. Pagarás exactamente lo que indica tu plan mensual o anual, sin cargos sorpresa ni tarifas de configuración.
          </p>
        </div>
      </section>

      <LandingFooter />
      <CookieBanner />
    </div>
  );
}
