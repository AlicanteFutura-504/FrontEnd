"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Página premium de inicio de sesión.
 * Valida credenciales contra 'root' / 'root'.
 */
export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!username || !password) {
      setAlert({
        type: "error",
        message: "Por favor, completa todos los campos requeridos.",
      });
      return;
    }

    setLoading(true);

    // Validación temporal con usuario y contraseña 'root'
    setTimeout(() => {
      setLoading(false);
      if (username === "root" && password === "root") {
        setAlert({
          type: "success",
          message: "¡Sesión iniciada correctamente! Redirigiendo...",
        });

        // Redirigir al dashboard tras el éxito
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        setAlert({
          type: "error",
          message: "Credenciales inválidas. Solo se permite el acceso con el usuario 'root'.",
        });
      }
    }, 1000);
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <header className="login-header">
          <div className="login-header__brand">◫</div>
          <h1 className="login-header__title">Bienvenido a BookFlow</h1>
          <p className="login-header__subtitle">
            Ingresa tus credenciales para acceder al panel de control
          </p>
        </header>

        {alert && (
          <div
            id="login-alert"
            className={`login-alert login-alert--${alert.type}`}
            style={{ marginBottom: "20px" }}
          >
            {alert.message}
          </div>
        )}

        <form id="login-form" onSubmit={handleLogin} className="login-form">
          <div className="login-field">
            <label htmlFor="login-username" className="login-field__label">
              Usuario
            </label>
            <input
              id="login-username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="root"
              className="login-input"
              autoComplete="username"
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-password" className="login-field__label">
              Contraseña
            </label>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••"
              className="login-input"
              autoComplete="current-password"
            />
          </div>

          <div className="login-options">
            <label htmlFor="login-remember" className="login-checkbox-label">
              <input
                id="login-remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="login-checkbox"
              />
              <span>Recordarme</span>
            </label>

            <a
              id="forgot-password-link"
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                setAlert({
                  type: "success",
                  message: "Enlace de recuperación enviado a tu correo.",
                });
              }}
              className="login-forgot"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="login-btn"
          >
            {loading ? (
              <>
                <span className="spinner" style={{ fontSize: "18px" }}>⌛</span>
                <span>Verificando...</span>
              </>
            ) : (
              <>
                <span>⇥</span>
                <span>Iniciar sesión</span>
              </>
            )}
          </button>
        </form>
      </section>
    </main>
  );
}
