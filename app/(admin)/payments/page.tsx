/**
 * @fileoverview Ruta /payments deshabilitada.
 * Los pagos se gestionan por negocio desde /business/[id].
 * Cualquier acceso directo a esta ruta es redirigido al dashboard.
 */

import { redirect } from "next/navigation";

export default function PaymentsPage() {
  redirect("/dashboard");
}