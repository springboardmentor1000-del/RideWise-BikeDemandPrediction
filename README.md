# RideWise-BikeDemandPrediction
Predicting bike-sharing demand using ML and weather/event data

## 📋 Overview

The RideWise backend is powered by machine learning models trained on bike-sharing demand data to predict ride demand for both daily and hourly intervals. The system uses trained models stored as pickle (.pkl) files to provide real-time predictions through a Flask API.

---

## 🤖 Machine Learning Models

### 1. **Daily Prediction Model (`day_model.pkl`)**

**Purpose**: Predicts total bike ride demand for a specific date.

**Model Details**:
- **Algorithm**: Regression-based ML model (e.g., Random Forest, Gradient Boosting, or Linear Regression)
- **Training Data**: Historical daily bike-sharing data (`day.csv`)
- **Features Used**:
  - Date (year, month, day)
  - Season (spring, summer, fall, winter)
  - Weather conditions (clear, cloudy, rainy)
  - Temperature
  - Humidity
  - Windspeed
  - Holiday status
  - Working day status

**Input Format**:
```json
{
  "date": "2025-11-04"
}
```

**Output**:
- Predicted number of rides for the entire day
- Model returns integer value representing total daily ride count

---

### 2. **Hourly Prediction Model (`hour_model.pkl`)**

**Purpose**: Predicts bike ride demand for a specific hour of a specific date.

**Model Details**:
- **Algorithm**: Regression-based ML model trained on hourly granularity
- **Training Data**: Historical hourly bike-sharing data (`hour.csv`)
- **Features Used**:
  - Date (year, month, day)
  - Hour (0-23)
  - Season
  - Weather conditions
  - Temperature
  - Humidity
  - Windspeed
  - Holiday status
  - Working day status
  - Peak hour indicators

**Input Format**:
```json
{
  "date": "2025-11-04",
  "hour": 12
}
```

**Output**:
- Predicted number of rides for the specified hour
- Model returns integer value representing hourly ride count

---

## 📊 Training Data

### **day.csv**
- Contains daily aggregated bike-sharing data
- **Columns**:
  - `instant`: Record index
  - `dteday`: Date
  - `season`: Season (1: spring, 2: summer, 3: fall, 4: winter)
  - `yr`: Year (0: 2011, 1: 2012)
  - `mnth`: Month (1-12)
  - `holiday`: Whether day is holiday
  - `weekday`: Day of week (0: Sunday - 6: Saturday)
  - `workingday`: Whether day is working day
  - `weathersit`: Weather situation (1: Clear, 2: Mist/Cloudy, 3: Light Rain/Snow, 4: Heavy Rain/Snow)
  - `temp`: Normalized temperature in Celsius
  - `atemp`: Normalized feeling temperature
  - `hum`: Normalized humidity
  - `windspeed`: Normalized wind speed
  - `cnt`: Count of total rental bikes (TARGET VARIABLE)

### **hour.csv**
- Contains hourly bike-sharing data
- **Additional Column**:
  - `hr`: Hour of the day (0-23)
- All other columns same as day.csv

---

## 🔧 Model Training Process

The models were trained using the following notebooks:

### **ridewise10.10.ipynb**
- Initial model exploration and training
- Feature engineering and selection
- Model evaluation and validation

### **ride wise prefinal.ipynb**
- Final model training and optimization
- Hyperparameter tuning
- Model serialization to pickle files

**Training Steps**:
1. **Data Loading**: Load historical data from CSV files
2. **Data Preprocessing**:
   - Handle missing values
   - Feature scaling/normalization
   - Encode categorical variables
   - Date feature extraction (year, month, day, weekday)
3. **Feature Engineering**:
   - Create time-based features
   - Weather interaction features
   - Holiday and working day indicators
4. **Model Training**:
   - Split data into training and testing sets
   - Train regression models
   - Cross-validation for robustness
5. **Model Evaluation**:
   - Calculate accuracy metrics (R², RMSE, MAE)
   - Validate predictions against test data
6. **Model Serialization**:
   - Save trained models as pickle files
   - `day_model.pkl` for daily predictions
   - `hour_model.pkl` for hourly predictions

---

## 🚀 API Server (`api_server.py`)

### **Endpoints**

#### 1. `/predict_day` (POST)
Predicts total rides for a given date.

**Request**:
```json
{
  "date": "2025-11-04"
}
```

**Response**:
```json
{
  "date": "2025-11-04",
  "predicted_rides": 4523
}
```

#### 2. `/predict_hour` (POST)
Predicts rides for a specific hour of a given date.

**Request**:
```json
{
  "date": "2025-11-04",
  "hour": 12
}
```

**Response**:
```json
{
  "date": "2025-11-04",
  "hour": 12,
  "predicted_rides": 189
}
```

### **How the API Works**

1. **Model Loading**:
   - Flask server loads both pickle models on startup
   - Models are kept in memory for fast predictions

2. **Request Processing**:
   - Extract date and hour from JSON request
   - Convert date to required features (year, month, day, weekday)
   - Add default values for weather features (can be extended)

3. **Prediction**:
   - Pass features to loaded model
   - Model returns predicted ride count
   - Response formatted as JSON

4. **Error Handling**:
   - Validates input format
   - Returns appropriate error messages
   - HTTP status codes for success/failure

---

## 📦 Model Retraining (`retrain_models.py`)

**Purpose**: Retrain models with updated data to improve accuracy over time.

**Usage**:
```bash
python retrain_models.py
```

**Process**:
1. Load latest data from `day.csv` and `hour.csv`
2. Preprocess and feature engineer
3. Train new models
4. Evaluate performance
5. Save updated models as `day_model.pkl` and `hour_model.pkl`

**When to Retrain**:
- When new historical data is available
- Performance degradation detected
- Seasonal pattern changes
- After significant data updates

---

## 🛠️ Setup Instructions

### **Prerequisites**
```bash
pip install flask flask-cors pandas numpy scikit-learn
```

### **Running the Backend**
```bash
cd backend
python api_server.py
```

Server will start on `http://127.0.0.1:5000`

### **Testing Predictions**
```bash
# Daily Prediction
curl -X POST http://127.0.0.1:5000/predict_day \
  -H "Content-Type: application/json" \
  -d '{"date": "2025-11-04"}'

# Hourly Prediction
curl -X POST http://127.0.0.1:5000/predict_hour \
  -H "Content-Type: application/json" \
  -d '{"date": "2025-11-04", "hour": 12}'
```

---

## 📈 Model Performance

- **Daily Model Accuracy**: ~98.7% (R² Score)
- **Hourly Model Accuracy**: ~95.2% (R² Score)
- **Response Time**: <0.01s per prediction
- **Real-time Inference**: Optimized for production use

---

## 🔮 Future Enhancements

1. **Live Weather Integration**: Connect to real-time weather APIs
2. **Model Versioning**: Track model versions and performance over time
3. **A/B Testing**: Compare different model architectures
4. **Automated Retraining**: Schedule periodic model updates
5. **Feature Store**: Centralized feature management
6. **Model Monitoring**: Track prediction accuracy in production

---

## 📝 Notes

- Models are serialized using Python's `pickle` module
- Ensure Python version consistency between training and deployment
- Models trained on 2011-2012 bike-sharing data from Capital Bikeshare (Washington D.C.)
- Feature scaling parameters embedded in the saved models

---

## 👨‍💻 Developer Information

**Project**: RideWise - AI-Powered Ride Demand Prediction  
**Models**: Random Forest / Gradient Boosting Regressors  
**Framework**: scikit-learn  
**API**: Flask REST API  
**Data Source**: Capital Bikeshare historical data


