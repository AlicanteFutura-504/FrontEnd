"use client";

import React, { useState, useEffect, useRef } from "react";
import { getConversations, getMessagesBetween, sendMessage, markMessagesAsRead } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import { Send, User as UserIcon } from "lucide-react";
import Loading from "./Loading";
import { useToast } from "./Toast";

export default function Chat() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async () => {
    try {
      const convs = await getConversations();
      setConversations(convs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId: number) => {
    try {
      const msgs = await getMessagesBetween(otherUserId);
      setMessages(msgs);
      await markMessagesAsRead(otherUserId);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat.otherUserId);
      const interval = setInterval(() => fetchMessages(activeChat.otherUserId), 5000);
      return () => clearInterval(interval);
    }
  }, [activeChat]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    const text = inputText.trim();
    setInputText("");

    try {
      await sendMessage(activeChat.otherUserId, text);
      await fetchMessages(activeChat.otherUserId);
      await fetchConversations();
    } catch (err: any) {
      toast.error(err.message || "Error al enviar mensaje");
      setInputText(text); // revert
    }
  };

  if (loading) return <Loading />;

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 150px)', background: 'var(--surface)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
      {/* Sidebar */}
      <div style={{ width: '300px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', background: 'var(--surface-hover)' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>Mensajes</h2>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No tienes conversaciones activas.
            </div>
          ) : (
            conversations.map(conv => (
              <button
                key={conv.otherUserId}
                onClick={() => setActiveChat(conv)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '16px',
                  border: 'none',
                  borderBottom: '1px solid var(--border)',
                  background: activeChat?.otherUserId === conv.otherUserId ? 'var(--surface-hover)' : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                  {conv.otherUser.profilePicture ? (
                    <img src={conv.otherUser.profilePicture.startsWith('http') ? conv.otherUser.profilePicture : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${conv.otherUser.profilePicture}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <UserIcon size={20} color="var(--text-muted)" />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.otherUser.nombreCompleto || conv.otherUser.username}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(conv.lastMessageAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {conv.lastMessage}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span style={{ background: 'var(--accent)', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
        {activeChat ? (
          <>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {activeChat.otherUser.profilePicture ? (
                  <img src={activeChat.otherUser.profilePicture.startsWith('http') ? activeChat.otherUser.profilePicture : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${activeChat.otherUser.profilePicture}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <UserIcon size={20} color="var(--text-muted)" />
                )}
              </div>
              <h3 style={{ margin: 0, color: 'var(--text)' }}>{activeChat.otherUser.nombreCompleto || activeChat.otherUser.username}</h3>
            </div>

            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map((msg, idx) => {
                const isMine = msg.senderId === user?.id;
                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '70%',
                      padding: '12px 16px',
                      borderRadius: '16px',
                      borderBottomRightRadius: isMine ? '4px' : '16px',
                      borderBottomLeftRadius: !isMine ? '4px' : '16px',
                      background: isMine ? 'var(--accent)' : 'var(--surface)',
                      color: isMine ? 'white' : 'var(--text)',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                      fontSize: '0.95rem',
                      lineHeight: 1.5
                    }}>
                      {msg.content}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} style={{ padding: '20px', background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Escribe un mensaje..."
                style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid var(--border-strong)', background: 'var(--bg)', color: 'var(--text)', outline: 'none' }}
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                style={{
                  background: 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                  opacity: inputText.trim() ? 1 : 0.6
                }}
              >
                <Send size={20} style={{ marginLeft: '2px' }} />
              </button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Selecciona una conversación para empezar a chatear
          </div>
        )}
      </div>
    </div>
  );
}
