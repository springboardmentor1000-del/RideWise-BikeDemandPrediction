import os
import json
import hashlib
from functools import wraps
from datetime import datetime, date, time, timedelta
from typing import Any, Dict, List, Tuple

import numpy as np
import pandas as pd
from flask import Flask, jsonify, render_template, request, redirect, url_for, session, flash


# ------------------------------
# Shared constants/helpers (duplicated from Streamlit app for isolation)
# ------------------------------
WEATHER_OPTIONS: List[str] = [
    "Clear/Few Clouds",
    "Cloudy/Overcast",
    "Mist/Haze",
    "Light Rain/Snow",
    "Heavy Rain/Snow/Thunderstorm",
]

HOURLY_MODEL_CANDIDATES: List[str] = [
    "ridewise_hourly_gb_model.pkl",
    "hourly_model.pkl",
    "model_hourly.pkl",
]

DAILY_MODEL_CANDIDATES: List[str] = [
    "ridewise_daily_gb_model.pkl",
    "daily_model.pkl",
    "model_daily.pkl",
]


def find_default_model_path(candidates: List[str]) -> str:
    for cand in candidates:
        if os.path.exists(cand):
            return cand
    return candidates[0]


def map_weather_condition(condition: str) -> int:
    mapping = {name: idx for idx, name in enumerate(WEATHER_OPTIONS)}
    return mapping.get(condition, 0)


def build_feature_row(
    target_dt: datetime,
    temperature_c: float,
    humidity_pct: float,
    windspeed_kph: float,
    weather_condition: str,
    is_holiday: bool,
    is_working_day: bool,
    is_weekend_override: int | None = None,
) -> Dict[str, Any]:
    hour = target_dt.hour
    dayofweek = target_dt.weekday()
    month = target_dt.month
    day = target_dt.day
    is_weekend = 1 if dayofweek >= 5 else 0
    if is_weekend_override is not None:
        is_weekend = 1 if int(is_weekend_override) == 1 else 0

    if month in (12, 1, 2):
        season = 1
    elif month in (3, 4, 5):
        season = 2
    elif month in (6, 7, 8):
        season = 3
    else:
        season = 4

    return {
        "temp_c": temperature_c,
        "humidity_pct": humidity_pct,
        "windspeed_kph": windspeed_kph,
        "weather_code": map_weather_condition(weather_condition),
        "is_holiday": 1 if is_holiday else 0,
        "is_working_day": 1 if is_working_day else 0,
        "hour": hour,
        "dayofweek": dayofweek,
        "is_weekend": is_weekend,
        "month": month,
        "day": day,
        "season": season,
    }


def _translate_feature_names(raw_row: Dict[str, Any]) -> Dict[str, Any]:
    translated = dict(raw_row)
    if "hour" in raw_row:
        translated["hr"] = raw_row["hour"]
    if "month" in raw_row:
        translated["mnth"] = raw_row["month"]
    if "dayofweek" in raw_row:
        translated["weekday"] = raw_row["dayofweek"]
    if "is_working_day" in raw_row:
        translated["workingday"] = 1 if raw_row["is_working_day"] else 0
    if "is_holiday" in raw_row:
        translated["holiday"] = 1 if raw_row["is_holiday"] else 0
    if "weather_code" in raw_row:
        translated["weathersit"] = raw_row["weather_code"]
    if "temperature_c" in raw_row or "temp_c" in raw_row:
        translated["atemp"] = raw_row.get("temperature_c", raw_row.get("temp_c"))
        translated["temp"] = raw_row.get("temperature_c", raw_row.get("temp_c"))
    if "humidity_pct" in raw_row:
        translated["hum"] = raw_row["humidity_pct"]
    if "windspeed_kph" in raw_row:
        translated["windspeed"] = raw_row["windspeed_kph"]
    return translated


def _align_features_to_model(model, df: pd.DataFrame) -> Tuple[pd.DataFrame, List[str]]:
    feature_names = getattr(model, "feature_names_in_", None)
    if feature_names is None:
        return df, []
    missing = [c for c in feature_names if c not in df.columns]
    if missing:
        for c in missing:
            df[c] = 0
    aligned = df[feature_names]
    return aligned, missing


