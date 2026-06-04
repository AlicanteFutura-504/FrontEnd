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
      role="switch"
      aria-checked={mounted ? isDarkMode : false}
      onClick={() => handleToggle(!isDarkMode)}
      style={{
        width: "46px",
        height: "26px",
        borderRadius: "999px",
        background: mounted && isDarkMode ? "var(--accent-1, #6366f1)" : "var(--border-strong, #cbd5e1)",
        border: "none",
        padding: "3px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
        display: "flex",
        alignItems: "center",
      }}
      title={mounted && isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
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
          display: "grid",
          placeItems: "center",
          fontSize: "12px",
        }}
      >
        {mounted && isDarkMode ? "🌙" : "☀️"}
      </div>
    </button>
  );
}
