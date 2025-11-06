// import { useState, useEffect } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "./services/firebase";

// import Dashboard from "./pages/Dashboard";
// import HourlyPrediction from "./pages/HourlyPrediction";
// import DailyPrediction from "./pages/DailyPrediction";
// import Chatbot from "./pages/Chatbot";
// import Profile from "./pages/Profile";
// import ThreeScene from "./components/ThreeScene";
// import Login from "./pages/auth/Login";
// import Signup from "./pages/auth/signup";

// export default function App() {
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Listen to Firebase authentication state
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setIsLoggedIn(!!user);
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   if (loading) return <div className="text-center mt-20">Loading...</div>;

//   return (
//     <Routes>
//       <Route
//         path="/"
//         element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />}
//       />
//       <Route path="/signup" element={<Signup />} />

//       <Route
//         path="/dashboard"
//         element={
//           isLoggedIn ? (
//             <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white overflow-hidden transition-all duration-700">
//               <ThreeScene />
//               <nav className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo-600/40 via-purple-600/30 to-pink-600/40 backdrop-blur-md flex justify-center py-4 space-x-6 text-sm font-semibold z-10 shadow-lg border-b border-white/10 rounded-b-2xl">
//                 {["dashboard", "hourly", "daily", "chatbot", "profile"].map(
//                   (tab) => (
//                     <button
//                       key={tab}
//                       onClick={() => setActiveTab(tab)}
//                       className={`capitalize px-5 py-2 rounded-lg transition-all duration-300 ${
//                         activeTab === tab
//                           ? "bg-gradient-to-r from-pink-500 to-indigo-500 shadow-md scale-105"
//                           : "text-gray-200 hover:text-white hover:scale-105"
//                       }`}
//                     >
//                       {tab}
//                     </button>
//                   )
//                 )}
//                 <button
//                   onClick={() => {
//                     auth.signOut();
//                     setIsLoggedIn(false);
//                   }}
//                   className="ml-6 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-600 hover:to-red-600 rounded-xl shadow-md transition"
//                 >
//                   Logout
//                 </button>
//               </nav>

//               <div className="pt-24 flex justify-center items-center transition-all duration-500">
//                 {activeTab === "dashboard" && <Dashboard />}
//                 {activeTab === "hourly" && <HourlyPrediction />}
//                 {activeTab === "daily" && <DailyPrediction />}
//                 {activeTab === "chatbot" && <Chatbot />}
//                 {activeTab === "profile" && <Profile />}
//               </div>
//             </div>
//           ) : (
//             <Navigate to="/" replace />
//           )
//         }
//       />
//     </Routes>
//   );
// }
// import { useState, useEffect } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "./services/firebase";

// // Pages
// import Dashboard from "./pages/Dashboard";
// import HourlyPrediction from "./pages/HourlyPrediction";
// import DailyPrediction from "./pages/DailyPrediction";
// import Chatbot from "./pages/Chatbot";
// import Profile from "./pages/Profile";
// import ThreeScene from "./components/ThreeScene";
// import Login from "./pages/auth/Login";
// import Signup from "./pages/auth/signup";
// // import Signup from "./pages/auth/signup"; // ✅ Capitalized filename for consistency

// export default function App() {
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Listen to Firebase authentication state
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setIsLoggedIn(!!user);
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   if (loading) return <div className="text-center mt-20">Loading...</div>;

//   return (
//     <Routes>
//       {/* Default route: If logged in → dashboard, else → login */}
//       <Route
//         path="/"
//         element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />}
//       />

//       {/* Signup route */}
//       <Route path="/signup" element={<Signup />} />

//       {/* Dashboard route (protected) */}
//       <Route
//         path="/dashboard"
//         element={
//           isLoggedIn ? (
//             <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white overflow-hidden transition-all duration-700">
//               <ThreeScene />

