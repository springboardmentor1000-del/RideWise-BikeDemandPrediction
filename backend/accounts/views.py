from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
import json
import traceback
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        print("\n[DEBUG] Login attempt with:", attrs)  # 👀 shows username & password keys
        return super().validate(attrs)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# ✅ Utility for responses
def debug_response(message, details=None, status=400):
    print(f"\n[DEBUG] {message}")
    if details:
        print(f"[DETAILS] {details}\n")
    return JsonResponse({"error": message, "details": details}, status=status)


# ✅ Signup (register new user)
@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def signup(request):
    try:
        # Handle both DRF Web UI and raw JSON requests
        if "_content" in request.data:
            data = json.loads(request.data["_content"])
        else:
            data = request.data

        print(f"\n[DEBUG] Signup data: {data}")

        full_name = data.get("full_name", "").strip()
        username = data.get("username", "").strip()
        email = data.get("email", "").strip()
        password1 = data.get("password1", "")
        password2 = data.get("password2", "")

        if not all([full_name, username, email, password1, password2]):
            return JsonResponse({"error": "All fields are required."}, status=400)

        if password1 != password2:
            return JsonResponse({"error": "Passwords do not match."}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already exists."}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password1)
        user.first_name = full_name
        user.save()

        print(f"[SUCCESS] User created: {user.username}")
        return JsonResponse({"message": "Signup successful!"}, status=201)

    except Exception as e:
        print(f"[ERROR] Signup failed: {e}")
        traceback.print_exc()
        return JsonResponse({"error": "Internal Server Error", "details": str(e)}, status=500)

# ✅ Get current logged-in user using JWT
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user(request):
    try:
        user = request.user
        print(f"[INFO] Authenticated user via JWT: {user.username}")
        return JsonResponse({
            "isAuthenticated": True,
            "username": user.username,
            "email": user.email,
        })
    except Exception as e:
        print(f"[ERROR] get_user failed: {e}")
        traceback.print_exc()
        return debug_response("Internal Server Error", str(e), status=500)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def signout(request):
    try:
        refresh_token = request.data.get("refresh_token")
        if not refresh_token:
            return JsonResponse({"error": "No refresh token provided."}, status=400)

        token = RefreshToken(refresh_token)
        token.blacklist()  # ✅ Requires Blacklist app enabled

        return JsonResponse({"message": "Logout successful."})
    except Exception as e:
        print(f"[ERROR] Logout failed: {e}")
        return JsonResponse({"error": "Invalid or expired token."}, status=400)
