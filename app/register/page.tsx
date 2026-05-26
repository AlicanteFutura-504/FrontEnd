"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { registerAdmin } from "@/lib/api";
import ThemeToggle from "@/components/ui/ThemeToggle";

/**
 * Página premium de registro de nuevos usuarios.
 * Diseñada con estética glassmorphism y gradientes inmersivos.
 */
export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [dni, setDni] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!username || !email || !nombreCompleto || !dni || !contrasena) {
      setAlert({
        type: "error",
        message: "Por favor, completa todos los campos para registrarte.",
      });
      return;
    }

    setLoading(true);

    try {
      await registerAdmin({ username, email, nombreCompleto, dni, contrasena });
      setAlert({
        type: "success",
        message: "¡Usuario creado exitosamente! Redirigiendo al inicio de sesión...",
      });

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (error: any) {
      setAlert({
        type: "error",
        message: error.message || "No se pudo registrar el usuario. Intenta de nuevo.",
      });
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div style={{ position: "absolute", top: "24px", right: "24px", zIndex: 50 }}>
        <ThemeToggle />
      </div>
      <section className="login-card">
        <header className="login-header">
          <div className="login-header__brand" style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
          </div>
          <h1 className="login-header__title">Crear Cuenta</h1>
          <p className="login-header__subtitle">
            Regístrate para acceder al espacio de administración de Yoku
          </p>
        </header>

        {alert && (
          <div
            id="register-alert"
            className={`login-alert login-alert--${alert.type}`}
            style={{ marginBottom: "20px" }}
          >
            {alert.message}
          </div>
        )}

        <form id="register-form" onSubmit={handleRegister} className="login-form">
          <div className="login-field">
            <label htmlFor="reg-username" className="login-field__label">
              Nombre de Usuario
            </label>
            <input
              id="reg-username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="tu_usuario"
              className="login-input"
              autoComplete="username"
            />
          </div>

          <div className="login-field">
            <label htmlFor="reg-email" className="login-field__label">
              Correo Electrónico
            </label>
            <input
              id="reg-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@email.com"
              className="login-input"
              autoComplete="email"
            />
          </div>

          <div className="login-field">
            <label htmlFor="reg-fullname" className="login-field__label">
              Nombre Completo
            </label>
            <input
              id="reg-fullname"
              type="text"
              required
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              placeholder="Juan Pérez"
              className="login-input"
              autoComplete="name"
            />
          </div>

          <div className="login-field">
            <label htmlFor="reg-dni" className="login-field__label">
              DNI
            </label>
            <input
              id="reg-dni"
              type="text"
              required
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              placeholder="12345678Z"
              className="login-input"
            />
          </div>

          <div className="login-field">
            <label htmlFor="reg-password" className="login-field__label">
              Contraseña
            </label>
            <input
              id="reg-password"
              type="password"
              required
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="••••••••••••"
              className="login-input"
              autoComplete="new-password"
            />
          </div>

          <button
            id="register-submit-btn"
            type="submit"
            disabled={loading}
            className="login-btn"
            style={{ background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 10px 25px rgba(16, 185, 129, 0.4)" }}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ fontSize: "18px" }}>⌛</span>
                <span>Registrando...</span>
              </>
            ) : (
              <>
                <span>✓</span>
                <span>Registrarse ahora</span>
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: "28px", paddingTop: "20px", borderTop: "1px solid rgba(255, 255, 255, 0.1)", textAlign: "center" }}>
          <p style={{ color: "#94a3b8", fontSize: "14px", margin: "0 0 12px" }}>
            ¿Ya tienes una cuenta?
          </p>
          <button
            type="button"
            onClick={() => router.push("/login")}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              background: "rgba(255, 255, 255, 0.05)",
              color: "white",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
            }}
          >
            Iniciar sesión
          </button>
        </div>
      </section>
    </main>
  );
}