//               {/* Navigation Bar */}
//               <nav className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo-600/40 via-purple-600/30 to-pink-600/40 backdrop-blur-md flex justify-center py-4 space-x-6 text-sm font-semibold z-10 shadow-lg border-b border-white/10 rounded-b-2xl">
//                 {["dashboard", "hourly", "daily", "chatbot", "profile"].map(
//                   (tab) => (
//                     <button
//                       key={tab}
//                       onClick={() => setActiveTab(tab)}
//                       className={`capitalize px-5 py-2 rounded-lg transition-all duration-300 ${
//                         activeTab === tab
//                           ? "bg-gradient-to-r from-pink-500 to-indigo-500 shadow-md scale-105"
//                           : "text-gray-200 hover:text-white hover:scale-105"
//                       }`}
//                     >
//                       {tab}
//                     </button>
//                   )
//                 )}
//                 <button
//                   onClick={() => {
//                     auth.signOut();
//                     setIsLoggedIn(false);
//                   }}
//                   className="ml-6 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-600 hover:to-red-600 rounded-xl shadow-md transition"
//                 >
//                   Logout
//                 </button>
//               </nav>

//               {/* Active Page Section */}
//               <div className="pt-24 flex justify-center items-center transition-all duration-500">
//                 {activeTab === "dashboard" && <Dashboard />}
//                 {activeTab === "hourly" && <HourlyPrediction />}
//                 {activeTab === "daily" && <DailyPrediction />}
//                 {activeTab === "chatbot" && <Chatbot />}
//                 {activeTab === "profile" && <Profile />}
//               </div>
//             </div>
//           ) : (
//             <Navigate to="/" replace />
//           )
//         }
//       />
//     </Routes>
//   );
// }
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";

// Pages
import Dashboard from "./pages/Dashboard";
import HourlyPrediction from "./pages/HourlyPrediction";
import DailyPrediction from "./pages/DailyPrediction";
import Chatbot from "./pages/Chatbot";
import Profile from "./pages/Profile";
import ThreeScene from "./components/ThreeScene";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/signup"; // ✅ Capitalized name

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center mt-20 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          }
        />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected dashboard route */}
        <Route
  path="/dashboard"
  element={
    isLoggedIn ? (
      <div className="relative min-h-screen bg-gradient-to-br from-black via-neutral-900 to-orange-950 text-white overflow-hidden transition-all duration-700">
        <ThreeScene />

        {/* Navigation Bar */}
        <nav className="absolute top-0 left-0 right-0 bg-gradient-to-r from-black via-neutral-900 to-orange-950 backdrop-blur-md shadow-lg border-b border-orange-600/40 z-10 rounded-b-2xl">
          <div className="max-w-7xl mx-auto flex justify-between items-center px-10 py-4">

            {/* Left: Logo */}
            <h1 className="text-2xl font-bold text-orange-500 tracking-wide">
              RideWise
            </h1>

            {/* Center: Navigation Tabs */}
            <div className="flex space-x-10">
              {["dashboard", "hourly", "daily", "chatbot"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`capitalize px-5 py-2 rounded-lg transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-orange-600 to-orange-700 text-black font-semibold shadow-md scale-105"
                      : "text-gray-300 hover:text-orange-400 hover:scale-105"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Right: Profile Dropdown */}
            <div className="relative group">
              <button
                onClick={() => setActiveTab("profile")}
                className={`capitalize px-5 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === "profile"
                    ? "bg-gradient-to-r from-orange-600 to-orange-700 text-black font-semibold shadow-md scale-105"
                    : "text-gray-300 hover:text-orange-400 hover:scale-105"
                }`}
              >
                Profile
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-32 bg-neutral-900 text-gray-200 rounded-lg shadow-lg border border-orange-700 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transform transition-all duration-300 z-20">
                <button
                  onClick={() => {
                    auth.signOut();
                    setIsLoggedIn(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-orange-600 rounded-md"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Active Page Section */}
        <div className="pt-24 flex justify-center items-center transition-all duration-500 bg-gradient-to-b from-transparent to-black">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "hourly" && <HourlyPrediction />}
          {activeTab === "daily" && <DailyPrediction />}
          {activeTab === "chatbot" && <Chatbot />}
          {activeTab === "profile" && <Profile />}
        </div>
      </div>
    ) : (
      <Navigate to="/login" replace />
    )
  }
/>

        
      </Routes>
    </div>
  );
}
