import type {
  Booking,
  BookingStatus,
  CreateBookingDto,
  UpdateBookingDto
} from "./types";

// Reexportamos los tipos para que el resto de la aplicación 
// que importa desde lib/api.ts no se rompa y siga funcionando sin cambios.
export type { Booking, BookingStatus, CreateBookingDto, UpdateBookingDto };

// URL base del backend. Se saca de variables de entorno, o usa el localhost por defecto.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * Solicita todas las reservas al servidor backend.
 * @returns {Promise<Booking[]>} Una promesa con el listado (Array) de reservas obtenidas.
 */
export async function getAppointments(): Promise<Booking[]> {
  const res = await fetch(`${API_URL}/appointments`, {
    cache: "no-store", // Evitamos la caché para traer siempre datos recientes
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "No se pudo leer la respuesta");
    console.error("fetch a", `${API_URL}/appointments`, "falló con status:", res.status, errorText);
    throw new Error(`Error al obtener las reservas (Status: ${res.status}): ${errorText}`);
  }

  return res.json();
}

/**
 * Envía una solicitud de creación de una nueva reserva al servidor (POST).
 * @param {CreateBookingDto} data Datos introducidos por el usuario para la reserva.
 * @returns {Promise<Booking>} La reserva recién creada con su nuevo ID.
 */
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

/**
 * Solicita la modificación de un parámetro o parámetros de una reserva (PATCH).
 * @param {number} id ID numérico de la reserva.
 * @param {UpdateBookingDto} data Los atributos parciales que queremos cambiar (ej: el status).
 * @returns {Promise<Booking>} La reserva después de ser actualizada.
 */
export async function updateAppointment(
  id: number,
  data: UpdateBookingDto
): Promise<Booking> {
  const res = await fetch(`${API_URL}/appointments/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Error al editar la reserva");
  }

  return res.json();
}

/**
 * Solicita la eliminación permanente de una reserva del sistema (DELETE).
 * @param {number} id El identificador único de la reserva a borrar.
 * @returns {Promise<{message: string}>} Mensaje de confirmación en caso de éxito.
 */
export async function deleteAppointment(
  id: number
): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/appointments/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Error al eliminar la reserva");
  }

  const text = await res.text();
  if (!text) {
    return { message: `Reserva ${id} eliminada correctamente` };
  }

  return JSON.parse(text) as { message: string };
}