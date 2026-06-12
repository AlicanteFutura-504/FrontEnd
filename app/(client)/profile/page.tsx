"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { updateMe, uploadAvatar, getBusinesses } from "@/lib/api";
import { Business } from "@/lib/types";
import Loading from "@/components/ui/Loading";
import { Camera, Trash2, Edit2, X } from "lucide-react";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);

  // Form states
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [dni, setDni] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Trust score states
  const [trustScore, setTrustScore] = useState<{ score: number; status: string } | null>(null);
  const [loadingScore, setLoadingScore] = useState(true);

  // Favorites states
  const [favorites, setFavorites] = useState<Business[]>([]);
  const [loadingFavs, setLoadingFavs] = useState(true);

  const fetchTrustScore = async () => {
    if (!user) return;
    try {
      setLoadingScore(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/usuarios/${user.id}/trust-score`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      });
      if (res.ok) {
        const scoreData = await res.json();
        setTrustScore(scoreData);
      }
    } catch (e) {
      console.error("Error al cargar trust score:", e);
    } finally {
      setLoadingScore(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      setLoadingFavs(true);
      const storedFavs = JSON.parse(localStorage.getItem("favorites") || "[]");
      if (storedFavs.length > 0) {
        const res = await getBusinesses(1, 100);
        const allProperties = res.data || [];
        const favProperties = allProperties.filter((p: any) => storedFavs.includes(p.id));
        setFavorites(favProperties);
      } else {
        setFavorites([]);
      }
    } catch (e) {
      console.error("Error al cargar favoritos:", e);
    } finally {
      setLoadingFavs(false);
    }
  };

  useEffect(() => {
    if (user) {
      setNombreCompleto(user.nombreCompleto || "");
      setDni(user.dni || "");
      setPhone(user.phone || "");
      setEmail(user.email || "");
      setLoading(false);
      fetchTrustScore();
      fetchFavorites();
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const dataToUpdate: any = {
        nombreCompleto,
        dni,
        phone,
        email
      };
      if (contrasena) {
        if (!currentPassword) {
           throw new Error("Debe introducir la contraseña actual para poder establecer una nueva.");
        }
        dataToUpdate.contrasena = contrasena;
        dataToUpdate.currentPassword = currentPassword;
      }
      const updatedUser = await updateMe(dataToUpdate);
      updateUser(updatedUser);
      alert("¡Perfil actualizado con éxito!");
      setContrasena("");
      setCurrentPassword("");
      setIsEditing(false);
    } catch (e: any) {
      alert("Error al actualizar perfil: " + e.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const res = await uploadAvatar(file);
      if (user) {
        updateUser({
          ...user,
          profilePicture: res.profilePicture
        });
      }
      alert("Foto de perfil actualizada con éxito.");
    } catch (e: any) {
      alert("Error al subir avatar: " + e.message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveFavorite = (propertyId: number) => {
    const storedFavs = JSON.parse(localStorage.getItem("favorites") || "[]");
    const newFavs = storedFavs.filter((id: number) => id !== propertyId);
    localStorage.setItem("favorites", JSON.stringify(newFavs));
    setFavorites(prev => prev.filter(f => f.id !== propertyId));
    alert("Propiedad eliminada de favoritos.");
  };

  if (loading || !user) return <Loading />;

  // Gauge bar coloring based on status
  const getStatusColor = (status: string) => {
    if (status === "Promoter") return "#28a745";
    if (status === "Detractor") return "#dc3545";
    return "#ffc107";
  };

  const getStatusTranslation = (status: string) => {
    if (status === "Promoter") return "Promotor (Excelente Huésped)";
    if (status === "Detractor") return "Detractor (Huésped de riesgo)";
    return "Neutral";
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px", width: "100%", display: "flex", gap: "40px", flexWrap: "wrap" }}>
      
      {/* Left Column: Avatar & Trust Score */}
      <div style={{ flex: 1, minWidth: "300px", display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Profile Card Summary */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "32px", textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ position: "relative", width: "120px", height: "120px", margin: "0 auto 20px auto" }}>
            <img 
              src={user.profilePicture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"} 
              style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "4px solid var(--border-strong)" }}
              alt="Avatar"
            />
            <label style={{ position: "absolute", bottom: 0, right: 0, background: "var(--accent-gradient)", color: "white", padding: "8px", borderRadius: "50%", cursor: "pointer", display: "grid", placeItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", width: "36px", height: "36px" }}>
              <Camera size={18} />
              <input type="file" onChange={handleAvatarChange} disabled={uploadingAvatar} accept="image/*" style={{ display: "none" }} />
            </label>
          </div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, margin: "0 0 4px 0" }}>{user.nombreCompleto || user.username}</h2>
          <p style={{ color: "var(--text-muted)", margin: "0 0 16px 0", fontSize: "0.95rem" }}>{user.email}</p>
        </div>

        {/* Guest Trust Score Card */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "32px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 16px 0" }}>Puntuación de Confianza</h3>
          {loadingScore ? (
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Calculando puntuación...</p>
          ) : trustScore ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <span style={{ fontSize: "2.5rem", fontWeight: 800, color: getStatusColor(trustScore.status), lineHeight: 1 }}>
                  {trustScore.score}
                </span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>/ 100 ptos</span>
              </div>
              
              <div style={{ width: "100%", height: "12px", background: "var(--border-strong)", borderRadius: "100px", overflow: "hidden" }}>
                <div style={{ width: `${trustScore.score}%`, height: "100%", background: getStatusColor(trustScore.status), borderRadius: "100px", transition: "width 0.5s ease" }}></div>
              </div>

              <div>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Estatus del Huésped:</span>
                <div style={{ fontWeight: 700, color: getStatusColor(trustScore.status), fontSize: "1.05rem", marginTop: "2px" }}>
                  {getStatusTranslation(trustScore.status)}
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px", fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                {trustScore.status === "Promoter" ? (
                  <p style={{ margin: 0 }}>🎉 ¡Felicidades! Al ser un huésped <strong>Promotor</strong> con alta puntuación, el sistema te aplicará de forma automática un <strong>10% de descuento</strong> en el checkout de tus próximas reservas.</p>
                ) : (
                  <p style={{ margin: 0 }}>La puntuación de confianza se calcula en base a tus valoraciones recibidas por anfitriones y el porcentaje de reservas completadas con éxito sin cancelaciones.</p>
                )}
              </div>
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>No se pudo obtener la puntuación.</p>
          )}
        </div>
      </div>

      {/* Right Column: Edit Profile & Favorites */}
      <div style={{ flex: 2, minWidth: "350px", display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Edit profile form */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "32px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0 }}>Ajustes de la Cuenta</h3>
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              type="button"
              style={{ background: isEditing ? "var(--surface-hover)" : "var(--accent-gradient)", color: isEditing ? "var(--text)" : "white", border: isEditing ? "1px solid var(--border)" : "none", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", display: "flex", gap: "6px", alignItems: "center", fontWeight: 600, fontSize: "0.85rem" }}
            >
              {isEditing ? <X size={16} /> : <Edit2 size={16} />}
              {isEditing ? "Cancelar edición" : "Editar perfil"}
            </button>
          </div>
          <form onSubmit={handleUpdateProfile} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "6px" }}>Nombre Completo</label>
              <input type="text" value={nombreCompleto} onChange={e => setNombreCompleto(e.target.value)} disabled={!isEditing} required style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)", outline: "none", opacity: isEditing ? 1 : 0.6 }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "6px" }}>DNI / NIE</label>
              <input type="text" value={dni} onChange={e => setDni(e.target.value)} disabled={!isEditing} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)", outline: "none", opacity: isEditing ? 1 : 0.6 }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "6px" }}>Teléfono</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} disabled={!isEditing} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)", outline: "none", opacity: isEditing ? 1 : 0.6 }} />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "6px" }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} disabled={!isEditing} required style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)", outline: "none", opacity: isEditing ? 1 : 0.6 }} />
            </div>
            {isEditing && (
              <>
                <div style={{ gridColumn: "span 2" }}>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "6px" }}>Contraseña Actual (requerida para cambiar a una nueva)</label>
                  <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Introduce tu contraseña actual" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)", outline: "none" }} />
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "6px" }}>Nueva Contraseña</label>
                  <input type="password" value={contrasena} onChange={e => setContrasena(e.target.value)} placeholder="Mínimo 6 caracteres" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)", outline: "none" }} />
                </div>
                <div style={{ gridColumn: "span 2", marginTop: "8px" }}>
                  <button 
                    type="submit" 
                    disabled={updating}
                    style={{
                      background: "linear-gradient(135deg, #FF385C, #E61E4D)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "12px 24px",
                      fontWeight: 600,
                      cursor: updating ? "not-allowed" : "pointer",
                      opacity: updating ? 0.7 : 1
                    }}
                  >
                    {updating ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>

        {/* Favorites list */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "32px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "20px" }}>Mis Favoritos</h3>
          {loadingFavs ? (
            <p style={{ color: "var(--text-muted)" }}>Cargando tus favoritos...</p>
          ) : favorites.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {favorites.map((fav) => (
                <div key={fav.id} style={{ display: "flex", gap: "16px", borderBottom: "1px solid var(--border)", paddingBottom: "16px", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: "16px", alignItems: "center", cursor: "pointer" }} onClick={() => window.location.href = `/rooms/${fav.id}`}>
                    <img 
                      src={fav.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'} 
                      style={{ width: "80px", height: "60px", borderRadius: "8px", objectFit: "cover" }}
                      alt={fav.nombre}
                    />
                    <div>
                      <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700 }}>{fav.nombre}</h4>
                      <p style={{ margin: "2px 0 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>📍 {fav.city || "Alicante"}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemoveFavorite(fav.id)}
                    style={{ background: "transparent", border: "none", color: "var(--danger)", cursor: "pointer", fontSize: "1.25rem", padding: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}
                    title="Eliminar de favoritos"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)", margin: 0 }}>No tienes alojamientos guardados en tus favoritos todavía.</p>
          )}
        </div>

      </div>

    </div>
  );
}
