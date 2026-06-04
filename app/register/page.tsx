"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerAdmin } from "@/lib/api";
import styles from "../Landing.module.css";
import LandingHeader from "@/components/ui/LandingHeader";
import LandingFooter from "@/components/ui/LandingFooter";
import CookieBanner from "@/components/ui/CookieBanner";

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
    <div className={styles.landingWrapper}>
      <LandingHeader />

      <section className={styles.authSection}>
        <div className={styles.authCard}>
          <header className={styles.authHeader}>
            <h1 className={styles.authTitle}>Crear Cuenta</h1>
            <p className={styles.authSubtitle}>
              Regístrate para acceder al espacio de administración de Yoku
            </p>
          </header>

          {alert && (
            <div className={`${styles.authAlert} ${alert.type === 'success' ? styles.authAlertSuccess : styles.authAlertError}`}>
              {alert.message}
            </div>
          )}

          <form onSubmit={handleRegister} className={styles.authForm}>
            <div className={styles.authField}>
              <label htmlFor="reg-username" className={styles.authLabel}>Nombre de Usuario</label>
              <input
                id="reg-username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="tu_usuario"
                className={styles.authInput}
                autoComplete="username"
              />
            </div>

            <div className={styles.authField}>
              <label htmlFor="reg-email" className={styles.authLabel}>Correo Electrónico</label>
              <input
                id="reg-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@email.com"
                className={styles.authInput}
                autoComplete="email"
              />
            </div>

            <div className={styles.authField}>
              <label htmlFor="reg-fullname" className={styles.authLabel}>Nombre Completo</label>
              <input
                id="reg-fullname"
                type="text"
                required
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
                placeholder="Juan Pérez"
                className={styles.authInput}
                autoComplete="name"
              />
            </div>

            <div className={styles.authField}>
              <label htmlFor="reg-dni" className={styles.authLabel}>DNI</label>
              <input
                id="reg-dni"
                type="text"
                required
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                placeholder="12345678Z"
                className={styles.authInput}
              />
            </div>

            <div className={styles.authField}>
              <label htmlFor="reg-password" className={styles.authLabel}>Contraseña</label>
              <input
                id="reg-password"
                type="password"
                required
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="••••••••••••"
                className={styles.authInput}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`${styles.btnPrimary} ${styles.authSubmit}`}
            >
              {loading ? "Registrando..." : "Registrarse ahora"}
            </button>
          </form>

          <div className={styles.authFooter}>
            ¿Ya tienes una cuenta? <Link href="/login" className={styles.authLink}>Inicia sesión</Link>
          </div>
        </div>
      </section>

      <LandingFooter />
      <CookieBanner />
    </div>
  );
}
