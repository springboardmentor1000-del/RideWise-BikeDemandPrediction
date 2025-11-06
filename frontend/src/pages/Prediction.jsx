import React, { useState } from "react";
import { getPrediction } from "../services/api";
import ThreeScene from "../components/ThreeScene";

export default function Prediction() {
  const [form, setForm] = useState({
    season: "",
    yr: "",
    mnth: "",
    holiday: "",
    weekday: "",
    workingday: "",
    weathersit: "",
    temp: "",
    atemp: "",
    hum: "",
    windspeed: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const prediction = await getPrediction(form);
      setResult(prediction);
    } catch (error) {
      console.error("Prediction error:", error);
      setResult({ prediction: "Error fetching prediction" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#0B0E19] text-white overflow-hidden">
      {/* 🌌 Animated 3D Background */}
      {/* <ThreeScene /> */}

      <div className="bg-[#141824]/90 p-8 rounded-2xl shadow-lg w-full max-w-lg z-10 backdrop-blur-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">
          🚲 Bike Demand Predictor
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(form).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="capitalize mb-1 text-gray-300">{key}</label>
              <input
                name={key}
                value={form[key]}
                onChange={handleChange}
                type="number"
                required
                className="p-2 rounded-lg bg-[#1F2430] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}

          {/* 🟣 Predict Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 p-3 mt-4 rounded-lg font-semibold transition duration-300"
          >
            {loading ? "Predicting..." : "Predict"}
          </button>
        </form>

        {/* 🔮 Result Section */}
        {result && (
          <div className="mt-6 text-center bg-[#1F2430] p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">🔮 Predicted Demand</h2>
            <p className="text-2xl font-bold text-green-400">
              {result.prediction}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
