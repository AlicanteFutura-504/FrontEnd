"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Reservas", href: "/bookings" },
  { label: "Clientes", href: "/customers" },
  { label: "Cobros", href: "/payments" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "240px",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        padding: "24px 16px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ margin: 0, fontSize: "24px" }}>BookFlow</h2>
        <p style={{ margin: "8px 0 0", color: "#6b7280", fontSize: "14px" }}>
          Panel interno
        </p>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                textDecoration: "none",
                color: isActive ? "#0369a1" : "#111827",
                padding: "12px 16px",
                borderRadius: "12px",
                backgroundColor: isActive ? "#e0f2fe" : "#f8fafc",
                fontWeight: isActive ? 600 : 400,
                transition: "all 0.2s ease",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}