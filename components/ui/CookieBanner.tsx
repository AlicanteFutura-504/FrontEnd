"use client";

import React, { useState, useEffect } from "react";
import CookieSettingsModal from "./CookieSettingsModal";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Listen for custom event from footer
    const handleOpenSettings = () => setShowModal(true);
    window.addEventListener("open-cookie-settings", handleOpenSettings);
    
    return () => {
      window.removeEventListener("open-cookie-settings", handleOpenSettings);
    };
  }, []);

  useEffect(() => {
    // Check if the user has already accepted cookies
    const hasAccepted = localStorage.getItem("yoku_cookies_accepted");
    if (!hasAccepted) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("yoku_cookies_accepted", "true");
    setShowBanner(false);
    setShowModal(false);
  };

  const rejectCookies = () => {
    localStorage.setItem("yoku_cookies_accepted", "false");
    setShowBanner(false);
    setShowModal(false);
  };

  const savePreferences = (prefs: any) => {
    localStorage.setItem("yoku_cookies_accepted", "true");
    localStorage.setItem("yoku_cookies_prefs", JSON.stringify(prefs));
    setShowBanner(false);
    setShowModal(false);
  };

  return (
    <>
      {showBanner && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "20px 24px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
            zIndex: 9999,
            maxWidth: "90%",
            width: "800px",
            animation: "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          <style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translate(-50%, 20px); }
              to { opacity: 1; transform: translate(-50%, 0); }
            }
          `}</style>
          
          <div>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "700", color: "#111827" }}>
              Usamos cookies 🍪
            </h4>
            <p style={{ margin: 0, fontSize: "14px", color: "#6b7280", lineHeight: "1.5" }}>
              Utilizamos cookies propias y de terceros para mejorar nuestros servicios y mostrarle publicidad relacionada con sus preferencias mediante el análisis de sus hábitos de navegación.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexShrink: 0 }}>
            <button
              onClick={() => setShowModal(true)}
              style={{
                backgroundColor: "transparent",
                color: "#6b7280",
                border: "none",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                padding: "8px 12px",
              }}
            >
              Configurar
            </button>
            <button
              onClick={acceptCookies}
              style={{
                backgroundColor: "#0066FF",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                padding: "10px 20px",
                boxShadow: "0 4px 6px -1px rgba(0, 102, 255, 0.2)",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0052cc")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0066FF")}
            >
              Aceptar todas
            </button>
          </div>
        </div>
      )}

      <CookieSettingsModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        onAcceptAll={acceptCookies}
        onRejectAll={rejectCookies}
        onSavePreferences={savePreferences}
      />
    </>
  );
}
