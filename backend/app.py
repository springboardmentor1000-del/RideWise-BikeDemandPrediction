# # # from fastapi import FastAPI
# # # from pydantic import BaseModel
# # # from fastapi.middleware.cors import CORSMiddleware
# # # import pickle
# # # import numpy as np
# # # import os

# # # app = FastAPI(title="🚲 Bike Demand Predictor API", version="1.0")

# # # # Allow frontend access
# # # app.add_middleware(
# # #     CORSMiddleware,
# # #     allow_origins=["*"],  # You can later restrict this to ["http://localhost:5173"]
# # #     allow_credentials=True,
# # #     allow_methods=["*"],
# # #     allow_headers=["*"],
# # # )

# # # # Load models
# # # MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
# # # HOUR_MODEL_PATH = os.path.join(MODEL_DIR, "random_forest_hour_model.pkl")
# # # DAY_MODEL_PATH = os.path.join(MODEL_DIR, "random_forest_day_model.pkl")

# # # try:
# # #     with open(HOUR_MODEL_PATH, "rb") as f:
# # #         hour_model = pickle.load(f)
# # #     print("✅ Hourly model loaded successfully.")
# # # except Exception as e:
# # #     hour_model = None
# # #     print(f"⚠️ Failed to load hourly model: {e}")

# # # try:
# # #     with open(DAY_MODEL_PATH, "rb") as f:
# # #         day_model = pickle.load(f)
# # #     print("✅ Daily model loaded successfully.")
# # # except Exception as e:
# # #     day_model = None
# # #     print(f"⚠️ Failed to load daily model: {e}")

# # # # Input Schema
# # # class BikeInput(BaseModel):
# # #     season: int
# # #     yr: int
# # #     mnth: int
# # #     holiday: int
# # #     weekday: int
# # #     workingday: int
# # #     weathersit: int
# # #     temp: float
# # #     atemp: float
# # #     hum: float
# # #     windspeed: float


# # # @app.get("/")
# # # def home():
# # #     return {"message": "🚴 API is running fine!"}


# # # @app.post("/predict/hourly")
# # # def predict_hourly(data: BikeInput):
# # #     if hour_model is None:
# # #         return {"error": "Hourly model not loaded."}
# # #     features = np.array([[
# # #         data.season, data.yr, data.mnth, data.holiday, data.weekday,
# # #         data.workingday, data.weathersit, data.temp, data.atemp,
# # #         data.hum, data.windspeed
# # #     ]])
# # #     prediction = hour_model.predict(features)[0]
# # #     return {"prediction": float(prediction)}


# # # @app.post("/predict/daily")
# # # def predict_daily(data: BikeInput):
# # #     if day_model is None:
# # #         return {"error": "Daily model not loaded."}
# # #     features = np.array([[
# # #         data.season, data.yr, data.mnth, data.holiday,
# # #         data.weekday, data.workingday, data.weathersit,
# # #         data.temp, data.atemp, data.hum, data.windspeed
# # #     ]])
# # #     prediction = day_model.predict(features)[0]
# # #     return {"prediction": float(prediction)}
# # from fastapi import FastAPI
# # from pydantic import BaseModel
# # from fastapi.middleware.cors import CORSMiddleware
# # import pickle
# # import numpy as np
# # import os

# # # 🧠 Add transformers for chatbot
# # from transformers import pipeline

# # # ---------------- APP SETUP ----------------
# # app = FastAPI(title="🚲 Bike Demand Predictor + AI Chatbot", version="2.0")

# # # Allow frontend access
# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=["*"],  # later restrict to ["http://localhost:5173"]
# #     allow_credentials=True,
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# # )

# # # ---------------- MODEL LOADING ----------------
# # MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
# # HOUR_MODEL_PATH = os.path.join(MODEL_DIR, "random_forest_hour_model.pkl")
# # DAY_MODEL_PATH = os.path.join(MODEL_DIR, "random_forest_day_model.pkl")

# # try:
# #     with open(HOUR_MODEL_PATH, "rb") as f:
# #         hour_model = pickle.load(f)
# #     print("✅ Hourly model loaded successfully.")
# # except Exception as e:
# #     hour_model = None
# #     print(f"⚠️ Failed to load hourly model: {e}")

# # try:
# #     with open(DAY_MODEL_PATH, "rb") as f:
# #         day_model = pickle.load(f)
# #     print("✅ Daily model loaded successfully.")
# # except Exception as e:
# #     day_model = None
# #     print(f"⚠️ Failed to load daily model: {e}")

# # # ---------------- SCHEMAS ----------------
# # class BikeInput(BaseModel):
# #     season: int
# #     yr: int
# #     mnth: int
# #     holiday: int
# #     weekday: int
# #     workingday: int
# #     weathersit: int
# #     temp: float
# #     atemp: float
# #     hum: float
# #     windspeed: float


# # class ChatRequest(BaseModel):
# #     message: str


# # # ---------------- ENDPOINTS ----------------
# # @app.get("/")
# # def home():
# #     return {"message": "🚴 API and Chatbot running fine!"}


