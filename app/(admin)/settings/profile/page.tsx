"use client";

import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return <div className="p-8">Cargando perfil...</div>;

  return (
    <div className="page-stack">
      <header className="page-hero">
        <div>
          <h2>Mi Perfil</h2>
          <p>Gestiona tu información personal y credenciales de acceso.</p>
        </div>
        <Link href="/dashboard" className="secondary-btn">Volver al inicio</Link>
      </header>

      <div className="dashboard-grid">
        <section className="section-card">
          <h3 className="panel-title" style={{ marginBottom: '24px' }}>Información Personal</h3>
          
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

            <div className="form-grid">
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
