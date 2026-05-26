import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrarse | Yoku Admin",
  description: "Crea una nueva cuenta de usuario en la plataforma de gestión Yoku.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
