"use client";

import React, { useState, useEffect } from "react";

const testimonials = [
  {
    id: 1,
    name: "María López",
    role: "Propietaria",
    company: "Salón Belleza María",
    text: "Desde que usamos Yoku, las ausencias se han reducido un 80%. La facilidad con la que nuestros clientes reservan por su cuenta nos ha ahorrado muchísimas horas de teléfono.",
    rating: 5,
  },
  {
    id: 2,
    name: "Carlos Ruiz",
    role: "Gerente",
    company: "Clínica Dental Sonrisas",
    text: "Una herramienta imprescindible. El control de pagos integrado y la agenda 24/7 nos ha permitido escalar nuestro negocio de manera profesional y ordenada.",
    rating: 5,
  },
  {
    id: 3,
    name: "Ana Martínez",
    role: "Entrenadora Personal",
    company: "FitLife Studio",
    text: "Mis clientes adoran lo fácil que es agendar sus sesiones desde el móvil. Los recordatorios automáticos son un salvavidas para mantener mi agenda completa sin estrés.",
    rating: 5,
  },
  {
    id: 4,
    name: "Javier Gómez",
    role: "Fundador",
    company: "Gómez Consultores",
    text: "Buscábamos una forma seria y corporativa de gestionar citas con clientes internacionales. Yoku superó nuestras expectativas por su diseño limpio y robustez.",
    rating: 5,
  }
];

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      width: "100%",
      maxWidth: "800px",
      margin: "0 auto",
      padding: "4rem 2rem",
      textAlign: "center",
      position: "relative",
      minHeight: "350px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}>
      <h2 style={{
        fontSize: "2rem",
        fontWeight: 800,
        color: "#111827",
        marginBottom: "3rem",
      }}>
        Lo que dicen nuestros clientes
      </h2>

      <div style={{ position: "relative", width: "100%", height: "200px" }}>
        {testimonials.map((testimonial, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={testimonial.id}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                opacity: isActive ? 1 : 0,
                transform: isActive ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.6s ease, transform 0.6s ease",
                pointerEvents: isActive ? "auto" : "none",
              }}
            >
              <div style={{ color: "#f59e0b", fontSize: "1.5rem", marginBottom: "1rem" }}>
                {"★".repeat(testimonial.rating)}
              </div>
              <p style={{
                fontSize: "1.25rem",
                color: "#4b5563",
                lineHeight: 1.6,
                fontStyle: "italic",
                marginBottom: "2rem",
              }}>
                "{testimonial.text}"
              </p>
              <div>
                <h4 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "#111827" }}>
                  {testimonial.name}
                </h4>
                <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  {testimonial.role}, {testimonial.company}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "2rem" }}>
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              width: index === currentIndex ? "24px" : "8px",
              height: "8px",
              borderRadius: "999px",
              backgroundColor: index === currentIndex ? "#0066FF" : "#d1d5db",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              padding: 0,
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
