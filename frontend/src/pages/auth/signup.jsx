// import { useState } from "react";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../../services/firebase.js";
// import { Link, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import bgBike from "../../assets/mainbike.png"; // 🏍️ your background image

// export default function Signup() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       alert("Signup successful!");
//       navigate("/login");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div
//       className="relative flex items-center justify-center min-h-screen bg-cover bg-center overflow-hidden text-white"
//       style={{ backgroundImage: `url(${bgBike})` }}
//     >
//       {/* Dark overlay for contrast */}
//       <div className="absolute inset-0 bg-black/50" />

//       {/* Frosted transparent card */}
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//         className="relative z-10 w-[85%] sm:w-[360px] px-8 py-6 text-center border border-white/20 bg-white/10 backdrop-blur-lg shadow-xl"
//       >
//         <motion.h2
//           initial={{ y: -15, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.2 }}
//           className="text-3xl font-extrabold text-orange-500"
//         >
//           RideWise
//         </motion.h2>

//         <motion.h3
//           initial={{ y: -10, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.3 }}
//           className="text-xl font-semibold text-orange-400 mb-6"
//         >
//           Sign Up
//         </motion.h3>

//         <form onSubmit={handleSignup} className="space-y-5">
//           <motion.input
//             whileFocus={{ scale: 1.02 }}
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full p-3 bg-black/70 text-white placeholder-gray-400 border border-orange-500 focus:outline-none focus:ring-0"
//           />

//           <motion.input
//             whileFocus={{ scale: 1.02 }}
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full p-3 bg-black/70 text-white placeholder-gray-400 border border-orange-500 focus:outline-none focus:ring-0"
//           />

//           {error && (
//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="text-red-400 text-sm text-center"
//             >
//               {error}
//             </motion.p>
//           )}

//           <motion.button
//             whileHover={{
//               scale: 1.05,
//               boxShadow: "0 0 20px #ff6600",
//             }}
//             whileTap={{ scale: 0.96 }}
//             type="submit"
//             className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 transition-all duration-300"
//           >
//             Sign Up
//           </motion.button>

//           <p className="text-gray-300 mt-6 text-sm">
//             Already have an account?{" "}
//             <Link to="/login" className="text-orange-400 hover:underline">
//               Login
//             </Link>
//           </p>
//         </form>
//       </motion.div>
//     </div>
//   );
// }
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase.js";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import bgBike from "../../assets/mainbike.png"; // 🏍️ background image

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup successful!");
      navigate("/login"); // ✅ Redirect to login after signup
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center overflow-hidden text-white"
      style={{ backgroundImage: `url(${bgBike})` }}
    >
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Frosted transparent card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-[85%] sm:w-[360px] px-8 py-6 text-center border border-white/20 bg-white/10 backdrop-blur-lg shadow-xl"
      >
        <motion.h2
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-extrabold text-orange-500"
        >
          RideWise
        </motion.h2>

        <motion.h3
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-semibold text-orange-400 mb-6"
        >
          Sign Up
        </motion.h3>

        <form onSubmit={handleSignup} className="space-y-5">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-black/70 text-white placeholder-gray-400 border border-orange-500 focus:outline-none focus:ring-0"
          />

          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-black/70 text-white placeholder-gray-400 border border-orange-500 focus:outline-none focus:ring-0"
          />

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px #ff6600",
            }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 transition-all duration-300"
          >
            Sign Up
          </motion.button>

          <p className="text-gray-300 mt-6 text-sm">
            Already have an account?{" "}
            {/* ✅ Fixed Link navigation */}
            <Link
              to="/login"
              className="text-orange-400 hover:underline cursor-pointer"
            >
              Login
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
