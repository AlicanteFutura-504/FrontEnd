"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUsuario } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import ThemeToggle from "@/components/ui/ThemeToggle";

/**
 * Página premium de inicio de sesión.
 * Valida credenciales contra la base de datos y 'root'.
 */
export default function LoginPage() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
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

    try {
      const data = await loginUsuario(username, password);
      
      setAlert({
        type: "success",
        message: "¡Sesión iniciada correctamente! Redirigiendo...",
      });

      setTimeout(() => {
        authLogin(data.access_token, data.user);
      }, 800);
    } catch (error: any) {
      setAlert({
        type: "error",
        message: error.message || "Nombre de usuario o contraseña incorrectos.",
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
          <div className="login-header__brand" style={{ background: 'transparent' }}>
            <img src="/favicon.ico" alt="Yoku Logo" style={{ width: 64, height: 64, objectFit: 'contain' }} />
          </div>
          <h1 className="login-header__title">Bienvenido a Yoku</h1>
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

        <div style={{ marginTop: "28px", paddingTop: "20px", borderTop: "1px solid rgba(255, 255, 255, 0.1)", textAlign: "center" }}>
          <p style={{ color: "#94a3b8", fontSize: "14px", margin: "0 0 12px" }}>
            ¿No tienes una cuenta en Yoku?
          </p>
          <button
            type="button"
            onClick={() => router.push("/register")}
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
            Registrarse
          </button>
        </div>
      </section>
    </main>
  );
}
