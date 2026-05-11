/**
 * @fileoverview Layout del grupo de rutas del panel de administración `(admin)`.
 * Proporciona la estructura visual compartida (sidebar + header) para todas
 * las páginas del área protegida de la aplicación.
 * @module app/(admin)/layout
 */

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

/**
 * Layout del panel de administración.
 * Renderiza el shell de la interfaz de administración compuesto por:
 * - `<Sidebar>` — navegación lateral con los enlaces del menú.
 * - `<Header>`  — barra superior con el título de la sección.
 * - `<main>`    — área de contenido donde se inyectan las páginas hijas.
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
    <div className="admin-shell">
      <Sidebar />

      <div className="admin-main">
        <Header />
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}