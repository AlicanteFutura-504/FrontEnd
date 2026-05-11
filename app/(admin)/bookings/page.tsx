/**
 * @fileoverview Página del módulo de Bookings (Server Component).
 * Obtiene las reservas desde el backend en el servidor y las pasa
 * al componente cliente `BookingsClient` como props iniciales.
 * @module app/(admin)/bookings/page
 */

import BookingsClient from "./BookingsClient";
import { getAppointments } from "@/lib/api";

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
  /** Lista de reservas obtenida del backend en el momento del render del servidor. */
  const bookings = await getAppointments();

  return <BookingsClient initialBookings={bookings} />;
}