from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import pickle
import uvicorn
import traceback

# Load the model
try:
    with open("enhanced_sentiment_model.pkl", "rb") as f:
        model = pickle.load(f)
    print(f"Model loaded successfully. Type: {type(model)}")
    if hasattr(model, 'predict'):
        print("Model has predict method")
    else:
        print("Model does not have predict method")
        print(f"Model keys: {model.keys() if isinstance(model, dict) else 'Not a dict'}")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Initialize FastAPI
app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict(request: Request):
    try:
        body = await request.json()
        text = body.get("message", "")
        if not text:
            return {"sentiment": "No message provided"}

        prediction = model.predict([text])[0]
        return {"sentiment": str(prediction)}  # ensure it's serializable
    except Exception as e:
        print("Error during prediction:", e)
        traceback.print_exc()
        return {"sentiment": "Error during prediction"}
