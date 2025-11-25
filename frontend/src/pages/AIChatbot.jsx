import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, MessageCircle, X, Move, Maximize2, Minimize2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function AIChatbot({ isOpen, setIsOpen }) {
  const [closing, setClosing] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 **Hello! I’m RideWise AI.** You can ask me about routes, traffic, or rental predictions.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [position, setPosition] = useState({ x: 40, y: 80 });
  const [size, setSize] = useState({ width: 420, height: 550 });
  const offset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const resizeDirection = useRef(null);
  const startPos = useRef({ x: 0, y: 0, width: 0, height: 0, left: 0, top: 0 });
  const frameRequested = useRef(false);
  const [isResizingActive, setIsResizingActive] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMouseMove = (e) => {
    if (frameRequested.current) return;
    frameRequested.current = true;
    requestAnimationFrame(() => {
      if (isDragging.current) {
        document.body.classList.add("dragging");
        setPosition({
          x: e.clientX - offset.current.x,
          y: e.clientY - offset.current.y,
        });
      } else if (isResizing.current) {
        const dx = e.clientX - startPos.current.x;
        const dy = e.clientY - startPos.current.y;
        const dir = resizeDirection.current;
        let newWidth = startPos.current.width;
        let newHeight = startPos.current.height;
        let newLeft = startPos.current.left;
        let newTop = startPos.current.top;

        if (dir.includes("right")) newWidth = Math.max(320, startPos.current.width + dx);
        if (dir.includes("left")) {
          newWidth = Math.max(320, startPos.current.width - dx);
          newLeft = startPos.current.left + dx;
        }
        if (dir.includes("bottom")) newHeight = Math.max(400, startPos.current.height + dy);
        if (dir.includes("top")) {
          newHeight = Math.max(400, startPos.current.height - dy);
          newTop = startPos.current.top + dy;
        }

        setSize({ width: newWidth, height: newHeight });
        setPosition({ x: newLeft, y: newTop });
      }
      frameRequested.current = false;
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    isResizing.current = false;
    document.body.classList.remove("dragging");
    setIsResizingActive(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleDragStart = (e) => {
    if (isFullScreen) return;
    e.stopPropagation();
    isDragging.current = true;
    offset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const startResize = (e, direction) => {
    if (isFullScreen) return;
    e.stopPropagation();
    isResizing.current = true;
    setIsResizingActive(true);
    resizeDirection.current = direction;
    startPos.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      left: position.x,
      top: position.y,
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/chatbot/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      const reply =
        data.reply || data.error || "Sorry, I couldn’t understand that. Please try again.";
      setMessages((prev) => [...prev, { sender: "bot", text: reply.replace(/\n/g, "\n\n") }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Server error. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleFullScreen = () => setIsFullScreen((prev) => !prev);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setIsOpen(false);
      setIsFullScreen(false);
    }, 350);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ease-in-out ${
            closing ? "animate-fadeOutDown" : "animate-fadeInUp"
          } ${isFullScreen ? "inset-0" : ""}`}
          style={
            isFullScreen
              ? { width: "100vw", height: "100vh", left: 0, top: 0 }
              : {
                  left: position.x,
                  top: position.y,
                  width: size.width,
                  height: size.height,
                  transition: "all 0.1s ease-in-out",
                }
          }
        >
          <div
            className={`flex flex-col h-full bg-[#0f534f] text-white border border-white/20 rounded-3xl shadow-[0_0_40px_rgba(15,83,79,0.4)] overflow-hidden relative transition-all duration-200 ${
              isResizingActive ? "shadow-[0_0_30px_rgba(255,165,0,0.5)]" : ""
            }`}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 py-4 text-xl font-semibold shadow-lg flex justify-center items-center select-none">
              <Move size={18} className="absolute left-4 text-white/80" />
              RideWise AI
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-3 no-drag">
                <button
                  onClick={toggleFullScreen}
                  className="text-white/90 hover:text-white transition-transform hover:scale-110"
                >
                  {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </button>
                <button
                  onClick={handleClose}
                  className="text-white/90 hover:text-white transition-transform hover:scale-110"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#0b3b39] scrollbar-thin scrollbar-thumb-orange-400/60 scrollbar-track-transparent no-drag">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 transition-all duration-500 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="p-2 rounded-full bg-orange-500/90 text-white shadow-md">
                      <Bot size={18} />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed shadow-md break-words ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-[#0f534f] to-[#15877e] text-white rounded-br-none"
                        : "bg-[#164e47] text-white border border-white/10 rounded-bl-none"
                    }`}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                  </div>
                  {msg.sender === "user" && (
                    <div className="p-2 rounded-full bg-teal-800 text-white shadow-md">
                      <User size={18} />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-white/70 text-sm animate-pulse">
                  <Bot size={16} className="text-orange-400" />
                  <span>RideWise AI is typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-[#0f534f] p-3 border-t border-white/20 flex items-center gap-3 no-drag">
              <textarea
                className="flex-1 bg-[#164e47] text-white placeholder-white/60 p-3 rounded-2xl resize-none outline-none border border-white/20 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all text-sm"
                placeholder="Type your message..."
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl hover:scale-105 transition-all disabled:opacity-60"
              >
                <Send size={20} />
              </button>
            </div>

            {/* 🟢 Resize + Drag Handles */}
            {!isFullScreen && (
              <>
                {/* Drag border (entire edge area for dragging only) */}
                <div
                  onMouseDown={handleDragStart}
                  className="absolute inset-0 border-4 border-transparent cursor-move pointer-events-none"
                  style={{
                    boxShadow: "inset 0 0 0 4px transparent",
                    pointerEvents: "none",
                  }}
                />

                {/* Actual draggable zones (corners) */}
                <div
                  onMouseDown={handleDragStart}
                  className="absolute top-0 left-0 w-full h-3 cursor-move"
                ></div>
                <div
                  onMouseDown={handleDragStart}
                  className="absolute bottom-0 left-0 w-full h-3 cursor-move"
                ></div>
                <div
                  onMouseDown={handleDragStart}
                  className="absolute top-0 left-0 w-3 h-full cursor-move"
                ></div>
                <div
                  onMouseDown={handleDragStart}
                  className="absolute top-0 right-0 w-3 h-full cursor-move"
                ></div>

                {/* Resize corners */}
                <div data-resizer onMouseDown={(e) => startResize(e, "bottom-right")} className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize"></div>
                <div data-resizer onMouseDown={(e) => startResize(e, "bottom-left")} className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize"></div>
                <div data-resizer onMouseDown={(e) => startResize(e, "top-right")} className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize"></div>
                <div data-resizer onMouseDown={(e) => startResize(e, "top-left")} className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize"></div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
