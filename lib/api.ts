export type BookingStatus = "pending" | "confirmed" | "paid";

export interface Booking {
  id: number;
  appointmentDate: string;
  appointmentTime: string;
  status: BookingStatus;
  customerId: number;
  businessId: number;
  serviceName: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBookingDto {
  appointmentDate: string;
  appointmentTime: string;
  status: BookingStatus;
  customerId: number;
  businessId: number;
  serviceName: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function getAppointments(): Promise<Booking[]> {
  const res = await fetch(`${API_URL}/appointments`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Error al obtener las reservas");
  }

  return res.json();
}

export async function createAppointment(data: CreateBookingDto): Promise<Booking> {
  const res = await fetch(`${API_URL}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Error al crear la reserva");
  }

  return res.json();
}