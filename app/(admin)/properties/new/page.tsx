"use client";

import React, { useState } from "react";
import { createBusiness } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { MapPin, Home, Phone, Banknote, Users, FileText, Building, UserCircle, Mail, Lock } from "lucide-react";

export default function NewBusinessPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    city: "",
    address: "",
    telefono: "",
    username: "",
    email: "",
    contrasena: "",
    pricePerNight: 0,
    maxGuests: 2,
    description: "",
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
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Nombre del Local</label>
                <div className="input-with-icon">
                  <span className="input-icon"><Building size={16} /></span>
                  <input name="nombre" value={formData.nombre} onChange={handleChange} required className="input" placeholder="Ej. Restaurante El Puerto" />
                </div>
              </div>
              <div className="form-group">
                <label>Ciudad</label>
                <div className="input-with-icon">
                  <span className="input-icon"><MapPin size={16} /></span>
                  <input name="city" value={formData.city} onChange={handleChange} className="input" placeholder="Alicante" />
                </div>
              </div>

              <div className="form-group">
                <label>Dirección completa</label>
                <div className="input-with-icon">
                  <span className="input-icon"><Home size={16} /></span>
                  <input name="address" value={formData.address} onChange={handleChange} className="input" placeholder="Av. Mediterráneo, 12" />
                </div>
              </div>
              
              <div className="form-group">
                <label>Teléfono de Contacto</label>
                <div className="input-with-icon">
                  <span className="input-icon"><Phone size={16} /></span>
                  <input name="telefono" value={formData.telefono} onChange={handleChange} className="input" placeholder="965 00 00 00" />
                </div>
              </div>

              <div className="form-group">
                <label>Precio por noche (€)</label>
                <div className="input-with-icon">
                  <span className="input-icon"><Banknote size={16} /></span>
                  <input name="pricePerNight" type="number" min="0" value={formData.pricePerNight} onChange={handleChange} className="input" placeholder="Ej. 75" />
                </div>
              </div>

              <div className="form-group">
                <label>Huéspedes Máximos</label>
                <div className="input-with-icon">
                  <span className="input-icon"><Users size={16} /></span>
                  <input name="maxGuests" type="number" min="1" value={formData.maxGuests} onChange={handleChange} className="input" placeholder="Ej. 4" />
                </div>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Descripción</label>
                <div className="input-with-icon">
                  <span className="input-icon" style={{ alignSelf: 'flex-start', marginTop: '12px' }}><FileText size={16} /></span>
                  <textarea name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="input" placeholder="Alojamiento espacioso con vistas al mar..." rows={4} style={{ resize: 'vertical' }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '12px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
            <h3 className="panel-title" style={{ marginBottom: '16px' }}>Acceso del Local</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Usuario (para el personal)</label>
                <div className="input-with-icon">
                  <span className="input-icon"><UserCircle size={16} /></span>
                  <input name="username" value={formData.username} onChange={handleChange} required className="input" placeholder="usuario_local" />
                </div>
              </div>
              <div className="form-group">
                <label>Email corporativo</label>
                <div className="input-with-icon">
                  <span className="input-icon"><Mail size={16} /></span>
                  <input name="email" type="email" value={formData.email} onChange={handleChange} required className="input" placeholder="local@propiedad.com" />
                </div>
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Contraseña de acceso</label>
                <div className="input-with-icon">
                  <span className="input-icon"><Lock size={16} /></span>
                  <input name="contrasena" type="password" value={formData.contrasena} onChange={handleChange} required className="input" placeholder="••••••••" />
                </div>
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
