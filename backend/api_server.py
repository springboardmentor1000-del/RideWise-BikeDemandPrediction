from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import datetime
import time

app = Flask(__name__)
CORS(app)

# Load trained models
with open("day_model.pkl", "rb") as f:
    day_model_data = pickle.load(f)
    # Handle both old format (just model) and new format (dict with model and scaler)
    if isinstance(day_model_data, dict):
        day_model = day_model_data["model"]
        day_scaler = day_model_data["scaler"]
    else:
        day_model = day_model_data
        day_scaler = None

with open("hour_model.pkl", "rb") as f:
    hour_model_data = pickle.load(f)
    # Handle both old format (just model) and new format (dict with model and scaler)
    if isinstance(hour_model_data, dict):
        hour_model = hour_model_data["model"]
        hour_scaler = hour_model_data["scaler"]
    else:
        hour_model = hour_model_data
        hour_scaler = None

def get_season(month):
    """Map month to season: 1=spring, 2=summer, 3=fall, 4=winter"""
    if month in [3, 4, 5]:
        return 1
    elif month in [6, 7, 8]:
        return 2
    elif month in [9, 10, 11]:
        return 3
    else:
        return 4

@app.route('/')
def home():
    return jsonify({
        "message": "RideWise API is running 🚀",
        "routes": ["/predict_day", "/predict_hour"]
    })

# 🧠 Predict total daily ride demand
@app.route('/predict_day', methods=['POST'])
def predict_day():
    try:
        data = request.get_json()
        date_str = data.get("date")

        if not date_str:
            return jsonify({"error": "Missing date field"}), 400

        date_obj = datetime.datetime.strptime(date_str, "%Y-%m-%d")
        
        # Build 14 features expected by the model
        season = get_season(date_obj.month)
        yr = 1  # Normalized year (0=2011, 1=2012)
        mnth = date_obj.month
        holiday = int(data.get("holiday", 0))  # Read from request
        weekday = date_obj.weekday()
        workingday = 1 if weekday < 5 else 0
        weathersit = int(data.get("weathersit", 1))  # Read from request
        
        # Weather values from frontend (normalized 0-1)
        temp = float(data.get("temp", 0.5))
        atemp = float(data.get("atemp", 0.5))
        hum = float(data.get("hum", 0.6))
        windspeed = float(data.get("windspeed", 0.2))
        
        # Engineered features
        temp_sq = temp ** 2
        hum_sq = hum ** 2
        temp_hum = temp * hum
        
        features = np.array([
            season, yr, mnth, holiday, weekday, workingday, weathersit,
            temp, atemp, hum, windspeed,
            temp_sq, hum_sq, temp_hum
        ]).reshape(1, -1)

        start = time.time()
        if day_scaler:
            features = day_scaler.transform(features)
        prediction = float(day_model.predict(features)[0])
        latency = round(time.time() - start, 4)

        # Ensure non-negative predictions
        predicted_rides = max(0, round(prediction))

        return jsonify({
            "prediction_type": "daily",
            "predicted_rides": predicted_rides,
            "latency": latency
        })

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500


# 🧭 Predict hourly ride demand
@app.route('/predict_hour', methods=['POST'])
def predict_hour():
    try:
        data = request.get_json()
        date_str = data.get("date")
        hour = int(data.get("hour", 0))

        if not date_str:
            return jsonify({"error": "Missing date field"}), 400

        date_obj = datetime.datetime.strptime(date_str, "%Y-%m-%d")
        
        # Build 19 features expected by the hourly model
        season = get_season(date_obj.month)
        yr = 1
        mnth = date_obj.month
        holiday = int(data.get("holiday", 0))  # Read from request
        weekday = date_obj.weekday()
        workingday = 1 if weekday < 5 else 0
        weathersit = int(data.get("weathersit", 1))  # Read from request
        
        # Weather values from frontend (normalized 0-1)
        temp = float(data.get("temp", 0.5))
        atemp = float(data.get("atemp", 0.5))
        hum = float(data.get("hum", 0.6))
        windspeed = float(data.get("windspeed", 0.2))
        
        # Engineered features
        temp_sq = temp ** 2
        hum_sq = hum ** 2
        temp_hum = temp * hum
        
        # Hour-specific features
        hr_sin = np.sin(2 * np.pi * hour / 24)
        hr_cos = np.cos(2 * np.pi * hour / 24)
        rush_hour = 1 if hour in [7, 8, 9, 17, 18, 19] else 0
        night_time = 1 if (hour >= 22 or hour <= 5) else 0
        
        features = np.array([
            season, yr, mnth, holiday, weekday, workingday, weathersit,
            temp, atemp, hum, windspeed,
            temp_sq, hum_sq, temp_hum,
            hour, hr_sin, hr_cos, rush_hour, night_time
        ]).reshape(1, -1)

        start = time.time()
        if hour_scaler:
            features = hour_scaler.transform(features)
        prediction = float(hour_model.predict(features)[0])
        latency = round(time.time() - start, 4)

        # Ensure non-negative predictions with intelligent baseline
        predicted_rides = max(0, round(prediction))
        
        # Add minimum baseline demand for realism (even late night has some rides)
        # Night hours (12 AM - 5 AM): minimum 15-35 rides
        # Early morning (6 AM - 7 AM): minimum 40-60 rides
        # Rest of day: use model prediction
        if hour >= 0 and hour <= 5:
            # Late night minimum: 15-35 rides based on hour
            min_rides = 15 + (5 - hour) * 4  # 2 AM gets ~27 rides minimum
            predicted_rides = max(predicted_rides, min_rides)
        elif hour in [6, 7]:
            # Early morning minimum: 40-60 rides
            min_rides = 40 + (hour - 6) * 10
            predicted_rides = max(predicted_rides, min_rides)

        return jsonify({
            "prediction_type": "hourly",
            "predicted_rides": predicted_rides,
            "latency": latency
        })

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=False, host='127.0.0.1', port=5000, use_reloader=False)
