import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import logo from "../assets/images/ride_wise_logo.png";

export default function Navbar({ onChatOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signout, loading } = useAuthContext();

  if (loading) return null;

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md fixed top-0 left-0 w-full z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* ✅ Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-primary tracking-wide flex items-center"
          >
            <img src={logo} alt="RideWise" className="w-8 h-8 mr-2" />
            RideWise
          </Link>

          {/* ✅ Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            {!user ? (
              <>
                <Link
                  to="/signin"
                  className="text-primary font-semibold hover:text-primary/80 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-b from-accent1 to-accent2 text-white px-5 py-2 rounded-md font-medium shadow-md hover:from-orange-400 hover:to-orange-500 transition"
                >
                  Sign Up
                </Link>
                <Link
                  to="/contact"
                  className="text-primary font-semibold hover:text-primary/80 transition"
                >
                  Contact Us
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/predictor"
                  className="text-primary font-semibold hover:text-primary/80 transition"
                >
                  Predictor
                </Link>

                {/* 🟢 Open Chatbot directly */}
                <button
                  onClick={onChatOpen}
                  className="text-primary font-semibold hover:text-primary/80 transition"
                >
                  AI Chatbot
                </button>

                <Link
                  to="/insights"
                  className="text-primary font-semibold hover:text-orange-600 transition"
                >
                  Insights
                </Link>
                <Link
                  to="/contact"
                  className="text-primary font-semibold hover:text-primary/80 transition"
                >
                  Contact Us
                </Link>

                <span className="text-gray-600 font-medium">
                  Hi, {user.username}
                </span>
                <button
                  onClick={signout}
                  className="text-red-600 font-semibold hover:text-red-800 transition"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>

          {/* ✅ Mobile Menu Button */}
          <button
            className="md:hidden text-primary focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ✅ Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md shadow-lg">
          <div className="flex flex-col px-6 py-4 space-y-4">
            {!user ? (
              <>
                <Link
                  to="/signin"
                  onClick={() => setMenuOpen(false)}
                  className="text-primary font-semibold hover:text-primary/80 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="bg-gradient-to-b from-accent1 to-accent2 text-white px-5 py-2 rounded-md font-medium shadow-md hover:from-orange-400 hover:to-orange-500 transition text-center"
                >
                  Sign Up
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="text-primary font-semibold hover:text-primary/80 transition"
                >
                  Contact Us
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/predictor"
                  onClick={() => setMenuOpen(false)}
                  className="text-primary font-semibold hover:text-primary/80 transition"
                >
                  Predictor
                </Link>

                {/* 🟢 Open Chatbot directly (mobile) */}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onChatOpen();
                  }}
                  className="text-primary font-semibold hover:text-primary/80 transition text-left"
                >
                  AI Chatbot
                </button>

                <Link
                  to="/insights"
                  onClick={() => setMenuOpen(false)}
                  className="text-primary font-semibold hover:text-orange-600 transition"
                >
                  Insights
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="text-primary font-semibold hover:text-primary/80 transition"
                >
                  Contact Us
                </Link>

                <span className="text-gray-600 font-medium">
                  Hi, {user.username}
                </span>
                <button
                  onClick={() => {
                    signout();
                    setMenuOpen(false);
                  }}
                  className="text-red-600 font-semibold hover:text-red-800 transition text-left"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
