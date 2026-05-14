"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createUsuario } from "@/lib/api";

/**
 * Página premium de registro de nuevos usuarios.
 * Diseñada con estética glassmorphism y gradientes inmersivos.
 */
export default function RegisterPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!nombre || !contrasena) {
      setAlert({
        type: "error",
        message: "Por favor, completa todos los campos para registrarte.",
      });
      return;
    }

    setLoading(true);

    try {
      await createUsuario(nombre, contrasena);
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
      <section className="login-card">
        <header className="login-header">
          <div className="login-header__brand" style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>+</div>
          <h1 className="login-header__title">Crear Cuenta</h1>
          <p className="login-header__subtitle">
            Regístrate para acceder al espacio de administración de BookFlow
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
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="tu_usuario"
              className="login-input"
              autoComplete="username"
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
