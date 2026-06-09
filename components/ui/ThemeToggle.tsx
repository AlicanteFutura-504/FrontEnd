"use client";

import React, { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(stored);
    document.documentElement.setAttribute("data-theme", stored ? "dark" : "light");
  }, []);

  const handleToggle = (dark: boolean) => {
    setIsDarkMode(dark);
    localStorage.setItem("darkMode", String(dark));
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={() => handleToggle(!isDarkMode)}
      title={mounted && isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      style={{
        width: "32px",
        height: "32px",
        borderRadius: "8px",
        background: "transparent",
        border: "1px solid var(--border)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "16px",
        transition: "background 0.2s",
        color: "var(--text-muted)",
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-hover)")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      {mounted && isDarkMode ? "🌙" : "☀️"}
    </button>
  );
}