# # @app.post("/predict/hourly")
# # def predict_hourly(data: BikeInput):
# #     """Predict hourly bike demand"""
# #     if hour_model is None:
# #         return {"error": "Hourly model not loaded."}

# #     features = np.array([[
# #         data.season, data.yr, data.mnth, data.holiday, data.weekday,
# #         data.workingday, data.weathersit, data.temp, data.atemp,
# #         data.hum, data.windspeed
# #     ]])
# #     prediction = hour_model.predict(features)[0]
# #     return {"prediction": float(prediction)}


# # @app.post("/predict/daily")
# # def predict_daily(data: BikeInput):
# #     """Predict daily bike demand"""
# #     if day_model is None:
# #         return {"error": "Daily model not loaded."}

# #     features = np.array([[
# #         data.season, data.yr, data.mnth, data.holiday,
# #         data.weekday, data.workingday, data.weathersit,
# #         data.temp, data.atemp, data.hum, data.windspeed
# #     ]])
# #     prediction = day_model.predict(features)[0]
# #     return {"prediction": float(prediction)}


# # # ---------------- AI CHATBOT (LOCAL MODEL) ----------------
# # try:
# #     print("🧠 Loading local Hugging Face model...")
# #     generator = pipeline("text-generation", model="mistralai/Mistral-7B-Instruct-v0.2")
# #     print("✅ Chat model loaded successfully!")
# # except Exception as e:
# #     generator = None
# #     print(f"⚠️ Failed to load chatbot model: {e}")


# # @app.post("/chat")
# # def chat(req: ChatRequest):
# #     """Chatbot endpoint"""
# #     if generator is None:
# #         return {"reply": "Chat model not available on server."}

# #     # Generate text using Hugging Face model
# #     try:
# #         response = generator(
# #             req.message,
# #             max_new_tokens=120,
# #             do_sample=True,
# #             temperature=0.7,
# #             top_p=0.9
# #         )
# #         text = response[0]["generated_text"]
# #         # Clean up reply (remove input repetition)
# #         cleaned = text.replace(req.message, "").strip()
# #         return {"reply": cleaned or "I'm here to help you with bike predictions!"}
# #     except Exception as e:
# #         return {"reply": f"Error: {e}"}


# # # ---------------- MAIN ENTRY ----------------
# # if __name__ == "__main__":
# #     import uvicorn
# #     uvicorn.run(app, host="127.0.0.1", port=8000)
# from fastapi import FastAPI
# from pydantic import BaseModel
# from fastapi.middleware.cors import CORSMiddleware
# import pickle
# import numpy as np
# import os
# from transformers import pipeline

# # ---------------- APP SETUP ----------------
# app = FastAPI(title="🚲 Bike Demand Predictor + AI Chatbot", version="2.0")

# # Allow frontend access
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # later restrict to ["http://localhost:5173"]
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ---------------- MODEL LOADING ----------------
# MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
# HOUR_MODEL_PATH = os.path.join(MODEL_DIR, "random_forest_hour_model.pkl")
# DAY_MODEL_PATH = os.path.join(MODEL_DIR, "random_forest_day_model.pkl")

# try:
#     with open(HOUR_MODEL_PATH, "rb") as f:
#         hour_model = pickle.load(f)
#     print("✅ Hourly model loaded successfully.")
# except Exception as e:
#     hour_model = None
#     print(f"⚠️ Failed to load hourly model: {e}")

# try:
#     with open(DAY_MODEL_PATH, "rb") as f:
#         day_model = pickle.load(f)
#     print("✅ Daily model loaded successfully.")
# except Exception as e:
#     day_model = None
#     print(f"⚠️ Failed to load daily model: {e}")

# # ---------------- SCHEMAS ----------------
# class BikeInput(BaseModel):
#     season: int
#     yr: int
#     mnth: int
#     holiday: int
#     weekday: int
#     workingday: int
#     weathersit: int
#     temp: float
#     atemp: float
#     hum: float
#     windspeed: float


# class ChatRequest(BaseModel):
#     message: str


# # ---------------- ENDPOINTS ----------------
# @app.get("/")
# def home():
#     return {"message": "🚴 API and Chatbot running fine!"}


# @app.post("/predict/hourly")
# def predict_hourly(data: BikeInput):
#     """Predict hourly bike demand"""
#     if hour_model is None:
#         return {"error": "Hourly model not loaded."}

#     features = np.array([[
#         data.season, data.yr, data.mnth, data.holiday, data.weekday,
#         data.workingday, data.weathersit, data.temp, data.atemp,
#         data.hum, data.windspeed
#     ]])
#     prediction = hour_model.predict(features)[0]
#     return {"prediction": float(prediction)}


# @app.post("/predict/daily")
# def predict_daily(data: BikeInput):
#     """Predict daily bike demand"""
#     if day_model is None:
#         return {"error": "Daily model not loaded."}

#     features = np.array([[
#         data.season, data.yr, data.mnth, data.holiday,
#         data.weekday, data.workingday, data.weathersit,
#         data.temp, data.atemp, data.hum, data.windspeed
#     ]])
#     prediction = day_model.predict(features)[0]
#     return {"prediction": float(prediction)}


