import React from 'react';
import LandingHeader from '@/components/ui/LandingHeader';
import LandingFooter from '@/components/ui/LandingFooter';
import CookieBanner from '@/components/ui/CookieBanner';
import styles from '../terminos/Terminos.module.css';

export default function PrivacidadPage() {
  return (
    <div className={styles.pageWrapper}>
      <LandingHeader />
      
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <h1 className={styles.title}>Política de Privacidad</h1>
          <p className={styles.lastUpdated}>Última actualización: 10 de junio de 2026</p>

          <section className={styles.section}>
            <h2>I. Información Básica</h2>
            <p>El responsable del tratamiento de los datos personales es Yoku Inc. ("Yoku", "nosotros", "nuestro"). Esta política describe cómo recopilamos, utilizamos, protegemos y compartimos la información personal de nuestros usuarios ("Comercios") y de los clientes de nuestros usuarios ("Clientes Finales") cuando interactúan con nuestra plataforma, aplicación móvil, sitio web y servicios relacionados (colectivamente, los "Servicios").</p>
            <p>Al utilizar los Servicios de Yoku, aceptas las prácticas descritas en esta Política de Privacidad.</p>
          </section>

          <section className={styles.section}>
            <h2>A. Sistema de Reservas y Gestión Yoku</h2>
            <p>Para proporcionar nuestros servicios de agenda y reservas, procesamos datos de los Comercios (como nombre, correo electrónico, datos de facturación, detalles del negocio) necesarios para la ejecución del contrato y la gestión de la cuenta.</p>
            <p>Para los Clientes Finales que reservan a través de la plataforma de un Comercio, Yoku actúa como encargado del tratamiento. Procesamos nombre, correo electrónico, teléfono y detalles de la reserva exclusivamente según las instrucciones del Comercio para facilitar la prestación de su servicio.</p>
          </section>

          <section className={styles.section}>
            <h2>B. Datos Personales al Registrarse en la Aplicación de Clientes</h2>
            <p>Si un Cliente Final decide crear una cuenta global en la aplicación Yoku para gestionar sus reservas en múltiples comercios, Yoku actuará como responsable del tratamiento de esos datos específicos de la cuenta de usuario (perfil, preferencias de comunicación y el historial global de reservas).</p>
          </section>

          <section className={styles.section}>
            <h2>C. Servicio de Pagos Yoku (POS)</h2>
            <p>Para procesar transacciones y pagos en línea, recopilamos información financiera que es cifrada de forma segura y compartida únicamente con nuestros proveedores de pasarela de pago certificados (Nivel 1 PCI-DSS). Yoku no almacena los números completos de las tarjetas de crédito de los Clientes Finales.</p>
          </section>

          <section className={styles.section}>
            <h2>II. Derechos de los Interesados</h2>
            <p>De acuerdo con el RGPD y las leyes de privacidad aplicables, tienes derecho a:</p>
            <ul>
              <li>Acceder a tus datos personales.</li>
              <li>Solicitar la rectificación de datos inexactos.</li>
              <li>Solicitar el borrado de tus datos ("derecho al olvido").</li>
              <li>Restringir u oponerte al tratamiento de tus datos.</li>
              <li>La portabilidad de tus datos a otro proveedor de servicios.</li>
            </ul>
            <p>Si eres un Cliente Final y deseas ejercer estos derechos respecto a los datos recopilados por un Comercio al reservar, por favor contacta directamente al Comercio. Para solicitudes relacionadas con tu cuenta de Comercio Yoku, contáctanos en <strong>privacy@yoku.com</strong>.</p>
          </section>

          <section className={styles.section}>
            <h2>III. Seguridad de los Datos Personales</h2>
            <p>Implementamos estrictas medidas técnicas y organizativas para proteger tus datos personales contra pérdida, robo, acceso no autorizado, divulgación, copia, uso o modificación. Esto incluye encriptación SSL/TLS, firewalls, almacenamiento seguro en servidores de AWS en la Unión Europea y controles de acceso basados en roles dentro de nuestra organización.</p>
          </section>

          <section className={styles.section}>
            <h2>IV. Envío de Comunicaciones Comerciales</h2>
            <p>Si nos has dado tu consentimiento (por ejemplo, al registrarte en nuestra plataforma o suscribirte a nuestra newsletter), podemos enviarte correos electrónicos con consejos de negocio, actualizaciones de producto u ofertas promocionales de Yoku. Puedes darte de baja en cualquier momento haciendo clic en el enlace "Darse de baja" al final de cualquiera de estos correos electrónicos.</p>
          </section>

          <section className={styles.section}>
            <h2>V. Destinatarios de los Datos Personales</h2>
            <p>No vendemos tus datos personales. Sin embargo, para proporcionar nuestros Servicios, podemos compartir tus datos con proveedores de servicios de confianza (subencargados) bajo estrictos acuerdos de confidencialidad, incluyendo:</p>
            <ul>
              <li>Proveedores de alojamiento en la nube (ej. Amazon Web Services).</li>
              <li>Servicios de envío de correos electrónicos y SMS transaccionales (ej. Twilio, SendGrid).</li>
              <li>Procesadores de pago y servicios financieros.</li>
              <li>Herramientas de análisis interno y soporte al cliente (ej. Intercom).</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>VI. Cookies y Archivos de Registro</h2>
            <p>Utilizamos cookies y tecnologías de seguimiento similares para mejorar la experiencia de usuario, analizar el tráfico, personalizar contenido y mostrar anuncios relevantes. Puedes configurar tu navegador para que rechace todas o algunas de las cookies, aunque esto puede afectar la funcionalidad de la plataforma. Para más detalles, revisa nuestra política y panel de configuración de cookies en el sitio web.</p>
          </section>

          <section className={styles.section}>
            <h2>VII. Disposiciones Finales</h2>
            <p>Yoku se reserva el derecho de modificar esta Política de Privacidad para reflejar cambios en nuestras prácticas o por razones legales y regulatorias. Te notificaremos sobre cambios significativos publicando un aviso destacado en nuestro sitio o enviándote un correo electrónico antes de que el cambio entre en vigencia.</p>
            <p>Si tienes cualquier pregunta sobre cómo tratamos tus datos, ponte en contacto con nuestro Delegado de Protección de Datos en <strong>privacy@yoku.com</strong>.</p>
          </section>
        </div>
      </main>

      <LandingFooter />
      <CookieBanner />
    </div>
  );
}
