#!/usr/bin/env python3
"""
Basic server test without Gemini API
This will help us isolate the connection issue
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Create a simple test app
app = FastAPI(title="Test Chat API")

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174", 
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.get("/")
async def root():
    return {"message": "Test server is running!", "status": "ok"}

@app.get("/health")
async def health():
    return {"status": "healthy", "message": "Test server is working"}

@app.post("/chat")
async def chat(request: ChatRequest):
    """Simple echo response for testing"""
    return {
        "response": f"Test response: I received your message '{request.message}'. The server is working!"
    }

if __name__ == "__main__":
    print("🧪 Starting test server on http://127.0.0.1:8001")
    print("This is a basic test to check connectivity...")
    uvicorn.run(app, host="127.0.0.1", port=8001)
