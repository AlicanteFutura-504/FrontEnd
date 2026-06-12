import React from "react";
import Chat from "@/components/ui/Chat";

export default function MessagesPage() {
  return (
    <div className="page-stack">
      <header className="page-hero">
        <div>
          <h2>Mensajes</h2>
          <p>Comunícate directamente con tus anfitriones.</p>
        </div>
      </header>
      <Chat />
    </div>
  );
}
