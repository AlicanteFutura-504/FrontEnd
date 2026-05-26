"use client";

import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { updateMe as updateProfileApi } from "@/lib/api";
import Image from "next/image";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombreCompleto: user?.nombreCompleto || "",
    username: user?.username || "",
    email: user?.email || "",
    dni: user?.dni || "",
    profilePicture: user?.profilePicture || "",
  });

  // Sincronizar el formulario con los datos del usuario si estos cambian
  useEffect(() => {
    if (user) {
      setFormData({
        nombreCompleto: user.nombreCompleto || "",
        username: user.username || "",
        email: user.email || "",
        dni: user.dni || "",
        profilePicture: user.profilePicture || "",
      });
    }
  }, [user]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para cambio de contraseña
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ newPassword: "", confirmPassword: "" });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Estados para Modal Unsplash
  const [isUnsplashModalOpen, setIsUnsplashModalOpen] = useState(false);
  const [unsplashQuery, setUnsplashQuery] = useState("");
  const [unsplashResults, setUnsplashResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [unsplashError, setUnsplashError] = useState<string | null>(null);

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
      // Guardamos los datos con la URL de la foto incluida
      const updatedUser = await updateProfileApi(formData);
      
      updateUser(updatedUser);
      
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Error al actualizar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchOnline = () => {
    setIsUnsplashModalOpen(true);
  };

  const searchUnsplash = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unsplashQuery.trim()) return;
    
    setIsSearching(true);
    setUnsplashError(null);
    try {
      const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
      if (!accessKey) {
        throw new Error("Falta la clave de API de Unsplash en el archivo .env (NEXT_PUBLIC_UNSPLASH_ACCESS_KEY)");
      }
      const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(unsplashQuery)}&per_page=12`, {
        headers: {
          Authorization: `Client-ID ${accessKey}`
        }
      });
      
      if (!res.ok) throw new Error("Error al buscar imágenes en Unsplash. Verifica tu API Key.");
      
      const data = await res.json();
      setUnsplashResults(data.results || []);
    } catch (err: any) {
      setUnsplashError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);
    setPasswordError(null);
    try {
      await updateProfileApi({ contrasena: passwordData.newPassword });
      setIsChangingPassword(false);
      setPasswordData({ newPassword: "", confirmPassword: "" });
      alert("Contraseña actualizada correctamente");
    } catch (err: any) {
      setPasswordError(err.message || "Error al actualizar la contraseña");
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
                  profilePicture: user.profilePicture || "",
                });
                setIsEditing(true);
              }} 
              className="primary-btn"
            >
              Editar Perfil
            </button>
          ) : (
            <button 
              onClick={() => {
                setIsEditing(false);
                setFormData(prev => ({ ...prev, profilePicture: user.profilePicture || "" }));
              }} 
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
              <div 
                className="admin-avatar"
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  fontSize: '32px', 
                  overflow: 'hidden'
                }}
              >
                {(isEditing ? formData.profilePicture : user.profilePicture) ? (
                  <img 
                    src={isEditing ? formData.profilePicture : (user.profilePicture?.startsWith('http') ? user.profilePicture : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${user.profilePicture}`)} 
                    alt="Perfil" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + (user.nombreCompleto || user.username) + '&background=random';
                    }}
                  />
                ) : (
                  user.nombreCompleto?.charAt(0) || user.username.charAt(0)
                )}
              </div>
              
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: '20px' }}>{user.nombreCompleto || "Nombre no especificado"}</h4>
                <p style={{ margin: '4px 0 0', color: 'var(--muted)' }}>{user.role === 'admin' ? 'Administrador Global' : 'Gestor de Negocio'}</p>
                
                {isEditing && (
                  <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                      <input 
                        type="url" 
                        name="profilePicture"
                        value={formData.profilePicture}
                        onChange={handleInputChange}
                        className="input"
                        placeholder="Pega aquí la URL de la foto"
                        style={{ padding: '10px 14px', fontSize: '14px' }}
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={handleSearchOnline}
                      className="secondary-btn"
                      style={{ padding: '10px 16px', fontSize: '13px' }}
                      title="Abrir galería de imágenes en otra pestaña"
                    >
                      Buscar foto online
                    </button>
                  </div>
                )}
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
                  <div className="input" style={{ background: 'var(--surface-2)', border: 'none', fontWeight: 600 }}>{user.email || "No especificado"}</div>
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
            
            {!isChangingPassword ? (
              <button 
                className="secondary-btn" 
                style={{ width: '100%' }}
                onClick={() => setIsChangingPassword(true)}
              >
                Cambiar contraseña
              </button>
            ) : (
              <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="input-group">
                  <label className="kpi-card__label" style={{ fontSize: '12px' }}>Nueva contraseña</label>
                  <input 
                    type="password" 
                    className="input" 
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Mínimo 6 caracteres"
                    required
                    style={{ padding: '8px 12px' }}
                  />
                </div>
                <div className="input-group">
                  <label className="kpi-card__label" style={{ fontSize: '12px' }}>Confirmar contraseña</label>
                  <input 
                    type="password" 
                    className="input" 
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Repite la contraseña"
                    required
                    style={{ padding: '8px 12px' }}
                  />
                </div>
                {passwordError && <p style={{ color: '#ff4444', fontSize: '12px', margin: 0 }}>{passwordError}</p>}
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <button type="submit" className="primary-btn" style={{ flex: 1, padding: '8px' }} disabled={isLoading}>
                    {isLoading ? "Guardando..." : "Guardar"}
                  </button>
                  <button 
                    type="button" 
                    className="secondary-btn" 
                    style={{ flex: 1, padding: '8px' }}
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({ newPassword: "", confirmPassword: "" });
                      setPasswordError(null);
                    }}
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
          
          <div className="info-box" style={{ borderLeft: '4px solid var(--accent)' }}>
            <p className="info-box__eyebrow">Última conexión</p>
            <p className="info-box__title">Hoy, hace un momento</p>
            <p className="info-box__text">IP: 127.0.0.1 (Local)</p>
          </div>
        </section>
      </div>

      {isUnsplashModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsUnsplashModalOpen(false)}>
          <div className="modal-card" style={{ width: '80%', maxWidth: '800px', maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Buscar Foto de Perfil</h3>
            <p className="modal-text">Busca en Unsplash la imagen que prefieras.</p>
            
            <form onSubmit={searchUnsplash} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input 
                type="text" 
                className="input" 
                value={unsplashQuery}
                onChange={e => setUnsplashQuery(e.target.value)}
                placeholder="Ej. persona, cara, oficina..."
                style={{ flex: 1 }}
              />
              <button type="submit" className="primary-btn" disabled={isSearching}>
                {isSearching ? "Buscando..." : "Buscar"}
              </button>
            </form>
            
            {unsplashError && <p style={{ color: '#ef4444', marginBottom: '16px' }}>{unsplashError}</p>}
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '16px' }}>
              {unsplashResults.map((img: any) => (
                <div 
                  key={img.id} 
                  style={{ 
                    cursor: 'pointer', 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    aspectRatio: '1/1',
                    border: formData.profilePicture === img.urls.regular ? '4px solid var(--accent-1)' : '2px solid transparent',
                    transition: 'transform 0.2s ease',
                  }}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, profilePicture: img.urls.regular }));
                    setIsUnsplashModalOpen(false);
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img src={img.urls.small} alt={img.alt_description || "Unsplash"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
            
            <div className="modal-actions" style={{ marginTop: '24px' }}>
              <button className="secondary-btn" onClick={() => setIsUnsplashModalOpen(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
