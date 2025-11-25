# backend/chatbot/peak_utils.py
import pandas as pd
from datetime import datetime, timedelta
from .prediction_utils import predict_rental_for_date, predict_rental_for_hour
from .weather_utils import get_weather_for_datetime


def get_peak_hour(date_str=None, city="Hyderabad"):
    """Find the hour with maximum predicted rentals for the given date."""
    if not date_str:
        date_str = datetime.now().strftime("%Y-%m-%d")

    results = []
    for h in range(24):
        time_str = f"{h:02d}:00"
        weather = get_weather_for_datetime(city, date_str, h)
        pred = predict_rental_for_hour(date_str, time_str, weather)
        results.append((h, pred))

    peak_hour, peak_value = max(results, key=lambda x: x[1])
    return {
        "intent": "peak_hour_queries",
        "date": date_str,
        "peak_hour": peak_hour,
        "peak_value": round(peak_value, 2),
    }


def get_peak_day(start_date=None, days=7, city="Hyderabad"):
    """Find the day with highest predicted rentals in the given range (forward from start)."""
    if not start_date:
        today = datetime.now()
        # start of the week (Monday)
        start_dt = today - timedelta(days=today.weekday())
    else:
        start_dt = datetime.strptime(start_date, "%Y-%m-%d")

    results = []
    for i in range(days):
        d = (start_dt + timedelta(days=i)).strftime("%Y-%m-%d")  # forward
        weather = get_weather_for_datetime(city, d, 12)  # noon weather
        pred = predict_rental_for_date(d, weather)
        results.append((d, pred))

    peak_day, peak_value = max(results, key=lambda x: x[1])
    return {
        "intent": "peak_day_queries",
        "start_date": start_dt.strftime("%Y-%m-%d"),  # start of the week
        "peak_day": peak_day,                           # actual peak day
        "peak_value": round(peak_value, 2),
    }

def get_peak_month(months_back=6, city="Hyderabad"):
    """Find the month with highest average rentals over past months."""
    today = datetime.now()
    results = []

    for i in range(months_back):
        month_start = (today - pd.DateOffset(months=i)).replace(day=1)
        total_pred, count = 0, 0
        for d in pd.date_range(month_start, month_start + pd.offsets.MonthEnd(0)):
            weather = get_weather_for_datetime(city, d.strftime("%Y-%m-%d"), 12)
            pred = predict_rental_for_date(d.strftime("%Y-%m-%d"), weather)
            total_pred += pred
            count += 1
        avg_pred = total_pred / count if count else 0
        results.append((month_start.strftime("%Y-%m"), avg_pred))

    peak_month, peak_value = max(results, key=lambda x: x[1])
    return {
        "intent": "peak_month_queries",
        "peak_month": peak_month,
        "peak_value": round(peak_value, 2),
    }
