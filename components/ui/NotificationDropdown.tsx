"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, Check, Trash2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
  bookingId?: number;
  reviewId?: number;
}

export default function NotificationDropdown() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/notifications`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (err) {
        console.error("Error fetching notifications", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, [user]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const markAsRead = async (id: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const removeNotification = async (id: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/notifications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "transparent",
          border: "none",
          color: "var(--text)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px",
          borderRadius: "50%",
          position: "relative"
        }}
        title="Notificaciones"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{
            position: "absolute",
            top: "4px",
            right: "4px",
            background: "var(--danger)",
            color: "white",
            fontSize: "10px",
            fontWeight: "bold",
            borderRadius: "50%",
            width: "16px",
            height: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: "absolute",
          top: "40px",
          right: "0",
          width: "350px",
          maxHeight: "450px",
          overflowY: "auto",
          background: "var(--surface)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          padding: "16px"
        }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "1.1rem", fontWeight: 600 }}>Notificaciones</h3>
          
          {notifications.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", textAlign: "center", padding: "20px 0" }}>
              No tienes notificaciones recientes.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {notifications.map(n => (
                <div key={n.id} style={{
                  padding: "12px",
                  borderRadius: "8px",
                  background: n.isRead ? "transparent" : "var(--surface-hover)",
                  border: "1px solid var(--border-strong)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text)" }}>{n.title}</span>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {!n.isRead && (
                        <button 
                          onClick={() => markAsRead(n.id)}
                          title="Marcar como leída"
                          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent-1)", padding: "2px" }}
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => removeNotification(n.id)}
                        title="Eliminar"
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger)", padding: "2px" }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>{n.message}</p>
                  
                  {n.link && (
                    <Link 
                      href={n.link} 
                      onClick={() => { setIsOpen(false); if (!n.isRead) markAsRead(n.id); }}
                      style={{ fontSize: "0.85rem", color: "var(--accent-1)", textDecoration: "underline", marginTop: "4px" }}
                    >
                      Ver detalles
                    </Link>
                  )}
                  {/* Fallback links based on ids if explicit link is null */}
                  {!n.link && n.bookingId && (
                    <Link 
                      href={user?.role === 'host' ? `/properties` : `/mis-reservas`} 
                      onClick={() => { setIsOpen(false); if (!n.isRead) markAsRead(n.id); }}
                      style={{ fontSize: "0.85rem", color: "var(--accent-1)", textDecoration: "underline", marginTop: "4px" }}
                    >
                      Ir a Reservas
                    </Link>
                  )}
                  {!n.link && n.reviewId && (
                    <Link 
                      href={user?.role === 'host' ? `/properties` : `/`} 
                      onClick={() => { setIsOpen(false); if (!n.isRead) markAsRead(n.id); }}
                      style={{ fontSize: "0.85rem", color: "var(--accent-1)", textDecoration: "underline", marginTop: "4px" }}
                    >
                      Ver Reseñas
                    </Link>
                  )}
                  
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", alignSelf: "flex-end" }}>
                    {new Date(n.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
