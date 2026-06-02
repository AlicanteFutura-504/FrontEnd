"use client";

import React, { useSyncExternalStore } from "react";

const THEME_EVENT = "yoku-theme-change";

function getThemeSnapshot() {
  if (typeof window === "undefined") {
    return false;
  }

  return localStorage.getItem("darkMode") === "true";
}

function subscribeToTheme(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(THEME_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(THEME_EVENT, callback);
  };
}

export default function ThemeToggle() {
  const isDarkMode = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => false);

  const handleToggle = (dark: boolean) => {
    localStorage.setItem("darkMode", String(dark));
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDarkMode}
      onClick={() => handleToggle(!isDarkMode)}
      style={{
        width: "48px",
        height: "28px",
        borderRadius: "6px",
        background: isDarkMode ? "var(--accent-1, #6d28d9)" : "var(--surface-2, #f7f2ff)",
        border: "1px solid var(--border-strong, #cbb2ff)",
        padding: "3px",
        cursor: "pointer",
        transition: "background-color 0.15s ease, border-color 0.15s ease",
        display: "flex",
        alignItems: "center",
      }}
      title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "4px",
          background: "#ffffff",
          boxShadow: "0 1px 2px rgba(42, 25, 80, 0.18)",
          transition: "transform 0.15s ease",
          transform: isDarkMode ? "translateX(20px)" : "translateX(0)",
          display: "grid",
          placeItems: "center",
          fontSize: "12px",
        }}
      >
        {isDarkMode ? "D" : "L"}
      </div>
    </button>
  );
}