# # ---------------- AI CHATBOT (LOCAL MODEL) ----------------
# @app.post("/chat")
# def chat(req: ChatRequest):
#     """Chatbot endpoint"""
#     if generator is None:
#         return {"reply": "Chat model not available on server."}

#     try:
#         # 🧩 Add a guiding system prompt
#         prompt = (
#             f"You are a helpful assistant who answers simply and clearly about bikes, data, and predictions.\n\n"
#             f"User: {req.message}\nAssistant:"
#         )

#         response = generator(
#             prompt,
#             max_new_tokens=60,
#             do_sample=True,
#             temperature=0.7,
#             top_p=0.9,
#             repetition_penalty=1.2
#         )

#         # Extract and clean reply
#         text = response[0]["generated_text"]
#         # Remove everything before "Assistant:"
#         cleaned = text.split("Assistant:")[-1].strip()

#         # Clean extra characters
#         cleaned = cleaned.replace("\n", " ").strip()

#         return {"reply": cleaned or "I'm here to help you with bike predictions!"}

#     except Exception as e:
#         return {"reply": f"Error: {str(e)}"}

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pickle
import numpy as np
import os
from transformers import pipeline

# ---------------- APP SETUP ----------------
app = FastAPI(title="🚲 Bike Demand Predictor + AI Chatbot", version="2.0")

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict to ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- MODEL LOADING ----------------
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
HOUR_MODEL_PATH = os.path.join(MODEL_DIR, "random_forest_hour_model.pkl")
DAY_MODEL_PATH = os.path.join(MODEL_DIR, "random_forest_day_model.pkl")

try:
    with open(HOUR_MODEL_PATH, "rb") as f:
        hour_model = pickle.load(f)
    print("✅ Hourly model loaded successfully.")
except Exception as e:
    hour_model = None
    print(f"⚠️ Failed to load hourly model: {e}")

try:
    with open(DAY_MODEL_PATH, "rb") as f:
        day_model = pickle.load(f)
    print("✅ Daily model loaded successfully.")
except Exception as e:
    day_model = None
    print(f"⚠️ Failed to load daily model: {e}")

# ---------------- CHATBOT MODEL LOADING ----------------
try:
    print("🧠 Loading local Hugging Face model...")
    generator = pipeline(
        "text-generation",
        model="distilgpt2",     # ✅ lightweight, local-friendly model
        pad_token_id=50256      # ✅ prevents padding warning
    )
    print("✅ Chat model loaded successfully!")
except Exception as e:
    generator = None
    print(f"⚠️ Failed to load chatbot model: {e}")

# ---------------- SCHEMAS ----------------
class BikeInput(BaseModel):
    season: int
    yr: int
    mnth: int
    holiday: int
    weekday: int
    workingday: int
    weathersit: int
    temp: float
    atemp: float
    hum: float
    windspeed: float


class ChatRequest(BaseModel):
    message: str


# ---------------- ENDPOINTS ----------------
@app.get("/")
def home():
    return {"message": "🚴 API and Chatbot running fine!"}


@app.post("/predict/hourly")
def predict_hourly(data: BikeInput):
    """Predict hourly bike demand"""
    if hour_model is None:
        return {"error": "Hourly model not loaded."}

    features = np.array([[data.season, data.yr, data.mnth, data.holiday,
                          data.weekday, data.workingday, data.weathersit,
                          data.temp, data.atemp, data.hum, data.windspeed]])
    prediction = hour_model.predict(features)[0]
    return {"prediction": float(prediction)}


@app.post("/predict/daily")
def predict_daily(data: BikeInput):
    """Predict daily bike demand"""
    if day_model is None:
        return {"error": "Daily model not loaded."}

    features = np.array([[data.season, data.yr, data.mnth, data.holiday,
                          data.weekday, data.workingday, data.weathersit,
                          data.temp, data.atemp, data.hum, data.windspeed]])
    prediction = day_model.predict(features)[0]
    return {"prediction": float(prediction)}


# ---------------- AI CHATBOT ----------------
@app.post("/chat")
def chat(req: ChatRequest):
    """Chatbot endpoint"""
    if generator is None:
        return {"reply": "Chat model not available on server."}

    try:
        # 🧩 Add a guiding system prompt
        prompt = (
            f"You are a friendly assistant who helps users understand bikes, data, and predictions clearly.\n\n"
            f"User: {req.message}\nAssistant:"
        )

        response = generator(
            prompt,
            max_new_tokens=80,
            do_sample=True,
            temperature=0.7,
            top_p=0.9,
            repetition_penalty=1.2
        )

        text = response[0]["generated_text"]
        cleaned = text.split("Assistant:")[-1].strip().replace("\n", " ").strip()

        return {"reply": cleaned or "I'm here to help you with bike predictions!"}

    except Exception as e:
        return {"reply": f"Error: {str(e)}"}


# ---------------- MAIN ENTRY ----------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
