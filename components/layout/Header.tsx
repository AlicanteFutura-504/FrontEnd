/**
 * @fileoverview Componente de cabecera superior del panel de administración.
 * Muestra el título global de la aplicación y una descripción de la plataforma.
 * @module components/layout/Header
 */

/**
 * Componente Header.
 * Renderiza la barra superior fija del panel de administración con el
 * nombre de la aplicación y una descripción breve de su propósito.
 *
 * @returns {JSX.Element} La cabecera con el título y la descripción de la plataforma.
 */
export default function Header() {
  return (
    <header className="admin-header">
      <div>
        <h1 className="admin-header__title">Bookings Admin</h1>
        <p className="admin-header__subtitle">Plataforma de gestión de reservas y cobros</p>
      </div>
    </header>

  );
}