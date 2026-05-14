"use client";

/**
 * @fileoverview Componente de barra de navegación lateral del panel de administración.
 * Marca el enlace activo comparando el pathname actual con cada ruta de menú.
 * @module components/layout/Sidebar
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

/**
 * Definición de un elemento del menú de navegación.
 */
interface MenuItem {
  /** Etiqueta visible en la interfaz. */
  label: string;
  /** Ruta a la que navega el enlace. */
  href: string;
  /** Icono Unicode asociado al elemento. */
  icon: string;
}

/**
 * Elementos del menú principal de la aplicación.
 * Cada entrada corresponde a una sección del panel de administración.
 */
const menuItems: MenuItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "◫" },
  { label: "Bookings", href: "/bookings", icon: "☰" },
  { label: "Customers", href: "/customers", icon: "◎" },
  { label: "Payments", href: "/payments", icon: "◌" },
  { label: "Settings", href: "/settings", icon: "⚙" },
];

/**
 * Componente Sidebar.
 * Renderiza el panel lateral de navegación del área de administración.
 * Utiliza `usePathname` para detectar la ruta activa y aplicar
 * el modificador CSS `admin-sidebar__link--active` al enlace correspondiente.
 *
 * @returns {JSX.Element} La barra lateral con el logo y los enlaces de navegación.
 */
export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  /** Pathname de la URL actualmente activa en el navegador. */
  const pathname = usePathname();

  return (
    <aside className={`admin-sidebar ${collapsed ? 'admin-sidebar--collapsed' : ''}`}>
      <div className="admin-sidebar__brand">
        <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar" style={{ marginBottom: "12px", background: "none", border: "none", cursor: "pointer", color: "var(--text)" }}>☰</button>
        <h2 className="admin-sidebar__title">BookFlow</h2>
        <p className="admin-sidebar__subtitle">Admin workspace</p>
      </div>

      <nav className="admin-sidebar__nav">
        {menuItems.map((item) => {
          /** Indica si este ítem corresponde a la ruta actualmente activa. */
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-sidebar__link ${isActive ? "admin-sidebar__link--active" : ""}`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}