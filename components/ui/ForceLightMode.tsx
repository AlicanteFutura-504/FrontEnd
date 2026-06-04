"use client";

import { useEffect } from "react";

export default function ForceLightMode() {
  useEffect(() => {
    // Forzamos el modo claro en el DOM
    document.documentElement.setAttribute("data-theme", "light");
    // Opcionalmente podríamos forzar la preferencia en localStorage también
    // localStorage.setItem("darkMode", "false");
  }, []);

  return null;
}
