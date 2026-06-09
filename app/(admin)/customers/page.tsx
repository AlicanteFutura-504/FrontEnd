/**
 * @fileoverview Ruta /customers deshabilitada.
 * Los clientes se gestionan por propiedad desde /properties/[id].
 * Cualquier acceso directo a esta ruta es redirigido al dashboard.
 */

import { redirect } from "next/navigation";

export default function CustomersPage() {
  redirect("/dashboard");
}