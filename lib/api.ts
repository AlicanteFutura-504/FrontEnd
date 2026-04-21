import { Appointment } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function getAppointments(): Promise<Appointment[]> {
  const res = await fetch(`${API_URL}/appointments`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("No se pudieron cargar las reservas");
  }

  return res.json();
}

export type CreateAppointmentInput = {
  date: string;
  time: string;
  status: "pending" | "confirmed" | "paid";
  serviceName: string;
};

export async function createAppointment(data: CreateAppointmentInput) {
  const payload = {
    ...data,
    customerId: 1,
    businessId: 1,
  };

  const res = await fetch(`${API_URL}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = "No se pudo crear la reserva";

    try {
      const errorData = await res.json();
      if (errorData?.message) {
        message = Array.isArray(errorData.message)
          ? errorData.message.join(", ")
          : errorData.message;
      }
    } catch {}

    throw new Error(message);
  }

  return res.json();
}