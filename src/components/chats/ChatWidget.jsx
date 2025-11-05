import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom"; // 👈 thêm dòng này
import "./chat-widget.css";

const MOCK_CONVERSATIONS = [
  { id: "1", name: "CyberCore - Gaming D.C", avatar: "https://i.pravatar.cc/80?img=1", lastMessage: "Hello 👋 Do you want to booking at my cyber ?" },
  { id: "2", name: "Cyber Legend", avatar: "https://i.pravatar.cc/80?img=2", lastMessage: "We have promo tonight!" },
  { id: "3", name: "KOW Esports Stadium", avatar: "https://i.pravatar.cc/80?img=3", lastMessage: "Rank lobby ready." },
  { id: "4", name: "Cyber Meow", avatar: "https://i.pravatar.cc/80?img=4", lastMessage: "Meow discount 🐾" },
];

const initialMsgs = {
  1: [
    {
      id: "m1",
      fromMe: false,
      senderName: "CyberCore - Gaming D.C",
      senderAvatar: "https://i.pravatar.cc/80?img=1",
      text: "Hello 👋 Do you want to booking at my cyber ?",
      time: "09:20",
    },
  ],
  2: [],
  3: [],
  4: [],
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(MOCK_CONVERSATIONS[0].id);
  const [messages, setMessages] = useState(initialMsgs);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const msgEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, open, activeId]);

  // Close on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (!open) return;
      const target = e.target;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        !target.closest(".cw-fab")
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus input
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 160);
  }, [open, activeId]);

  const send = () => {
    const text = input.trim();
    if (!text) return;

    const idGen =
      (window.crypto?.randomUUID?.()) ||
      `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    setMessages((prev) => {
      const arr = prev[activeId] || [];
      const next = {
        id: idGen,
        text,
        fromMe: true,
        senderName: "You",
        senderAvatar: null,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      return { ...prev, [activeId]: [...arr, next] };
    });
    setInput("");
  };

  const filteredConversations = MOCK_CONVERSATIONS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  const activeConv =
    MOCK_CONVERSATIONS.find((c) => c.id === activeId) || MOCK_CONVERSATIONS[0];

  // 👇 Từ đây trở xuống là phần render qua Portal
  return createPortal(
    <>
      {/* Floating button */}
      <button
        className="cw-fab"
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((v) => !v)}
      >
        <svg
          className="cw-fab-icon"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            d="M20 2H4a2 2 0 0 0-2 2v15.5a.5.5 0 0 0 .8.4L7 17h13a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {/* Panel */}
      <div
        ref={panelRef}
        className={`cw-panel ${open ? "cw-open" : ""}`}
        role="dialog"
        aria-modal="false"
        aria-label="Chat widget"
      >
        {/* Header */}
        <div className="cw-header">
          <span>Chat</span>
          <button
            className="cw-icon-btn"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="cw-body">
          {/* Sidebar */}
          <aside className="cw-sidebar">
            <div className="cw-search">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                aria-label="Search conversations"
              />
            </div>
            <ul className="cw-conv-list">
              {filteredConversations.map((c) => (
                <li
                  key={c.id}
                  className={`cw-conv-item ${
                    activeId === c.id ? "active" : ""
                  }`}
                  onClick={() => setActiveId(c.id)}
                >
                  <img src={c.avatar} alt="" className="cw-avatar" />
                  <div className="cw-conv-meta">
                    <div className="cw-conv-name">{c.name}</div>
                    {c.lastMessage && (
                      <div className="cw-conv-last" title={c.lastMessage}>
                        {c.lastMessage}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </aside>

          {/* Chat area */}
          <section className="cw-chat">
            <div className="cw-chat-title" title={activeConv.name}>
              <img
                src={activeConv.avatar}
                alt=""
                className="cw-chat-title-avatar"
              />
              <div className="cw-chat-title-name">{activeConv.name}</div>
            </div>

            <div className="cw-thread">
              {(messages[activeId] || []).map((m) => {
                const isLeft = !m.fromMe;
                return (
                  <div
                    key={m.id}
                    className={`cw-msg-row ${isLeft ? "left" : "right"}`}
                  >
                    {isLeft && (
                      <div className="cw-msg-meta">
                        <div className="cw-msg-name">
                          {m.senderName || activeConv.name}
                        </div>
                        <img
                          src={m.senderAvatar || activeConv.avatar}
                          alt=""
                          className="cw-msg-avatar"
                        />
                      </div>
                    )}
                    <div className="cw-bubble2" title={m.time}>
                      {m.text}
                    </div>
                  </div>
                );
              })}
              <div ref={msgEndRef} />
            </div>

            {/* Quick actions */}
            <div className="cw-actions">
              <button className="cw-chip">Check Machine Status</button>
              <button className="cw-chip">Book Now</button>
              <button className="cw-chip">Book by Hour</button>
              <button className="cw-chip">Contact Staff</button>
            </div>

            {/* Input */}
            <form
              className="cw-inputbar"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <div className="cw-self">
                <span className="cw-self-icon" aria-hidden>
                  👤
                </span>
              </div>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Aa"
                className="cw-input"
              />
              <button type="submit" className="cw-send" aria-label="Send">
                ➤
              </button>
            </form>
          </section>
        </div>
      </div>
    </>,
    document.body // 👈 render tách khỏi header nhưng vẫn cùng React tree
  );
}
