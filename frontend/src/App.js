import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import ContactUs from "./pages/ContactUs";
import Predictor from "./pages/Predictor";
import AIChatbot from "./pages/AIChatbot";
import AuthTest from "./pages/AuthTest";
import Insights from "./pages/Insights";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthContext } from "./context/AuthContext";
import { useState } from "react";

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuthContext();

  // 🧠 Chatbot open/close control
  const [chatOpen, setChatOpen] = useState(false);

  if (loading) return null;

  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar onChatOpen={() => setChatOpen(true)} />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contact" element={<ContactUs />} />

          <Route
            path="/predictor"
            element={
              <ProtectedRoute>
                <Predictor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/insights"
            element={
              <ProtectedRoute>
                <Insights />
              </ProtectedRoute>
            }
          />
          <Route path="/authtest" element={<AuthTest />} />
        </Routes>
      </main>

      {/* 💬 Global Chatbot — controlled by state */}
      {user && (
        <AIChatbot
          isOpen={chatOpen}
          setIsOpen={setChatOpen}
          location={location}
          navigate={navigate}
        />
      )}

      <Footer onChatOpen={() => setChatOpen(true)} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
