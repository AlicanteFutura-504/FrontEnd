/**
 * @fileoverview Layout raíz de la aplicación Next.js.
 * Define el documento HTML base (lang, fuentes, estilos globales)
 * que envuelve a todas las páginas de la aplicación.
 * @module app/layout
 */

import "./globals.css";
import type { Metadata } from "next";

/**
 * Metadatos SEO de la aplicación, consumidos automáticamente por Next.js
 * para generar las etiquetas `<title>` y `<meta name="description">`.
 */
export const metadata: Metadata = {
  title: "Bookings Admin",
  description: "Base inicial del proyecto de gestión de reservas",
};

/**
 * Componente de layout raíz.
 * Renderiza el esqueleto HTML (`<html>` + `<body>`) y envuelve
 * el resto de la aplicación mediante el slot `children`.
 *
 * @param {object}          props          - Props del componente.
 * @param {React.ReactNode} props.children - Árbol de componentes hijo a renderizar dentro del body.
 * @returns {JSX.Element} El documento HTML base de la aplicación.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('darkMode') === 'true') {
                  document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}