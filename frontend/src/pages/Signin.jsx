import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import signinBg from "../assets/images/signin_bg.jpg";



const Signin = () => {
  const { user, signin } = useAuthContext(); // ✅ From JWT-based AuthContext
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await signin(formData.username, formData.password);

      if (success) navigate("/");
      else setError("Invalid username or password.");
    } catch (err) {
      console.error("Signin Error:", err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0f534f]/95 text-white font-sans">
      <div className="flex flex-grow relative">
        {/* Right-side background image */}
        <div
          className="hidden md:block absolute top-0 right-0 w-1/2 h-full"
          style={{
            backgroundImage: `url(${signinBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center right",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#064e4a4d] to-[#0336338c]" />
        </div>

        {/* Left-side Sign-in form */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-8 py-12 z-10">
          <div className="w-full max-w-md">
            <h2 className="text-4xl font-extrabold mb-2 text-white">
              Welcome Back
            </h2>
            <p className="text-lg mb-6 text-white/90">
              Sign in to continue your RideWise journey
            </p>

            {error && (
              <div className="bg-red-500/80 text-white px-4 py-2 mb-4 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div className="mb-4">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl text-gray-800 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Password */}
              <div className="mb-6 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-10 rounded-xl text-gray-800 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3l18 18M9.88 9.88C9.34 10.58 9 11.53 9 12.5C9 14.99 11.01 17 13.5 17C14.47 17 15.42 16.66 16.12 16.12M17.94 17.94C16.41 19.07 14.52 19.75 12.5 19.75C7.5 19.75 3.8 16.64 2 12.75C2.68 11.03 3.74 9.47 5.11 8.18L3 3"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5C7 5 3.3 8.11 1.5 12C3.3 15.89 7 19 12 19C17 19 20.7 15.89 22.5 12C20.7 8.11 17 5 12 5Z"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-2 rounded-xl text-lg font-semibold text-white bg-gradient-to-b from-orange-500 to-orange-600 shadow-lg hover:shadow-xl hover:from-orange-400 hover:to-orange-500 transition"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-5 text-center text-white/90 text-sm">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-orange-400 font-semibold hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
