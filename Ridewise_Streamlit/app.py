import os
import sys
from datetime import datetime, date, time, timedelta
from typing import Dict, Any, List

import numpy as np
import pandas as pd
import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import json
import hashlib
import base64


# ------------------------------
# App Config
# ------------------------------
st.set_page_config(page_title="RideWise - Bike Demand Prediction", page_icon="🚲", layout="centered")
# ------------------------------
# Background Image Helper
# ------------------------------
def _encode_image_base64(path: str) -> str | None:
    try:
        with open(path, "rb") as f:
            return base64.b64encode(f.read()).decode()
    except Exception:
        return None


def set_background_image():
    candidates = ["background.jpg", "background.png", "assets/background.jpg", "assets/background.png"]
    img64 = None
    mime = "image/jpeg"
    for p in candidates:
        if os.path.exists(p):
            img64 = _encode_image_base64(p)
            if p.endswith(".png"):
                mime = "image/png"
            break
    if not img64:
        return
    css = f"""
    <style>
    .stApp {{
        background: url("data:{mime};base64,{img64}") no-repeat center center fixed;
        background-size: cover;
    }}
    /* Optional: add subtle overlay for readability */
    .stApp > div:first-child {{
        backdrop-filter: none;
    }}
    </style>
    """
    st.markdown(css, unsafe_allow_html=True)
# ------------------------------
# Simple Auth Helpers (local JSON, demo only)
# ------------------------------
USERS_FILE = "users.json"


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


def _find_user_by_email(users: list, email: str) -> Dict[str, Any] | None:
    email_l = email.strip().lower()
    for u in users:
        if u.get("email", "").strip().lower() == email_l:
            return u
    return None


def render_auth() -> bool:
    if "auth_user" not in st.session_state:
        st.session_state.auth_user = None
    if "auth_tab" not in st.session_state:
        st.session_state.auth_tab = "Sign In"

    st.sidebar.header("Account 👤")
    if st.session_state.auth_user:
        u = st.session_state.auth_user
        st.sidebar.success(f"✅ Signed in as {u['username']}\n{u['email']}")
        if st.sidebar.button("Log out 🚪"):
            st.session_state.auth_user = None
        return True

    tab = st.sidebar.radio("Authentication", options=["Sign In", "Sign Up"], index=0)
    st.session_state.auth_tab = tab

    if tab == "Sign Up":
        st.subheader("✍️ Create your account")
        col1, col2 = st.columns(2)
        with col1:
            username = st.text_input("Username", max_chars=40)
            email = st.text_input("Email")
        with col2:
            password = st.text_input("Password", type="password")
            password2 = st.text_input("Confirm Password", type="password")
        btn = st.button("Sign Up ✨", type="primary")
        if btn:
            if not username or not email or not password:
                st.error("All fields are required.")
            elif password != password2:
                st.error("Passwords do not match.")
            else:
                data = _load_users()
                if _find_user_by_email(data["users"], email):
                    st.error("Email already registered. Please sign in.")
                else:
                    user = {
                        "username": username.strip(),
                        "email": email.strip(),
                        "password_hash": _hash_password(password),
                    }
                    data["users"].append(user)
                    _save_users(data)
                    st.success("Account created. You can now sign in.")
        return False
    else:
        st.subheader("👋 Welcome back")
        email = st.text_input("Email")
        password = st.text_input("Password", type="password")
        btn = st.button("Sign In ▶️", type="primary")
        if btn:
            data = _load_users()
            user = _find_user_by_email(data["users"], email)
            if not user:
                st.error("No account found for this email.")
            else:
                if user.get("password_hash") == _hash_password(password):
                    st.session_state.auth_user = {"username": user["username"], "email": user["email"]}
                    st.rerun()
                else:
                    st.error("Incorrect password.")
        return False


