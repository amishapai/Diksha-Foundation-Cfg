#!/usr/bin/env python3
"""
Test the connection to the chat API
"""

import requests
import json

def test_connection():
    """Test if the chat endpoint is working"""
    
    print("🔍 Testing connection to chat API...")
    
    # Test health endpoint
    try:
        health_response = requests.get("http://127.0.0.1:8001/health")
        print(f"✅ Health check: {health_response.json()}")
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False
    
    # Test chat endpoint
    try:
        chat_data = {"message": "Hello, this is a test"}
        chat_response = requests.post(
            "http://127.0.0.1:8001/chat",
            json=chat_data,
            headers={"Content-Type": "application/json"}
        )
        
        if chat_response.status_code == 200:
            result = chat_response.json()
            print(f"✅ Chat test successful: {result}")
            return True
        else:
            print(f"❌ Chat test failed: {chat_response.status_code} - {chat_response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Chat test error: {e}")
        return False

if __name__ == "__main__":
    test_connection()
