import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrarse | BookFlow Admin",
  description: "Crea una nueva cuenta de usuario en la plataforma de gestión BookFlow.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
