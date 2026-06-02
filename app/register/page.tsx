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
          <div className="login-header__brand" style={{ background: "transparent" }}>
            <img src="/favicon.ico" alt="Yoku Logo" style={{ width: 64, height: 64, objectFit: 'contain' }} />
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

        <div className="auth-footer">
          <p>
            ¿Ya tienes una cuenta?
          </p>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="secondary-btn auth-footer__button"
          >
            Iniciar sesión
          </button>
        </div>
      </section>
    </main>
  );
}