def load_model(model_path: str, loader: str):
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at '{model_path}'.")

    def try_joblib(p: str):
        try:
            import joblib
            return joblib.load(p)
        except Exception as e:
            return e

    def try_pickle(p: str):
        try:
            import pickle
            with open(p, "rb") as f:
                return pickle.load(f)
        except Exception as e:
            return e

    def try_cloudpickle(p: str):
        try:
            import cloudpickle
            with open(p, "rb") as f:
                return cloudpickle.load(f)
        except Exception as e:
            return e

    attempts = []
    if loader == "joblib":
        attempts = [try_joblib]
    elif loader == "pickle":
        attempts = [try_pickle]
    elif loader == "cloudpickle":
        attempts = [try_cloudpickle]
    else:
        attempts = [try_joblib, try_pickle, try_cloudpickle]

    last_error = None
    for attempt in attempts:
        res = attempt(model_path)
        if not isinstance(res, Exception):
            return res
        last_error = res
    raise RuntimeError(f"Failed to load model: {type(last_error).__name__}: {last_error}")


def predict_hourly(model, feature_row: Dict[str, Any]) -> Tuple[float, List[str]]:
    translated = _translate_feature_names(feature_row)
    df = pd.DataFrame([translated])
    df, imputed = _align_features_to_model(model, df)
    y_pred = model.predict(df)
    return max(float(y_pred[0]), 0.0), imputed


def predict_daily(model, base_dt: datetime, common_features: Dict[str, Any]) -> Dict[str, Any]:
    row = build_feature_row(
        target_dt=base_dt,
        temperature_c=common_features["temp_c"],
        humidity_pct=common_features["humidity_pct"],
        windspeed_kph=common_features["windspeed_kph"],
        weather_condition=common_features["weather_condition"],
        is_holiday=common_features["is_holiday"],
        is_working_day=common_features["is_working_day"],
        is_weekend_override=common_features.get("is_weekend_override"),
    )
    df = pd.DataFrame([_translate_feature_names(row)])
    df, imputed = _align_features_to_model(model, df)
    total_pred = float(model.predict(df)[0])
    total_pred = max(total_pred, 0.0)

    weekday_profile = np.array([
        0.01, 0.005, 0.005, 0.005, 0.01, 0.02, 0.05, 0.08, 0.1, 0.06, 0.04, 0.035,
        0.035, 0.04, 0.05, 0.06, 0.08, 0.12, 0.11, 0.07, 0.035, 0.02, 0.01, 0.005
    ])
    weekend_profile = np.array([
        0.01, 0.008, 0.008, 0.008, 0.01, 0.02, 0.03, 0.05, 0.07, 0.08, 0.09, 0.095,
        0.095, 0.09, 0.08, 0.07, 0.06, 0.05, 0.04, 0.03, 0.02, 0.015, 0.012, 0.01
    ])
    is_weekend = row["is_weekend"] == 1
    profile = weekend_profile if is_weekend else weekday_profile
    profile = profile / profile.sum()
    by_hour = (profile * total_pred).tolist()

    return {
        "total": float(total_pred),
        "average": float(np.mean(by_hour)),
        "by_hour": by_hour,
        "imputed": imputed,
    }


app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "dev-secret-change-me")

USERS_FILE = "users.json"
HISTORY_FILE = "prediction_history.json"

# Optional: Gemini setup for natural language parsing
GEMINI_API_KEY = os.environ.get("GOOGLE_API_KEY")
gemini_model = None
if GEMINI_API_KEY:
    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        gemini_model = genai.GenerativeModel("gemini-1.5-flash")
    except Exception:
        gemini_model = None


