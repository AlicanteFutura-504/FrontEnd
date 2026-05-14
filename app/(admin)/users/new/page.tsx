"use client";

import React, { useState } from "react";
import { createUsuario } from "@/lib/api";

/**
 * Página de creación de usuarios (Exclusiva para 'root').
 * Permite añadir nuevos usuarios a la base de datos con nombre y contraseña.
 */
export default function NewUserPage() {
  const [nombre, setNombre] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!nombre || !contrasena) {
      setAlert({
        type: "error",
        message: "Por favor, completa tanto el nombre de usuario como la contraseña.",
      });
      return;
    }

    setLoading(true);

    try {
      await createUsuario(nombre, contrasena);
      setAlert({
        type: "success",
        message: `¡Usuario '${nombre}' creado exitosamente en la base de datos!`,
      });
      setNombre("");
      setContrasena("");
    } catch (error: any) {
      setAlert({
        type: "error",
        message: error.message || "No se pudo crear el usuario. Verifica la conexión con el servidor.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-stack">
      <div className="page-hero">
        <div>
          <h2>Crear Nuevo Usuario</h2>
          <p>Añade nuevos administradores al sistema con sus respectivas credenciales</p>
        </div>
      </div>

      <section className="section-card" style={{ maxWidth: "600px", margin: "0 auto" }}>
        {alert && (
          <div
            id="create-user-alert"
            className={`login-alert login-alert--${alert.type}`}
            style={{ marginBottom: "20px" }}
          >
            {alert.message}
          </div>
        )}

        <form id="create-user-form" onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label htmlFor="user-nombre" style={{ display: "block", marginBottom: "8px", fontWeight: 600, fontSize: "14px", color: "var(--muted)" }}>
              Nombre de Usuario
            </label>
            <input
              id="user-nombre"
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="ejemplo_admin"
              className="input"
            />
          </div>

          <div>
            <label htmlFor="user-contrasena" style={{ display: "block", marginBottom: "8px", fontWeight: 600, fontSize: "14px", color: "var(--muted)" }}>
              Contraseña
            </label>
            <input
              id="user-contrasena"
              type="password"
              required
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="••••••••••••"
              className="input"
            />
          </div>

          <button
            id="submit-create-user"
            type="submit"
            disabled={loading}
            className="primary-btn"
            style={{ marginTop: "10px", width: "100%", padding: "14px" }}
          >
            {loading ? "Creando usuario..." : "Registrar usuario en base de datos"}
          </button>
        </form>
      </section>
    </div>
  );
}
