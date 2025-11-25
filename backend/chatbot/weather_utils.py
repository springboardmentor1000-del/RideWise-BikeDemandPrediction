# backend/chatbot/weather_utils.py
import requests
import datetime
import sys
import holidays


# --- Weather helper mappings ---
def get_season(month: int) -> int:
    """Return season code like Bike Sharing dataset (1=spring, 2=summer, 3=fall, 4=winter)."""
    if month in [3, 4, 5]:
        return 1
    elif month in [6, 7, 8]:
        return 2
    elif month in [9, 10, 11]:
        return 3
    else:
        return 4


def get_weathersit_from_code(code: int) -> int:
    """Map Open-Meteo weather codes to numeric weathersit (1–4)."""
    if code == 0:
        return 1  # Clear
    elif code in [1, 2, 3]:
        return 2  # Cloudy
    elif code in [45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67]:
        return 3  # Light Rain / Mist
    elif code in [71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99]:
        return 4  # Snow / Storm / Heavy
    return 1


def is_holiday(date_obj: datetime.date) -> int:
    """Return 1 if holiday (India), else 0."""
    in_holidays = holidays.IN(years=date_obj.year)
    return 1 if date_obj in in_holidays else 0


def is_workingday(date_obj: datetime.date) -> int:
    """Return 1 if weekday and not a holiday, else 0."""
    return 0 if date_obj.weekday() >= 5 or is_holiday(date_obj) else 1


# --- Main geocoding function ---
def get_coordinates(city: str):
    """Get latitude and longitude for city name using Open-Meteo geocoding API."""
    geo_url = "https://geocoding-api.open-meteo.com/v1/search"
    geo_params = {"name": city, "count": 1}
    geo_res = requests.get(geo_url, params=geo_params, timeout=10)

    if geo_res.status_code != 200:
        raise Exception(f"Geocoding error {geo_res.status_code}: {geo_res.text}")

    results = geo_res.json().get("results")
    if not results:
        raise Exception(f"City '{city}' not found in geocoding API.")

    place = results[0]
    return place["latitude"], place["longitude"], place["name"], place.get("country", "")


# --- Core function used by chatbot ---
def get_weather_for_datetime(city: str, date_str: str, hour: int = 12) -> dict:
    """
    Fetch weather for specific city, date, and hour using Open-Meteo.
    Auto-selects historical or forecast endpoint depending on date.
    """
    target_dt = datetime.datetime.strptime(date_str, "%Y-%m-%d")
    today = datetime.datetime.utcnow().date()

    # --- Step 1: Geocode ---
    lat, lon, city_name, country = get_coordinates(city)

    # --- Step 2: Choose endpoint ---
    if target_dt.date() < today:
        base_url = "https://archive-api.open-meteo.com/v1/archive"
        print("🕰️ Using historical API...")
    else:
        base_url = "https://api.open-meteo.com/v1/forecast"
        print("🌤️ Using forecast API...")

    # --- Step 3: Build params ---
    params = {
        "latitude": lat,
        "longitude": lon,
        "start_date": target_dt.date().isoformat(),
        "end_date": target_dt.date().isoformat(),
        "hourly": "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weathercode",
        "timezone": "auto",
    }

    # --- Step 4: Fetch data ---
    try:
        res = requests.get(base_url, params=params, timeout=15)
        res.raise_for_status()
        data = res.json()

        if "hourly" not in data:
            raise Exception("No hourly weather data found.")

        times = data["hourly"]["time"]
        temps = data["hourly"]["temperature_2m"]
        feels = data["hourly"]["apparent_temperature"]
        hums = data["hourly"]["relative_humidity_2m"]
        winds = data["hourly"]["wind_speed_10m"]
        codes = data["hourly"]["weathercode"]

        # Find closest hour index
        target_dt_full = target_dt.replace(hour=hour)
        closest_idx = min(
            range(len(times)),
            key=lambda i: abs(datetime.datetime.fromisoformat(times[i]) - target_dt_full),
        )

        temp = temps[closest_idx]
        atemp = feels[closest_idx]
        hum = hums[closest_idx]
        wind = winds[closest_idx]
        code = codes[closest_idx]
        weathersit = get_weathersit_from_code(code)

    except Exception as e:
        print(f"[WeatherUtils] ⚠️ API fetch failed: {e}")
        # fallback defaults
        temp, atemp, hum, wind, weathersit = 25.0, 27.0, 60.0, 10.0, 1

    # --- Step 5: Derived values ---
    season = get_season(target_dt.month)
    holiday = is_holiday(target_dt)
    workingday = is_workingday(target_dt)

    # --- Step 6: Return weather data ---
    weather_info = {
        "city": city_name,
        "country": country,
        "date": date_str,
        "hour": hour,
        "temp": round(temp, 2),
        "atemp": round(atemp, 2),
        "humidity": round(hum, 2),
        "windspeed": round(wind, 2),
        "season": season,
        "weathersit": weathersit,
        "holiday": holiday,
        "workingday": workingday,
    }

    
    return weather_info