# ------------------------------
# Model Loading
# ------------------------------
@st.cache_resource(show_spinner=True)
def load_model(model_path: str, loader: str, file_mtime: float):
    """Load a model from disk with multiple strategies. file_mtime is used to bust cache."""
    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"Model file not found at '{model_path}'. Update the path in the sidebar under 'Model settings'."
        )

    last_error = None

    def try_joblib(p: str):
        try:
            import joblib
            return joblib.load(p)
        except Exception as e:  # noqa: BLE001
            return e

    def try_pickle(p: str):
        try:
            import pickle
            with open(p, "rb") as f:
                return pickle.load(f)
        except Exception as e:  # noqa: BLE001
            return e

    def try_cloudpickle(p: str):
        try:
            import cloudpickle
            with open(p, "rb") as f:
                return cloudpickle.load(f)
        except Exception as e:  # noqa: BLE001
            return e

    attempts = []
    if loader == "joblib":
        attempts = [try_joblib]
    elif loader == "pickle":
        attempts = [try_pickle]
    elif loader == "cloudpickle":
        attempts = [try_cloudpickle]
    else:  # auto
        attempts = [try_joblib, try_pickle, try_cloudpickle]

    for attempt in attempts:
        res = attempt(model_path)
        if not isinstance(res, Exception):
            return res
        last_error = res

    raise RuntimeError(
        "Failed to load model. Try a different load method in 'Model settings'.\n"
        f"Underlying error: {type(last_error).__name__}: {last_error}"
    )


# ------------------------------
# Feature Engineering Helpers
# ------------------------------
WEATHER_OPTIONS = [
    "Clear/Few Clouds",
    "Cloudy/Overcast",
    "Mist/Haze",
    "Light Rain/Snow",
    "Heavy Rain/Snow/Thunderstorm",
]

HOURLY_MODEL_CANDIDATES = [
    "ridewise_hourly_gb_model.pkl",
    "hourly_model.pkl",
    "model_hourly.pkl",
]

DAILY_MODEL_CANDIDATES = [
    "ridewise_daily_gb_model.pkl",
    "daily_model.pkl",
    "model_daily.pkl",
]


