"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";
import "../client.css";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only strictly redirect if there's an explicit "client" check we want to enforce.
    // For now, if no user, send to login.
    if (!user) {
      router.push("/login");
    } else if (user.role !== "guest" && user.role !== "superadmin") {
      // Si entra un propiedad, echarlo a su panel.
      router.push("/dashboard");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="client-shell">
      <header className="client-header">
        <div className="client-header__top">
          <div className="client-brand">
            <img src="/favicon.ico" alt="Yoku Logo" style={{ width: 36, height: 36, objectFit: 'contain' }} />
            <span>Yoku</span>
          </div>
          <nav className="client-nav">
            <Link href="/dashboard" className={pathname === "/dashboard" ? "active" : ""}>Salones</Link>
            <Link href="/dashboard" className={pathname === "/dashboard/services" ? "active" : ""}>Servicios</Link>
            <Link href="/dashboard" className={pathname === "/dashboard/offers" ? "active" : ""}>Ofertas</Link>
          </nav>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <ThemeToggle />
            <span style={{ fontWeight: 600 }}>Hola, {user.nombreCompleto || user.email}</span>
            <button 
              onClick={logout}
              style={{
                background: "transparent",
                border: "1px solid var(--border-strong)",
                color: "var(--text)",
                padding: "8px 16px",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              Salir
            </button>
          </div>
        </div>
        
        {/* Booking Style Search Bar */}
        <div className="client-search-bar">
          <input className="client-search-input" placeholder="📍 Ubicación (Ej. Barcelona)" />
          <div className="client-search-divider"></div>
          <input className="client-search-input" type="date" />
          <div className="client-search-divider"></div>
          <input className="client-search-input" placeholder="👤 Personas" />
          <button className="client-search-btn">Buscar</button>
        </div>
      </header>

      <main className="client-main">
        {children}
      </main>
    </div>
  );
}
