from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Load models
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')
with open(os.path.join(MODEL_DIR, 'day.pkl'), 'rb') as f:
    day_model = pickle.load(f)
with open(os.path.join(MODEL_DIR, 'hour.pkl'), 'rb') as f:
    hour_model = pickle.load(f)

@app.route('/')
def home():
    return jsonify({
        "message": "RideWise API is running 🚀",
        "routes": ["/predict_day", "/predict_hour"]
    })

@app.route('/predict_day', methods=['POST'])
def predict_day():
    data = request.get_json()
    # Example: expects a list of features in order
    features = np.array(data.get('features')).reshape(1, -1)
    prediction = day_model.predict(features)
    return jsonify({"prediction": float(prediction[0])})

@app.route('/predict_hour', methods=['POST'])
def predict_hour():
    data = request.get_json()
    features = np.array(data.get('features')).reshape(1, -1)
    prediction = hour_model.predict(features)
    return jsonify({"prediction": float(prediction[0])})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
