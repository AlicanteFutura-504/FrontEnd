"use client";

import React, { useState, useEffect } from "react";
import { createBusiness } from "@/lib/api";

/**
 * Página premium para la creación de empresas.
 * Vincula automáticamente la nueva empresa al usuario autenticado.
 */
export default function NewBusinessPage() {
  const [nombre, setNombre] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [usuarioId, setUsuarioId] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    try {
      const storedId = localStorage.getItem("currentUserId");
      if (storedId) {
        setUsuarioId(parseInt(storedId, 10));
      }
    } catch (err) {}
  }, []);

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!nombre || !contrasena) {
      setAlert({
        type: "error",
        message: "Por favor, completa tanto el nombre de la empresa como la contraseña.",
      });
      return;
    }

    setLoading(true);

    try {
      await createBusiness(nombre, contrasena, usuarioId);
      setAlert({
        type: "success",
        message: `¡Empresa '${nombre}' registrada exitosamente en la base de datos!`,
      });
      setNombre("");
      setContrasena("");
    } catch (error: any) {
      setAlert({
        type: "error",
        message: error.message || "No se pudo registrar la empresa. Verifica la conexión con el servidor.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-stack">
      <div className="page-hero" style={{ borderLeft: "4px solid #10b981" }}>
        <div>
          <h2>Registrar Nueva Empresa</h2>
          <p>Añade y vincula empresas al espacio de trabajo de tu cuenta de usuario</p>
        </div>
      </div>

      <section className="section-card" style={{ maxWidth: "600px", margin: "0 auto" }}>
        {alert && (
          <div
            id="create-business-alert"
            className={`login-alert login-alert--${alert.type}`}
            style={{ marginBottom: "20px" }}
          >
            {alert.message}
          </div>
        )}

        <form id="create-business-form" onSubmit={handleCreateBusiness} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label htmlFor="business-nombre" style={{ display: "block", marginBottom: "8px", fontWeight: 600, fontSize: "14px", color: "var(--muted)" }}>
              Nombre de la Empresa
            </label>
            <input
              id="business-nombre"
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. TechCorp Spain"
              className="input"
            />
          </div>

          <div>
            <label htmlFor="business-contrasena" style={{ display: "block", marginBottom: "8px", fontWeight: 600, fontSize: "14px", color: "var(--muted)" }}>
              Contraseña de Acceso
            </label>
            <input
              id="business-contrasena"
              type="password"
              required
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="••••••••••••"
              className="input"
            />
          </div>

          <button
            id="submit-create-business"
            type="submit"
            disabled={loading}
            className="primary-btn"
            style={{ marginTop: "10px", width: "100%", padding: "14px", background: "#059669" }}
          >
            {loading ? "Registrando empresa..." : "Guardar empresa en base de datos"}
          </button>
        </form>
      </section>
    </div>
  );
}
