import React from "react";
import { useAuthContext } from "../context/AuthContext";

export default function Footer({ onChatOpen }) {
  const { user } = useAuthContext();

  return (
    <footer className="bg-[#0a3a38] text-white/80 text-center py-6 px-4 mt-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-bold text-white mb-2 tracking-wide">
          RideWise
        </h2>

        <p className="text-sm md:text-base mb-4">
          Predicting Smarter Mobility with{" "}
          <span className="text-orange-400 font-semibold">AI</span>
        </p>

        <div className="flex justify-center gap-6 text-sm md:text-base mb-4 flex-wrap">
          <a href="/" className="hover:text-orange-400 transition-colors">
            Home
          </a>
          <a href="/contact" className="hover:text-orange-400 transition-colors">
            Contact Us
          </a>

          {user && (
            <>
              {/* 🟢 Open Chatbot directly */}
              <button
                onClick={onChatOpen}
                className="hover:text-orange-400 transition-colors"
              >
                AI Chatbot
              </button>

              <a href="/predictor" className="hover:text-orange-400 transition-colors">
                Predictor
              </a>
              <a href="/insights" className="hover:text-orange-400 transition-colors">
                Insights
              </a>
            </>
          )}
        </div>

        <div className="border-t border-white/20 mt-4 pt-4 text-xs text-white/60">
          © {new Date().getFullYear()} RideWise — All rights reserved.
        </div>
      </div>
    </footer>
  );
}
