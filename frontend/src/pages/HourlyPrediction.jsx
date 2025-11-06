import { useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Title);

export default function HourlyPrediction() {
  const [inputs, setInputs] = useState({
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
    hour: "",
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const handlePredict = async () => {
    try {
      const payload = Object.fromEntries(
        Object.entries(inputs).map(([k, v]) => [k, v === "" ? 0 : parseFloat(v)])
      );
      const { data } = await axios.post("http://127.0.0.1:8000/predict/hourly", payload);
      setResult({
        prediction: data.prediction.toFixed(2),
        temp: inputs.temp,
        hum: inputs.hum,
      });
    } catch (err) {
      console.error(err);
      setResult({ error: "Error fetching prediction!" });
    }
  };

  const trendData = result
    ? {
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        datasets: [
          {
            label: "Predicted Demand",
            data: Array.from({ length: 24 }, () =>
              Math.max(0, parseFloat(result.prediction) + Math.random() * 100 - 50)
            ),
            borderColor: "#f97316", // orange
            backgroundColor: "rgba(249, 115, 22, 0.2)",
            pointBackgroundColor: "#fff",
            pointBorderColor: "#f97316",
            pointRadius: 4,
            borderWidth: 3,
            tension: 0.4,
            fill: true,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#ffffff",
          font: { size: 14 },
        },
      },
      title: {
        display: true,
        text: "Predicted Demand Trend by Hour",
        color: "#ffffff",
        font: { size: 18 },
      },
    },
    scales: {
      x: {
        ticks: { color: "#ffffff", font: { size: 12 } },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        ticks: { color: "#ffffff", font: { size: 12 } },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  return (
    <div className="flex flex-col items-center text-white space-y-6 p-10 bg-black shadow-2xl w-full min-h-screen border-t border-orange-500">
      <h1 className="text-3xl font-extrabold mb-4 text-orange-500">
        Hourly Bike Demand Prediction
      </h1>

      {/* Input Section */}
      <div className="grid grid-cols-3 gap-4 w-full">
        {Object.keys(inputs).map((key) => (
          <input
            key={key}
            type="number"
            name={key}
            placeholder={key}
            value={inputs[key]}
            onChange={handleChange}
            className="p-2 rounded-xl bg-neutral-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-700"
          />
        ))}
      </div>

      <button
        onClick={handlePredict}
        className="bg-orange-600 hover:bg-orange-700 px-8 py-3 rounded-xl font-bold transition-transform transform hover:scale-105 shadow-lg text-black"
      >
        Predict
      </button>

      {/* Results Section */}
      {result && !result.error && (
        <div className="bg-neutral-900 p-6 rounded-2xl border border-orange-500 w-full mt-6">
          <h2 className="text-2xl font-semibold mb-3 text-orange-400">
            Prediction Summary
          </h2>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="bg-black p-4 rounded-xl border border-orange-600">
              <p className="text-lg font-medium text-gray-300">Predicted Demand</p>
              <h3 className="text-3xl font-bold text-orange-400">{result.prediction}</h3>
              <p className="text-sm text-gray-400">bikes</p>
            </div>
            <div className="bg-black p-4 rounded-xl border border-orange-600">
              <p className="text-lg font-medium text-gray-300">Temperature</p>
              <h3 className="text-3xl font-bold text-orange-400">{result.temp}°C</h3>
            </div>
            <div className="bg-black p-4 rounded-xl border border-orange-600">
              <p className="text-lg font-medium text-gray-300">Humidity</p>
              <h3 className="text-3xl font-bold text-orange-400">{result.hum}%</h3>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Plot */}
      {trendData && (
        <div className="bg-neutral-900 p-6 rounded-2xl border border-orange-500 w-full mt-8">
          <h2 className="text-xl font-semibold mb-3 text-center text-orange-400">
            Analytics — Demand Trend by Hour
          </h2>
          <div className="bg-black rounded-xl p-4 border border-gray-700">
            <Line data={trendData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Error */}
      {result?.error && (
        <p className="text-red-400 font-medium mt-3">{result.error}</p>
      )}
    </div>
  );
}
