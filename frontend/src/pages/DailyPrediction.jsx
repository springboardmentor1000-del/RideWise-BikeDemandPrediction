// import { useState } from "react";
// import axios from "axios";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   Tooltip,
//   Legend,
//   Title,
//   Filler,
// } from "chart.js";

// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Title, Filler);

// export default function DailyPrediction() {
//   const [inputs, setInputs] = useState({
//     season: "",
//     yr: "",
//     mnth: "",
//     holiday: "",
//     humidity: "",
//     weekday: "",
//     workingday: "",
//     weathersit: "",
//     temp: "",
//     atemp: "",
//     hum: "",
//     windspeed: "",
//   });

//   const [result, setResult] = useState(null);

//   const handleChange = (e) =>
//     setInputs({ ...inputs, [e.target.name]: e.target.value });

//   const handlePredict = async () => {
//     try {
//       const payload = Object.fromEntries(
//         Object.entries(inputs).map(([k, v]) => [k, v === "" ? 0 : parseFloat(v)])
//       );
//       const { data } = await axios.post("http://127.0.0.1:8000/predict/daily", payload);
//       setResult({
//         prediction: data.prediction.toFixed(2),
//         temp: inputs.temp,
//         hum: inputs.hum,
//       });
//     } catch (err) {
//       console.error(err);
//       setResult({ error: "⚠️ Error fetching daily prediction!" });
//     }
//   };

//   const trendData = result
//     ? {
//         labels: Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`),
//         datasets: [
//           {
//             label: "Predicted Demand",
//             data: Array.from({ length: 7 }, () =>
//               Math.max(0, parseFloat(result.prediction) + Math.random() * 150 - 75)
//             ),
//             borderColor: "#4fc3f7",
//             backgroundColor: "rgba(79, 195, 247, 0.2)",
//             pointBackgroundColor: "#fff",
//             pointBorderColor: "#4fc3f7",
//             pointRadius: 4,
//             borderWidth: 3,
//             tension: 0.4,
//             fill: true,
//           },
//         ],
//       }
//     : null;

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         labels: { color: "#ffffff", font: { size: 14 } },
//       },
//       title: {
//         display: true,
//         text: "Predicted Demand Trend by Day",
//         color: "#ffffff",
//         font: { size: 18 },
//       },
//     },
//     scales: {
//       x: {
//         ticks: { color: "#ffffff" },
//         grid: { color: "rgba(255,255,255,0.1)" },
//       },
//       y: {
//         ticks: { color: "#ffffff" },
//         grid: { color: "rgba(255,255,255,0.1)" },
//       },
//     },
//   };

//   return (
//     <div className="flex flex-col items-center text-white space-y-6 p-10 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 rounded-3xl shadow-2xl w-[900px] mx-auto">
//       <h1 className="text-3xl font-extrabold mb-4">🌤️ Daily Bike Demand Prediction</h1>

//       {/* Input Section */}
//       <div className="grid grid-cols-3 gap-4 w-full">
//         {Object.keys(inputs).map((key) => (
//           <input
//             key={key}
//             type="number"
//             name={key}
//             placeholder={key}
//             value={inputs[key]}
//             onChange={handleChange}
//             className="p-2 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//           />
//         ))}
//       </div>

//       <button
//         onClick={handlePredict}
//         className="bg-indigo-500 hover:bg-indigo-600 px-8 py-3 rounded-xl font-bold transition-transform transform hover:scale-105 shadow-lg"
//       >
//         🚀 Predict
//       </button>

//       {/* Results Section */}
//       {result && !result.error && (
//         <div className="bg-white/20 p-6 rounded-2xl backdrop-blur-md w-full mt-6">
//           <h2 className="text-2xl font-semibold mb-3">🔮 Prediction Summary</h2>
//           <div className="grid grid-cols-3 gap-6 text-center">
//             <div className="bg-white/10 p-4 rounded-xl">
//               <p className="text-lg font-medium">🚲 Predicted Demand</p>
//               <h3 className="text-3xl font-bold text-cyan-300">{result.prediction}</h3>
//               <p className="text-sm text-gray-200">bikes</p>
//             </div>
//             <div className="bg-white/10 p-4 rounded-xl">
//               <p className="text-lg font-medium">🌡️ Temperature</p>
//               <h3 className="text-3xl font-bold text-pink-300">{result.temp}°C</h3>
//             </div>
//             <div className="bg-white/10 p-4 rounded-xl">
//               <p className="text-lg font-medium">💧 Humidity</p>
//               <h3 className="text-3xl font-bold text-blue-300">{result.hum}%</h3>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Trend Chart */}
//       {trendData && (
//         <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md w-full mt-8">
//           <h2 className="text-xl font-semibold mb-3 text-center">📊 Analytics — Demand Trend by Day</h2>
//           <div className="bg-black/20 rounded-xl p-4">
//             <Line data={trendData} options={chartOptions} />
//           </div>
//         </div>
//       )}

//       {/* Error */}
//       {result?.error && (
//         <p className="text-red-400 font-medium mt-3">{result.error}</p>
//       )}
//     </div>
//   );
// }
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
  Filler,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Title, Filler);

export default function DailyPrediction() {
  const [inputs, setInputs] = useState({
    season: "",
    yr: "",
    mnth: "",
    holiday: "",
    humidity: "",
    weekday: "",
    workingday: "",
    weathersit: "",
    temp: "",
    atemp: "",
    hum: "",
    windspeed: "",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const handlePredict = async () => {
    try {
      const payload = Object.fromEntries(
        Object.entries(inputs).map(([k, v]) => [k, v === "" ? 0 : parseFloat(v)])
      );
      const { data } = await axios.post("http://127.0.0.1:8000/predict/daily", payload);
      setResult({
        prediction: data.prediction.toFixed(2),
        temp: inputs.temp,
        hum: inputs.hum,
      });
    } catch (err) {
      console.error(err);
      setResult({ error: "Error fetching daily prediction!" });
    }
  };

  const trendData = result
    ? {
        labels: Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`),
        datasets: [
          {
            label: "Predicted Demand",
            data: Array.from({ length: 7 }, () =>
              Math.max(0, parseFloat(result.prediction) + Math.random() * 150 - 75)
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
        labels: { color: "#ffffff", font: { size: 14 } },
      },
      title: {
        display: true,
        text: "Predicted Demand Trend by Day",
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
        Daily Bike Demand Prediction
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

      {/* Trend Chart */}
      {trendData && (
        <div className="bg-neutral-900 p-6 rounded-2xl border border-orange-500 w-full mt-8">
          <h2 className="text-xl font-semibold mb-3 text-center text-orange-400">
            Analytics — Demand Trend by Day
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
