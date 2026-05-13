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

      <section className="section-card" style={{ padding: "16px 20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: mounted && isDarkMode ? "var(--primary-soft)" : "#f1f5f9",
                color: mounted && isDarkMode ? "var(--accent)" : "#f59e0b",
                display: "grid",
                placeItems: "center",
                fontSize: "18px",
                transition: "all 0.3s ease",
              }}
            >
              {mounted && isDarkMode ? "🌙" : "☀️"}
            </div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: "15px" }}>
              Modo Oscuro
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={mounted ? isDarkMode : false}
            onClick={() => handleToggle(!isDarkMode)}
            style={{
              width: "46px",
              height: "26px",
              borderRadius: "999px",
              background: mounted && isDarkMode ? "var(--accent)" : "var(--muted-2)",
              border: "none",
              padding: "3px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "999px",
                background: "#ffffff",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: mounted && isDarkMode ? "translateX(20px)" : "translateX(0)",
              }}
            />
          </button>
        </div>
      </section>
    </div>
  );
}
