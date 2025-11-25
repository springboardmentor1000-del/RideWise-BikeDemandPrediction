# backend/chatbot/ridewise_intent_detector.py
import os
import datetime
import google.generativeai as genai
import json
import re

# Example: 2025-11-11 10:35:08 IST
current_datetime = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S %Z")
current_day_of_week = datetime.datetime.now().strftime("%A")

# --- Configure Gemini ---
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

MODEL_NAME = "models/gemini-2.5-flash"

# --- Indian holidays mapping ---
HOLIDAYS = {
    "christmas": lambda year: f"{year}-12-25",
    "new year": lambda year: f"{year}-01-01",
    "independence day": lambda year: f"{year}-08-15",
    "republic day": lambda year: f"{year}-01-26",
}

# --- Weekdays mapping ---
WEEKDAYS = {
    "monday": 0, "tuesday": 1, "wednesday": 2, "thursday": 3,
    "friday": 4, "saturday": 5, "sunday": 6,
}

# --- Context library for RideWise ---
RIDEWISE_CONTEXTS = {
    "FEATURE_USAGE_NAVIGATION": """
🧭 RideWise Feature Usage & Navigation:
- To predict rentals or bike availability, go to the Dashboard, enter all input parameters, then tap **Predict**.
- To check traffic conditions, use the Route Planner — it combines real-time traffic and weather.
- Weather forecasts automatically adjust bike recommendations and demand.
- To find nearby bikes, open the Map View or Nearby Rentals tab.
- You can schedule rides in advance or use the Smart Route Planner to find the best route.
    """,

    "APP_INTELLIGENCE_TECHNOLOGY": """
🤖 RideWise App Intelligence & Technology:
- RideWise uses AI and machine learning to predict demand, traffic, and weather-based availability.
- It combines data from weather APIs, traffic sensors, and rental systems.
- Predictions improve automatically as more rides are logged.
- RideWise also supports smart helmets and connected devices for safer rides.
    """,

    "TROUBLESHOOTING_SUPPORT": """
🔧 Troubleshooting & Support:
- If you can’t log in, check your internet and credentials.
- If predictions aren’t working, verify your inputs or refresh the dashboard.
- Ensure GPS permissions are enabled for accurate location detection.
- To reset your password, tap “Forgot Password” on the login screen.
- For app crashes, go to Settings → Help → Report a Bug.
    """,

    "BRANDING_DESIGN_CURIOSITY": """
🎨 Branding & Design:
- The RideWise logo represents connected and intelligent mobility.
- The cinematic UI is designed to create a futuristic experience.
- You can switch to dark mode or enable glassmorphic themes in settings.
    """,

    "ACCOUNT_SETTINGS": """
⚙️ Account & Settings:
- You can change your profile picture from your Profile page.
- Update preferred bike type in Preferences.
- Enable notifications for weather or rental alerts in Settings → Notifications.
- Save favorite routes for easy access.
    """,

    "DATA_INSIGHTS": """
📊 Data & Insights:
- View your past ride history in the Insights section.
- Check prediction accuracy or trends in rental data.
- Connect a smart tracker to log mileage and fuel usage.
- Export ride data as CSV or view charts in-app.
    """,

    "WEATHER_RELATED_RIDEWISE_CONTEXT_ONLY": """
🌦️ Weather & Safety:
- Check if it will rain or if it's safe to ride.
- RideWise adjusts recommendations and routes based on weather.
- Enable storm or rain alerts in Settings.
- Weather data is sourced live for temperature, humidity, and visibility.
    """,

    "OFF_TOPIC_QUERIES": """
🤔 I’m here to help with RideWise topics like routes, rentals, or predictions.
Please ask something related to the app. 😊
    """
}


PREDICTIVE_INTENTS = [
    "time_based_rental_queries_general_time_frames",
    "time_based_rental_queries_specific_time_points",
    "peak_hour_queries",
    "peak_day_queries",
]

# --- Time context injection ---
TIME_INJECTION = f"""
---
# ABSOLUTE CONTEXT
Current date and time: {current_day_of_week}, {current_datetime}.
All relative time phrases ('today', 'next week', 'after 2 days') must be calculated using this context.
---
"""

