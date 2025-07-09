from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import google.generativeai as genai
import os
import re
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize the FastAPI app
app = FastAPI(
    title="Gemini Chat API",
    description="AI Chat API with language detection for student counseling",
    version="1.0.0"
)

# Allow frontend access
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

# Configure Gemini API
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    logger.error("GEMINI_API_KEY not found in environment variables")
    raise ValueError("GEMINI_API_KEY not set in environment. Please add it to your .env file.")

try:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.0-flash-exp")
    logger.info("Gemini API configured successfully")
except Exception as e:
    logger.error(f"Failed to configure Gemini API: {e}")
    raise

# Pydantic model for input
class ChatRequest(BaseModel):
    message: str

def detect_language(text: str) -> str:
    """Detect the primary language of the input text"""
    # Hindi unicode range detection
    hindi_chars = len(re.findall(r'[\u0900-\u097F]', text))

    # English alphabet detection
    english_chars = len(re.findall(r'[a-zA-Z]', text))

    # Common Hinglish words (Hindi words written in English)
    hinglish_words = [
        'hai', 'hoon', 'mein', 'tumhara', 'tumhari', 'mera', 'meri', 'kya', 'kaun', 'kahan',
        'kab', 'kyun', 'kaise', 'achha', 'accha', 'theek', 'thik', 'nahi', 'nahin', 'haan',
        'ji', 'bhai', 'didi', 'yaar', 'dost', 'ghar', 'school', 'padhna', 'padhai', 'exam',
        'teacher', 'sir', 'madam', 'mummy', 'papa', 'family', 'friends', 'matlab', 'samjha',
        'samjhi', 'pata', 'maloom', 'dekho', 'suno', 'bolo', 'karo', 'jana', 'aana', 'khana',
        'paani', 'time', 'bas', 'bilkul', 'sach', 'jhooth', 'kitna', 'kitni', 'bohot', 'bahut'
    ]

    # Convert to lowercase for checking
    text_lower = text.lower()
    hinglish_count = sum(1 for word in hinglish_words if word in text_lower)

    total_chars = hindi_chars + english_chars

    if total_chars == 0:
        return "mixed"

    # Determine language based on character distribution and hinglish words
    if hindi_chars > 0 and hindi_chars / total_chars > 0.3:
        return "hindi"
    elif hinglish_count >= 2 or (hinglish_count >= 1 and english_chars > 0):
        return "hinglish"
    elif english_chars > 0:
        return "english"
    else:
        return "mixed"

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        # Detect the language of the user's message
        detected_language = detect_language(request.message)

        # Create language-specific prompt
        prompt = f"""
        You are a friendly, supportive AI counselor conducting an assessment conversation with a child aged 13-16 from India.
        Ask meaningful questions related to confidence, leadership, and creativity.

        LANGUAGE GUIDELINES:
        - You MUST respond in the SAME language the child uses
        - If they speak in Hindi, respond in Hindi
        - If they speak in English, respond in English
        - If they use Hinglish (Hindi written in English), respond in Hinglish
        - If they mix languages, you can mix too but maintain the same proportion
        - Always detect the language pattern and maintain consistency
        - Use age-appropriate vocabulary in the language they choose

        The child's response (detected language: {detected_language}): "{request.message}"

        Please respond with your next friendly, age-appropriate question or feedback in the SAME language as the child used.

        Examples:
        - If child says "Mein theek hoon" → respond in Hinglish like "Achha! Aaj kya special kiya?"
        - If child says "I am fine" → respond in English like "That's great! What made your day special?"
        - If child says "मैं ठीक हूँ" → respond in Hindi like "बहुत अच्छा! आज कुछ खास किया?"
        """

        response = model.generate_content(prompt)

        if not response or not response.text:
            logger.warning("Empty response from Gemini API")
            detected_lang = detect_language(request.message) if request.message else "english"
            error_messages = {
                "english": "I couldn't generate a response. Please try again.",
                "hindi": "मैं कोई उत्तर नहीं दे सका। कृपया पुनः प्रयास करें।",
                "hinglish": "Main koi jawab nahi de saka. Please try again.",
                "mixed": "Main कोई jawab नहीं दे सका। Please try again."
            }
            error_msg = error_messages.get(detected_lang, error_messages["english"])
            return {"response": error_msg}

        detected_lang = detect_language(request.message) if request.message else "english"
        logger.info(f"Successfully generated response for language: {detected_lang}")
        return {"response": response.text.strip()}

    except Exception as e:
        logger.error(f"Error generating response: {str(e)}")

        # Language-specific error messages
        error_messages = {
            "english": "Oops! Something went wrong. Please try again later.",
            "hindi": "अरे! कुछ गलत हो गया। कृपया बाद में फिर से कोशिश करें।",
            "hinglish": "Oops! Kuch galat ho gaya. Please baad mein try karo.",
            "mixed": "Oops! कुछ गलत हो गया। Please try again later."
        }

        detected_lang = detect_language(request.message) if request.message else "english"
        error_msg = error_messages.get(detected_lang, error_messages["english"])

        return {"response": error_msg}

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint to verify API is running"""
    try:
        # Test if Gemini API is accessible
        test_response = model.generate_content("Hello")
        return {
            "status": "healthy",
            "message": "Gemini API is working properly",
            "gemini_api": "connected"
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "message": "Gemini API connection failed",
            "error": str(e)
        }

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Gemini Chat API is running",
        "version": "1.0.0",
        "endpoints": {
            "chat": "/chat",
            "health": "/health"
        }
    }

# Run with: uvicorn gemini_api:app --reload --host 127.0.0.1 --port 8001
