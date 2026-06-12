"use client";

import React, { useState, useEffect } from "react";
import Loading from "@/components/ui/Loading";
import { getBusiness, updateBusiness } from "@/lib/api";
import { useRouter } from "next/navigation";
import { MapPin, Home, Phone, Banknote, Users, FileText, Building } from "lucide-react";

export default function EditBusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    city: "",
    address: "",
    telefono: "",
    pricePerNight: 0,
    maxGuests: 2,
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const business = await getBusiness(Number(id));
        setFormData({
          nombre: business.nombre || "",
          city: business.city || "",
          address: business.address || "",
          telefono: business.telefono || "",
          pricePerNight: business.pricePerNight || 0,
          maxGuests: business.maxGuests || 2,
          description: business.description || "",
        });
      } catch (error: any) {
        setAlert({
          type: "error",
          message: error.message || "No se pudo cargar la información del propiedad.",
        });
      } finally {
        setFetching(false);
      }
    };
    fetchBusiness();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);

    try {
      await updateBusiness(Number(id), formData);
      setAlert({
        type: "success",
        message: `¡Propiedad actualizado exitosamente!`,
      });
      setTimeout(() => router.push("/properties"), 1500);
    } catch (error: any) {
      setAlert({
        type: "error",
        message: error.message || "No se pudo actualizar el propiedad.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Loading />;

  return (
    <div className="page-stack">
      <header className="page-hero">
        <div>
          <h2>Editar Propiedad</h2>
          <p>Modifica la información de tu local.</p>
        </div>
      </header>

      <section className="section-card" style={{ maxWidth: "800px", margin: "0 auto", width: '100%' }}>
        {alert && (
          <div className={alert.type === 'success' ? 'message-success' : 'message-error'} style={{ marginBottom: '24px', padding: '16px', borderRadius: '12px', background: alert.type === 'success' ? 'var(--success-bg)' : 'var(--warning-bg)' }}>
            {alert.message}
          </div>
        )}

        <form onSubmit={handleUpdateBusiness} className="page-stack">
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

          <div className="message-row" style={{ marginTop: '12px', display: 'flex', gap: '12px' }}>
            <button type="submit" disabled={loading} className="primary-btn" style={{ flex: 1, padding: '16px' }}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
            <button type="button" onClick={() => router.push("/properties")} className="secondary-btn" style={{ flex: 1, padding: '16px' }}>
              Cancelar
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
