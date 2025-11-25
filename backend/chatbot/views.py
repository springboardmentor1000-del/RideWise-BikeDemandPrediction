# backend/chatbot/views.py
import os
import json
import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .ridewise_intent_detector import detect_intent
from .weather_utils import get_weather_for_datetime
from .prediction_utils import predict_rental_for_date, predict_rental_for_hour
from .peak_utils import get_peak_hour, get_peak_day, get_peak_month


def normalize_intent_result(intent_result):
    """Ensure the intent result is always a dict."""
    if isinstance(intent_result, list):
        return intent_result[0] if intent_result else {}
    elif isinstance(intent_result, dict):
        return intent_result
    return {}


@csrf_exempt
def chat_with_ai(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=400)

    # --- Parse user message ---
    try:
        body = json.loads(request.body)
        user_message = body.get("message", "").strip()
        if not user_message:
            return JsonResponse({"error": "Empty message"}, status=400)
    except Exception:
        return JsonResponse({"error": "Invalid JSON body"}, status=400)

    # --- STEP 1: Detect intent via Gemini ---
    raw_intent_result = detect_intent(user_message)
    intent_result = normalize_intent_result(raw_intent_result)
    intent = intent_result.get("intent", "").upper()

    print("\n[RideWise Gemini Intent Detector Output]:")
    print(json.dumps(intent_result, indent=2))

    # --- STEP 2: Parse contextual info ---
    today = datetime.date.today()
    target_time = intent_result.get("time", None)
    city = intent_result.get("city", "Hyderabad")
    target_date_raw = intent_result.get("date", today.isoformat())
    response_text = intent_result.get("response_text", "")  # 👈 now directly from Gemini

    peak_start_date = None
    if "PEAK_HOUR" in intent:
        target_date = today.isoformat()
    elif "PEAK_DAY" in intent:
        msg_lower = user_message.lower()
        if "this week" in msg_lower:
            peak_start_date = today - datetime.timedelta(days=today.weekday())
        elif "next week" in msg_lower:
            peak_start_date = today - datetime.timedelta(days=today.weekday()) + datetime.timedelta(days=7)
        elif "to" in target_date_raw:
            peak_start_date = target_date_raw.split(" to ")[0]
        else:
            peak_start_date = today - datetime.timedelta(days=today.weekday())
        start_of_week = today - datetime.timedelta(days=today.weekday())
        target_date = start_of_week.isoformat()
    elif "PEAK_MONTH" in intent:
        target_date = None
    else:
        target_date = target_date_raw.split(" to ")[0]

    if isinstance(peak_start_date, datetime.date):
        peak_start_date = peak_start_date.isoformat()

    # --- STEP 3: Weather context ---
    try:
        hour = int(target_time.split(":")[0]) if target_time else 12
    except Exception:
        hour = 12

    weather_data = get_weather_for_datetime(city, target_date, hour) if target_date else {}

    # --- STEP 4: Intent Routing ---
    try:
        # ⏱️ Time-based rentals
        if "TIME_BASED_RENTAL_QUERIES" in intent:
            if target_time:
                prediction = predict_rental_for_hour(target_date, target_time, weather_data)
                response_text = (
                    f"📈 Estimated rentals on **{target_date} at {target_time}** → **{prediction} rides expected.**\nwith\n"
                    f"- Season: {weather_data.get('season', 'N/A')}\n"
                    f"- Weather: {weather_data.get('weathersit', 'N/A')}\n"
                    f"- Temperature: {weather_data.get('temp', 'N/A')}°C\n"
                    f"- Feels like: {weather_data.get('atemp', 'N/A')}°C\n"
                    f"- Humidity: {weather_data.get('humidity', 'N/A')}%\n"
                    f"- Wind speed: {weather_data.get('windspeed', 'N/A')} km/h"
                )
            else:
                prediction = predict_rental_for_date(target_date, weather_data)
                response_text = (
                    f"📅 Estimated rentals on **{target_date}** → **{prediction} total rides expected.**\nwith\n"
                    f"- Season: {weather_data.get('season', 'N/A')}\n"
                    f"- Weather: {weather_data.get('weathersit', 'N/A')}\n"
                    f"- Temperature: {weather_data.get('temp', 'N/A')}°C\n"
                    f"- Feels like: {weather_data.get('atemp', 'N/A')}°C\n"
                    f"- Humidity: {weather_data.get('humidity', 'N/A')}%\n"
                    f"- Wind speed: {weather_data.get('windspeed', 'N/A')} km/h"
                )

        # 📊 Peak queries
        elif "PEAK_HOUR" in intent:
            peak_data = get_peak_hour(today.isoformat())
            response_text = (
                f"⏰ The **peak rental hour** on {peak_data['date']} "
                f"is around **{peak_data['peak_hour']}:00** with ~**{peak_data['peak_value']} rides.**"
            )

        elif "PEAK_DAY" in intent:
            peak_data = get_peak_day(start_date=peak_start_date)
            response_text = (
                f"📆 The **busiest day** in the week starting {peak_start_date} "
                f"is **{peak_data['peak_day']}** with about **{peak_data['peak_value']} rides.**"
            )

        elif "PEAK_MONTH" in intent:
            peak_data = get_peak_month()
            response_text = (
                f"📊 The **peak rental month** is **{peak_data['peak_month']}** "
                f"with an average of **{peak_data['peak_value']} rides/day.**"
            )

        # 🌦️ Weather-related (already handled above)
        # All other intents now already have their own `response_text` generated by Gemini

        if not response_text:
            response_text = "🤔 I’m here to assist with RideWise-related topics like rentals, weather, or predictions."

    except Exception as e:
        print("[ERROR] Exception in intent routing:", e)
        response_text = "⚠️ Sorry, something went wrong while processing your request."

    # --- STEP 5: Return structured response ---
    return JsonResponse({
        "intent": intent,
        "date": target_date,
        "time": target_time,
        "weather": weather_data,
        "reply": response_text,
    })
