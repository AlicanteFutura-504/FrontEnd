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
      <header
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          padding: "20px 24px",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "28px" }}>Bookings Admin</h1>
        <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: "14px" }}>
          Plataforma de gestión de reservas y cobros
        </p>
      </header>
    );
  }