def find_default_model_path(candidates: list) -> str:
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
    # Date-time derived features
    hour = target_dt.hour
    dayofweek = target_dt.weekday()  # Monday=0
    month = target_dt.month
    day = target_dt.day
    is_weekend = 1 if dayofweek >= 5 else 0
    if is_weekend_override is not None:
        is_weekend = 1 if int(is_weekend_override) == 1 else 0

    # Season: simple meteorological mapping (can be adjusted to your dataset)
    # 1: Winter, 2: Spring, 3: Summer, 4: Autumn
    if month in (12, 1, 2):
        season = 1
    elif month in (3, 4, 5):
        season = 2
    elif month in (6, 7, 8):
        season = 3
    else:
        season = 4

    # Normalizations/encodings: keep raw values; model should match training schema
    features: Dict[str, Any] = {
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
    return features


def _translate_feature_names(raw_row: Dict[str, Any]) -> Dict[str, Any]:
    """Map app feature names to common training schema names (Bike Sharing-like)."""
    translated = dict(raw_row)
    # Likely schema mappings
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
        # Use apparent temperature field name common in datasets
        translated["atemp"] = raw_row.get("temperature_c", raw_row.get("temp_c"))
        translated["temp"] = raw_row.get("temperature_c", raw_row.get("temp_c"))
    if "humidity_pct" in raw_row:
        translated["hum"] = raw_row["humidity_pct"]
    if "windspeed_kph" in raw_row:
        translated["windspeed"] = raw_row["windspeed_kph"]
    return translated


def _align_features_to_model(model, df: pd.DataFrame) -> (pd.DataFrame, List[str]):
    """Ensure DataFrame matches model.feature_names_in_. Return aligned df and list of imputed columns."""
    feature_names = getattr(model, "feature_names_in_", None)
    if feature_names is None:
        return df, []
    missing = [c for c in feature_names if c not in df.columns]
    if missing:
        for c in missing:
            df[c] = 0
    aligned = df[feature_names]
    return aligned, missing


def predict_hourly(model, feature_row: Dict[str, Any]) -> (float, List[str]):
    translated = _translate_feature_names(feature_row)
    df = pd.DataFrame([translated])
    df, imputed = _align_features_to_model(model, df)
    y_pred = model.predict(df)
    # Ensure non-negative rentals
    return max(float(y_pred[0]), 0.0), imputed


def predict_daily(model, base_dt: datetime, common_features: Dict[str, Any]) -> Dict[str, Any]:
    # Build a single daily feature row (hour ignored if model doesn't use it)
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

    # Create an hourly distribution profile to visualize how demand spreads across the day
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
    profile = profile / profile.sum()  # normalize
    by_hour = (profile * total_pred).tolist()

    return {
        "total": float(total_pred),
        "average": float(np.mean(by_hour)),
        "by_hour": by_hour,
        "imputed": imputed,
    }


# ------------------------------
# UI Components
# ------------------------------
def sidebar_inputs():
    st.sidebar.header("Prediction Options ⚙️")
    mode = st.sidebar.radio("Select prediction type", options=["Hourly", "Daily"], index=0)

    # Auto-detect models without exposing settings in the UI
    h_detected = find_default_model_path(HOURLY_MODEL_CANDIDATES)
    d_detected = find_default_model_path(DAILY_MODEL_CANDIDATES)
    try:
        h_mtime = os.path.getmtime(h_detected) if os.path.exists(h_detected) else 0.0
    except Exception:  # noqa: BLE001
        h_mtime = 0.0
    try:
        d_mtime = os.path.getmtime(d_detected) if os.path.exists(d_detected) else 0.0
    except Exception:  # noqa: BLE001
        d_mtime = 0.0

    return mode, (h_detected, "auto", h_mtime), (d_detected, "auto", d_mtime)


def header():
    st.title("🚲 RideWise – Predict Bike‑Sharing Demand ✨")
    st.write(
        "🧭 Use the sidebar to choose Hourly or Daily predictions. Enter weather details and day type, then click Predict to get the expected number of bikes."
    )


def hourly_form(model_path: str, loader: str, file_mtime: float):
    st.subheader("⏰ Hourly Prediction")
    col1, col2 = st.columns(2)
    with col1:
        target_date = st.date_input("Target date", value=date.today() + timedelta(days=1))
        target_hour = st.slider("Target hour (24h)", min_value=0, max_value=23, value=17)
        temperature_c = st.number_input("Temperature (°C)", min_value=-30.0, max_value=60.0, value=20.0, step=0.1)
        humidity_pct = st.slider("Humidity (%)", min_value=0, max_value=100, value=60)
    with col2:
        windspeed_kph = st.number_input("Windspeed (km/h)", min_value=0.0, max_value=150.0, value=12.0, step=0.1)
        weather = st.selectbox("Weather condition", options=WEATHER_OPTIONS, index=0)
        day_type = st.selectbox("Day type", options=["Weekday", "Weekend"], index=0)

    col3, col4 = st.columns(2)
    with col3:
        is_holiday = st.checkbox("Holiday", value=False)
    with col4:
        is_working_day = st.checkbox("Working day", value=True)

    # Advanced options removed

    predict_clicked = st.button("Predict Hourly Demand 🔮", type="primary")

    if predict_clicked:
        model = load_model(model_path, loader, file_mtime)
        target_dt = datetime.combine(target_date, time(target_hour, 0))
        row = build_feature_row(
            target_dt=target_dt,
            temperature_c=float(temperature_c),
            humidity_pct=float(humidity_pct),
            windspeed_kph=float(windspeed_kph),
            weather_condition=weather,
            is_holiday=bool(is_holiday),
            is_working_day=bool(is_working_day),
            is_weekend_override=1 if day_type == "Weekend" else 0,
        )
        pred, imputed = predict_hourly(model, row)
        st.success(f"✅ Predicted bikes for {target_dt.strftime('%Y-%m-%d %H:00')}: {int(round(pred))}")

        # Visualization: Gauge for predicted demand
        max_axis = max(100.0, pred * 1.8)
        fig = go.Figure(go.Indicator(
            mode="gauge+number",
            value=pred,
            title={"text": "⏱️ Hourly Demand"},
            gauge={
                "axis": {"range": [0, max_axis]},
                "bar": {"color": "#2c7be5"},
                "steps": [
                    {"range": [0, max_axis * 0.4], "color": "#e3f2fd"},
                    {"range": [max_axis * 0.4, max_axis * 0.75], "color": "#bbdefb"},
                    {"range": [max_axis * 0.75, max_axis], "color": "#90caf9"},
                ],
            },
            number={"valueformat": ".0f"},
        ))
        st.plotly_chart(fig, use_container_width=True)

        if imputed:
            st.caption(f"Note: Filled missing model features with 0: {', '.join(imputed[:6])}{'...' if len(imputed) > 6 else ''}")

        # Additional visualization: 24-hour profile line chart for the selected date
        rows_24 = []
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
        chart_df = pd.DataFrame({"hour": [f"{h:02d}:00" for h in range(24)], "pred": y24})
        line = px.line(chart_df, x="hour", y="pred", title="Predicted profile across 24 hours", labels={"pred": "Bikes"})
        line.update_traces(mode="lines+markers")
        line.update_layout(margin=dict(l=10, r=10, t=40, b=10))
        st.plotly_chart(line, use_container_width=True)


def daily_form(model_path: str, loader: str, file_mtime: float):
    st.subheader("📅 Daily Prediction")
    col1, col2 = st.columns(2)
    with col1:
        target_date = st.date_input("Target date", value=date.today() + timedelta(days=1), key="daily_date")
        temperature_c = st.number_input("Avg Temperature (°C)", min_value=-30.0, max_value=60.0, value=18.0, step=0.1, key="daily_temp")
        humidity_pct = st.slider("Avg Humidity (%)", min_value=0, max_value=100, value=65, key="daily_hum")
    with col2:
        windspeed_kph = st.number_input("Avg Windspeed (km/h)", min_value=0.0, max_value=150.0, value=14.0, step=0.1, key="daily_wind")
        weather = st.selectbox("Typical Weather condition", options=WEATHER_OPTIONS, index=1, key="daily_weather")
        day_type = st.selectbox("Day type", options=["Weekday", "Weekend"], index=0, key="daily_daytype")

    col3, col4 = st.columns(2)
    with col3:
        is_holiday = st.checkbox("Holiday", value=False, key="daily_holiday")
    with col4:
        is_working_day = st.checkbox("Working day", value=True, key="daily_working")

    # Advanced options removed

    predict_clicked = st.button("Predict Daily Demand 📊", type="primary")

    if predict_clicked:
        model = load_model(model_path, loader, file_mtime)
        base_dt = datetime.combine(target_date, time(0, 0))
        common = {
            "temp_c": float(temperature_c),
            "humidity_pct": float(humidity_pct),
            "windspeed_kph": float(windspeed_kph),
            "weather_condition": weather,
            "is_holiday": bool(is_holiday),
            "is_working_day": bool(is_working_day),
            "is_weekend_override": 1 if day_type == "Weekend" else 0,
        }
        results = predict_daily(model, base_dt, common)
        total = int(round(results["total"]))
        avg = round(results["average"], 1)

        st.success(f"✅ Predicted total bikes for {target_date.strftime('%Y-%m-%d')}: {total}")

        # Visualizations
        hours = [f"{h:02d}:00" for h in range(24)]
        df = pd.DataFrame({"hour": hours, "predicted_bikes": [float(v) for v in results["by_hour"]]})
        df["cumulative"] = df["predicted_bikes"].cumsum()

        tab1, tab2 = st.tabs(["Hourly bar chart 📊", "Cumulative area 🧮"])
        with tab1:
            bar = px.bar(df, x="hour", y="predicted_bikes", title="Hourly predicted demand", labels={"predicted_bikes": "Bikes"})
            bar.update_layout(margin=dict(l=10, r=10, t=40, b=10))
            st.plotly_chart(bar, use_container_width=True)
        with tab2:
            area = px.area(df, x="hour", y="cumulative", title="Cumulative predicted demand", labels={"cumulative": "Cumulative bikes"})
            area.update_layout(margin=dict(l=10, r=10, t=40, b=10))
            st.plotly_chart(area, use_container_width=True)

        with st.expander("Show hourly table"):
            st.dataframe(df[["hour", "predicted_bikes"]].assign(predicted_bikes=lambda d: d["predicted_bikes"].round(0).astype(int)), use_container_width=True, hide_index=True)
        st.caption(f"Average hourly demand: {avg}")
        if results.get("imputed"):
            imp = results["imputed"]
            st.caption(f"Note: Filled missing model features with 0: {', '.join(imp[:6])}{'...' if len(imp) > 6 else ''}")


# ------------------------------
# Main
# ------------------------------
def main():
    set_background_image()
    header()
    if render_auth():
        mode, hourly_model, daily_model = sidebar_inputs()
        if mode == "Hourly":
            h_path, h_loader, h_mtime = hourly_model
            hourly_form(h_path, h_loader, h_mtime)
        else:
            d_path, d_loader, d_mtime = daily_model
            daily_form(d_path, d_loader, d_mtime)
    else:
        st.info("Please sign in to use predictions.")


if __name__ == "__main__":
    main()


