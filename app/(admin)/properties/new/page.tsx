"use client";

import React, { useState } from "react";
import { createBusiness } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

export default function NewBusinessPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    username: "",
    email: "",
    contrasena: "",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!user) return;

    setLoading(true);

    try {
      await createBusiness({
        ...formData,
        usuarioId: user.id
      });
      setAlert({
        type: "success",
        message: `¡Propiedad '${formData.nombre}' añadido exitosamente!`,
      });
      setTimeout(() => router.push("/properties"), 1500);
    } catch (error: any) {
      setAlert({
        type: "error",
        message: error.message || "No se pudo añadir el propiedad.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-stack">
      <header className="page-hero">
        <div>
          <h2>Añadir Nuevo Propiedad</h2>
          <p>Configura el perfil de tu local y genera sus credenciales de acceso para el personal.</p>
        </div>
      </header>

      <section className="section-card" style={{ maxWidth: "800px", margin: "0 auto", width: '100%' }}>
        {alert && (
          <div className={alert.type === 'success' ? 'message-success' : 'message-error'} style={{ marginBottom: '24px', padding: '16px', borderRadius: '12px', background: alert.type === 'success' ? 'var(--success-bg)' : 'var(--warning-bg)' }}>
            {alert.message}
          </div>
        )}

        <form onSubmit={handleCreateBusiness} className="page-stack">
          <div>
            <h3 className="panel-title" style={{ marginBottom: '16px' }}>Información Comercial</h3>
            <div className="form-grid">
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="kpi-card__label">Nombre del Local</label>
                <input name="nombre" value={formData.nombre} onChange={handleChange} required className="input" placeholder="Ej. Restaurante El Puerto" />
              </div>
              <div className="input-group">
                <label className="kpi-card__label">Ubicación / Dirección</label>
                <input name="direccion" value={formData.direccion} onChange={handleChange} className="input" placeholder="Av. Mediterráneo, 12" />
              </div>
              <div className="input-group">
                <label className="kpi-card__label">Teléfono de Contacto</label>
                <input name="telefono" value={formData.telefono} onChange={handleChange} className="input" placeholder="965 00 00 00" />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '12px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
            <h3 className="panel-title" style={{ marginBottom: '16px' }}>Acceso del Local</h3>
            <div className="form-grid">
              <div className="input-group">
                <label className="kpi-card__label">Usuario (para el personal)</label>
                <input name="username" value={formData.username} onChange={handleChange} required className="input" placeholder="usuario_local" />
              </div>
              <div className="input-group">
                <label className="kpi-card__label">Email corporativo</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} required className="input" placeholder="local@propiedad.com" />
              </div>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="kpi-card__label">Contraseña de acceso</label>
                <input name="contrasena" type="password" value={formData.contrasena} onChange={handleChange} required className="input" placeholder="••••••••" />
              </div>
            </div>
          </div>

          <div className="message-row" style={{ marginTop: '12px' }}>
            <button type="submit" disabled={loading} className="primary-btn" style={{ width: '100%', padding: '16px' }}>
              {loading ? "Procesando..." : "Finalizar y Añadir Propiedad"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
