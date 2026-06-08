/**
 * @fileoverview Layout del grupo de rutas del panel de administración `(admin)`.
 * Utiliza el estilo de página web pública (Navegación superior y pie de página).
 * @module app/(admin)/layout
 */

import Header from "@/components/layout/Header";
import LandingFooter from "@/components/ui/LandingFooter";
import ScrollToTop from "@/components/ui/ScrollToTop";
import styles from '@/app/Landing.module.css';

/**
 * Layout del panel de administración.
 * Renderiza el shell de la interfaz de administración compuesto por:
 * - `<Header>`  — navegación superior con enlaces de menú y perfil (igual que la landing).
 * - `<main>`    — área de contenido centrada.
 * - `<LandingFooter>` - pie de página para unificar el diseño.
 *
 * @param {object}          props          - Props del componente.
 * @param {React.ReactNode} props.children - Página hija a renderizar en el área de contenido.
 * @returns {JSX.Element} El shell completo del panel de administración.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.landingWrapper}>
      <Header />

      <main className="admin-content" style={{ maxWidth: '1440px', margin: '0 auto', padding: '32px 24px', minHeight: 'calc(100vh - 200px)', width: '100%' }}>
        {children}
      </main>

      <LandingFooter />
      <ScrollToTop />
    </div>
  );
}