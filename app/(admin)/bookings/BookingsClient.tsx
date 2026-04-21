"use client";

import { useState } from "react";
import { Appointment } from "@/lib/types";
import { createAppointment, getAppointments } from "@/lib/api";

type Props = {
  initialBookings: Appointment[];
};

function getBadgeStyle(status: string) {
  const base = {
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 600 as const,
    display: "inline-block",
  };

  if (status === "confirmed" || status === "paid") {
    return {
      ...base,
      backgroundColor: "#dcfce7",
      color: "#166534",
    };
  }

  if (status === "pending") {
    return {
      ...base,
      backgroundColor: "#fef3c7",
      color: "#92400e",
    };
  }

  return {
    ...base,
    backgroundColor: "#e5e7eb",
    color: "#374151",
  };
}

function getStatusLabel(status: string) {
  if (status === "pending") return "Pendiente";
  if (status === "confirmed") return "Confirmada";
  if (status === "paid") return "Pagada";
  return status;
}

function FilterPill({ label }: { label: string }) {
  return (
    <button
      style={{
        border: "1px solid #e5e7eb",
        backgroundColor: "#ffffff",
        borderRadius: "999px",
        padding: "10px 14px",
        fontSize: "14px",
        cursor: "pointer",
      }}
      type="button"
    >
      {label}
    </button>
  );
}

export default function BookingsClient({ initialBookings }: Props) {
  const [bookings, setBookings] = useState<Appointment[]>(initialBookings);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    date: "",
    time: "",
    status: "pending" as "pending" | "confirmed" | "paid",
    serviceName: "",
    });

  async function refreshBookings() {
    const data = await getAppointments();
    setBookings(data);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError("");

    try {
      await createAppointment(form);
      await refreshBookings();

      setMessage("Reserva creada correctamente");
      setForm({
        date: "",
        time: "",
        status: "pending",
        serviceName: "",
        });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la reserva");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <section
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          padding: "24px",
          border: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: "30px" }}>Reservas</h2>
          <p style={{ margin: "8px 0 0", color: "#6b7280" }}>
            Gestión de reservas de clientes y comercios.
          </p>
        </div>

        <button
          type="button"
          style={{
            border: "none",
            backgroundColor: "#0284c7",
            color: "#ffffff",
            borderRadius: "14px",
            padding: "12px 18px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Nueva reserva
        </button>
      </section>

      <section
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          padding: "24px",
          border: "1px solid #e5e7eb",
        }}
      >
        <h3 style={{ marginTop: 0, fontSize: "22px" }}>Crear reserva</h3>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "16px",
          }}
        >
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
            style={{
              padding: "12px 14px",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
            }}
          />

          <input
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            required
            style={{
              padding: "12px 14px",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
            }}
          />

          <input
            type="text"
            value={form.serviceName}
            onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
            placeholder="Nombre del servicio"
            required
            style={{
              gridColumn: "1 / -1",
              padding: "12px 14px",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
            }}
          />

          <select
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value as "pending" | "confirmed" | "paid",
              })
            }
            style={{
              padding: "12px 14px",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
            }}
          >
            <option value="pending">Pendiente</option>
            <option value="confirmed">Confirmada</option>
            <option value="paid">Pagada</option>
          </select>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                border: "none",
                backgroundColor: "#0284c7",
                color: "#ffffff",
                borderRadius: "12px",
                padding: "12px 16px",
                fontWeight: 600,
                cursor: "pointer",
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? "Guardando..." : "Guardar reserva"}
            </button>

            {message ? <span style={{ color: "#166534" }}>{message}</span> : null}
            {error ? <span style={{ color: "#b91c1c" }}>{error}</span> : null}
          </div>
        </form>
      </section>

      <section
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <FilterPill label="Hoy" />
        <FilterPill label="Pendientes" />
        <FilterPill label="Confirmadas" />
        <FilterPill label="Pagadas" />
      </section>

      <section
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          padding: "24px",
          border: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "22px" }}>Listado de reservas</h3>
          <span style={{ color: "#6b7280", fontSize: "14px" }}>
            {bookings.length} resultados
          </span>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#6b7280" }}>
                <th style={{ padding: "12px 0" }}>ID</th>
                <th style={{ padding: "12px 0" }}>Fecha</th>
                <th style={{ padding: "12px 0" }}>Hora</th>
                <th style={{ padding: "12px 0" }}>Servicio</th>
                <th style={{ padding: "12px 0" }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                <td style={{ padding: "16px 0", fontWeight: 600 }}>
                  {booking.id}
                </td>
                <td style={{ padding: "16px 0" }}>{booking.date}</td>
                <td style={{ padding: "16px 0" }}>{booking.time}</td>
                <td style={{ padding: "16px 0" }}>{booking.serviceName}</td>
                <td style={{ padding: "16px 0" }}>
                  <span style={getBadgeStyle(booking.status)}>
                    {getStatusLabel(booking.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}