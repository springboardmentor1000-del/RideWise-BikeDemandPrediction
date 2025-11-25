# backend/accounts/urls.py
from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path("signup/", views.signup, name="signup"),
    path("signin/", views.CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),         # ✅ refresh access token
    path("verify/", TokenVerifyView.as_view(), name="token_verify"),            # ✅ verify token validity
    path("get_user/", views.get_user, name="get_user"),
    path("signout/", views.signout, name="signout"),

]
