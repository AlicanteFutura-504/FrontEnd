/**
 * @fileoverview Página del módulo de Bookings (Server Component).
 * Obtiene las reservas desde el backend en el servidor y las pasa
 * al componente cliente `BookingsClient` como props iniciales.
 * @module app/(admin)/bookings/page
 */

import BookingsClient from "./BookingsClient";
import { getAppointments, type Booking } from "@/lib/api";

/**
 * Página de gestión de reservas.
 * Es un **Server Component** asíncrono: llama a la API en el servidor,
 * antes de que se envíe HTML al cliente. Esto garantiza que la tabla
 * de reservas se renderice con datos reales desde el primer render.
 *
 * @async
 * @returns {Promise<JSX.Element>} El componente cliente `BookingsClient`
 *   hidratado con la lista de reservas obtenida del backend.
 */
export default async function BookingsPage() {
  let bookings: Booking[] = [];

  try {
    bookings = await getAppointments();
  } catch (error) {
    console.error("Error al cargar reservas desde el servidor:", error);
  }

  return <BookingsClient initialBookings={bookings} />;
}