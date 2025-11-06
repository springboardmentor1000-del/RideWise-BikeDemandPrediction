// import React from "react";

// export default function Navbar({ activeTab, setActiveTab, onLogout }) {
//   const tabs = ["Dashboard", "Hourly", "Daily", "Chatbot", "Profile"];

//   return (
//     <nav
//       className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-4 
//                  border-b border-orange-700 shadow-[0_0_15px_rgba(255,100,0,0.3)]
//                  bg-gradient-to-r from-black via-neutral-900 to-black"
//     >
//       {/* Logo Section */}
//       <div className="flex items-center gap-3">
//         <div className="text-orange-500 font-extrabold text-xl tracking-wide">
//           🚲 RideWise
//         </div>
//         <div className="text-gray-400 text-sm font-medium">Bike Predictor</div>
//       </div>

//       {/* Navigation Tabs */}
//       <div className="flex gap-6">
//         {tabs.map((t) => (
//           <button
//             key={t}
//             onClick={() => setActiveTab(t)}
//             className={`relative text-sm font-semibold transition-all duration-300 ${
//               activeTab === t
//                 ? "text-orange-400 after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-orange-500"
//                 : "text-gray-300 hover:text-orange-300"
//             }`}
//           >
//             {t}
//           </button>
//         ))}
//       </div>

//       {/* Logout Button */}
//       <button
//         onClick={onLogout}
//         className="px-4 py-2 rounded-md font-semibold text-sm text-black bg-orange-500 hover:bg-orange-600 transition-all duration-300"
//       >
//         Logout
//       </button>
//     </nav>
//   );
// }
import React from "react";

export default function Navbar({ activeTab, setActiveTab, onLogout }) {
  const tabs = ["Dashboard", "Hourly", "Daily", "Chatbot", "Profile"];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between 
                 px-10 py-4 border-b border-orange-600 
                 shadow-[0_0_25px_rgba(255,100,0,0.4)] 
                 bg-gradient-to-r from-black via-neutral-900 to-black"
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <span className="text-orange-500 font-extrabold text-xl tracking-wide">
          🚲 RideWise
        </span>
        <span className="text-gray-400 text-sm font-medium">
          Bike Predictor
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-6">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`relative text-sm font-semibold transition-all duration-300 ${
              activeTab === t
                ? "text-orange-400 after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-orange-500"
                : "text-gray-300 hover:text-orange-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="px-4 py-2 rounded-md font-semibold text-sm text-black bg-orange-500 hover:bg-orange-600 transition-all duration-300"
      >
        Logout
      </button>
    </nav>
  );
}
