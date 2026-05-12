"use client";

import React, { useState, useEffect } from "react";

export default function SettingsPage() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(stored);
  }, []);

  const handleToggle = (dark: boolean) => {
    setIsDarkMode(dark);
    localStorage.setItem("darkMode", String(dark));
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  };

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <h2>Ajustes</h2>
          <p>Configura las preferencias visuales y de comportamiento de la plataforma.</p>
        </div>
      </section>

      <section className="section-card">
        <h3 style={{ margin: "0 0 6px", fontSize: "18px", fontWeight: 700 }}>Apariencia</h3>
        <p style={{ margin: "0 0 24px", color: "var(--muted)", fontSize: "14px" }}>
          Elige entre el tema claro u oscuro para la interfaz de administración.
        </p>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          {/* Opción Modo Claro */}
          <button
            type="button"
            onClick={() => handleToggle(false)}
            style={{
              flex: "1",
              minWidth: "200px",
              padding: "20px",
              borderRadius: "16px",
              border: `2px solid ${!isDarkMode && mounted ? "var(--accent)" : "var(--border)"}`,
              background: "var(--surface)",
              color: "var(--text)",
              textAlign: "left",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              transition: "all 0.2s ease",
              boxShadow: !isDarkMode && mounted ? "0 4px 12px rgba(37, 99, 235, 0.15)" : "none",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: !isDarkMode && mounted ? "var(--primary-soft)" : "var(--surface-2)",
                color: !isDarkMode && mounted ? "var(--accent)" : "var(--muted)",
                display: "grid",
                placeItems: "center",
                fontSize: "20px",
                transition: "all 0.2s ease",
              }}
            >
              ☀️
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: "15px" }}>Modo Claro</p>
              <p style={{ margin: "2px 0 0", color: "var(--muted)", fontSize: "13px" }}>
                Aspecto diurno y brillante
              </p>
            </div>
          </button>

          {/* Opción Modo Oscuro */}
          <button
            type="button"
            onClick={() => handleToggle(true)}
            style={{
              flex: "1",
              minWidth: "200px",
              padding: "20px",
              borderRadius: "16px",
              border: `2px solid ${isDarkMode && mounted ? "var(--accent)" : "var(--border)"}`,
              background: "var(--surface)",
              color: "var(--text)",
              textAlign: "left",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              transition: "all 0.2s ease",
              boxShadow: isDarkMode && mounted ? "0 4px 12px rgba(37, 99, 235, 0.15)" : "none",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: isDarkMode && mounted ? "var(--primary-soft)" : "var(--surface-2)",
                color: isDarkMode && mounted ? "var(--accent)" : "var(--muted)",
                display: "grid",
                placeItems: "center",
                fontSize: "20px",
                transition: "all 0.2s ease",
              }}
            >
              🌙
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: "15px" }}>Modo Oscuro</p>
              <p style={{ margin: "2px 0 0", color: "var(--muted)", fontSize: "13px" }}>
                Ideal para entornos con poca luz
              </p>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}
