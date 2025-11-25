# backend/predictor/urls.py
from django.urls import path
from . import views

app_name = "predictor"

urlpatterns = [
    path("", views.home, name="home"),
    path("predict/", views.predict, name="predict"),
    path("overview/", views.overview, name="overview"),
    path("weather/today/", views.today_weather, name="today_weather"),
    path('insights/', views.insights, name='insights'),
]
