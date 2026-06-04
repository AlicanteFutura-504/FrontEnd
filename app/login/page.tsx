"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUsuario } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import styles from "../Landing.module.css";
import LandingHeader from "@/components/ui/LandingHeader";
import LandingFooter from "@/components/ui/LandingFooter";
import CookieBanner from "@/components/ui/CookieBanner";

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
    <div className={styles.landingWrapper}>
      <LandingHeader />

      <section className={styles.authSection}>
        <div className={styles.authCard}>
          <header className={styles.authHeader}>
            <h1 className={styles.authTitle}>Bienvenido a Yoku</h1>
            <p className={styles.authSubtitle}>
              Ingresa tus credenciales para acceder al panel de control
            </p>
          </header>

          {alert && (
            <div className={`${styles.authAlert} ${alert.type === 'success' ? styles.authAlertSuccess : styles.authAlertError}`}>
              {alert.message}
            </div>
          )}

          <form onSubmit={handleLogin} className={styles.authForm}>
            <div className={styles.authField}>
              <label htmlFor="login-username" className={styles.authLabel}>Usuario</label>
              <input
                id="login-username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="root"
                className={styles.authInput}
                autoComplete="username"
              />
            </div>

            <div className={styles.authField}>
              <label htmlFor="login-password" className={styles.authLabel}>Contraseña</label>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                className={styles.authInput}
                autoComplete="current-password"
              />
            </div>

            <div className={styles.authOptions}>
              <label htmlFor="login-remember" className={styles.authCheckboxLabel}>
                <input
                  id="login-remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className={styles.authCheckbox}
                />
                <span>Recordarme</span>
              </label>

              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  setAlert({
                    type: "success",
                    message: "Enlace de recuperación enviado a tu correo.",
                  });
                }}
                className={styles.authForgot}
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`${styles.btnPrimary} ${styles.authSubmit}`}
            >
              {loading ? "Verificando..." : "Iniciar sesión"}
            </button>
          </form>

          <div className={styles.authFooter}>
            ¿No tienes una cuenta en Yoku? <Link href="/register" className={styles.authLink}>Regístrate</Link>
          </div>
        </div>
      </section>

      <LandingFooter />
      <CookieBanner />
    </div>
  );
}
