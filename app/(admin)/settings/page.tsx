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

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px",
            borderRadius: "18px",
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            transition: "all 0.3s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "14px",
                background: mounted && isDarkMode ? "var(--primary-soft)" : "#f1f5f9",
                color: mounted && isDarkMode ? "var(--accent)" : "#f59e0b",
                display: "grid",
                placeItems: "center",
                fontSize: "22px",
                transition: "all 0.3s ease",
              }}
            >
              {mounted && isDarkMode ? "🌙" : "☀️"}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: "16px" }}>
                {mounted && isDarkMode ? "Modo Oscuro Activado" : "Modo Claro Activado"}
              </p>
              <p style={{ margin: "2px 0 0", color: "var(--muted)", fontSize: "13px" }}>
                Ajusta el contraste y los colores de la interfaz
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={mounted ? isDarkMode : false}
            onClick={() => handleToggle(!isDarkMode)}
            style={{
              width: "56px",
              height: "32px",
              borderRadius: "999px",
              background: mounted && isDarkMode ? "var(--accent)" : "var(--muted-2)",
              border: "none",
              padding: "4px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "999px",
                background: "#ffffff",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: mounted && isDarkMode ? "translateX(24px)" : "translateX(0)",
              }}
            />
          </button>
        </div>
      </section>
    </div>
  );
}
