/**
 * @fileoverview Página raíz de la aplicación (`/`).
 * Redirige automáticamente al usuario al panel de Dashboard.
 * @module app/page
 */

import { redirect } from "next/navigation";

/**
 * Página de inicio de la aplicación.
 * No renderiza contenido visible: redirige inmediatamente a `/dashboard`
 * mediante una redirección de servidor (HTTP 307).
 *
 * @returns {never} Esta función nunca retorna un JSX porque lanza una redirección.
 */
export default function Home() {
  redirect("/login");
}