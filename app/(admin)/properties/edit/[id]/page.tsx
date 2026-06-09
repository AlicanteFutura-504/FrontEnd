"use client";

import React, { useState, useEffect } from "react";
import Loading from "@/components/ui/Loading";
import { getBusiness, updateBusiness } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function EditBusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
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
          direccion: business.direccion || "",
          telefono: business.telefono || "",
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
