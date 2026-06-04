"use client";

import React, { useState, useEffect } from "react";

interface CookieSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcceptAll: () => void;
  onSavePreferences: (prefs: any) => void;
  onRejectAll: () => void;
}

export default function CookieSettingsModal({ isOpen, onClose, onAcceptAll, onSavePreferences, onRejectAll }: CookieSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"categorias" | "propositos" | "proveedores">("categorias");
  const [preferences, setPreferences] = useState({
    analitica: true,
    anuncio: true,
    otros: true
  });

  if (!isOpen) return null;

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    onSavePreferences(preferences);
    onClose();
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10000,
      fontFamily: "var(--font-outfit), 'Outfit', sans-serif"
    }}>
      <div style={{
        backgroundColor: "#ffffff",
        width: "100%",
        maxWidth: "800px",
        maxHeight: "90vh",
        borderRadius: "1rem",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        position: "relative",
        animation: "modalFadeIn 0.3s ease-out forwards"
      }}>
        <style>{`
          @keyframes modalFadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .cookie-tab {
            padding: 1rem 0;
            margin-right: 2rem;
            cursor: pointer;
            color: #6b7280;
            font-weight: 600;
            border-bottom: 2px solid transparent;
            transition: all 0.2s;
          }
          .cookie-tab.active {
            color: #111827;
            border-bottom-color: #0066FF;
          }
          .cookie-toggle {
            appearance: none;
            width: 44px;
            height: 24px;
            background-color: #e5e7eb;
            border-radius: 999px;
            position: relative;
            cursor: pointer;
            outline: none;
            transition: background-color 0.2s;
          }
          .cookie-toggle:checked {
            background-color: #10b981;
          }
          .cookie-toggle::after {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            width: 20px;
            height: 20px;
            background-color: white;
            border-radius: 50%;
            transition: transform 0.2s;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          }
          .cookie-toggle:checked::after {
            transform: translateX(20px);
          }
          .cookie-toggle:disabled {
            cursor: not-allowed;
            opacity: 0.7;
          }
          .cookie-toggle:disabled:checked {
            background-color: #3b82f6;
          }
        `}</style>

        {/* Header */}
        <div style={{ padding: "2rem 2rem 1rem", borderBottom: "1px solid #e5e7eb" }}>
          <button 
            onClick={onClose}
            style={{
              position: "absolute", top: "1.5rem", right: "1.5rem",
              background: "none", border: "none", fontSize: "1.5rem",
              color: "#9ca3af", cursor: "pointer", padding: "0.5rem"
            }}
          >
            ✕
          </button>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", margin: "0 0 1rem 0" }}>Política de privacidad</h2>
          <p style={{ color: "#6b7280", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
            Utilizamos cookies para personalizar el contenido y los anuncios, proporcionar funciones de redes sociales y analizar nuestro tráfico. También compartimos información sobre su uso de nuestro sitio con nuestros socios de redes sociales, publicidad y análisis. <a href="#" style={{ color: "#0066FF", textDecoration: "none" }}>Más información</a>
          </p>

          <div style={{ display: "flex", marginTop: "1.5rem" }}>
            <div className={`cookie-tab ${activeTab === "categorias" ? "active" : ""}`} onClick={() => setActiveTab("categorias")}>
              Categorías de cookies
            </div>
            <div className={`cookie-tab ${activeTab === "propositos" ? "active" : ""}`} onClick={() => setActiveTab("propositos")}>
              Propósitos y características
            </div>
            <div className={`cookie-tab ${activeTab === "proveedores" ? "active" : ""}`} onClick={() => setActiveTab("proveedores")}>
              Proveedores
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "2rem" }}>
          {activeTab === "categorias" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              
              <div style={{ border: "1px solid #f3f4f6", borderRadius: "0.75rem", padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <h3 style={{ margin: 0, fontSize: "1.125rem", color: "#111827" }}>Necesaria</h3>
                  <span style={{ color: "#0066FF", fontSize: "0.875rem", fontWeight: 600 }}>Siempre activo</span>
                </div>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem", lineHeight: 1.5 }}>
                  Las cookies necesarias son cruciales para las funciones básicas del sitio web y el sitio web no funcionará de la forma prevista sin ellas.
                </p>
              </div>

              <div style={{ border: "1px solid #f3f4f6", borderRadius: "0.75rem", padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <h3 style={{ margin: 0, fontSize: "1.125rem", color: "#111827" }}>Funcional</h3>
                  <input type="checkbox" className="cookie-toggle" defaultChecked disabled />
                </div>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem", lineHeight: 1.5 }}>
                  Las cookies funcionales ayudan a realizar ciertas funcionalidades, como compartir el contenido del sitio web en las plataformas de redes sociales.
                </p>
              </div>

              <div style={{ border: "1px solid #f3f4f6", borderRadius: "0.75rem", padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <h3 style={{ margin: 0, fontSize: "1.125rem", color: "#111827" }}>Analítica</h3>
                  <input 
                    type="checkbox" 
                    className="cookie-toggle" 
                    checked={preferences.analitica}
                    onChange={() => togglePreference("analitica")}
                  />
                </div>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem", lineHeight: 1.5 }}>
                  Las cookies analíticas se utilizan para comprender cómo los visitantes interactúan con el sitio web. Estas cookies ayudan a proporcionar información sobre métricas de número de visitantes.
                </p>
              </div>

              <div style={{ border: "1px solid #f3f4f6", borderRadius: "0.75rem", padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <h3 style={{ margin: 0, fontSize: "1.125rem", color: "#111827" }}>Anuncio</h3>
                  <input 
                    type="checkbox" 
                    className="cookie-toggle" 
                    checked={preferences.anuncio}
                    onChange={() => togglePreference("anuncio")}
                  />
                </div>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem", lineHeight: 1.5 }}>
                  Las cookies publicitarias se utilizan para ofrecer a los visitantes anuncios y campañas de marketing relevantes.
                </p>
              </div>

            </div>
          )}

          {activeTab === "propositos" && (
            <div style={{ color: "#4b5563" }}>
              <p>Opciones detalladas sobre los propósitos específicos para los cuales se utilizan sus datos (IAB TCF v2.2).</p>
              {/* Contenido simplificado simulando la vista */}
              <div style={{ marginTop: "1rem", border: "1px solid #f3f4f6", borderRadius: "0.75rem", padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <h3 style={{ margin: 0, fontSize: "1.125rem", color: "#111827" }}>Propósitos Estándar</h3>
                  <input type="checkbox" className="cookie-toggle" defaultChecked />
                </div>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>Uso de datos para mejorar productos, desarrollar nuevas funciones y medir rendimiento.</p>
              </div>
            </div>
          )}

          {activeTab === "proveedores" && (
            <div style={{ color: "#4b5563" }}>
              <p>Lista de proveedores (vendors) con los que compartimos información.</p>
              <div style={{ marginTop: "1rem", border: "1px solid #f3f4f6", borderRadius: "0.75rem", padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <h3 style={{ margin: 0, fontSize: "1.125rem", color: "#111827" }}>Proveedores de terceros</h3>
                  <input type="checkbox" className="cookie-toggle" defaultChecked />
                </div>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>Google Analytics, Facebook Pixel, Intercom, entre otros asociados integrados.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ 
          padding: "1.5rem 2rem", 
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <button 
            onClick={onRejectAll}
            style={{
              padding: "0.75rem 1.5rem", backgroundColor: "#f3f4f6", color: "#374151",
              border: "none", borderRadius: "0.5rem", fontWeight: 600, cursor: "pointer"
            }}
          >
            Rechazar todo
          </button>
          
          <div style={{ display: "flex", gap: "1rem" }}>
            <button 
              onClick={handleSave}
              style={{
                padding: "0.75rem 1.5rem", backgroundColor: "#3b82f6", color: "white",
                border: "none", borderRadius: "0.5rem", fontWeight: 600, cursor: "pointer"
              }}
            >
              Guardar mis preferencias
            </button>
            <button 
              onClick={onAcceptAll}
              style={{
                padding: "0.75rem 1.5rem", backgroundColor: "#1e3a8a", color: "white",
                border: "none", borderRadius: "0.5rem", fontWeight: 600, cursor: "pointer"
              }}
            >
              Aceptar todo
            </button>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: "10px", right: "20px", fontSize: "0.75rem", color: "#9ca3af" }}>
          Powered by <strong>YokuPrivacy</strong>
        </div>

      </div>
    </div>
  );
}
