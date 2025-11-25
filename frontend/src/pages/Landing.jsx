import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import landingBg from "../assets/images/landing_bg.jpg";
import logo from "../assets/images/ride_wise_logo.png";
import { motion } from "framer-motion";
import {
  WiDaySunny,
  WiStrongWind,
  WiCloudy,
  WiRain,
  WiSnowflakeCold,
  WiFog,
} from "react-icons/wi";
import { BsGraphUp, BsThermometerHalf, BsDroplet } from "react-icons/bs";
import { MdOutlineSevereCold } from "react-icons/md";
import { useAuthContext } from "../context/AuthContext";
import CountUp from "react-countup";

const Landing = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuthContext();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  const seasonMap = {
    1: { name: "Spring", icon: <WiDaySunny className="text-2xl text-amber-300" /> },
    2: { name: "Summer", icon: <WiDaySunny className="text-2xl text-yellow-400" /> },
    3: { name: "Fall", icon: <WiCloudy className="text-2xl text-orange-400" /> },
    4: { name: "Winter", icon: <WiSnowflakeCold className="text-2xl text-cyan-300" /> },
  };

  const weatherMap = {
    1: "Clear",
    2: "Misty",
    3: "Light Rain",
    4: "Heavy Rain",
  };

  const getWeatherIcon = (code) => {
    switch (code) {
      case 1:
        return <WiDaySunny className="text-2xl text-yellow-300" />;
      case 2:
        return <WiFog className="text-2xl text-gray-300" />;
      case 3:
        return <WiRain className="text-2xl text-blue-300" />;
      case 4:
        return <MdOutlineSevereCold className="text-2xl text-cyan-300" />;
      default:
        return <WiCloudy className="text-2xl text-gray-400" />;
    }
  };

  useEffect(() => {
    if (!user) return;

    const fetchOverview = async () => {
      const city = "Hyderabad";
      const date = new Date().toISOString().split("T")[0];
      const hour = new Date().getHours();
      const token = localStorage.getItem("access");

      try {
        const [weatherRes, rentalsRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_BASE_URL}/api/predictor/weather/today?city=${city}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.REACT_APP_API_BASE_URL}/api/predictor/overview?city=${city}&date=${date}&hour=${hour}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Debug: log status and raw text if JSON fails
        const weatherText = await weatherRes.text();
        let weatherData;
        try {
          weatherData = JSON.parse(weatherText);
        } catch (err) {
          console.error("Failed to parse weather JSON. Raw response:", weatherText);
          throw err;
        }

        const rentalsText = await rentalsRes.text();
        let rentalsData;
        try {
          rentalsData = JSON.parse(rentalsText);
        } catch (err) {
          console.error("Failed to parse rentals JSON. Raw response:", rentalsText);
          throw err;
        }

        setOverview({
          weather: weatherData,
          totalRentals: rentalsData.predictions?.total_rentals_today ?? 0,
          currentRentals: rentalsData.predictions?.current_hour_rentals ?? 0,
        });
      } catch (err) {
        console.error("Error fetching overview:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [user]);


  return (
    <div className="relative text-white font-inter overflow-hidden bg-[#0a3c3a]">
      {/* Background Effects - truly dark and balanced (no vignette) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `linear-gradient(to top right, rgba(7, 59, 57, 0.92), rgba(15, 83, 79, 0.9), rgba(12, 60, 58, 0.92)), url(${landingBg})`,
          backgroundBlendMode: "multiply",
          filter: "brightness(0.5)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#062c2b]/90 via-[#09403f]/85 to-[#0b4948]/90 z-0" />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col justify-center items-center text-center px-8 md:px-20 pt-36 pb-32 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.img
            src={logo}
            alt="RideWise Logo"
            className="w-28 md:w-36 mx-auto mb-8 drop-shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          />

          <motion.p
            className="text-sm uppercase tracking-widest text-cyan-300 font-semibold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            AI + Mobility = Smarter Cities
          </motion.p>

          <motion.h1
            className="text-5xl md:text-6xl font-extrabold mb-6 text-white leading-tight tracking-tight"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Smarter Rides, <br />
            <span className="bg-gradient-to-r from-orange-400 to-cyan-400 text-transparent bg-clip-text">
              Predictively Driven
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            RideWise transforms ordinary ride-sharing into an intelligent, predictive ecosystem.
            By merging <span className="text-cyan-300 font-semibold">machine learning</span>,
            <span className="text-orange-300 font-semibold"> real-time weather</span>, and
            <span className="text-cyan-300 font-semibold"> urban analytics</span>, we help cities
            anticipate demand, reduce waiting time, and improve sustainability.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-wrap justify-center gap-6 mb-14"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {user ? (
              <>
                <button
                  onClick={() => navigate("/predictor")}
                  className="px-8 py-3 rounded-xl text-lg font-semibold bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg hover:shadow-amber-400/40 hover:scale-105 transition-all duration-300"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={signOut}
                  className="px-8 py-3 rounded-xl text-lg font-semibold border border-white/40 text-white/90 hover:bg-white hover:text-[#0f534f] transition-all duration-300"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/signin")}
                className="px-8 py-3 rounded-xl text-lg font-semibold bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg hover:shadow-amber-400/40 hover:scale-105 transition-all duration-300"
              >
                Get Started
              </button>
            )}
          </motion.div>

          {/* Features */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            {[
              { title: "AI Forecasts", desc: "Predicts ride demand based on live data patterns.", icon: "📊" },
              { title: "Weather-Aware", desc: "Adapts forecasts instantly to changing conditions.", icon: "🌤️" },
              { title: "Sustainable Rides", desc: "Reduces idle fleets & emissions intelligently.", icon: "🚴‍♂️" },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-gradient-to-br from-cyan-400/10 to-orange-400/10 backdrop-blur-sm border border-white/10 hover:shadow-lg hover:shadow-cyan-400/20 transition-all duration-300"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-white/70">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Overview Section */}
      {user && (
        <section className="relative z-10 max-w-6xl mx-auto mt-10 mb-24 px-6 text-center">
          <motion.h2
            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-cyan-400 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Today’s City Snapshot
          </motion.h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-4">
            {loading ? (
              <div className="text-center py-20 text-white/70">Loading overview...</div>
            ) : (
              [
                {
                  label: "Season",
                  icon: seasonMap[overview?.weather?.season]?.icon ?? <WiCloudy />,
                  value: seasonMap[overview?.weather?.season]?.name ?? "--",
                },
                {
                  label: "Weather",
                  icon: getWeatherIcon(overview?.weather?.weathersit),
                  value: weatherMap[overview?.weather?.weathersit] ?? "--",
                },
                {
                  label: "Temperature",
                  icon: <BsThermometerHalf className="text-2xl text-orange-300" />,
                  value: `${overview?.weather?.temp ?? "--"}°C`,
                },
                {
                  label: "Feels Like",
                  icon: <BsThermometerHalf className="text-2xl text-orange-200" />,
                  value: `${overview?.weather?.atemp ?? "--"}°C`,
                },
                {
                  label: "Humidity",
                  icon: <BsDroplet className="text-2xl text-cyan-300" />,
                  value: `${overview?.weather?.humidity ?? "--"}%`,
                },
                {
                  label: "Wind Speed",
                  icon: <WiStrongWind className="text-2xl text-sky-300" />,
                  value: `${overview?.weather?.windspeed ?? "--"} km/h`,
                },
                {
                  label: "Today's Total Rentals",
                  icon: <BsGraphUp className="text-2xl text-orange-300" />,
                  value: <CountUp end={overview?.totalRentals ?? 0} duration={1.5} separator="," />,
                },
                {
                  label: "Current Hour Rentals",
                  icon: <WiStrongWind className="text-2xl text-cyan-300" />,
                  value: <CountUp end={overview?.currentRentals ?? 0} duration={1.5} separator="," />,
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-all duration-300 hover:-translate-y-1 shadow-md"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                >
                  <div className="flex flex-col items-center">
                    <div className="mb-1">{item.icon}</div>
                    <p className="text-xs text-white/70">{item.label}</p>
                    <p className="text-base font-semibold text-white mt-0.5">{item.value}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="relative z-10 max-w-6xl mx-auto mt-10 mb-24 px-6 text-center">
        <div className="absolute top-10 left-20 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-24 w-72 h-72 bg-orange-400/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <motion.div
          className="relative max-w-5xl mx-auto backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-lg p-10 sm:p-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-4xl sm:text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-cyan-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            About RideWise
          </motion.h2>

          <motion.p
            className="text-lg sm:text-xl text-white/90 leading-relaxed mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            RideWise transforms <span className="text-orange-300 font-semibold">bike-sharing systems</span>
            into intelligent networks. By leveraging
            <span className="text-cyan-300 font-semibold"> predictive AI models</span> and
            <span className="text-orange-300 font-semibold"> real-time environmental data</span>,
            it empowers city planners and operators to anticipate demand, optimize fleet distribution,
            and reduce environmental impact — making every ride count toward a smarter, greener future.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              { title: "98%", desc: "Prediction Accuracy", icon: "📈" },
              { title: "10+", desc: "Cities Supported", icon: "🌍" },
              { title: "35%", desc: "Reduced Idle Time", icon: "⚡" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="p-6 rounded-xl bg-gradient-to-br from-cyan-400/10 to-orange-400/10 border border-white/10 hover:border-cyan-400/30 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-white/70">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              to="/signup"
              className="inline-block px-10 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-orange-500 to-cyan-400 shadow-lg hover:shadow-cyan-400/30 hover:scale-105 transition-all"
            >
              {user ? "Get Started" : "Join RideWise Today"}
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;
