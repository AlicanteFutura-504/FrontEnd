"use client";

import { useState, useRef, useEffect } from "react";
import "./Chatbox.css";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export default function Chatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No token found");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: userMessage.content,
          history: messages, // Send past context
        }),
      });

      if (!res.ok) throw new Error("Error from server");

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Ocurrió un error al intentar conectarme con el servidor. Inténtalo más tarde." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="chatbox-container">
      {isOpen && (
        <div className="chatbox-window dark-theme">
          <div className="chatbox-header">
            <div
              style={{
                width: 32,
                height: 32,
                background: "linear-gradient(135deg, #0070f3, #a200ff)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
                <path d="M9 13v2" />
                <path d="M15 13v2" />
              </svg>
            </div>
            <div>
              <h3>Asistente IA</h3>
              <p>Alicante Futura</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ marginLeft: "auto", background: "none", border: "none", color: "#fff", cursor: "pointer", opacity: 0.6 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="chatbox-messages">
            {messages.length === 0 && (
              <div style={{ textAlign: "center", color: "rgba(255,255,255,0.5)", marginTop: "auto", marginBottom: "auto" }}>
                <p>¡Hola! Soy tu asistente virtual.</p>
                <p style={{ fontSize: 12 }}>¿En qué te puedo ayudar hoy?</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {isLoading && <div className="chatbox-typing">Escribiendo...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbox-input-area">
            <input
              type="text"
              className="chatbox-input"
              placeholder="Escribe tu mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button className="chatbox-send-btn" onClick={handleSend} disabled={!input.trim() || isLoading}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      )}

      {!isOpen && (
        <button className="chatbox-toggle-btn" onClick={() => setIsOpen(true)}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      )}
    </div>
  );
}
