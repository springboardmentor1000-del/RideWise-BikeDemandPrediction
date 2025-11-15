import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import MetricCard from './components/MetricCard';
import WeatherBackground from './components/WeatherBackground';
import ridewiseLogo from './assets/ridewise_logo.png';

// Weather Icon Component
const WeatherIcon = ({ condition, size = 60 }) => {
  const icons = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Smoke': '🌫️',
    'Haze': '🌫️',
    'Dust': '🌫️',
    'Fog': '🌫️',
    'Sand': '🌫️',
    'Ash': '🌫️',
    'Squall': '💨',
    'Tornado': '🌪️'
  };

  return (
    <span style={{ fontSize: `${size}px`, display: 'inline-block' }}>
      {icons[condition] || '🌤️'}
    </span>
  );
};

function Dashboard() {
  const navigate = useNavigate();
  
  // User state
  const [userName, setUserName] = useState('');
  
  // Prediction states
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('');
  const [holiday, setHoliday] = useState(0);
  const [weathersit, setWeathersit] = useState(1);
  const [temp, setTemp] = useState('');
  const [atemp, setAtemp] = useState('');
  const [hum, setHum] = useState('');
  const [windspeed, setWindspeed] = useState('');
  
  // Results
  const [dailyPrediction, setDailyPrediction] = useState(null);
  const [hourlyPrediction, setHourlyPrediction] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');
  
  // Prediction history for graphs
  const [predictionHistory, setPredictionHistory] = useState({
    daily: [],
    hourly: []
  });
  
  // Weather
  const [weatherCondition, setWeatherCondition] = useState('clear');
  const [weatherData, setWeatherData] = useState(null);
  const location = 'Pune, India';
  
  // Active tab
  const [activeTab, setActiveTab] = useState('predict');

  // Analytics data
  const [analyticsData, setAnalyticsData] = useState({
    weeklyTrend: [
      { day: 'Mon', rides: 4200, predicted: 4100 },
      { day: 'Tue', rides: 3800, predicted: 3900 },
      { day: 'Wed', rides: 4500, predicted: 4400 },
      { day: 'Thu', rides: 4100, predicted: 4200 },
      { day: 'Fri', rides: 5200, predicted: 5100 },
      { day: 'Sat', rides: 6800, predicted: 6700 },
      { day: 'Sun', rides: 6200, predicted: 6300 },
    ],
    hourlyPattern: [
      { hour: '0-3', rides: 120 },
      { hour: '4-7', rides: 450 },
      { hour: '8-11', rides: 2800 },
      { hour: '12-15', rides: 3200 },
      { hour: '16-19', rides: 4500 },
      { hour: '20-23', rides: 1800 },
    ],
    weatherImpact: [
      { condition: 'Clear', rides: 5200, color: '#fbbf24' },
      { condition: 'Cloudy', rides: 4800, color: '#94a3b8' },
      { condition: 'Rain', rides: 3200, color: '#3b82f6' },
      { condition: 'Heavy Rain', rides: 1800, color: '#1e40af' },
    ],
    monthlyStats: {
      totalRides: 127500,
      avgDaily: 4250,
      peakDay: 'Saturday',
      accuracy: 94.5,
    }
  });

  const checkApiStatus = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/');
      if (response.ok) {
        setApiStatus('connected');
      } else {
        setApiStatus('disconnected');
      }
    } catch (error) {
      setApiStatus('disconnected');
    }
  };

  const fetchWeather = useCallback(async () => {
    try {
      const apiKey = '195d805cfc0441afa8c0c4f297c5e458';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();
      if (data.weather && data.weather[0]) {
        const condition = data.weather[0].main.toLowerCase();
        setWeatherCondition(condition);
        setWeatherData({
          temp: Math.round(data.main.temp),
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
          condition: data.weather[0].description,
        });
        
        // Auto-fill weather inputs
        setTemp((data.main.temp / 41).toFixed(2)); // Normalized
        setAtemp((data.main.feels_like / 50).toFixed(2)); // Normalized
        setHum((data.main.humidity / 100).toFixed(2)); // Normalized
        setWindspeed((data.wind.speed / 67).toFixed(2)); // Normalized
        
        // Set weather situation
        if (condition.includes('rain')) setWeathersit(3);
        else if (condition.includes('cloud')) setWeathersit(2);
        else setWeathersit(1);
      }
    } catch (error) {
      console.error('Weather fetch error:', error);
    }
  }, [location]);

  useEffect(() => {
    // Get user info
    if (auth.currentUser) {
      setUserName(auth.currentUser.displayName || 'User');
    }
    
    // Check API status
    checkApiStatus();
    
    // Fetch weather
    fetchWeather();
  }, [fetchWeather]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const predictDaily = async () => {
    if (!date || !temp || !atemp || !hum || !windspeed) {
      setStatusMessage('Please fill all fields for daily prediction');
      return;
    }
    
    setIsLoading(true);
    setStatusMessage('Analyzing data patterns...');
    
    try {
      const response = await fetch('http://127.0.0.1:5000/predict_day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          holiday: parseInt(holiday),
          weathersit: parseInt(weathersit),
          temp: parseFloat(temp),
          atemp: parseFloat(atemp),
          hum: parseFloat(hum),
          windspeed: parseFloat(windspeed)
        })
      });
      
      const data = await response.json();
      if (data.predicted_rides) {
        const prediction = Math.round(data.predicted_rides);
        setDailyPrediction(prediction);
        setStatusMessage('Daily prediction complete! 🎉');
        
        // Add to history
        setPredictionHistory(prev => ({
          ...prev,
          daily: [...prev.daily, {
            date,
            prediction,
            temp: parseFloat(temp),
            weather: weathersit,
            timestamp: new Date().toISOString()
          }].slice(-10) // Keep last 10 predictions
        }));
      }
    } catch (error) {
      setStatusMessage('Error connecting to prediction service');
      console.error('Prediction error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const predictHourly = async () => {
    if (!date || !hour || !temp || !atemp || !hum || !windspeed) {
      setStatusMessage('Please fill all fields for hourly prediction');
      return;
    }
    
    setIsLoading(true);
    setStatusMessage('Processing hourly data...');
    
    try {
      const response = await fetch('http://127.0.0.1:5000/predict_hour', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          hour: parseInt(hour),
          holiday: parseInt(holiday),
          weathersit: parseInt(weathersit),
          temp: parseFloat(temp),
          atemp: parseFloat(atemp),
          hum: parseFloat(hum),
          windspeed: parseFloat(windspeed)
        })
      });
      
      const data = await response.json();
      if (data.predicted_rides) {
        const prediction = Math.round(data.predicted_rides);
        setHourlyPrediction(prediction);
        setStatusMessage('Hourly prediction complete! 🚀');
        
        // Add to history
        setPredictionHistory(prev => ({
          ...prev,
          hourly: [...prev.hourly, {
            date,
            hour: parseInt(hour),
            prediction,
            temp: parseFloat(temp),
            weather: weathersit,
            timestamp: new Date().toISOString()
          }].slice(-20) // Keep last 20 predictions
        }));
      }
    } catch (error) {
      setStatusMessage('Error connecting to prediction service');
      console.error('Prediction error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get weather condition name from weathersit value
  const getWeatherCondition = (weathersit) => {
    const conditions = {
      1: 'Clear',
      2: 'Clouds',
      3: 'Rain',
      4: 'Thunderstorm'
    };
    return conditions[weathersit] || 'Clear';
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <WeatherBackground weatherCondition={weatherCondition} />
      
      {/* Navbar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '75px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '1.5rem',
              fontWeight: '900',
              color: '#1a1a2e',
            }}>
              <img src={ridewiseLogo} alt="RideWise" style={{ width: '40px', height: '40px' }} />
              <span style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>RideWise</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setActiveTab('predict')}
                style={{
                  padding: '12px 24px',
                  background: activeTab === 'predict' ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent',
                  border: 'none',
                  color: activeTab === 'predict' ? '#ffffff' : '#6b7280',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  boxShadow: activeTab === 'predict' ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none',
                }}
              >
                🎯 Predict
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                style={{
                  padding: '12px 24px',
                  background: activeTab === 'analytics' ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent',
                  border: 'none',
                  color: activeTab === 'analytics' ? '#ffffff' : '#6b7280',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  boxShadow: activeTab === 'analytics' ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none',
                }}
              >
                📊 Analytics
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '50px',
              fontSize: '0.85rem',
              fontWeight: '600',
              background: apiStatus === 'connected' ? 'linear-gradient(135deg, #10b981, #34d399)' : 'linear-gradient(135deg, #ef4444, #f87171)',
              color: '#ffffff',
              boxShadow: apiStatus === 'connected' ? '0 4px 15px rgba(16, 185, 129, 0.3)' : '0 4px 15px rgba(239, 68, 68, 0.3)',
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }} />
              {apiStatus === 'connected' ? 'API Connected' : 'API Offline'}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 16px',
              background: 'rgba(30, 41, 59, 0.9)',
              borderRadius: '10px',
              border: '1px solid #334155',
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '0.9rem',
              }}>
                {userName.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: '500' }}>
                {userName}
              </span>
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: '10px 20px',
                background: 'transparent',
                border: '1px solid #ef4444',
                color: '#ef4444',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div style={{
        paddingTop: '100px',
        paddingBottom: '40px',
        paddingLeft: '30px',
        paddingRight: '30px',
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', padding: '60px 20px 40px', color: 'white' }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            marginBottom: '15px',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          }}>
            <span style={{
              background: 'linear-gradient(45deg, #fff, #a8edea, #fed6e3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Ride Demand Intelligence</span>
          </h1>
          <p style={{ fontSize: '1.3rem', opacity: 0.95, marginBottom: '30px', fontWeight: '300' }}>
            AI-powered predictions for smarter transportation planning
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              padding: '12px 24px',
              borderRadius: '50px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
              🤖 ML Powered
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              padding: '12px 24px',
              borderRadius: '50px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
              ⚡ Real-time Data
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              padding: '12px 24px',
              borderRadius: '50px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
              📍 Location-based
            </div>
          </div>
        </div>

        {/* Metrics */}
        {(dailyPrediction || hourlyPrediction) && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '25px',
            marginBottom: '35px',
          }}>
            {dailyPrediction && (
              <MetricCard
                title="Daily Forecast"
                value={dailyPrediction}
                subtitle="Predicted rides for the day"
                type="daily"
              />
            )}
            {hourlyPrediction && (
              <MetricCard
                title="Hourly Forecast"
                value={hourlyPrediction}
                subtitle={`Rides at ${hour}:00`}
                type="hourly"
              />
            )}
            {dailyPrediction && hourlyPrediction && (
              <MetricCard
                title="Utilization"
                value={`${Math.round((hourlyPrediction / dailyPrediction) * 100)}%`}
                subtitle="Hourly vs Daily demand"
                type="tertiary"
              />
            )}
          </div>
        )}
        {/* Input Card */}
        {activeTab === 'predict' && (
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
            marginBottom: '30px',
          }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              marginBottom: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#1a1a2e',
            }}>
              🎯 Prediction Parameters
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '25px',
              marginBottom: '30px',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '0.95rem', fontWeight: '600', color: '#4a5568' }}>📅 Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{
                    padding: '16px 20px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    background: '#f7fafc',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s ease',
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '0.95rem', fontWeight: '600', color: '#4a5568' }}>🕐 Hour (0-23)</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  style={{
                    padding: '16px 20px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    background: '#f7fafc',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s ease',
                  }}
                  placeholder="Enter hour"
                />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '0.95rem', fontWeight: '600', color: '#4a5568' }}>🎉 Holiday</label>
                <select
                  value={holiday}
                  onChange={(e) => setHoliday(e.target.value)}
                  style={{
                    padding: '16px 20px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    background: '#f7fafc',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '0.95rem', fontWeight: '600', color: '#4a5568' }}>🌤️ Weather Situation</label>
                <select
                  value={weathersit}
                  onChange={(e) => setWeathersit(e.target.value)}
                  style={{
                    padding: '16px 20px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    background: '#f7fafc',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <option value="1">Clear/Partly Cloudy</option>
                  <option value="2">Mist/Cloudy</option>
                  <option value="3">Light Rain/Snow</option>
                  <option value="4">Heavy Rain/Snow</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '0.95rem', fontWeight: '600', color: '#4a5568' }}>🌡️ Temperature (normalized)</label>
                <input
                  type="number"
                  step="0.01"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  style={{
                    padding: '16px 20px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    background: '#f7fafc',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s ease',
                  }}
                  placeholder="0.0 to 1.0"
                />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '0.95rem', fontWeight: '600', color: '#4a5568' }}>🌡️ Feels Like (normalized)</label>
                <input
                  type="number"
                  step="0.01"
                  value={atemp}
                  onChange={(e) => setAtemp(e.target.value)}
                  style={{
                    padding: '16px 20px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    background: '#f7fafc',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s ease',
                  }}
                  placeholder="0.0 to 1.0"
                />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '0.95rem', fontWeight: '600', color: '#4a5568' }}>💧 Humidity (normalized)</label>
                <input
                  type="number"
                  step="0.01"
                  value={hum}
                  onChange={(e) => setHum(e.target.value)}
                  style={{
                    padding: '16px 20px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    background: '#f7fafc',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s ease',
                  }}
                  placeholder="0.0 to 1.0"
                />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '0.95rem', fontWeight: '600', color: '#4a5568' }}>💨 Wind Speed (normalized)</label>
                <input
                  type="number"
                  step="0.01"
                  value={windspeed}
                  onChange={(e) => setWindspeed(e.target.value)}
                  style={{
                    padding: '16px 20px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    background: '#f7fafc',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s ease',
                  }}
                  placeholder="0.0 to 1.0"
                />
              </div>
            </div>

            {/* Weather Info Card */}
            {weatherData && (
              <div style={{
                marginTop: '20px',
                padding: '25px',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                border: '2px solid rgba(102, 126, 234, 0.3)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1a1a2e', margin: 0 }}>
                    🌍 Live Weather - {location}
                  </h3>
                  <WeatherIcon condition={weatherData.condition} size={50} />
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '15px',
                  marginTop: '15px',
                }}>
                  <div style={{
                    padding: '15px',
                    background: 'white',
                    borderRadius: '12px',
                    textAlign: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  }}>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '6px' }}>🌡️ Temperature</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#667eea' }}>{weatherData.temp}°C</div>
                  </div>
                  <div style={{
                    padding: '15px',
                    background: 'white',
                    borderRadius: '12px',
                    textAlign: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  }}>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '6px' }}>💧 Humidity</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#667eea' }}>{weatherData.humidity}%</div>
                  </div>
                  <div style={{
                    padding: '15px',
                    background: 'white',
                    borderRadius: '12px',
                    textAlign: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  }}>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '6px' }}>💨 Wind Speed</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#667eea' }}>{weatherData.windSpeed} km/h</div>
                  </div>
                  <div style={{
                    padding: '15px',
                    background: 'white',
                    borderRadius: '8px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>Condition</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#667eea', textTransform: 'capitalize' }}>
                      {weatherData.condition}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '30px' }}>
              <button
                onClick={predictDaily}
                disabled={isLoading}
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: '18px 32px',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                <span style={{ fontSize: '1.3rem' }}>📅</span>
                Predict Daily
              </button>
              <button
                onClick={predictHourly}
                disabled={isLoading}
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: '18px 32px',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                <span style={{ fontSize: '1.3rem' }}>⏰</span>
                Predict Hourly
              </button>
            </div>

            {statusMessage && (
              <div style={{
                marginTop: '25px',
                padding: '18px 24px',
                borderRadius: '12px',
                textAlign: 'center',
                fontWeight: '600',
                background: isLoading ? 'linear-gradient(135deg, #ffeaa7, #fdcb6e)' : 'linear-gradient(135deg, #00b894, #00cec9)',
                color: isLoading ? '#2d3436' : 'white',
              }}>
                {statusMessage}
              </div>
            )}

            {/* Prediction History Graphs */}
            {(predictionHistory.daily.length > 0 || predictionHistory.hourly.length > 0) && (
              <div style={{ marginTop: '40px' }}>
                <h3 style={{
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  marginBottom: '25px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  📊 Prediction Graphs
                </h3>

                {/* Daily Predictions Graph */}
                {predictionHistory.daily.length > 0 && (
                  <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '30px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    marginBottom: '30px',
                  }}>
                    <h4 style={{
                      fontSize: '1.3rem',
                      fontWeight: '700',
                      marginBottom: '20px',
                      color: '#1a1a2e',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}>
                      📅 Daily Ride Predictions
                    </h4>
                    
                    <div style={{ position: 'relative', height: '300px', marginTop: '20px' }}>
                      {/* Y-axis */}
                      <div style={{
                        position: 'absolute',
                        left: '0',
                        top: '0',
                        bottom: '40px',
                        width: '50px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        fontSize: '0.8rem',
                        color: '#6b7280',
                      }}>
                        {[8000, 6000, 4000, 2000, 0].map(val => <div key={val}>{val}</div>)}
                      </div>

                      {/* Graph area */}
                      <div style={{
                        marginLeft: '60px',
                        height: '260px',
                        borderBottom: '2px solid #e5e7eb',
                        borderLeft: '2px solid #e5e7eb',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-around',
                        gap: '10px',
                        padding: '10px',
                      }}>
                        {predictionHistory.daily.map((item, index) => {
                          const maxVal = 8000;
                          const height = (item.prediction / maxVal) * 240;
                          const dateLabel = new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                          
                          return (
                            <div key={index} style={{
                              flex: 1,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '8px',
                            }}>
                              <div style={{
                                position: 'relative',
                                width: '100%',
                                maxWidth: '50px',
                              }}>
                                <div
                                  style={{
                                    width: '100%',
                                    height: `${height}px`,
                                    background: 'linear-gradient(180deg, #667eea, #764ba2)',
                                    borderRadius: '8px 8px 0 0',
                                    position: 'relative',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    boxShadow: '0 -4px 12px rgba(102, 126, 234, 0.3)',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 -8px 20px rgba(102, 126, 234, 0.5)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 -4px 12px rgba(102, 126, 234, 0.3)';
                                  }}
                                  title={`${item.prediction} rides`}
                                >
                                  <div style={{
                                    position: 'absolute',
                                    top: '-25px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    color: '#667eea',
                                    whiteSpace: 'nowrap',
                                  }}>
                                    {item.prediction}
                                  </div>
                                </div>
                                <WeatherIcon condition={getWeatherCondition(item.weather)} size={20} />
                              </div>
                              <div style={{
                                fontSize: '0.7rem',
                                fontWeight: '600',
                                color: '#6b7280',
                                textAlign: 'center',
                              }}>
                                {dateLabel}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Hourly Predictions Graph */}
                {predictionHistory.hourly.length > 0 && (
                  <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '30px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  }}>
                    <h4 style={{
                      fontSize: '1.3rem',
                      fontWeight: '700',
                      marginBottom: '20px',
                      color: '#1a1a2e',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}>
                      ⏰ Hourly Ride Predictions
                    </h4>

                    <div style={{ position: 'relative', height: '300px', marginTop: '20px' }}>
                      {/* Y-axis */}
                      <div style={{
                        position: 'absolute',
                        left: '0',
                        top: '0',
                        bottom: '40px',
                        width: '50px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        fontSize: '0.8rem',
                        color: '#6b7280',
                      }}>
                        {[500, 400, 300, 200, 100, 0].map(val => <div key={val}>{val}</div>)}
                      </div>

                      {/* Line graph */}
                      <div style={{
                        marginLeft: '60px',
                        height: '260px',
                        borderBottom: '2px solid #e5e7eb',
                        borderLeft: '2px solid #e5e7eb',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: '10px',
                      }}>
                        <svg width="100%" height="240" style={{ position: 'absolute', top: '10px', left: '0' }}>
                          <defs>
                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#f093fb" />
                              <stop offset="100%" stopColor="#f5576c" />
                            </linearGradient>
                            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="rgba(240, 147, 251, 0.3)" />
                              <stop offset="100%" stopColor="rgba(245, 87, 108, 0.05)" />
                            </linearGradient>
                          </defs>
                          
                          {/* Area fill */}
                          <path
                            d={predictionHistory.hourly.reduce((path, item, index) => {
                              const x = (index / (predictionHistory.hourly.length - 1 || 1)) * 100;
                              const y = 100 - (item.prediction / 500) * 100;
                              if (index === 0) return `M ${x}% ${y}%`;
                              return `${path} L ${x}% ${y}%`;
                            }, '') + ` L 100% 100% L 0% 100% Z`}
                            fill="url(#areaGradient)"
                          />
                          
                          {/* Line */}
                          <path
                            d={predictionHistory.hourly.reduce((path, item, index) => {
                              const x = (index / (predictionHistory.hourly.length - 1 || 1)) * 100;
                              const y = 100 - (item.prediction / 500) * 100;
                              if (index === 0) return `M ${x}% ${y}%`;
                              return `${path} L ${x}% ${y}%`;
                            }, '')}
                            stroke="url(#lineGradient)"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          
                          {/* Data points */}
                          {predictionHistory.hourly.map((item, index) => {
                            const x = (index / (predictionHistory.hourly.length - 1 || 1)) * 100;
                            const y = 100 - (item.prediction / 500) * 100;
                            return (
                              <g key={index}>
                                <circle
                                  cx={`${x}%`}
                                  cy={`${y}%`}
                                  r="5"
                                  fill="white"
                                  stroke="url(#lineGradient)"
                                  strokeWidth="3"
                                />
                                <circle
                                  cx={`${x}%`}
                                  cy={`${y}%`}
                                  r="8"
                                  fill="transparent"
                                  style={{ cursor: 'pointer' }}
                                >
                                  <title>{`Hour ${item.hour}: ${item.prediction} rides`}</title>
                                </circle>
                              </g>
                            );
                          })}
                        </svg>

                        {/* X-axis labels */}
                        <div style={{
                          position: 'absolute',
                          bottom: '-30px',
                          left: '0',
                          right: '0',
                          display: 'flex',
                          justifyContent: 'space-around',
                        }}>
                          {predictionHistory.hourly.map((item, index) => (
                            <div key={index} style={{
                              fontSize: '0.7rem',
                              fontWeight: '600',
                              color: '#6b7280',
                              textAlign: 'center',
                            }}>
                              {item.hour}:00
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            {/* Analytics Header */}
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '40px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
              marginBottom: '30px',
            }}>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: '700',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                📊 Analytics Dashboard
              </h2>
              <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                Comprehensive insights and historical performance metrics
              </p>
            </div>

            {/* Key Metrics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '25px',
              marginBottom: '30px',
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                borderRadius: '20px',
                padding: '30px',
                color: 'white',
                boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)',
              }}>
                <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '10px' }}>Total Rides (Month)</div>
                <div style={{ fontSize: '2.5rem', fontWeight: '900' }}>{analyticsData.monthlyStats.totalRides.toLocaleString()}</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '8px' }}>📈 +12.5% from last month</div>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
              }}>
                <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '10px' }}>Average Daily Rides</div>
                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1a1a2e' }}>{analyticsData.monthlyStats.avgDaily.toLocaleString()}</div>
                <div style={{ fontSize: '0.85rem', color: '#10b981', marginTop: '8px' }}>✓ Consistent performance</div>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
              }}>
                <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '10px' }}>Prediction Accuracy</div>
                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1a1a2e' }}>{analyticsData.monthlyStats.accuracy}%</div>
                <div style={{ fontSize: '0.85rem', color: '#10b981', marginTop: '8px' }}>🎯 Excellent accuracy</div>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
              }}>
                <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '10px' }}>Peak Demand Day</div>
                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1a1a2e' }}>{analyticsData.monthlyStats.peakDay}</div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '8px' }}>⭐ Highest volume</div>
              </div>
            </div>

            {/* Weekly Trend Chart */}
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '40px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
              marginBottom: '30px',
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '30px',
                color: '#1a1a2e',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                📈 Weekly Trend Analysis
              </h3>
              <div style={{ position: 'relative', height: '300px' }}>
                {/* Chart Y-axis labels */}
                <div style={{ position: 'absolute', left: '0', top: '0', bottom: '30px', width: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '0.8rem', color: '#6b7280' }}>
                  <div>7000</div>
                  <div>5000</div>
                  <div>3000</div>
                  <div>1000</div>
                </div>

                {/* Chart bars */}
                <div style={{ marginLeft: '50px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '270px', borderBottom: '2px solid #e5e7eb', paddingRight: '20px' }}>
                  {analyticsData.weeklyTrend.map((item, index) => {
                    const maxRides = 7000;
                    const actualHeight = (item.rides / maxRides) * 250;
                    const predictedHeight = (item.predicted / maxRides) * 250;
                    
                    return (
                      <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', flex: 1 }}>
                        <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-end', height: '250px' }}>
                          {/* Predicted bar */}
                          <div style={{
                            width: '20px',
                            height: `${predictedHeight}px`,
                            background: 'linear-gradient(180deg, #fbbf24, #f59e0b)',
                            borderRadius: '4px 4px 0 0',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                          title={`Predicted: ${item.predicted}`}
                          />
                          {/* Actual bar */}
                          <div style={{
                            width: '20px',
                            height: `${actualHeight}px`,
                            background: 'linear-gradient(180deg, #667eea, #764ba2)',
                            borderRadius: '4px 4px 0 0',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                          title={`Actual: ${item.rides}`}
                          />
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#6b7280' }}>{item.day}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '25px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '20px', height: '12px', background: 'linear-gradient(90deg, #667eea, #764ba2)', borderRadius: '2px' }} />
                  <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Actual Rides</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '20px', height: '12px', background: 'linear-gradient(90deg, #fbbf24, #f59e0b)', borderRadius: '2px' }} />
                  <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Predicted Rides</span>
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
              
              {/* Hourly Pattern */}
              <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '40px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: '30px',
                  color: '#1a1a2e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  ⏰ Hourly Demand Pattern
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {analyticsData.hourlyPattern.map((item, index) => {
                    const maxRides = 5000;
                    const percentage = (item.rides / maxRides) * 100;
                    
                    return (
                      <div key={index}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                          <span style={{ fontWeight: '600', color: '#1a1a2e' }}>{item.hour}</span>
                          <span style={{ color: '#6b7280' }}>{item.rides.toLocaleString()} rides</span>
                        </div>
                        <div style={{
                          width: '100%',
                          height: '12px',
                          background: '#f3f4f6',
                          borderRadius: '10px',
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            width: `${percentage}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #667eea, #764ba2)',
                            borderRadius: '10px',
                            transition: 'width 0.5s ease',
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Weather Impact */}
              <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '40px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: '30px',
                  color: '#1a1a2e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  🌤️ Weather Impact Analysis
                </h3>

                {/* Donut chart representation */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                  <div style={{
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: 'conic-gradient(' +
                      `${analyticsData.weatherImpact[0].color} 0deg 140deg, ` +
                      `${analyticsData.weatherImpact[1].color} 140deg 240deg, ` +
                      `${analyticsData.weatherImpact[2].color} 240deg 310deg, ` +
                      `${analyticsData.weatherImpact[3].color} 310deg 360deg` +
                    ')',
                    position: 'relative',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      background: 'white',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Total</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1a1a2e' }}>
                        {analyticsData.weatherImpact.reduce((sum, item) => sum + item.rides, 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {analyticsData.weatherImpact.map((item, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '4px',
                          background: item.color,
                        }} />
                        <span style={{ fontSize: '0.95rem', color: '#1a1a2e' }}>{item.condition}</span>
                      </div>
                      <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#6b7280' }}>
                        {item.rides.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Insights Section */}
            <div style={{
              background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
              borderRadius: '24px',
              padding: '40px',
              marginTop: '30px',
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '25px',
                color: '#1a1a2e',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                💡 Key Insights
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div style={{
                  background: 'white',
                  padding: '25px',
                  borderRadius: '16px',
                  borderLeft: '4px solid #10b981',
                }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '10px' }}>
                    🎯 High Accuracy
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    Our ML model maintains 94.5% accuracy across all weather conditions and time periods.
                  </p>
                </div>

                <div style={{
                  background: 'white',
                  padding: '25px',
                  borderRadius: '16px',
                  borderLeft: '4px solid #3b82f6',
                }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '10px' }}>
                    � Peak Hours
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    Evening hours (16-19) show highest demand with 4,500+ rides. Plan resources accordingly.
                  </p>
                </div>

                <div style={{
                  background: 'white',
                  padding: '25px',
                  borderRadius: '16px',
                  borderLeft: '4px solid #f59e0b',
                }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '10px' }}>
                    🌧️ Weather Impact
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    Heavy rain reduces demand by 65%. Weather integration improves prediction reliability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
