#!/usr/bin/env python3
"""
Test the real Gemini API with different languages
"""

import requests
import json
import time

def test_gemini_responses():
    """Test Gemini API with different language inputs"""
    
    print("🤖 Testing Real Gemini API with your custom prompts...")
    print("=" * 60)
    
    test_cases = [
        {
            "message": "Hello, I'm feeling a bit stressed about my exams",
            "language": "English",
            "description": "Student stress in English"
        },
        {
            "message": "मैं अपनी पढ़ाई को लेकर चिंतित हूँ",
            "language": "Hindi", 
            "description": "Study concerns in Hindi"
        },
        {
            "message": "Main thoda confused hoon about my career choices",
            "language": "Hinglish",
            "description": "Career confusion in Hinglish"
        },
        {
            "message": "I am feeling happy today! Aaj mera mood achha hai",
            "language": "Mixed",
            "description": "Happy mood in mixed language"
        }
    ]
    
    for i, test in enumerate(test_cases, 1):
        print(f"\n🧪 Test {i}: {test['description']}")
        print(f"📝 Input ({test['language']}): {test['message']}")
        print("⏳ Waiting for Gemini response...")
        
        try:
            response = requests.post(
                "http://127.0.0.1:8001/chat",
                json={"message": test['message']},
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Response: {data['response']}")
            else:
                print(f"❌ Error: {response.status_code} - {response.text}")
                
        except requests.exceptions.Timeout:
            print("❌ Request timed out (Gemini API might be slow)")
        except Exception as e:
            print(f"❌ Error: {e}")
        
        print("-" * 60)
        time.sleep(2)  # Small delay between requests
    
    print("\n🎯 Testing complete! Your Gemini API is working with custom prompts.")

if __name__ == "__main__":
    test_gemini_responses()
