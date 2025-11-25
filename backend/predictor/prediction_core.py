# backend/predictor/prediction_core.py

import os
import joblib
import pandas as pd
import numpy as np
from django.conf import settings

# -------------------------------------------------
# Model Paths
# -------------------------------------------------
PREDICTOR_DIR = os.path.join(settings.BASE_DIR, "predictor")
DAY_MODEL_PATH = os.path.join(PREDICTOR_DIR, "cat_day_model.pkl")   # CatBoost
HOUR_MODEL_PATH = os.path.join(PREDICTOR_DIR, "cat_hour_model.pkl") 

# -------------------------------------------------
# Lazy-loaded models
# -------------------------------------------------
day_model = None     # CatBoost
hour_model = None    

def get_day_model():
    global day_model
    if day_model is None:
        day_model = joblib.load(DAY_MODEL_PATH)
    return day_model

def get_hour_model():
    global hour_model
    if hour_model is None:
        hour_model = joblib.load(HOUR_MODEL_PATH)
    return hour_model



# -------------------------------------------------
# Clean Input
# -------------------------------------------------
def clean_input(df, dataset_type="day"):
    df = df.copy()
    num_cols = ['temp', 'atemp', 'hum', 'windspeed']
    if dataset_type == 'hour':
        num_cols.append('hour')

    for col in num_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(df[col].median())
    return df


# -------------------------------------------------
# Feature Engineering
# -------------------------------------------------
def create_features(df, dataset_type="day"):
    df = df.copy()

    df["dteday"] = pd.to_datetime(df["dteday"], errors="coerce")

    df["is_weekend"] = df["dteday"].dt.dayofweek.isin([5, 6]).astype(int)
    df["is_month_start"] = df["dteday"].dt.is_month_start.astype(int)
    df["is_month_end"] = df["dteday"].dt.is_month_end.astype(int)
    df["is_quarter_start"] = df["dteday"].dt.is_quarter_start.astype(int)
    df["is_quarter_end"] = df["dteday"].dt.is_quarter_end.astype(int)

    period = 366 if df['dteday'].dt.is_leap_year.any() else 365

    df['day_sin'] = np.sin(2 * np.pi * df["dteday"].dt.dayofyear / period)
    df['day_cos'] = np.cos(2 * np.pi * df["dteday"].dt.dayofyear / period)

    df["season_sin"] = np.sin(2 * np.pi * df["season"] / 4)
    df["season_cos"] = np.cos(2 * np.pi * df["season"] / 4)

    df["month_sin"] = np.sin(2 * np.pi * df["mnth"] / 12)
    df["month_cos"] = np.cos(2 * np.pi * df["mnth"] / 12)

    df['weekday_sin'] = np.sin(2 * np.pi * df['weekday'] / 7)
    df['weekday_cos'] = np.cos(2 * np.pi * df['weekday'] / 7)

    if "hr" in df.columns:
        df["hour_sin"] = np.sin(2 * np.pi * df["hr"] / 24)
        df["hour_cos"] = np.cos(2 * np.pi * df["hr"] / 24)
        df["is_peak_hour"] = df["hr"].isin([7, 8, 9, 17, 18, 19]).astype(int)

    return df


# -------------------------------------------------
# Encoding
# -------------------------------------------------
def encode_features(df, is_hourly=False):
    df = df.copy()

    cat_cols = ['weathersit']
    if is_hourly and 'time_of_day' in df.columns:
        cat_cols.append('time_of_day')

    df = pd.get_dummies(df, columns=cat_cols, prefix=cat_cols, drop_first=False)

    bool_cols = df.select_dtypes(include='bool').columns
    df[bool_cols] = df[bool_cols].astype(int)

    df = df.reindex(sorted(df.columns), axis=1)
    return df


# -------------------------------------------------
# Final Feature Selection (Columns used during training)
# -------------------------------------------------
def filter_dataset(df, dataset_type):
    day_features = [
        "atemp", "day_cos", "day_sin", "holiday", "hum", "is_month_end",
        "is_month_start", "is_quarter_end", "is_quarter_start", "is_weekend",
        "month_cos", "month_sin", "season_cos", "season_sin", "temp",
        "weathersit_1", "weathersit_2", "weathersit_3", "weekday_cos",
        "weekday_sin", "windspeed", "workingday", "yr"
    ]

    hour_features = [
        "atemp", "day_cos", "day_sin", "holiday", "hour_cos", "hour_sin", "hum",
        "is_month_end", "is_month_start", "is_peak_hour", "is_quarter_end",
        "is_quarter_start", "is_weekend", "month_cos", "month_sin", "season_cos",
        "season_sin", "temp", "weathersit_1", "weathersit_2", "weathersit_3",
        "weathersit_4", "weekday_cos", "weekday_sin", "windspeed",
        "workingday", "yr"
    ]

    selected = day_features if dataset_type == "day" else hour_features
    return df[[col for col in selected if col in df.columns]]


# -------------------------------------------------
# Prepare Data for Prediction — CatBoost + XGBoost
# -------------------------------------------------
def prepare_features_for_prediction(data, dataset_type="day"):
    """
    dataset_type: "day" → CatBoost
                  "hour" → XGBoost
    """
    dteday = pd.to_datetime(data['date'])
    yr_value = max(0, min(dteday.year - 2011, 1))  # 2011 → 0, 2012 → 1

    df = pd.DataFrame([{
        'dteday': dteday,
        'season': int(data.get('season', 1)),
        'yr': yr_value,
        'mnth': dteday.month,
        'hr': int(data.get('hour', 0)),
        'holiday': int(data.get('holiday', 0)),
        'weekday': dteday.weekday(),
        'workingday': int(data.get('workingday', 0)),
        'weathersit': int(data.get('weathersit', 1)),
        'temp': float(data.get('temp', 0.5)),
        'atemp': float(data.get('atemp', 0.5)),
        'hum': float(data.get('hum', 0.5)),
        'windspeed': float(data.get('windspeed', 0.2))
    }])

    # Feature pipeline
    df = clean_input(df, dataset_type)
    df = create_features(df, dataset_type)
    df = encode_features(df, is_hourly=(dataset_type == 'hour'))
    df = filter_dataset(df, dataset_type)

    # -----------------------------------------
    # Apply model-specific feature alignment
    # -----------------------------------------
    if dataset_type == "day":
        model = get_day_model()  # CatBoost
        model_features = model.feature_names_
    else:
        model = get_hour_model()  # XGBoost
        model_features = model.feature_names_

    # Add missing cols
    for f in model_features:
        if f not in df.columns:
            df[f] = 0

    # Drop extra
    df = df[model_features]

    return df
