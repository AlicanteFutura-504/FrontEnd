import React from 'react';
import LandingHeader from '@/components/ui/LandingHeader';
import LandingFooter from '@/components/ui/LandingFooter';
import CookieBanner from '@/components/ui/CookieBanner';
import styles from './Terminos.module.css';

export default function TerminosPage() {
  return (
    <div className={styles.pageWrapper}>
      <LandingHeader hideThemeToggle={true} />

      <main className={styles.mainContent}>
        <div className={styles.container}>
          <h1 className={styles.title}>Términos y Condiciones de Servicio</h1>
          <p className={styles.lastUpdated}>Última actualización: 10 de junio de 2026</p>

          <section className={styles.section}>
            <h2>1. Introducción</h2>
            <p>Bienvenido a Yoku ("nosotros", "nuestro", "la Plataforma"). Al acceder o utilizar nuestro sitio web, servicios de software, herramientas de gestión de reservas, punto de venta y aplicaciones móviles (colectivamente, los "Servicios"), usted acepta estar sujeto a estos Términos y Condiciones ("Términos"). Si no está de acuerdo con estos Términos, no utilice nuestros Servicios.</p>
          </section>

          <section className={styles.section}>
            <h2>2. Descripción de los Servicios</h2>
            <p>Yoku es una plataforma integral de gestión empresarial diseñada para negocios de servicios. Nuestros Servicios incluyen, pero no se limitan a:</p>
            <ul>
              <li>Calendario de programación y reservas online.</li>
              <li>Sistemas de punto de venta (POS) y procesamiento de pagos.</li>
              <li>Gestión de clientes (CRM) y comunicación automatizada (recordatorios).</li>
              <li>Herramientas de gestión de equipos y análisis de datos.</li>
            </ul>
            <p>Nos reservamos el derecho de modificar, suspender o descontinuar cualquier parte de los Servicios en cualquier momento y sin previo aviso.</p>
          </section>

          <section className={styles.section}>
            <h2>3. Registro de Cuenta y Seguridad</h2>
            <p>Para utilizar la mayoría de las funciones de Yoku, debe registrar una cuenta comercial. Al registrarse, usted acepta proporcionar información precisa, actual y completa. Es su responsabilidad mantener la confidencialidad de sus credenciales de inicio de sesión.</p>
            <p>Usted es responsable de todas las actividades que ocurran bajo su cuenta. Yoku no será responsable de ninguna pérdida o daño que resulte del incumplimiento de esta obligación de seguridad.</p>
          </section>

          <section className={styles.section}>
            <h2>4. Suscripciones, Pagos y Facturación</h2>
            <p><strong>Planes de suscripción:</strong> Yoku ofrece varios planes de suscripción, incluyendo opciones gratuitas y premium. Los detalles de los precios y las características de cada plan están disponibles en nuestra página de Precios.</p>
            <p><strong>Ciclo de facturación:</strong> Las tarifas de suscripción se facturan por adelantado en un ciclo mensual o anual. Todos los pagos son no reembolsables, excepto según lo exija la ley aplicable o lo dispuesto específicamente en estos Términos.</p>
            <p><strong>Impuestos:</strong> Los precios publicados no incluyen impuestos aplicables, los cuales serán calculados y añadidos en el momento del pago según su ubicación fiscal.</p>
          </section>

          <section className={styles.section}>
            <h2>5. Uso Aceptable</h2>
            <p>Al utilizar Yoku, usted acepta no:</p>
            <ul>
              <li>Violar ninguna ley, regulación o derecho de terceros.</li>
              <li>Utilizar los Servicios para enviar spam, comunicaciones no solicitadas o con fines de marketing engañoso.</li>
              <li>Distribuir virus, malware u otro código informático dañino.</li>
              <li>Intentar eludir las medidas de seguridad o acceder a cuentas de otros usuarios.</li>
              <li>Cargar contenido ilegal, ofensivo, difamatorio o inapropiado.</li>
            </ul>
            <p>Nos reservamos el derecho de suspender o cancelar cuentas que violen esta política de uso aceptable.</p>
          </section>

          <section className={styles.section}>
            <h2>6. Privacidad y Protección de Datos</h2>
            <p>La protección de sus datos y los de sus clientes es fundamental para nosotros. Yoku actúa como Procesador de Datos para la información de sus clientes y como Controlador de Datos para la información de su cuenta comercial.</p>
            <p>Al utilizar nuestros Servicios, usted acepta nuestra <a href="/privacidad">Política de Privacidad</a>, que detalla cómo recopilamos, utilizamos y protegemos sus datos. Usted garantiza que ha obtenido el consentimiento necesario de sus clientes para procesar su información a través de nuestra Plataforma.</p>
          </section>

          <section className={styles.section}>
            <h2>7. Propiedad Intelectual</h2>
            <p>Los Servicios, incluyendo su diseño, código, logotipos, marcas comerciales y características, son propiedad exclusiva de Yoku y están protegidos por leyes de propiedad intelectual. No se le otorga ningún derecho o licencia sobre nuestra propiedad intelectual más allá del uso previsto de los Servicios de acuerdo con estos Términos.</p>
            <p>Usted conserva todos los derechos sobre el contenido y los datos que cargue en la Plataforma.</p>
          </section>

          <section className={styles.section}>
            <h2>8. Limitación de Responsabilidad</h2>
            <p>En la máxima medida permitida por la ley aplicable, Yoku y sus proveedores no serán responsables por daños indirectos, incidentales, especiales, consecuentes o punitivos, incluyendo, sin limitación, pérdida de beneficios, datos, uso, buena voluntad u otras pérdidas intangibles resultantes de:</p>
            <ul>
              <li>Su acceso, uso o imposibilidad de acceder o utilizar los Servicios.</li>
              <li>Cualquier conducta o contenido de terceros en los Servicios.</li>
              <li>Acceso, uso o alteración no autorizados de sus transmisiones o contenido.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>9. Modificaciones a los Términos</h2>
            <p>Yoku se reserva el derecho de modificar o reemplazar estos Términos en cualquier momento. Notificaremos a los usuarios sobre cambios materiales con al menos 30 días de anticipación enviando un correo electrónico o colocando un aviso destacado en nuestra Plataforma. Su uso continuo de los Servicios después de que los cambios entren en vigencia constituye su aceptación de los nuevos Términos.</p>
          </section>

          <section className={styles.section}>
            <h2>10. Contacto</h2>
            <p>Si tiene alguna pregunta, inquietud o sugerencia sobre estos Términos y Condiciones, por favor contáctenos en:</p>
            <p><strong>Yoku Inc.</strong><br />
              Email: legal@yoku.com<br />
              Dirección: Av. de la Innovación 42, Distrito Tecnológico, 03008 Alicante, España</p>
          </section>
        </div>
      </main>

      <LandingFooter />
      <CookieBanner />
    </div>
  );
}
