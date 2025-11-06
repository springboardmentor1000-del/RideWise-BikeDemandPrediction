import React, { useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I'm your local AI assistant 🤖" }
  ]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!text.trim()) return;
    const userMsg = { from: "user", text };
    setMessages((m) => [...m, userMsg]);
    setText("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((m) => [...m, { from: "bot", text: data.reply }]);
      } else {
        setMessages((m) => [...m, { from: "bot", text: "⚠️ Server error." }]);
      }
    } catch (err) {
      setMessages((m) => [...m, { from: "bot", text: "🚫 Cannot reach backend." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card" style={{ padding: 18, marginBottom: 12 }}>
        <h2>🧠 Local AI Chatbot</h2>
        <p style={{ color: "#c8cbff" }}>
          Ask me about predictions, data, or just chat — all offline!
        </p>
      </div>

      <div className="card" style={{ padding: 12 }}>
        <div
          className="chat-window"
          id="chat-window"
          style={{
            minHeight: 200,
            maxHeight: 400,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            padding: 8
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.from === "user" ? "flex-end" : "flex-start",
                background: m.from === "user" ? "#ff7f11" : "#e4e6ff",
                color: m.from === "user" ? "#fff" : "#000",
                padding: "8px 12px",
                borderRadius: 8,
                maxWidth: "80%"
              }}
            >
              {m.text}
            </div>
          ))}
          {loading && (
            <div style={{ color: "#999", fontStyle: "italic" }}>Thinking...</div>
          )}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your question..."
            className="input"
            style={{ flex: 1 }}
          />
          <button
            onClick={sendMessage}
            className="nav-btn"
            style={{
              background: "#e56e00",
              color: "white",
              padding: "10px 16px",
              borderRadius: 8
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
