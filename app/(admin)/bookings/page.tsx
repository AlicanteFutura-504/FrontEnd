/**
 * @fileoverview Ruta /bookings deshabilitada.
 * Las reservas se gestionan por negocio desde /business/[id]/bookings.
 * Cualquier acceso directo a esta ruta es redirigido al dashboard.
 * @module app/(admin)/bookings/page
 */

import { redirect } from "next/navigation";

export default function BookingsPage() {
  redirect("/dashboard");
}