def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def _load_users() -> Dict[str, Any]:
    if not os.path.exists(USERS_FILE):
        return {"users": []}
    try:
        with open(USERS_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            if isinstance(data, dict) and "users" in data:
                return data
    except Exception:
        pass
    return {"users": []}


def _save_users(data: Dict[str, Any]) -> None:
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def _find_user_by_email(users: List[Dict[str, Any]], email: str):
    email_l = (email or "").strip().lower()
    for u in users:
        if (u.get("email", "").strip().lower()) == email_l:
            return u
    return None


def _load_history() -> Dict[str, Any]:
    if not os.path.exists(HISTORY_FILE):
        return {"predictions": []}
    try:
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            if isinstance(data, dict) and "predictions" in data:
                return data
    except Exception:
        pass
    return {"predictions": []}


def _save_history(data: Dict[str, Any]) -> None:
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def login_required(view_func):
    @wraps(view_func)
    def wrapper(*args, **kwargs):
        if not session.get("user"):
            return redirect(url_for("signin"))
        return view_func(*args, **kwargs)
    return wrapper


@app.get("/")
def index():
    if session.get("user"):
        return redirect(url_for("home"))
    return redirect(url_for("signin"))


@app.context_processor
def inject_background_url():
    """Expose background image URL if present (png preferred, then jpg)."""
    png_path = os.path.join(app.static_folder or "static", "background.png")
    jpg_path = os.path.join(app.static_folder or "static", "background.jpg")
    bg = None
    if os.path.exists(png_path):
        bg = url_for("static", filename="background.png")
    elif os.path.exists(jpg_path):
        bg = url_for("static", filename="background.jpg")
    return {"background_url": bg}


@app.route("/signin", methods=["GET", "POST"])
def signin():
    if request.method == "POST":
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")
        data = _load_users()
        user = _find_user_by_email(data.get("users", []), email)
        if not user or user.get("password_hash") != _hash_password(password):
            flash("Invalid email or password", "error")
            return render_template("signin.html")
        session["user"] = {"username": user.get("username"), "email": user.get("email")}
        return redirect(url_for("home"))
    return render_template("signin.html")


@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")
        confirm = request.form.get("confirm", "")
        if not username or not email or not password:
            flash("All fields are required", "error")
            return render_template("signup.html")
        if password != confirm:
            flash("Passwords do not match", "error")
            return render_template("signup.html")
        data = _load_users()
        if _find_user_by_email(data.get("users", []), email):
            flash("Email already registered. Please sign in.", "error")
            return render_template("signup.html")
        data.setdefault("users", []).append({
            "username": username,
            "email": email,
            "password_hash": _hash_password(password),
        })
        _save_users(data)
        flash("Account created. Please sign in.", "success")
        return redirect(url_for("signin"))
    return render_template("signup.html")


@app.get("/logout")
def logout():
    session.pop("user", None)
    return redirect(url_for("signin"))


@app.get("/home")
@login_required
def home():
    hour_model_path = find_default_model_path(HOURLY_MODEL_CANDIDATES)
    day_model_path = find_default_model_path(DAILY_MODEL_CANDIDATES)
    
    # Get user's prediction history
    history = _load_history()
    user_email = session.get("user", {}).get("email", "")
    user_history = [p for p in history.get("predictions", []) if p.get("user_email") == user_email]
    
    return render_template(
        "home.html",
        weather_options=WEATHER_OPTIONS,
        hour_model_path=hour_model_path,
        day_model_path=day_model_path,
        user=session.get("user"),
        history=user_history[-20:],  # Last 20 predictions
    )


@app.get("/api/history")
@login_required
def api_history():
    history = _load_history()
    user_email = session.get("user", {}).get("email", "")
    user_history = [p for p in history.get("predictions", []) if p.get("user_email") == user_email]
    return jsonify({"history": user_history[-20:]})


@app.post("/api/predict_hourly")
def api_predict_hourly():
    data = request.get_json(force=True, silent=True) or request.form
    try:
        model_path = data.get("model_path") or find_default_model_path(HOURLY_MODEL_CANDIDATES)
        loader = data.get("loader", "auto")
        target_date_str = data.get("target_date")
        target_hour = int(data.get("target_hour", 17))
        temperature_c = float(data.get("temperature_c", 20.0))
        humidity_pct = float(data.get("humidity_pct", 60))
        windspeed_kph = float(data.get("windspeed_kph", 12.0))
        weather = data.get("weather_condition", WEATHER_OPTIONS[0])
        is_holiday = str(data.get("is_holiday", "false")).lower() in ("1", "true", "yes", "on")
        is_working_day = str(data.get("is_working_day", "true")).lower() in ("1", "true", "yes", "on")
        day_type = data.get("day_type", "Weekday")

        if target_date_str:
            target_date = datetime.strptime(target_date_str, "%Y-%m-%d").date()
        else:
            target_date = date.today()

        model = load_model(model_path, loader)
        target_dt = datetime.combine(target_date, time(target_hour, 0))
        row = build_feature_row(
            target_dt=target_dt,
            temperature_c=temperature_c,
            humidity_pct=humidity_pct,
            windspeed_kph=windspeed_kph,
            weather_condition=weather,
            is_holiday=is_holiday,
            is_working_day=is_working_day,
            is_weekend_override=1 if day_type == "Weekend" else 0,
        )
        pred, imputed = predict_hourly(model, row)

        # Build a 24-hour profile for visualization on the same date
        rows_24: List[Dict[str, Any]] = []
        for h in range(24):
            dt_h = datetime.combine(target_date, time(h, 0))
            r = build_feature_row(
                target_dt=dt_h,
                temperature_c=float(temperature_c),
                humidity_pct=float(humidity_pct),
                windspeed_kph=float(windspeed_kph),
                weather_condition=weather,
                is_holiday=bool(is_holiday),
                is_working_day=bool(is_working_day),
                is_weekend_override=1 if day_type == "Weekend" else 0,
            )
            rows_24.append(r)
        df24 = pd.DataFrame([_translate_feature_names(r) for r in rows_24])
        df24, _ = _align_features_to_model(model, df24)
        y24 = model.predict(df24)
        y24 = [max(float(v), 0.0) for v in y24]

        rounded = int(round(pred))
        
        # Save to history
        if session.get("user"):
            history = _load_history()
            history["predictions"].append({
                "type": "hourly",
                "user_email": session["user"]["email"],
                "date": target_date_str or str(date.today()),
                "hour": target_hour,
                "prediction": rounded,
                "timestamp": datetime.now().isoformat(),
            })
            _save_history(history)
        
        return jsonify({
            "prediction": pred,
            "rounded": rounded,
            "imputed": imputed,
            "by_hour_24": y24,
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.post("/api/predict_daily")
def api_predict_daily():
    data = request.get_json(force=True, silent=True) or request.form
    try:
        model_path = data.get("model_path") or find_default_model_path(DAILY_MODEL_CANDIDATES)
        loader = data.get("loader", "auto")
        target_date_str = data.get("target_date")
        temperature_c = float(data.get("temperature_c", 18.0))
        humidity_pct = float(data.get("humidity_pct", 65))
        windspeed_kph = float(data.get("windspeed_kph", 14.0))
        weather = data.get("weather_condition", WEATHER_OPTIONS[1])
        is_holiday = str(data.get("is_holiday", "false")).lower() in ("1", "true", "yes", "on")
        is_working_day = str(data.get("is_working_day", "true")).lower() in ("1", "true", "yes", "on")
        day_type = data.get("day_type", "Weekday")

        if target_date_str:
            target_date = datetime.strptime(target_date_str, "%Y-%m-%d").date()
        else:
            target_date = date.today()

        base_dt = datetime.combine(target_date, time(0, 0))
        common = {
            "temp_c": temperature_c,
            "humidity_pct": humidity_pct,
            "windspeed_kph": windspeed_kph,
            "weather_condition": weather,
            "is_holiday": is_holiday,
            "is_working_day": is_working_day,
            "is_weekend_override": 1 if day_type == "Weekend" else 0,
        }
        model = load_model(model_path, loader)
        results = predict_daily(model, base_dt, common)
        results["rounded_total"] = int(round(results["total"]))
        
        # Save to history
        if session.get("user"):
            history = _load_history()
            history["predictions"].append({
                "type": "daily",
                "user_email": session["user"]["email"],
                "date": target_date_str or str(date.today()),
                "prediction": results["rounded_total"],
                "timestamp": datetime.now().isoformat(),
            })
            _save_history(history)
        
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ------------------------------
# Chat endpoint: parse natural language and respond with predictions
# ------------------------------
@app.post("/api/chat")
def api_chat():
    data = request.get_json(force=True, silent=True) or request.form
    message = (data.get("message") or "").strip().lower()
    # If user not logged in, return JSON 401 instead of HTML redirect
    if not session.get("user"):
        return jsonify({"error": "Please sign in to use the chatbot."}), 401
    if not message:
        return jsonify({"reply": "Please enter a question like 'how many bikes will be rented tomorrow at 5pm?'"})

    # Simple parsing for date and hour
    import re
    now = datetime.now()

    # First, try Gemini to extract structure if available
    parsed = {"kind": None, "date": None, "hour": None}
    if gemini_model is not None:
        try:
            prompt = (
                "Extract prediction intent from the user message. Return STRICT JSON with keys: "
                "kind ('hourly' or 'daily'), date (YYYY-MM-DD), hour (0-23 or null).\n"
                "Message: " + message
            )
            resp = gemini_model.generate_content(prompt)
            import json as _json
            # Attempt to find a JSON object in the response
            txt = resp.text or "{}"
            start = txt.find("{")
            end = txt.rfind("}")
            if start != -1 and end != -1 and end > start:
                parsed = _json.loads(txt[start:end+1])
        except Exception:
            parsed = {"kind": None, "date": None, "hour": None}

    # Date detection
    target_date = None
    # If Gemini parsed a date, prefer it
    if isinstance(parsed.get("date"), str):
        try:
            target_date = datetime.strptime(parsed["date"], "%Y-%m-%d").date()
        except Exception:
            target_date = None

    # tomorrow / today (fallback)
    tomorrow_aliases = ("tomorrow", "tommorow", "tmrw", "next day")
    if target_date is None and any(a in message for a in tomorrow_aliases):
        target_date = (date.today() + timedelta(days=1))
    elif target_date is None and "today" in message:
        target_date = date.today()

    # Explicit preference phrases
    if target_date is None and ("not today" in message or "instead tomorrow" in message):
        target_date = (date.today() + timedelta(days=1))

    # explicit date: 25 nov 2025 / 25 november 2025 / 2025-11-25 / 11/25/2025
    if target_date is None:
        # try DD Mon YYYY
        m = re.search(r"\b(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\s+(\d{4})\b", message)
        if m:
            day = int(m.group(1))
            mon_str = m.group(2)
            year = int(m.group(3))
            mon_map = {
                'jan':1,'january':1,'feb':2,'february':2,'mar':3,'march':3,'apr':4,'april':4,'may':5,'jun':6,'june':6,
                'jul':7,'july':7,'aug':8,'august':8,'sep':9,'sept':9,'september':9,'oct':10,'october':10,'nov':11,'november':11,'dec':12,'december':12
            }
            month = mon_map.get(mon_str, None)
            if month:
                try:
                    target_date = date(year, month, day)
                except Exception:
                    target_date = None
        # try YYYY-MM-DD
        if target_date is None:
            m = re.search(r"\b(20\d{2})-(\d{1,2})-(\d{1,2})\b", message)
            if m:
                y, mo, d = int(m.group(1)), int(m.group(2)), int(m.group(3))
                try:
                    target_date = date(y, mo, d)
                except Exception:
                    target_date = None
        # try DD/MM/YYYY or MM/DD/YYYY (ambiguous). Prefer DD/MM/YYYY if day>12
        if target_date is None:
            m = re.search(r"\b(\d{1,2})/(\d{1,2})/(20\d{2})\b", message)
            if m:
                a, b, y = int(m.group(1)), int(m.group(2)), int(m.group(3))
                # if a>12 it's DD/MM/YYYY else assume MM/DD/YYYY
                if a > 12:
                    dd, mm = a, b
                else:
                    mm, dd = a, b
                try:
                    target_date = date(y, mm, dd)
                except Exception:
                    target_date = None

    # Hour detection (do NOT misinterpret dates like "25 Nov" as hour)
    target_hour = None
    # Prefer Gemini parse
    if isinstance(parsed.get("hour"), int):
        target_hour = max(0, min(23, int(parsed["hour"])))
    else:
        # Only accept a time if either:
        #  - prefixed with 'at '
        #  - has am/pm
        #  - has a colon (HH:MM)
        # This avoids matching bare numbers in dates
        time_match = re.search(r"\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b", message)
        ampm_match = re.search(r"\b(\d{1,2})\s*(am|pm)\b", message)
        colon_match = re.search(r"\b(\d{1,2}):(\d{2})\b", message)
        hh = None
        ampm = None
        if time_match:
            hh = int(time_match.group(1))
            ampm = time_match.group(3)
        elif ampm_match:
            hh = int(ampm_match.group(1))
            ampm = ampm_match.group(2)
        elif colon_match:
            hh = int(colon_match.group(1))
        if hh is not None:
            if ampm:
                if ampm == 'pm' and hh != 12:
                    hh += 12
                if ampm == 'am' and hh == 12:
                    hh = 0
            hh = max(0, min(23, hh))
            target_hour = hh

    # Decide hourly vs daily
    wants_hourly = False
    if parsed.get("kind") in ("hourly", "daily"):
        wants_hourly = parsed["kind"] == "hourly"
    else:
        wants_hourly = (target_hour is not None)

    # Intent gating: only predict when user asks about demand/rent/bike or provided a date/time
    intent_keywords = ("predict", "demand", "bike", "bikes", "rent")
    has_intent = any(k in message for k in intent_keywords) or (target_date is not None) or (target_hour is not None)
    if not has_intent:
        # If Gemini available, answer general question; else guide
        if gemini_model is not None:
            try:
                resp = gemini_model.generate_content(
                    "You are RideWise assistant. Briefly answer about bike demand prediction app capabilities in 1-2 sentences. Question: " + message
                )
                txt = resp.text.strip() if getattr(resp, 'text', None) else ""
                if not txt:
                    txt = "I can forecast bike demand hourly or daily based on weather and day type. Try asking a specific prediction question."
                return jsonify({"reply": txt})
            except Exception:
                pass
        return jsonify({
            "reply": (
                "Hi! Ask me things like 'How many bikes will be rented tomorrow at 5pm?' "
                "or 'What is the expected bike demand on 25 Nov 2025?'"
            )
        })

    # Defaults for weather if not provided
    def compute_defaults(d: date):
        dayofweek = d.weekday()
        is_weekend = dayofweek >= 5
        return {
            "temp_c": 20.0,
            "humidity_pct": 60.0,
            "windspeed_kph": 12.0,
            "weather_condition": WEATHER_OPTIONS[0],
            "is_holiday": False,
            "is_working_day": not is_weekend,
            "day_type": "Weekend" if is_weekend else "Weekday",
        }

    # Run prediction
    if target_date is None:
        target_date = date.today()
    defaults = compute_defaults(target_date)
    if wants_hourly:
        if target_hour is None:
            target_hour = 17
        # hourly prediction
        model_path = find_default_model_path(HOURLY_MODEL_CANDIDATES)
        loader = "auto"
        model = load_model(model_path, loader)
        target_dt = datetime.combine(target_date, time(target_hour, 0))
        row = build_feature_row(
            target_dt=target_dt,
            temperature_c=defaults["temp_c"],
            humidity_pct=defaults["humidity_pct"],
            windspeed_kph=defaults["windspeed_kph"],
            weather_condition=defaults["weather_condition"],
            is_holiday=defaults["is_holiday"],
            is_working_day=defaults["is_working_day"],
            is_weekend_override=1 if defaults["day_type"] == "Weekend" else 0,
        )
        pred, _ = predict_hourly(model, row)
        reply = f"Predicted bikes for {target_date.strftime('%Y-%m-%d')} at {target_hour:02d}:00: {int(round(pred))}."
    else:
        # daily prediction
        model_path = find_default_model_path(DAILY_MODEL_CANDIDATES)
        loader = "auto"
        model = load_model(model_path, loader)
        base_dt = datetime.combine(target_date, time(0, 0))
        results = predict_daily(model, base_dt, defaults)
        reply = f"Predicted total bikes on {target_date.strftime('%Y-%m-%d')}: {int(round(results['total']))}."

    return jsonify({"reply": reply})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=True)


