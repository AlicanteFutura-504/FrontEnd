"use client";

/**
 * @fileoverview Layout del grupo de rutas del panel de administración `(admin)`.
 * Proporciona la estructura visual compartida (sidebar + header) para todas
 * las páginas del área protegida de la aplicación.
 * @module app/(admin)/layout
 */

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

/**
 * Layout del panel de administración con validación de credenciales.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    
    // Si no hay token y no estamos en /payments, expulsamos al login
    if (!token && !pathname?.startsWith("/payments")) {
      router.push("/login");
    } else {
      // Si hay token, o si es la ruta /payments permitimos renderizar
      setIsAuthorized(true);
    }
  }, [router, pathname]);

  if (!isAuthorized) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--background)", color: "var(--foreground)" }}>
        Verificando credenciales seguras...
      </div>
    );
  }

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