"use client";

import React, { useState, useEffect } from "react";
import Loading from "@/components/ui/Loading";
import { getBusiness, updateBusiness, uploadPropertyImage, deletePropertyImage } from "@/lib/api";
import { useRouter } from "next/navigation";
import { MapPin, Home, Phone, Banknote, Users, FileText, Building, Image as ImageIcon, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function EditBusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const [amenityInput, setAmenityInput] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
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
  const { toast } = useToast();

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
        
        let parsedAmenities: string[] = [];
        try {
          if (typeof business.amenities === 'string') {
            parsedAmenities = JSON.parse(business.amenities);
          } else if (Array.isArray(business.amenities)) {
            parsedAmenities = business.amenities;
          }
        } catch {
          // Si no es JSON válido
          if (business.amenities) parsedAmenities = String(business.amenities).split(',').map(s => s.trim());
        }
        setAmenities(parsedAmenities || []);

        let parsedImages: string[] = [];
        try {
          if (typeof business.images === 'string') parsedImages = JSON.parse(business.images);
          else if (Array.isArray(business.images)) parsedImages = business.images;
        } catch {
          if (business.images) parsedImages = [String(business.images)];
        }
        setImages(parsedImages || []);
      } catch (error: any) {
        toast.error(error.message || "No se pudo cargar la información de la propiedad.");
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
    setLoading(true);

    try {
      const dataToSave = {
        ...formData,
        amenities: JSON.stringify(amenities),
      };
      await updateBusiness(Number(id), dataToSave);
      toast.success("¡Propiedad actualizada exitosamente!");
      setTimeout(() => router.push("/properties"), 1500);
    } catch (error: any) {
      toast.error(error.message || "No se pudo actualizar la propiedad.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingImage(true);
    try {
      const updatedBusiness = await uploadPropertyImage(Number(id), file);
      
      let parsedImages: string[] = [];
      try {
        if (typeof updatedBusiness.images === 'string') parsedImages = JSON.parse(updatedBusiness.images);
        else if (Array.isArray(updatedBusiness.images)) parsedImages = updatedBusiness.images;
      } catch {
        if (updatedBusiness.images) parsedImages = [String(updatedBusiness.images)];
      }
      setImages(parsedImages || []);
      toast.success("Imagen subida con éxito.");
    } catch (error: any) {
      toast.error(error.message || "Error al subir la imagen.");
    } finally {
      setUploadingImage(false);
      e.target.value = ""; // reset input
    }
  };

  const handleRemoveImage = async (imageUrl: string) => {
    if (!confirm("¿Eliminar esta imagen?")) return;
    try {
      const updatedBusiness = await deletePropertyImage(Number(id), imageUrl);
      let parsedImages: string[] = [];
      try {
        if (typeof updatedBusiness.images === 'string') parsedImages = JSON.parse(updatedBusiness.images);
        else if (Array.isArray(updatedBusiness.images)) parsedImages = updatedBusiness.images;
      } catch {
        if (updatedBusiness.images) parsedImages = [String(updatedBusiness.images)];
      }
      setImages(parsedImages || []);
      toast.success("Imagen eliminada.");
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar imagen.");
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
                <label>Comodidades (Amenities)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      value={amenityInput} 
                      onChange={e => setAmenityInput(e.target.value)} 
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (amenityInput.trim() && !amenities.includes(amenityInput.trim())) {
                            setAmenities([...amenities, amenityInput.trim()]);
                            setAmenityInput("");
                          }
                        }
                      }}
                      className="input" 
                      placeholder="Ej. Wifi, Piscina, Parking... (Presiona Enter)" 
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        if (amenityInput.trim() && !amenities.includes(amenityInput.trim())) {
                          setAmenities([...amenities, amenityInput.trim()]);
                          setAmenityInput("");
                        }
                      }}
                      style={{ background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0 16px', color: 'var(--text)', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Añadir
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {amenities.map(am => (
                      <span key={am} style={{ background: 'var(--primary)', color: 'white', padding: '6px 12px', borderRadius: '16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                        {am}
                        <button type="button" onClick={() => setAmenities(amenities.filter(a => a !== am))} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>&times;</button>
                      </span>
                    ))}
                    {amenities.length === 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No hay comodidades añadidas.</span>}
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Descripción</label>
                <div style={{ border: '1px solid var(--border-strong)', borderRadius: '8px', overflow: 'hidden', background: 'var(--surface)' }}>
                  <div style={{ padding: '8px 12px', background: 'var(--surface-hover)', borderBottom: '1px solid var(--border)', display: 'flex', gap: '8px' }}>
                    <button type="button" onClick={() => setFormData(p => ({...p, description: p.description + '**Negrita**'}))} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600, padding: '4px 8px', borderRadius: '4px' }}>B</button>
                    <button type="button" onClick={() => setFormData(p => ({...p, description: p.description + '*Cursiva*'}))} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontStyle: 'italic', padding: '4px 8px', borderRadius: '4px' }}>I</button>
                    <button type="button" onClick={() => setFormData(p => ({...p, description: p.description + '\n- Elemento'}))} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }}>Lista</button>
                  </div>
                  <div className="input-with-icon" style={{ border: 'none', borderRadius: 0 }}>
                    <span className="input-icon" style={{ alignSelf: 'flex-start', marginTop: '12px' }}><FileText size={16} /></span>
                    <textarea name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="input" placeholder="Alojamiento espacioso con vistas al mar..." rows={6} style={{ resize: 'vertical', border: 'none', background: 'transparent', outline: 'none' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Galería de Imágenes */}
          <div style={{ marginTop: '24px' }}>
            <h3 className="panel-title" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ImageIcon size={20} className="text-accent" /> Galería de Imágenes
            </h3>
            
            <div style={{ background: 'var(--surface-hover)', padding: '24px', borderRadius: '12px', border: '1px dashed var(--border-strong)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                {images.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <img 
                      src={img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${img}`} 
                      alt={`Property image ${idx}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img)}
                      style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(239,68,68,0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {images.length === 0 && (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                    No hay imágenes para esta propiedad. Añade algunas para destacar.
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <label style={{ 
                  background: 'var(--surface)', 
                  border: '1px solid var(--accent)', 
                  color: 'var(--accent)', 
                  padding: '10px 20px', 
                  borderRadius: '8px', 
                  fontWeight: 600, 
                  cursor: uploadingImage ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: uploadingImage ? 0.6 : 1
                }}>
                  <ImageIcon size={18} />
                  {uploadingImage ? 'Subiendo...' : 'Subir nueva imagen'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploadingImage} />
                </label>
              </div>
            </div>
          </div>

          <div className="message-row" style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
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
