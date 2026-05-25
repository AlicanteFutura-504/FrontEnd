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

  const DashboardIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1"></rect>
      <rect x="14" y="3" width="7" height="5" rx="1"></rect>
      <rect x="14" y="12" width="7" height="9" rx="1"></rect>
      <rect x="3" y="16" width="7" height="5" rx="1"></rect>
    </svg>
  );

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
  ];

  const BriefcaseIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
  );

  const CalendarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );

  const UsersIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );

  const CreditCardIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
      <line x1="1" y1="10" x2="23" y2="10"></line>
    </svg>
  );

  return (
    <aside className={`admin-sidebar ${collapsed ? 'admin-sidebar--collapsed' : ''}`}>
      <div className="admin-sidebar__brand-row" style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: collapsed ? '0' : '10px' }}>
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
              <span className="shrink-0"><CalendarIcon /></span>
              <span className={`nav-label ${collapsed ? 'nav-label--hidden' : ''}`}>Reservas</span>
            </Link>
            <Link 
              href={`/business/${activeBusinessId}/customers`} 
              className={`admin-sidebar__link ${pathname.includes("/customers") ? "admin-sidebar__link--active" : ""} ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? "Clientes" : ""}
            >
              <span className="shrink-0"><UsersIcon /></span>
              <span className={`nav-label ${collapsed ? 'nav-label--hidden' : ''}`}>Clientes</span>
            </Link>
            <Link 
              href={`/business/${activeBusinessId}/payments`} 
              className={`admin-sidebar__link ${pathname.includes("/payments") ? "admin-sidebar__link--active" : ""} ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? "Pagos" : ""}
            >
              <span className="shrink-0"><CreditCardIcon /></span>
              <span className={`nav-label ${collapsed ? 'nav-label--hidden' : ''}`}>Pagos</span>
            </Link>
          </div>
        )}
      </nav>

    </aside>
  );
}