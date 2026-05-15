"use client";

import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { useState, useEffect } from "react";
import { updateUser as updateProfileApi } from "@/lib/api";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombreCompleto: user?.nombreCompleto || "",
    username: user?.username || "",
    email: user?.email || "",
    dni: user?.dni || "",
  });

  // Sincronizar el formulario con los datos del usuario si estos cambian
  useEffect(() => {
    if (user) {
      setFormData({
        nombreCompleto: user.nombreCompleto || "",
        username: user.username || "",
        email: user.email || "",
        dni: user.dni || "",
      });
    }
  }, [user]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return <div className="p-8">Cargando perfil...</div>;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await updateProfileApi(user.id, formData);
      updateUser(updatedUser);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Error al actualizar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-stack">
      <header className="page-hero">
        <div>
          <h2>Mi Perfil</h2>
          <p>Gestiona tu información personal y credenciales de acceso.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {!isEditing ? (
            <button 
              onClick={() => {
                // Al entrar en modo edición, nos aseguramos de que los datos sean los actuales
                setFormData({
                  nombreCompleto: user.nombreCompleto || "",
                  username: user.username || "",
                  email: user.email || "",
                  dni: user.dni || "",
                });
                setIsEditing(true);
              }} 
              className="primary-btn"
            >
              Editar Perfil
            </button>
          ) : (
            <button 
              onClick={() => setIsEditing(false)} 
              className="secondary-btn"
              disabled={isLoading}
            >
              Cancelar
            </button>
          )}
          <Link href="/dashboard" className="secondary-btn">Volver al inicio</Link>
        </div>
      </header>

      <div className="dashboard-grid">
        <section className="section-card">
          <h3 className="panel-title" style={{ marginBottom: '24px' }}>
            {isEditing ? "Editar Información Personal" : "Información Personal"}
          </h3>
          
          {error && (
            <div style={{ padding: '12px', background: 'rgba(255,0,0,0.1)', color: '#ff4444', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', padding: '20px', background: 'var(--surface-2)', borderRadius: '18px' }}>
              <div className="admin-avatar" style={{ width: '80px', height: '80px', fontSize: '32px' }}>
                {user.nombreCompleto?.charAt(0) || user.username.charAt(0)}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '20px' }}>{user.nombreCompleto || "Nombre no especificado"}</h4>
                <p style={{ margin: '4px 0 0', color: 'var(--muted)' }}>{user.role === 'admin' ? 'Administrador Global' : 'Gestor de Negocio'}</p>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="form-grid">
                <div className="input-group">
                  <label className="kpi-card__label">Nombre completo</label>
                  <input 
                    type="text" 
                    name="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div className="input-group">
                  <label className="kpi-card__label">Nombre de usuario</label>
                  <input 
                    type="text" 
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="kpi-card__label">Correo electrónico</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="kpi-card__label">DNI / Identificación</label>
                  <input 
                    type="text" 
                    name="dni"
                    value={formData.dni}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>
                <div style={{ gridColumn: 'span 2', marginTop: '12px' }}>
                  <button type="submit" className="primary-btn" style={{ width: '100%' }} disabled={isLoading}>
                    {isLoading ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="form-grid">
                <div className="input-group">
                  <label className="kpi-card__label">Nombre completo</label>
                  <div className="input" style={{ background: 'var(--surface-2)', border: 'none', fontWeight: 600 }}>{user.nombreCompleto || "No especificado"}</div>
                </div>
                <div className="input-group">
                  <label className="kpi-card__label">Nombre de usuario</label>
                  <div className="input" style={{ background: 'var(--surface-2)', border: 'none', fontWeight: 600 }}>{user.username}</div>
                </div>
                <div className="input-group">
                  <label className="kpi-card__label">Correo electrónico</label>
                  <div className="input" style={{ background: 'var(--surface-2)', border: 'none', fontWeight: 600 }}>{user.email}</div>
                </div>
                <div className="input-group">
                  <label className="kpi-card__label">DNI / Identificación</label>
                  <div className="input" style={{ background: 'var(--surface-2)', border: 'none', fontWeight: 600 }}>{user.dni || "N/A"}</div>
                </div>
                <div className="input-group">
                  <label className="kpi-card__label">Rol en el sistema</label>
                  <div className="input" style={{ background: 'var(--surface-2)', border: 'none', fontWeight: 600, textTransform: 'capitalize' }}>{user.role}</div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="info-stack">
          <div className="section-card">
            <h3 className="panel-title" style={{ fontSize: '18px', marginBottom: '16px' }}>Seguridad</h3>
            <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '16px' }}>Tu cuenta está protegida con autenticación JWT de última generación.</p>
            <button className="secondary-btn" style={{ width: '100%' }}>Cambiar contraseña</button>
          </div>
          
          <div className="info-box" style={{ borderLeft: '4px solid var(--accent)' }}>
            <p className="info-box__eyebrow">Última conexión</p>
            <p className="info-box__title">Hoy, hace un momento</p>
            <p className="info-box__text">IP: 127.0.0.1 (Local)</p>
          </div>
        </section>
      </div>
    </div>
  );
}
