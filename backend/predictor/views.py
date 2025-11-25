# backend/predictor/views.py
import os
import json
from datetime import datetime, timedelta
import pandas as pd
from django.http import HttpResponse, JsonResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from chatbot.weather_utils import get_weather_for_datetime
from chatbot.prediction_utils import predict_rental_for_date, predict_rental_for_hour
from predictor.prediction_core import prepare_features_for_prediction, get_day_model, get_hour_model
import numpy as np
from django.http import FileResponse, Http404

# ------------------------------
# --- API Views ---
# ------------------------------


def overview(request):
    city = request.GET.get("city", "Hyderabad")
    date_str = request.GET.get("date", str(datetime.today().date()))
    hour = int(request.GET.get("hour", datetime.now().hour))

    try:
        weather = get_weather_for_datetime(city, date_str, hour)

        day_model = get_day_model()
        hour_model = get_hour_model()
        if day_model is None or hour_model is None:
            raise ValueError("Prediction model not loaded. Check model files.")

        total_day = predict_rental_for_date(date_str, weather, city)
        this_hour = predict_rental_for_hour(date_str, f"{hour}:00", weather, city)

        data = {
            "city": city,
            "date": date_str,
            "hour": hour,
            "weather": weather,
            "predictions": {
                "total_rentals_today": total_day,
                "current_hour_rentals": this_hour
            }
        }
        return JsonResponse(data)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



def today_weather(request):
    city = request.GET.get("city", "Hyderabad")
    now = datetime.now()
    weather = get_weather_for_datetime(city, now.strftime("%Y-%m-%d"), now.hour)
    return JsonResponse(weather)





#

@csrf_exempt
def home(request):
    return JsonResponse({"message": "Predictor API is active."})


@csrf_exempt
def predict(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Invalid request method'}, status=405)

    try:
        payload = json.loads(request.body)
        model_type = payload.get('model_type', 'day')
        base_input = {
            'date': payload['date'],
            'temp': float(payload['temp']),
            'atemp': float(payload['atemp']),
            'hum': float(payload['hum']),
            'windspeed': float(payload['windspeed']),
            'holiday': int(payload.get('holiday', 0)),
            'workingday': int(payload.get('workingday', 0)),
            'season': int(payload.get('season', 1)),
            'weathersit': int(payload.get('weathersit', 1)),
            'hour': int(payload.get('hour', 0))
        }

        def _predict_single(input_dict, dataset_type):
            df_features = prepare_features_for_prediction(input_dict, dataset_type)
            model = get_day_model() if dataset_type == 'day' else get_hour_model()
            raw_pred = model.predict(df_features)
            pred_value = float(max(0.0, raw_pred[0]))
            return round(pred_value)  # ✅ round to nearest integer


        if model_type == 'day':
            sel_date = pd.to_datetime(base_input['date'])
            sunday = sel_date - timedelta(days=(sel_date.weekday() + 1) % 7)
            week_dates = [sunday + timedelta(days=i) for i in range(7)]

            preds = [
                _predict_single(
                    {**base_input, 'date': d.strftime('%Y-%m-%d')},
                    'day'
                )
                for d in week_dates
            ]

            week_labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

            return JsonResponse({
                "type": "day",
                "current_prediction": preds[(sel_date - sunday).days],
                "week_labels": week_labels,
                "week_predictions": preds
            })

        else:
            sel_date = pd.to_datetime(base_input['date'])
            hour_labels = [f"{h:02d}" for h in range(24)]

            preds = [
                _predict_single(
                    {**base_input, 'hour': h},
                    'hour'
                )
                for h in range(24)
            ]

            return JsonResponse({
                "type": "hour",
                "current_prediction": preds[base_input['hour']],
                "hour_labels": hour_labels,
                "hour_predictions": preds
            })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)



def insights(request):
    json_path = os.path.join(settings.BASE_DIR, "predictor", "data", "data_insights.json")

    if not os.path.exists(json_path):
        return JsonResponse({"error": "Insights file not found"}, status=404)

    with open(json_path, "r") as f:
        data = json.load(f)

    return JsonResponse(data, safe=False)