# --- System prompt ---
SYSTEM_PROMPT = TIME_INJECTION+"""

You are RideWise Intent Detector Bot for the RideWise app.

Your role: Analyze a user query and return a STRICT JSON object that describes:
  - The detected intent
  - Contextual temporal data (if relevant)

## Intents
feature_usage_navigation,
app_intelligence_technology,
troubleshooting_support,
branding_design_curiosity,
account_settings,
data_insights,
weather_related_ridewise_context_only,
time_based_rental_queries_general_time_frames,
time_based_rental_queries_specific_time_points,
peak_hour_queries,
peak_day_queries,
peak_month_queries,
off_topic_queries

## Output Format

If intent is time-based or peak:
{
  "intent": "detected_intent_name",
  "date": "YYYY-MM-DD or date range",
  "time": "HH:MM or descriptive period", 
  "workinday": 1 or 0,
  "holiday": 1 or 0
}

Rules:
- The 'date' field MUST be the exact absolute date (YYYY-MM-DD format) derived from the user query and the ABSOLUTE CONTEXT.
- If the query is time-based or peak, but NO specific time is mentioned (e.g., "rentals today"), the 'time' field MUST be **null**.
- you should return time either as HH:MM or null if not specified, nothing else.
- if user query specifies evening/morning/afternoon/night, convert to approximate HH:MM (e.g., evening=18:00).
- Convert known Indian holidays to the specific absolute date within the year requested by the user.
- Assume the location for holiday checking is Telangana, India.
- Workday=1 if the date is a weekday (Mon-Fri) AND NOT a public holiday; Holiday=1 if the date is an Indian public holiday.
- Output must be ONLY JSON — no natural language output or explanation.

If intent is general (not time-based or peak):
{
  "intent": "detected_intent",
  "response_text": "A short helpful answer based on RideWise context"
}
Always use the RideWise context below for generating response_text:
""" + json.dumps(RIDEWISE_CONTEXTS, indent=2)

# --- Gemini model ---
model = genai.GenerativeModel(model_name=MODEL_NAME, system_instruction=SYSTEM_PROMPT)


# -------------------- Helpers --------------------
def previous_weekday(current_date: datetime.date, weekday_target: int) -> datetime.date:
    days_behind = current_date.weekday() - weekday_target
    if days_behind <= 0:
        days_behind += 7
    return current_date - datetime.timedelta(days=days_behind)

def next_weekday(current_date: datetime.date, weekday_target: int) -> datetime.date:
    days_ahead = weekday_target - current_date.weekday()
    if days_ahead <= 0:
        days_ahead += 7
    return current_date + datetime.timedelta(days=days_ahead)

def preprocess_query(user_query: str) -> str:
    today = datetime.date.today()
    year = today.year
    user_query = re.sub(r"\bthis year\b", str(year), user_query, flags=re.IGNORECASE)
    for holiday, func in HOLIDAYS.items():
        user_query = re.sub(holiday, func(year), user_query, flags=re.IGNORECASE)
    user_query = re.sub(r"\btoday\b", today.isoformat(), user_query, flags=re.IGNORECASE)
    user_query = re.sub(r"\btomorrow\b", (today + datetime.timedelta(days=1)).isoformat(), user_query, flags=re.IGNORECASE)
    for name, idx in WEEKDAYS.items():
        user_query = re.sub(rf"next {name}", next_weekday(today, idx).isoformat(), user_query, flags=re.IGNORECASE)
        user_query = re.sub(rf"last {name}", previous_weekday(today, idx).isoformat(), user_query, flags=re.IGNORECASE)
    return user_query


# -------------------- Main --------------------
def detect_intent(user_query: str):
    processed_query = preprocess_query(user_query)
    response = model.generate_content(
        processed_query,
        generation_config=genai.GenerationConfig(response_mime_type="application/json")
    )
    try:
        data = json.loads(response.text)
        return data
    except Exception:
        return {"error": "Invalid or non-JSON response", "raw": response.text}


# -------------------- Test --------------------
if __name__ == "__main__":
    test_queries = [
        "how to predict rentals in RideWise?",
        "what are rentals tomorrow evening?",
        "can I switch to dark mode?",
        "who won the cricket match last night?"
    ]
    for query in test_queries:
        print(f"\n🧑 User Query: {query}")
        intent_data = detect_intent(query)
        print("🤖 Detected Intent JSON:")
        print(json.dumps(intent_data, indent=2))

        
    