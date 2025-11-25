import { useEffect, useState } from "react";
import axios from "axios";
import {
  Area, AreaChart,
  LineChart, Line, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  Bike, BarChart3, Rocket, Sun, TrendingUp, CalendarDays,
  Gauge, LineChart as LineChartIcon, Building,
  AlertTriangle
} from "lucide-react";


const Insights = () => {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/predictor/insights/`);
        setInsights(response.data);
      } catch (err) {
        console.error("Error fetching insights:", err);
      }
    };
    fetchInsights();
  }, []);

  if (!insights) return <div className="p-10 text-xl">Loading insights...</div>;

  const trends = insights.trends;
  return (
    <div className="relative min-h-screen pt-24 pb-16 px-8 overflow-hidden">
      {/* Dynamic ambient gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-emerald-50 to-cyan-100"></div>

      {/* Soft moving light spots */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_30%,rgba(99,102,241,0.12),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(16,185,129,0.12),transparent_60%)] animate-pulse-slow"></div>

      {/* Content wrapper */}
      <div className="relative z-10">
        <h1 className="flex justify-center items-center gap-3 text-5xl font-extrabold mb-6 text-center bg-gradient-to-r from-indigo-700 via-emerald-600 to-blue-700 bg-clip-text text-transparent tracking-tight drop-shadow-md">
          <Bike className="w-12 h-12 text-indigo-600" />
          Ridewise Insights
        </h1>

        <p className="text-center text-gray-700 text-lg mb-10 max-w-3xl mx-auto">
          A deep dive into patterns, trends, and factors driving your bike rental demand.
        </p>

        {/* Averages */}
        {/* Averages Section */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-6 rounded-2xl shadow-md mt-6">
          <h2 className="flex items-center gap-2 text-3xl font-bold mb-4 text-emerald-700">
            <BarChart3 className="w-8 h-8 text-emerald-600" />
            Average Rentals Overview
          </h2>
          <p className="text-gray-600 mb-6">
            Average number of rides across different time scales. Useful for <b>capacity planning</b> and <b>baseline performance</b>.
          </p>

          {/* Averages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* Daily */}
            <div className="p-5 bg-gradient-to-r from-green-100 to-green-200 rounded-xl shadow text-center hover:scale-105 transition-transform duration-300">
              <h3 className="text-lg font-semibold text-green-700">Daily</h3>
              <p className="text-3xl font-bold text-green-900 mt-2">
                {insights.averages.avg_daily.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Avg rides per day</p>
            </div>

            {/* Hourly */}
            <div className="p-5 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-xl shadow text-center hover:scale-105 transition-transform duration-300">
              <h3 className="text-lg font-semibold text-emerald-700">Hourly</h3>
              <p className="text-3xl font-bold text-emerald-900 mt-2">
                {insights.averages.avg_hourly.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Avg rides per hour</p>
            </div>

            {/* Weekly */}
            <div className="p-5 bg-gradient-to-r from-teal-100 to-teal-200 rounded-xl shadow text-center hover:scale-105 transition-transform duration-300">
              <h3 className="text-lg font-semibold text-teal-700">Weekly</h3>
              <p className="text-3xl font-bold text-teal-900 mt-2">
                {insights.averages.avg_weekly.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Avg rides per week</p>
            </div>

            {/* Monthly */}
            <div className="p-5 bg-gradient-to-r from-lime-100 to-lime-200 rounded-xl shadow text-center hover:scale-105 transition-transform duration-300">
              <h3 className="text-lg font-semibold text-lime-700">Monthly</h3>
              <p className="text-3xl font-bold text-lime-900 mt-2">
                {insights.averages.avg_monthly.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Avg rides per month</p>
            </div>

            {/* Yearly */}
            <div className="p-5 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-xl shadow text-center hover:scale-105 transition-transform duration-300">
              <h3 className="text-lg font-semibold text-yellow-700">Yearly</h3>
              <p className="text-3xl font-bold text-yellow-900 mt-2">
                {insights.averages.avg_yearly.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Avg rides per year</p>
            </div>
          </div>
        </div>


        {/* Peaks Section */}
        <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-8 rounded-2xl shadow-lg mt-10 text-white overflow-hidden">
          {/* Subtle glowing background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05),_transparent_70%)]"></div>

          <h2 className="flex items-center justify-center gap-2 text-3xl font-bold mb-4 text-center text-purple-300 drop-shadow-lg">
            <Rocket className="w-7 h-7 text-purple-300" />
            Peak Rental Insights
          </h2>

          <p className="text-purple-200 text-center mb-8">
            Discover when demand surges to its highest — optimize your availability and operations.
          </p>

          {/* Peak metrics grid */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 z-10">
            {/* Peak Hour */}
            <div className="group p-6 rounded-xl bg-white/10 backdrop-blur-md border border-purple-400/30 hover:border-purple-400/80 hover:scale-105 transition-all duration-300 shadow-lg text-center">
              <h3 className="text-lg font-semibold text-purple-300 mb-1">Peak Hour</h3>
              <p className="text-4xl font-bold text-white group-hover:text-purple-200 transition">
                {insights.peaks.peak_hour}:00
              </p>
              <p className="text-sm text-purple-300 mt-2">Busiest hour of the day</p>
            </div>

            {/* Peak Day of Week */}
            <div className="group p-6 rounded-xl bg-white/10 backdrop-blur-md border border-indigo-400/30 hover:border-indigo-400/80 hover:scale-105 transition-all duration-300 shadow-lg text-center">
              <h3 className="text-lg font-semibold text-indigo-300 mb-1">Peak Day</h3>
              <p className="text-4xl font-bold text-white group-hover:text-indigo-200 transition">
                {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][insights.peaks.peak_day_of_week]}
              </p>
              <p className="text-sm text-indigo-300 mt-2">Highest demand weekday</p>
            </div>

            {/* Peak Day of Month */}
            <div className="group p-6 rounded-xl bg-white/10 backdrop-blur-md border border-pink-400/30 hover:border-pink-400/80 hover:scale-105 transition-all duration-300 shadow-lg text-center">
              <h3 className="text-lg font-semibold text-pink-300 mb-1">Peak Date</h3>
              <p className="text-4xl font-bold text-white group-hover:text-pink-200 transition">
                {insights.peaks.peak_day_of_month}
              </p>
              <p className="text-sm text-pink-300 mt-2">Busiest calendar date</p>
            </div>

            {/* Peak Month */}
            <div className="group p-6 rounded-xl bg-white/10 backdrop-blur-md border border-yellow-400/30 hover:border-yellow-400/80 hover:scale-105 transition-all duration-300 shadow-lg text-center">
              <h3 className="text-lg font-semibold text-yellow-300 mb-1">Peak Month</h3>
              <p className="text-4xl font-bold text-white group-hover:text-yellow-200 transition">
                {[
                  "January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"
                ][insights.peaks.peak_month_of_year - 1]}
              </p>
              <p className="text-sm text-yellow-300 mt-2">Most active month</p>
            </div>
          </div>

          {/* Subtle decorative pulse glow */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        </div>

        {/* Best Conditions for Rentals */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl shadow-md mt-10">
          <h2 className="flex items-center gap-2 text-3xl font-bold mb-4 text-indigo-700">
            <Sun className="w-8 h-8 text-indigo-600" />
            Best Conditions for Rentals
          </h2>
          <p className="text-gray-600 mb-6">
            Optimal environmental and seasonal conditions where bike rental demand peaks.
          </p>

          {/* Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Best Season */}
            <div className="p-5 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-xl shadow text-center">
              <h3 className="text-lg font-semibold text-yellow-700">Best Season</h3>
              <p className="text-2xl font-bold text-yellow-900 mt-2">
                {insights.best_conditions.best_season === 1
                  ? "Spring"
                  : insights.best_conditions.best_season === 2
                    ? "Summer"
                    : insights.best_conditions.best_season === 3
                      ? "Fall"
                      : "Winter"}
              </p>
            </div>

            {/* Best Weather */}
            <div className="p-5 bg-gradient-to-r from-sky-100 to-sky-200 rounded-xl shadow text-center">
              <h3 className="text-lg font-semibold text-sky-700">Best Weather</h3>
              <p className="text-2xl font-bold text-sky-900 mt-2">
                {insights.best_conditions.best_weather === 1
                  ? "Clear"
                  : insights.best_conditions.best_weather === 2
                    ? "Cloudy"
                    : "Rainy"}
              </p>
            </div>

            {/* Best Temperature */}
            <div className="p-5 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl shadow text-center">
              <h3 className="text-lg font-semibold text-orange-700">Best Temperature Range</h3>
              <p className="text-2xl font-bold text-orange-900 mt-2">
                {insights.best_conditions.best_temperature_range}
              </p>
            </div>

            {/* Feels Like (Atemp) */}
            <div className="p-5 bg-gradient-to-r from-rose-100 to-rose-200 rounded-xl shadow text-center">
              <h3 className="text-lg font-semibold text-rose-700">Best “Feels Like” (Atemp)</h3>
              <p className="text-2xl font-bold text-rose-900 mt-2">
                {insights.best_conditions.best_atemp_range}
              </p>
            </div>

            {/* Humidity */}
            <div className="p-5 bg-gradient-to-r from-cyan-100 to-cyan-200 rounded-xl shadow text-center">
              <h3 className="text-lg font-semibold text-cyan-700">Best Humidity Range</h3>
              <p className="text-2xl font-bold text-cyan-900 mt-2">
                {insights.best_conditions.best_humidity_range}
              </p>
            </div>

            {/* Windspeed */}
            <div className="p-5 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-xl shadow text-center">
              <h3 className="text-lg font-semibold text-indigo-700">Best Windspeed Range</h3>
              <p className="text-2xl font-bold text-indigo-900 mt-2">
                {insights.best_conditions.best_windspeed_range}
              </p>
            </div>
          </div>

          {/* Best Feature Combinations */}
          <div className="mt-8 bg-white p-5 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-indigo-700 mb-2">
              🌈 Best Feature Combinations
            </h3>
            <div className="flex flex-wrap gap-3">
              {insights.best_conditions.best_feature_combinations.map((combo, index) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-gradient-to-r from-green-100 to-emerald-200 rounded-lg text-green-800 text-sm font-semibold shadow-sm"
                >
                  {Object.entries(combo)
                    .map(([key, val]) => `${key}: ${val}`)
                    .join(", ")}
                </span>
              ))}
            </div>
          </div>
        </div>
        {/* RENTAL DEMAND TRENDS */}
        <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8 rounded-2xl shadow-md mt-10">
          <h2 className="flex items-center justify-center gap-2 text-3xl font-bold mb-2 text-slate-800 text-center">
            <TrendingUp className="w-8 h-8 text-slate-700" />
            Rental Demand Trends
          </h2>

          <p className="text-gray-600 text-center mb-10">
            Visualize rental demand variations across time — hour, week, month, and beyond.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Hourly Trend */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-blue-700 mb-3">⏰ Hourly Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={trends.hourly_trend.map((cnt, hr) => ({ hr, cnt }))}
                >
                  <defs>
                    <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hr" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="cnt"
                    stroke="#2563EB"
                    fillOpacity={1}
                    fill="url(#colorHr)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Weekly Trend */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-5 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-emerald-700 mb-3">📅 Weekly Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={trends.weekly_trend.map((cnt, day) => ({
                    day,
                    cnt,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="day"
                    tickFormatter={(d) =>
                      ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d]
                    }
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(d) =>
                      ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d]
                    }
                  />
                  <Bar dataKey="cnt" fill="#10B981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Trend */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-100 p-5 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-amber-700 mb-3">🗓 Monthly Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={trends.monthly_trend.map((cnt, month) => ({
                    month: month + 1,
                    cnt,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(m) =>
                      ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m - 1]
                    }
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(m) =>
                      ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m - 1]
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="cnt"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Date Trend (1–31) */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-100 p-5 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-pink-700 mb-3">📆 Monthly Date Trend (1–31)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={trends.monthly_date_trend.map((cnt, day) => ({
                    day: day + 1,
                    cnt,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="day"
                    label={{ value: "Day of Month", position: "insideBottom", offset: -5 }}
                  />
                  <YAxis />
                  <Tooltip labelFormatter={(v) => `Day ${v}`} />
                  <Line
                    type="monotone"
                    dataKey="cnt"
                    stroke="#EC4899"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Weekly Number Trend (Week 1–52) */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-100 p-5 rounded-xl shadow hover:shadow-lg transition lg:col-span-2">
              <h3 className="text-lg font-semibold text-indigo-700 mb-3">📊 Weekly Number Trend (Week 1–52)</h3>
              {trends.weekly_number_trend && trends.weekly_number_trend.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={trends.weekly_number_trend.map((cnt, week) => ({
                      week: week + 1,
                      cnt,
                    }))}
                  >
                    <defs>
                      <linearGradient id="colorWeek" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip labelFormatter={(v) => `Week ${v}`} />
                    <Area
                      type="monotone"
                      dataKey="cnt"
                      stroke="#8B5CF6"
                      fillOpacity={1}
                      fill="url(#colorWeek)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500">
                  No weekly data available (missing ‘week’ column in CSV).
                </p>
              )}
            </div>
          </div>
        </div>

        {/* IMPACT ON RENTALS SECTION */}
        <div className="relative mt-12 bg-gradient-to-br from-slate-50 via-white to-gray-100 p-8 rounded-2xl shadow-md">
          <h2 className="flex items-center justify-center gap-2 text-3xl font-bold mb-2 text-slate-800 text-center">
            <Gauge className="w-8 h-8 text-slate-700" />
            Impact on Rentals
          </h2>

          <p className="text-gray-600 text-center mb-10">
            Analyze how each condition influences ride demand — from weather and temperature to workdays and weekends.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

            {/* Season Impact */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-blue-700 mb-3">🌦 Season Impact</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={Object.entries(insights?.impact?.season_impact || {}).map(([key, cnt]) => {
                    const seasonNames = {
                      "1": "Spring",
                      "2": "Summer",
                      "3": "Fall",
                      "4": "Winter",
                    };
                    return {
                      key: seasonNames[key] || key,
                      cnt: Math.round(cnt),
                    };
                  })}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="key" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cnt" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>


            {/* Weather Impact */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-5 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-emerald-700 mb-3">☀️ Weather Impact</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={Object.entries(insights?.impact?.weather_impact || {}).map(([key, cnt]) => {
                    const weatherNames = {
                      "1": "Clear/Few Clouds",
                      "2": "Mist/Cloudy",
                      "3": "Light Snow/Rain",
                    };
                    return {
                      key: weatherNames[key] || key,
                      cnt: Math.round(cnt),
                    };
                  })}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="key" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cnt" fill="#10B981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>


            {/* Temperature Impact */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-100 p-5 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-amber-700 mb-3">🌡 Temperature Impact</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart
                  data={Object.entries(insights.impact.temperature_impact).map(([key, cnt]) => ({
                    key,
                    cnt: Math.round(cnt),
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="key" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="cnt" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Feels Like (Atemp) Impact */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-100 p-5 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-pink-700 mb-3">🌤 “Feels Like” Temp Impact</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart
                  data={Object.entries(insights.impact.atemp_impact).map(([key, cnt]) => ({
                    key,
                    cnt: Math.round(cnt),
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="key" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="cnt" stroke="#EC4899" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Humidity Impact */}
            <div className="bg-gradient-to-br from-cyan-50 to-teal-100 p-5 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-cyan-700 mb-3">💧 Humidity Impact</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart
                  data={Object.entries(insights.impact.humidity_impact).map(([key, cnt]) => ({
                    key,
                    cnt: Math.round(cnt),
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="key" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="cnt" stroke="#06B6D4" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Windspeed Impact */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-100 p-5 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-indigo-700 mb-3">🌬 Windspeed Impact</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart
                  data={Object.entries(insights.impact.windspeed_impact).map(([key, cnt]) => ({
                    key,
                    cnt: Math.round(cnt),
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="key" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="cnt" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>


            {/* Workingday Impact */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-100 p-5 rounded-xl shadow hover:shadow-lg transition">
              <div className="flex items-center gap-2 mb-3">
                <Building className="text-yellow-700 w-5 h-5" />
                <h3 className="text-lg font-semibold text-yellow-700">
                  Workingday vs Non-Working
                </h3>
              </div>

              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={Object.entries(insights?.impact?.workingday_impact || {}).map(
                    ([key, cnt]) => ({
                      key,
                      cnt: Math.round(cnt),
                    })
                  )}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="key" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cnt" fill="#EAB308" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Holiday vs Non-Holiday Impact */}
            {insights?.impact?.holiday_impact && (
              <div className="bg-gradient-to-br from-red-50 to-rose-100 p-5 rounded-xl shadow hover:shadow-lg transition">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-rose-700 mb-3">
                  <CalendarDays className="w-5 h-5 text-rose-600" />
                  Holiday vs Non-Holiday
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={Object.entries(insights.impact.holiday_impact).map(([key, cnt]) => ({
                      key: key === "0" ? "Non-Holiday" : "Holiday",
                      cnt: Math.round(cnt),
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="key" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value.toLocaleString()} rentals`]}
                    />
                    <Bar dataKey="cnt" fill="#F43F5E" radius={[6, 6, 0, 0]}>
                      <Cell key="non" fill="#FDA4AF" />
                      <Cell key="hol" fill="#F43F5E" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}


            {/* Weekday vs Weekend */}
            {/* Weekday vs Weekend */}
            <div className="bg-gradient-to-br from-green-50 to-teal-100 p-5 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-teal-700 mb-3">
                <CalendarDays className="w-5 h-5 text-teal-600" />
                Weekday vs Weekend
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={Object.entries(insights.impact.weekday_vs_weekend).map(([key, cnt]) => ({
                    key,
                    cnt: Math.round(cnt),
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="key" />
                  <YAxis />
                  <Tooltip formatter={(v) => [`${v.toLocaleString()} rentals`]} />
                  <Bar dataKey="cnt" radius={[6, 6, 0, 0]}>
                    <Cell key="weekday" fill="#10B981" />
                    <Cell key="weekend" fill="#F43F5E" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Month Period Impact */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-100 p-5 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-amber-700 mb-3">
                🗓 Month Period Impact
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={Object.entries(insights.impact.month_period_impact).map(([key, cnt]) => ({
                    key,
                    cnt: Math.round(cnt),
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="key" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cnt" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Weather Impact (Hourly Average) */}
            <div className="bg-gradient-to-br from-sky-50 to-blue-100 p-5 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-sky-700 mb-3">
                🌦 Hourly Weather Impact
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={Object.entries(insights.impact.weather_impact_hour).map(([key, cnt]) => ({
                    key:
                      key === "1"
                        ? "Clear"
                        : key === "2"
                          ? "Cloudy"
                          : key === "3"
                            ? "Light Rain"
                            : "Heavy Rain",
                    cnt: Math.round(cnt),
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="key" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cnt" fill="#38BDF8" radius={[6, 6, 0, 0]}>
                    <Cell fill="#60A5FA" /> {/* Clear */}
                    <Cell fill="#A5B4FC" /> {/* Cloudy */}
                    <Cell fill="#F472B6" /> {/* Light Rain */}
                    <Cell fill="#94A3B8" /> {/* Heavy Rain */}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>


          </div>

          {/* Small insight summary */}
          <div className="text-center text-gray-600 text-sm mt-8 italic">
            Hover over each chart to explore how that factor changes rental counts —
            useful for <b>forecasting, staffing, and pricing strategies.</b>
          </div>
        </div>



        {/* FEATURE IMPORTANCE OVERVIEW */}
        <div className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950 p-8 rounded-2xl shadow-xl mt-12 overflow-hidden">
          {/* Glow Orbs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>

          <h2 className="flex items-center justify-center gap-2 text-3xl font-bold mb-4 text-center text-indigo-300 drop-shadow">
            <LineChartIcon className="w-8 h-8 text-indigo-300" />
            Feature Importance: How Each Factor Impacts Rentals
          </h2>

          <p className="text-slate-400 text-center mb-8">
            Correlation strength between each feature and total rentals (<b>cnt</b>).
            <br />
            Positive = more rides; Negative = fewer rides.
          </p>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={Object.entries(insights.feature_importance).map(([feature, value]) => ({
                feature,
                value,
              }))}
              layout="vertical"
              margin={{ top: 20, right: 50, left: 60, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" domain={[-1, 1]} tick={{ fill: "#9CA3AF" }} />
              <YAxis
                dataKey="feature"
                type="category"
                tick={{ fill: "#E5E7EB", fontSize: 12 }}
                width={110}
              />
              <Tooltip
                formatter={(v) => [`${v}`, "Correlation"]}
                labelStyle={{ color: "#E5E7EB" }}
                contentStyle={{
                  backgroundColor: "rgba(17, 24, 39, 0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                {Object.entries(insights.feature_importance).map(([f, v], i) => (
                  <Cell
                    key={`cell-${i}`}
                    fill={
                      v >= 0
                        ? `rgba(34,197,94,${0.5 + Math.min(Math.abs(v), 1) * 0.5})` // green glow intensity by correlation strength
                        : `rgba(239,68,68,${0.5 + Math.min(Math.abs(v), 1) * 0.5})` // red glow intensity
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Color legend */}
          <div className="flex justify-center mt-6 space-x-6 text-sm text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-green-400"></span>
              <span>Positive correlation (increases rentals)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-400"></span>
              <span>Negative correlation (decreases rentals)</span>
            </div>
          </div>

          {/* Insight summary */}
          <div className="mt-6 text-center text-slate-300 italic text-sm">
            {(() => {
              const sorted = Object.entries(insights.feature_importance).sort(
                (a, b) => Math.abs(b[1]) - Math.abs(a[1])
              );
              const topFeature = sorted[0][0];
              const topValue = sorted[0][1];
              const direction = topValue > 0 ? "positively" : "negatively";
              return (
                <>
                  The most impactful feature is{" "}
                  <b className="text-indigo-300">{topFeature}</b>, which is{" "}
                  <b>{direction}</b> correlated with rental demand (
                  {topValue.toFixed(2)}).
                </>
              );
            })()}
          </div>
        </div>

        {/* Worst Conditions for Rentals */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-100 p-6 rounded-2xl shadow-md mt-10">
          <h2 className="flex items-center gap-2 text-3xl font-bold mb-4 text-slate-700">
            <AlertTriangle className="w-8 h-8 text-slate-600" />
            Worst Conditions for Rentals
          </h2>
          <p className="text-gray-600 mb-6">
            Environmental and seasonal conditions where rental demand drops significantly.
          </p>

          {/* Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Worst Season */}
            <div className="p-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl shadow text-center">
              <h3 className="text-lg font-semibold text-gray-700">Worst Season</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {insights.worst_conditions.worst_season === 1
                  ? "Spring"
                  : insights.worst_conditions.worst_season === 2
                    ? "Summer"
                    : insights.worst_conditions.worst_season === 3
                      ? "Fall"
                      : "Winter"}
              </p>
            </div>

            {/* Worst Weather */}
            <div className="p-5 bg-gradient-to-r from-slate-300 to-slate-400 rounded-xl shadow text-center">
              <h3 className="text-lg font-semibold text-slate-700">Worst Weather</h3>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {insights.worst_conditions.worst_weather === 1
                  ? "Clear"
                  : insights.worst_conditions.worst_weather === 2
                    ? "Cloudy"
                    : "Rainy"}
              </p>
            </div>

            {/* Worst Temperature */}
            <div className="p-5 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl shadow text-center">
              <h3 className="text-lg font-semibold text-blue-700">Worst Temperature Range</h3>
              <p className="text-2xl font-bold text-blue-900 mt-2">
                {insights.worst_conditions.worst_temperature_range}
              </p>
            </div>

            {/* Worst Humidity */}
            <div className="p-5 bg-gradient-to-r from-cyan-100 to-cyan-200 rounded-xl shadow text-center">
              <h3 className="text-lg font-semibold text-cyan-700">Worst Humidity Range</h3>
              <p className="text-2xl font-bold text-cyan-900 mt-2">
                {insights.worst_conditions.worst_humidity_range}
              </p>
            </div>

            {/* Worst Windspeed */}
            <div className="p-5 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-xl shadow text-center">
              <h3 className="text-lg font-semibold text-indigo-700">Worst Windspeed Range</h3>
              <p className="text-2xl font-bold text-indigo-900 mt-2">
                {insights.worst_conditions.worst_windspeed_range}
              </p>
            </div>
          </div>

          {/* Bad Feature Combinations */}
          <div className="mt-8 bg-white p-5 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">⚡ Bad Feature Combinations</h3>
            <div className="flex flex-wrap gap-3">
              {insights.worst_conditions.bad_feature_combinations.map((combo, index) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg text-gray-800 text-sm font-semibold shadow-sm"
                >
                  {Object.entries(combo)
                    .map(([key, val]) => `${key}: ${val}`)
                    .join(", ")}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Insights;
