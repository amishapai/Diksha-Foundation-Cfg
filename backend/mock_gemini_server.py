#!/usr/bin/env python3
"""
Mock Gemini Server for Testing
This simulates AI responses without needing a real API key
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import re
import random
import time

app = FastAPI(title="Mock Gemini Chat API", version="1.0.0")

# CORS configuration
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

def detect_language(text):
    """Detect language of input text"""
    # Hindi characters
    hindi_pattern = r'[\u0900-\u097F]+'
    # English words
    english_pattern = r'[a-zA-Z]+'
    
    has_hindi = bool(re.search(hindi_pattern, text))
    has_english = bool(re.search(english_pattern, text))
    
    if has_hindi and has_english:
        return "mixed"
    elif has_hindi:
        return "hindi"
    elif has_english:
        return "english"
    else:
        return "english"

def generate_mock_response(message, language):
    """Generate mock AI responses based on language"""
    
    # Mock responses for different languages
    responses = {
        "english": [
            "That's a great question! I'm here to help you with your studies and any concerns you might have.",
            "I understand how you're feeling. It's completely normal to have these thoughts. Would you like to talk more about it?",
            "Learning can be challenging sometimes, but you're doing great! What specific topic would you like help with?",
            "I'm here to listen and support you. Remember, every small step forward is progress!",
            "That sounds interesting! Can you tell me more about what you're thinking?"
        ],
        "hindi": [
            "यह बहुत अच्छा सवाल है! मैं आपकी पढ़ाई और किसी भी चिंता में मदद करने के लिए यहाँ हूँ।",
            "मैं समझ सकता हूँ कि आप कैसा महसूस कर रहे हैं। ये विचार आना बिल्कुल सामान्य है। क्या आप इसके बारे में और बात करना चाहेंगे?",
            "पढ़ाई कभी-कभी चुनौतीपूर्ण हो सकती है, लेकिन आप बहुत अच्छा कर रहे हैं! किस विषय में आपको मदद चाहिए?",
            "मैं आपकी बात सुनने और सहायता करने के लिए यहाँ हूँ। याद रखें, हर छोटा कदम प्रगति है!",
            "यह दिलचस्प लगता है! क्या आप मुझे बता सकते हैं कि आप क्या सोच रहे हैं?"
        ],
        "mixed": [
            "That's great! मैं आपकी help करने के लिए यहाँ हूँ। What would you like to discuss?",
            "I understand! यह normal है। Would you like to share more about it?",
            "Padhai sometimes challenging होती है, but you're doing well! Kya specific help चाहिए?",
            "Main यहाँ हूँ to listen और support करने के लिए। Remember, progress होती रहती है!",
            "Interesting! आप और बता सकते हैं about your thoughts?"
        ]
    }
    
    # Get appropriate responses for the detected language
    lang_responses = responses.get(language, responses["english"])
    
    # Add some context-aware responses
    message_lower = message.lower()
    
    if any(word in message_lower for word in ["sad", "upset", "worried", "anxious", "परेशान", "चिंता"]):
        if language == "hindi":
            return "मैं समझ सकता हूँ कि आप परेशान हैं। यह बिल्कुल ठीक है। क्या आप मुझे बताना चाहेंगे कि क्या हो रहा है? मैं यहाँ आपकी मदद के लिए हूँ।"
        elif language == "mixed":
            return "Main समझ सकता हूँ कि आप upset हैं। It's okay to feel this way. Would you like to share what's bothering you?"
        else:
            return "I can sense that you're feeling upset. That's completely okay. Would you like to share what's on your mind? I'm here to listen and help."
    
    elif any(word in message_lower for word in ["happy", "good", "great", "खुश", "अच्छा"]):
        if language == "hindi":
            return "यह सुनकर बहुत खुशी हुई! आपका अच्छा मूड देखकर मैं भी खुश हूँ। क्या कोई खास बात है जो आपको खुश कर रही है?"
        elif language == "mixed":
            return "That's wonderful! मुझे भी खुशी हुई। Kya कोई special reason है for feeling so good?"
        else:
            return "That's wonderful to hear! I'm so glad you're feeling good. Is there something special that's making you happy today?"
    
    elif any(word in message_lower for word in ["study", "homework", "exam", "पढ़ाई", "होमवर्क", "परीक्षा"]):
        if language == "hindi":
            return "पढ़ाई के बारे में बात करना अच्छा है! मैं आपकी पढ़ाई में मदद कर सकता हूँ। किस विषय में आपको सहायता चाहिए?"
        elif language == "mixed":
            return "Studies के बारे में बात करना great है! Main आपकी help कर सकता हूँ। Which subject में assistance चाहिए?"
        else:
            return "It's great that you want to talk about studies! I'm here to help you with your learning. Which subject would you like assistance with?"
    
    # Return a random appropriate response
    return random.choice(lang_responses)

@app.get("/")
async def root():
    return {
        "message": "Mock Gemini Chat API is running",
        "version": "1.0.0",
        "note": "This is a mock server for testing - responses are simulated",
        "endpoints": {
            "chat": "/chat",
            "health": "/health"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "Mock Gemini API is working properly",
        "type": "mock_server"
    }

@app.post("/chat")
async def chat(request: ChatRequest):
    """Mock chat endpoint that simulates AI responses"""
    
    # Simulate processing time
    time.sleep(0.5)
    
    try:
        # Detect language
        language = detect_language(request.message)
        
        # Generate mock response
        response_text = generate_mock_response(request.message, language)
        
        return {"response": response_text}
        
    except Exception as e:
        # Language-specific error messages
        error_messages = {
            "english": "Sorry, I'm having trouble right now. Please try again!",
            "hindi": "क्षमा करें, मुझे अभी कुछ समस्या हो रही है। कृपया फिर से कोशिश करें!",
            "mixed": "Sorry! मुझे कुछ problem हो रही है। Please try again!"
        }
        
        detected_lang = detect_language(request.message) if request.message else "english"
        error_msg = error_messages.get(detected_lang, error_messages["english"])
        
        return {"response": error_msg}

if __name__ == "__main__":
    print("🤖 Starting Mock Gemini Chat API on http://127.0.0.1:8001")
    print("📝 This is a mock server that simulates AI responses")
    print("🔄 Responses will be generated locally without using real Gemini API")
    print("⚡ Perfect for testing your frontend connection!")
    print("\nPress Ctrl+C to stop the server")
    
    uvicorn.run(app, host="127.0.0.1", port=8001)
