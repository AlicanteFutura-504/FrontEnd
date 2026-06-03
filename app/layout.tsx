/**
 * @fileoverview Layout raíz de la aplicación Next.js.
 */

import "./globals.css";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Yoku Admin",
  description: "Base inicial del proyecto de gestión de reservas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={outfit.variable}>
      <head>
      </head>
      <body className="font-sans antialiased">
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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}