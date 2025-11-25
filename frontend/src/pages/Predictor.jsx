import React, { useState, useEffect, useRef } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import { CalendarDays, AlarmClock } from 'lucide-react'
import dashboardBg from "../assets/images/home_bg.jpg";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  BarController,
  BarElement,
  LinearScale,
  Title,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  BarController,
  BarElement,
  LinearScale,
  Title,
  CategoryScale,
  Filler,
  Tooltip,
  Legend
);

const Predictor = () => {
  const [mode, setMode] = useState("manual"); // manual or auto
  const [city, setCity] = useState("");

  const [modelType, setModelType] = useState("day");
  const [date, setDate] = useState(new Date());
  const [season, setSeason] = useState("1");
  const [weathersit, setWeathersit] = useState("1");
  const [hour, setHour] = useState(12);
  const [temp, setTemp] = useState(0.5);
  const [atemp, setAtemp] = useState(0.5);
  const [hum, setHum] = useState(0.5);
  const [windspeed, setWindspeed] = useState(0.5);
  const [holiday, setHoliday] = useState("0");
  const [workingday, setWorkingday] = useState("0");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [bgActive, setBgActive] = useState(false);
  const [peakInfo, setPeakInfo] = useState(null);

  const weekChartRef = useRef(null);
  const hoursChartRef = useRef(null);
  const weekChartInstance = useRef(null);
  const hoursChartInstance = useRef(null);

  useEffect(() => {
    if (holiday === "1") setWorkingday("0");
    if (workingday === "1") setHoliday("0");
  }, [holiday, workingday]);

  const weatherOptions =
    modelType === "hour"
      ? [
        { value: "1", label: "Clear / Few clouds" },
        { value: "2", label: "Mist / Cloudy" },
        { value: "3", label: "Light Snow / Rain" },
        { value: "4", label: "Heavy Rain / Thunderstorm" },
      ]
      : [
        { value: "1", label: "Clear / Few clouds" },
        { value: "2", label: "Mist / Cloudy" },
        { value: "3", label: "Light Snow / Rain" },
      ];

  const getCSRFToken = () => {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      const [k, v] = cookie.split("=");
      if (k === "csrftoken") return decodeURIComponent(v);
    }
    return null;
  };

  const fetchWeather = async () => {
    if (!city) return alert("Please enter city name");
    try {
      setFetching(true);
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/predictor/overview?city=${city}&date=${date.toISOString().split("T")[0]}&hour=${hour}`
      );
      const data = await res.json();
      const w = data.weather;
      console.log("Fetched weather data:", w);
      setTemp(w.temp);
      setAtemp(w.atemp);
      setHum(w.humidity);
      setWindspeed(w.windspeed);
      setWeathersit(String(w.weathersit));
      setSeason(String(w.season));
      setHoliday(String(w.holiday));
      setWorkingday(String(w.workingday));
    } catch (err) {
      console.error("Weather fetch failed:", err);
      alert("Failed to fetch weather data.");
    } finally {
      setFetching(false);
    }
  };

  // --- Chart rendering functions remain same ---
  const renderWeekChart = (labels, data, highlightIndex) => {
    const ctx = weekChartRef.current?.getContext("2d");
    if (!ctx) return;
    if (weekChartInstance.current) weekChartInstance.current.destroy();

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "rgba(59,130,246,0.5)");
    gradient.addColorStop(1, "rgba(59,130,246,0.05)");

    weekChartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Weekly Demand",
            data,
            fill: true,
            tension: 0.4,
            backgroundColor: gradient,
            borderColor: "#3b82f6",
            borderWidth: 2,
            pointBackgroundColor: labels.map((_, i) =>
              i === highlightIndex ? "#facc15" : "#3b82f6"
            ),
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        animation: { duration: 1000, easing: "easeOutQuart" },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(15,23,42,0.9)",
            titleColor: "#fff",
            bodyColor: "#e2e8f0",
          },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  };

  const renderHoursChart = (labels, data, highlightHour) => {
    const ctx = hoursChartRef.current?.getContext("2d");
    if (!ctx) return;
    if (hoursChartInstance.current) hoursChartInstance.current.destroy();

    hoursChartInstance.current = new Chart(ctx, {
      data: {
        labels,
        datasets: [
          {
            type: "bar",
            label: "Hourly Demand",
            data,
            backgroundColor: labels.map((_, i) =>
              i === highlightHour ? "rgba(234,88,12,0.9)" : "rgba(234,88,12,0.5)"
            ),
            borderRadius: 6,
          },
          {
            type: "line",
            label: "Trend Line",
            data,
            borderColor: "#facc15",
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: "#facc15",
          },
        ],
      },
      options: {
        responsive: true,
        animation: { duration: 1000, easing: "easeOutQuart" },
        plugins: { legend: { display: false } },
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setBgActive(true);
    setError("");
    setResult(null);

    const payload = {
      date: date instanceof Date ? date.toISOString().split("T")[0] : date,
      season: parseInt(season),
      weathersit: parseInt(weathersit),
      temp: parseFloat(temp),
      atemp: parseFloat(atemp),
      hum: parseFloat(hum),
      windspeed: parseFloat(windspeed),
      holiday: parseInt(holiday),
      workingday: parseInt(workingday),
      model_type: modelType,
      ...(modelType === "hour" && { hour: parseInt(hour) }),
    };

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/predictor/predict/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken() || "",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log(data);
      if (!res.ok) throw new Error(data.error || "Server error");
      setResult(data);

      setTimeout(() => {
        if (data.type === "day") {
          renderWeekChart(
            data.week_labels,
            data.week_predictions.map(Number),
            new Date(date).getDay()
          );
        } else {
          renderHoursChart(
            data.hour_labels,
            data.hour_predictions.map(Number),
            payload.hour || 0
          );
        }
      }, 300);
      // --- Determine Peak Info based on response ---
      if (data.type === "day" && data.week_predictions && data.week_labels) {
        const maxIndex = data.week_predictions.indexOf(Math.max(...data.week_predictions));
        const peakDay = data.week_labels[maxIndex];
        const peakValue = data.week_predictions[maxIndex];
        setPeakInfo({
          type: "day",
          label: peakDay,
          value: peakValue.toLocaleString(undefined, { maximumFractionDigits: 0 }),
        });
      }
      else if (data.type === "hour" && data.hour_predictions && data.hour_labels) {
        const maxIndex = data.hour_predictions.indexOf(Math.max(...data.hour_predictions));
        const label =
          maxIndex === 0 ? "12 AM" :
            maxIndex < 12 ? `${maxIndex} AM` :
              maxIndex === 12 ? "12 PM" : `${maxIndex - 12} PM`;
        const peakValue = data.hour_predictions[maxIndex];
        setPeakInfo({
          type: "hour",
          label,
          value: peakValue.toLocaleString(undefined, { maximumFractionDigits: 0 }),
        });
      }


    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setBgActive(false), 1500);
    }

  };

  const hourOptions = Array.from({ length: 24 }, (_, i) => {
    const label =
      i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`;
    return { value: i, label };
  });

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative text-white overflow-hidden"
      style={{
        backgroundImage: `url(${dashboardBg})`,
        backgroundSize: bgActive ? "102%" : "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transition: "background-size 2.5s ease-in-out, opacity 2s ease-in-out",
        opacity: bgActive ? 0.95 : 1,
      }}
    >
      <div className="absolute inset-0 bg-[#0f534f]/80"></div>

      <section className="relative z-10 pt-28 pb-16 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-orange-400 drop-shadow-lg">
            Bike Demand Predictor
          </h1>
          <p className="text-white/90 text-lg mt-2">
            Forecast <span className="text-orange-400 font-semibold">bike-sharing demand</span> with weather and event factors — powered by{" "}
            <b>RideWise AI</b>.
          </p>
        </div>

        {/* Mode Switch */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setMode("manual")}
            className={`px-4 py-2 rounded-lg ${mode === "manual" ? "bg-orange-500 text-white" : "bg-white/10 text-gray-200"
              }`}
          >
            Manual Input
          </button>
          <button
            onClick={() => setMode("auto")}
            className={`px-4 py-2 rounded-lg ${mode === "auto" ? "bg-orange-500 text-white" : "bg-white/10 text-gray-200"
              }`}
          >
            Auto Fetch
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="glass bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-xl p-8 space-y-7 transition-all hover:shadow-orange-500/20">

          {/* keep all selects same */}
          <CustomSelect
            label="Prediction Type"
            value={modelType}
            onChange={setModelType}
            options={[
              { value: "day", label: "Daily" },
              { value: "hour", label: "Hourly" },
            ]}
          />

          <div>
            <label className="block text-sm font-semibold mb-1 text-orange-300">Date</label>
            <Flatpickr
              value={date}
              onChange={(d) => setDate(d[0])}
              className="w-full rounded-lg bg-white/15 p-2 focus:ring-2 focus:ring-orange-400 text-white"
              options={{ dateFormat: "Y-m-d" }}
            />
          </div>
          {modelType === "hour" && (
            <CustomSelect label="Hour" value={hour} onChange={setHour} options={hourOptions} />
          )}
          {mode === "auto" && (
            <>
              <input
                type="text"
                placeholder="Enter City Name"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300"
              />
              <button
                type="button"
                onClick={fetchWeather}
                disabled={fetching}
                className="w-full py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold"
              >
                {fetching ? "Fetching..." : "Fetch Weather Data"}
              </button>
            </>
          )}

          <CustomSelect
            label="Season"
            value={season}
            onChange={setSeason}
            options={[
              { value: "1", label: "Spring" },
              { value: "2", label: "Summer" },
              { value: "3", label: "Fall" },
              { value: "4", label: "Winter" },
            ]}
          />

          <CustomSelect
            label="Weather Situation"
            value={weathersit}
            onChange={setWeathersit}
            options={weatherOptions}
          />



          {[
            ["Temperature (°C)", temp, setTemp, -8, 39, "°C"],
            ["Feeling Temperature (°C)", atemp, setAtemp, -16, 50, "°C"],
            ["Humidity (%)", hum, setHum, 0, 100, "%"],
            ["Windspeed (km/h)", windspeed, setWindspeed, 0, 67, "km/h"],
          ].map(([label, val, setter, min, max, unit], i) => (
            <div key={i}>
              <label className="block text-sm font-semibold mb-1 text-orange-300">{label}</label>
              <input
                type="range"
                min={min}
                max={max}
                step="0.5"
                value={val}
                onChange={(e) => setter(e.target.value)}
                className="w-full accent-orange-500 cursor-pointer"
              />
              <div className="text-xs text-white/70 mt-1">
                {val} {unit}
              </div>
            </div>
          ))}


          <div className="flex justify-between gap-4">
            <CustomSelect
              label="Holiday?"
              value={holiday}
              onChange={setHoliday}
              options={[
                { value: "0", label: "No" },
                { value: "1", label: "Yes" },
              ]}
              width="w-1/2"
            />
            <CustomSelect
              label="Working Day?"
              value={workingday}
              onChange={setWorkingday}
              options={[
                { value: "0", label: "No" },
                { value: "1", label: "Yes" },
              ]}
              width="w-1/2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg transition-transform hover:scale-[1.02] flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Predicting...
              </>
            ) : (
              "Predict"
            )}
          </button>
        </form>

        {/* RESULT SECTION */}
        {/* RESULT SECTION */}
        <div className="mt-12">
          <div className="glass bg-white/10 border border-white/20 p-8 rounded-2xl backdrop-blur-md shadow-md">
            <h2 className="text-lg font-semibold mb-3 text-orange-300">Prediction Result</h2>
            <div className="min-h-[120px] flex items-center justify-center border-2 border-dashed border-white/30 rounded-lg text-white/70 text-sm">
              {error ? (
                <p className="text-red-400 font-medium">{error}</p>
              ) : !result ? (
                "No prediction yet"
              ) : (
                <div className="text-center fade-in">
                  <p className="text-sm text-gray-300">Predicted Count</p>
                  <p className="text-4xl font-extrabold text-orange-400 drop-shadow-lg">
                    {Number(result.current_prediction).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    ({result.type === "day" ? "Daily Prediction" : "Hourly Prediction"})
                  </p>
                </div>
              )}
            </div>

            {/* Chart */}
            {result && (
              <div className="mt-4">
                <canvas ref={result.type === "day" ? weekChartRef : hoursChartRef}></canvas>
              </div>
            )}

            {/* Peak Info */}
            {peakInfo && (
              <>
                <h2 className="text-lg font-semibold mt-8 mb-3 text-orange-300">
                  Peak {peakInfo.type === "day" ? "Day" : "Hour"}
                </h2>
                <div className="min-h-[120px] flex flex-col items-center justify-center border-2 border-dashed border-white/30 rounded-lg text-white/70 text-sm">
                  {peakInfo.type === "day" ? (
                    <div className="text-center fade-in">
                      <CalendarDays className="mx-auto text-orange-400 w-6 h-6 mb-2" />
                      <p className="text-sm text-gray-300">Peak Day</p>
                      <p className="text-2xl font-semibold text-orange-400 mt-1">
                        {peakInfo.label} ({peakInfo.value})
                      </p>
                    </div>
                  ) : (
                    <div className="text-center fade-in">
                      <AlarmClock className="mx-auto text-orange-400 w-6 h-6 mb-2" />
                      <p className="text-sm text-gray-300">Peak Hour</p>
                      <p className="text-2xl font-semibold text-orange-400 mt-1">
                        {peakInfo.label} ({peakInfo.value})
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

          </div>
        </div>


      </section>
    </div>
  );
};

// --- Custom Select ---
const CustomSelect = ({ label, value, onChange, options, width = "w-full" }) => (
  <div className={`${width}`}>
    <label className="block text-sm font-semibold mb-1 text-orange-300">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full bg-white/15 border border-white/20 rounded-lg p-2 text-white pr-8 focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#0f534f] text-white">
            {opt.label}
          </option>
        ))}
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-300">▼</span>
    </div>
  </div>
);

export default Predictor;
