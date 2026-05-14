"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getBusinesses } from "@/lib/api";
import { Business } from "@/lib/types";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isBusinessOpen, setIsBusinessOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();

  const isInsideBusiness = pathname.startsWith("/business/");
  const activeBusinessId = isInsideBusiness ? pathname.split("/")[2] : null;

  useEffect(() => {
    const storedState = localStorage.getItem("sidebar_collapsed");
    if (storedState === "true") {
      setCollapsed(true);
    }
    if (user) {
      getBusinesses()
        .then(setBusinesses)
        .catch(console.error);
    }
  }, [user]);

  const handleToggle = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem("sidebar_collapsed", String(newState));
  };

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: "◫" },
  ];

  const BriefcaseIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
  );

  return (
    <aside className={`admin-sidebar ${collapsed ? 'admin-sidebar--collapsed' : ''}`}>
      <div className="admin-sidebar__brand-row" style={{ justifyContent: collapsed ? 'center' : 'space-between' }}>
        <h2 className={`admin-sidebar__title ${collapsed ? 'collapsed-hide' : ''}`}>
          BookFlow
        </h2>
        <button className={`sidebar-toggle ${collapsed ? 'sidebar-toggle--collapsed' : ''}`} onClick={handleToggle}>
          <span className="arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </span>
        </button>
      </div>
      
      <p className={`admin-sidebar__subtitle ${collapsed ? 'collapsed-hide' : ''}`}>
        Admin workspace
      </p>

      <nav className="admin-sidebar__nav" style={{ marginTop: '20px' }}>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-sidebar__link ${pathname === item.href ? "admin-sidebar__link--active" : ""} ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? item.label : ""}
          >
            <span className="shrink-0">{item.icon}</span>
            <span className={`nav-label ${collapsed ? 'nav-label--hidden' : ''}`}>{item.label}</span>
          </Link>
        ))}

        <div className="admin-sidebar__dropdown-container">
          <div className="admin-sidebar__link-wrapper">
            <Link 
              href="/business" 
              className={`admin-sidebar__link ${pathname === "/business" ? "admin-sidebar__link--active" : ""} ${collapsed ? 'justify-center' : ''}`}
              style={{ flex: 1, paddingRight: collapsed ? '0' : '4px' }}
              title={collapsed ? "Business" : ""}
            >
              <span className="shrink-0"><BriefcaseIcon /></span>
              <span className={`nav-label ${collapsed ? 'nav-label--hidden' : ''}`}>Business</span>
            </Link>
            {!collapsed && businesses.length > 0 && (
              <button 
                onClick={() => setIsBusinessOpen(!isBusinessOpen)}
                className={`dropdown-toggle ${isBusinessOpen ? 'dropdown-toggle--open' : ''}`}
              >
                ▼
              </button>
            )}
          </div>

          {!collapsed && isBusinessOpen && (
            <div className="admin-sidebar__submenu">
              {businesses.map((b) => (
                <Link
                  key={b.id}
                  href={`/business/${b.id}`}
                  className={`admin-sidebar__submenu-link ${activeBusinessId === String(b.id) ? "admin-sidebar__submenu-link--active" : ""}`}
                >
                  {b.nombre}
                </Link>
              ))}
            </div>
          )}
        </div>

        {isInsideBusiness && activeBusinessId && activeBusinessId !== "new" && (
          <div className="admin-sidebar__active-business-menu">
            <p className={`admin-sidebar__section-label ${collapsed ? 'collapsed-hide' : ''}`}>
              {businesses.find(b => String(b.id) === activeBusinessId)?.nombre || 'Gestión'}
            </p>
            <Link 
              href={`/business/${activeBusinessId}/bookings`} 
              className={`admin-sidebar__link ${pathname.includes("/bookings") ? "admin-sidebar__link--active" : ""} ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? "Reservas" : ""}
            >
              <span className="shrink-0">☰</span>
              <span className={`nav-label ${collapsed ? 'nav-label--hidden' : ''}`}>Reservas</span>
            </Link>
            <Link 
              href={`/business/${activeBusinessId}/customers`} 
              className={`admin-sidebar__link ${pathname.includes("/customers") ? "admin-sidebar__link--active" : ""} ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? "Clientes" : ""}
            >
              <span className="shrink-0">◎</span>
              <span className={`nav-label ${collapsed ? 'nav-label--hidden' : ''}`}>Clientes</span>
            </Link>
            <Link 
              href={`/business/${activeBusinessId}/payments`} 
              className={`admin-sidebar__link ${pathname.includes("/payments") ? "admin-sidebar__link--active" : ""} ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? "Pagos" : ""}
            >
              <span className="shrink-0">$</span>
              <span className={`nav-label ${collapsed ? 'nav-label--hidden' : ''}`}>Pagos</span>
            </Link>
          </div>
        )}
      </nav>

    </aside>
  );
}