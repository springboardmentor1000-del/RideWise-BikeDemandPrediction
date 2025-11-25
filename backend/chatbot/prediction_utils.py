from predictor.prediction_core import prepare_features_for_prediction, get_day_model, get_hour_model

def predict_rental_for_date(date: str, weather_data: dict, city="Hyderabad"):
    features = {
        "date": date,
        "season": weather_data.get("season", 1),
        "weathersit": weather_data.get("weathersit", 1),
        "temp": weather_data.get("temp", 25),
        "atemp": weather_data.get("atemp", 27),
        "hum": weather_data.get("humidity", 60),
        "windspeed": weather_data.get("windspeed", 10),
        "holiday": weather_data.get("holiday", 0),
        "workingday": weather_data.get("workingday", 1),
    }

    X = prepare_features_for_prediction(features, "day")
    model = get_day_model()
    pred = model.predict(X)[0]
    return int(round(max(0, pred)))


def predict_rental_for_hour(date: str, time: str, weather_data: dict, city="Hyderabad"):
    try:
        hour = int(time.split(":")[0])
    except Exception:
        hour = 12

    features = {
        "date": date,
        "season": weather_data.get("season", 1),
        "weathersit": weather_data.get("weathersit", 1),
        "temp": weather_data.get("temp", 25),
        "atemp": weather_data.get("atemp", 27),
        "hum": weather_data.get("humidity", 60),
        "windspeed": weather_data.get("windspeed", 10),
        "holiday": weather_data.get("holiday", 0),
        "workingday": weather_data.get("workingday", 1),
        "hour": hour,
    }

    X = prepare_features_for_prediction(features, "hour")
    model = get_hour_model()
    pred = model.predict(X)[0]
    return int(round(max(0, pred)))
