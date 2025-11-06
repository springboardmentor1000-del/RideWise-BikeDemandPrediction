// import React, { useState } from "react";
// import Navbar from "../components/Navbar";
// import Dashboard from "./Dashboard";
// import HourlyPrediction from "./HourlyPrediction";
// import DailyPrediction from "./DailyPrediction";
// import Chatbot from "./Chatbot";
// import Profile from "./Profile";
// import ThreeScene from "../components/ThreeScene";

// export default function DashboardPage() {
//   const [activeTab, setActiveTab] = useState("Dashboard");

//   const handleLogout = () => {
//     // sign out logic e.g., firebase signOut(...) then navigate to login
//     window.location.href = "/"; // simple redirect if login at root
//   };

//   const renderContent = () => {
//     switch (activeTab) {
//       case "Dashboard": return <Dashboard />;
//       case "Hourly": return <HourlyPrediction />;
//       case "Daily": return <DailyPrediction />;
//       case "Chatbot": return <Chatbot />;
//       case "Profile": return <Profile />;
//       default: return <Dashboard />;
//     }
//   };

//   return (
//     <div className="app-container">
//       {/* animated background / 3d bike */}
//       <ThreeScene />
//       <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
//       <div className="content">
//         <div className="center-col">
//           {renderContent()}
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Dashboard from "./Dashboard";
import HourlyPrediction from "./HourlyPrediction";
import DailyPrediction from "./DailyPrediction";
import Chatbot from "./Chatbot";
import Profile from "./Profile";
import ThreeScene from "../components/ThreeScene";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const handleLogout = () => {
    window.location.href = "/";
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <Dashboard />;
      case "Hourly":
        return <HourlyPrediction />;
      case "Daily":
        return <DailyPrediction />;
      case "Chatbot":
        return <Chatbot />;
      case "Profile":
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black text-white overflow-hidden">
      {/* --- Animated 3D Background --- */}
      <ThreeScene />

      {/* --- Background overlay (optional texture) --- */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{
          backgroundImage: "url('/src/assets/c3a24e4a-1aa1-43f5-9807-ef5c7078a65e.png')",
        }}
      ></div>

      {/* --- Subtle indigo glow overlay --- */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.25)_0%,transparent_70%)]"></div>

      {/* --- Navbar (color changed here) --- */}
      <div className="relative z-20 bg-gradient-to-r from-indigo-600 via-blue-700 to-indigo-800 shadow-[0_0_25px_rgba(99,102,241,0.5)] backdrop-blur-md">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
        />
      </div>

      {/* --- Main Content --- */}
      <main className="relative z-10 pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-black/80 border border-indigo-700 shadow-[0_0_25px_rgba(99,102,241,0.3)] p-8 rounded-none">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* --- Footer --- */}
      <footer className="relative z-10 text-center text-gray-400 text-sm py-6 border-t border-gray-800 mt-10">
        © 2025 RideWise. All rights reserved.
      </footer>
    </div>
  );
}
