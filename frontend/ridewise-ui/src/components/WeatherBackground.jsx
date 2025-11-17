import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './WeatherBackground.css';

const WeatherBackground = ({ weatherCondition = 'clear' }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate particles for snow or rain
    if (weatherCondition === 'snow' || weatherCondition === 'rain') {
      const particleCount = weatherCondition === 'snow' ? 50 : 100;
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        animationDuration: weatherCondition === 'snow' 
          ? Math.random() * 3 + 4  // 4-7s for snow
          : Math.random() * 0.5 + 0.5, // 0.5-1s for rain
        size: weatherCondition === 'snow'
          ? Math.random() * 4 + 2  // 2-6px for snow
          : Math.random() * 2 + 1, // 1-3px for rain
        delay: Math.random() * 2,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [weatherCondition]);

  const getBackgroundClass = () => {
    switch (weatherCondition.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return 'weather-bg-clear';
      case 'rain':
      case 'rainy':
      case 'drizzle':
        return 'weather-bg-rain';
      case 'clouds':
      case 'cloudy':
        return 'weather-bg-cloudy';
      case 'snow':
      case 'snowy':
        return 'weather-bg-snow';
      default:
        return 'weather-bg-clear';
    }
  };

  return (
    <div className={`weather-background ${getBackgroundClass()}`}>
      {/* Animated gradient overlay */}
      <motion.div 
        className="gradient-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Cloud layer for cloudy weather */}
      {(weatherCondition === 'clouds' || weatherCondition === 'cloudy') && (
        <div className="clouds-container">
          <motion.div 
            className="cloud cloud-1"
            animate={{ x: [0, 100, 0] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="cloud cloud-2"
            animate={{ x: [0, -100, 0] }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="cloud cloud-3"
            animate={{ x: [0, 50, 0] }}
            transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}

      {/* Rain particles */}
      {weatherCondition === 'rain' && (
        <div className="rain-container">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="rain-drop"
              style={{
                left: `${particle.left}%`,
                width: `${particle.size}px`,
                height: `${particle.size * 10}px`,
                animationDuration: `${particle.animationDuration}s`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Snow particles */}
      {weatherCondition === 'snow' && (
        <div className="snow-container">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="snowflake"
              style={{
                left: `${particle.left}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDuration: `${particle.animationDuration}s`,
                animationDelay: `${particle.delay}s`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                rotate: [0, 360],
              }}
              transition={{
                duration: particle.animationDuration,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              ❄
            </motion.div>
          ))}
        </div>
      )}

      {/* Ambient light effects */}
      <motion.div 
        className="ambient-light"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default WeatherBackground;
