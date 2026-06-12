import React from "react";
import Chat from "@/components/ui/Chat";

export default function MessagesPage() {
  return (
    <div className="page-stack">
      <header className="page-hero">
        <div>
          <h2>Mensajería</h2>
          <p>Gestiona la comunicación con tus huéspedes.</p>
        </div>
      </header>
      <Chat />
    </div>
  );
}
