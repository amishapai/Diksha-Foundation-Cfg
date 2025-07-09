#!/usr/bin/env python3
"""
Test script for Gemini Chat API
Run this to verify your API is working correctly
"""

import requests
import json
import time
import sys

def test_health_check():
    """Test the health check endpoint"""
    print("🔍 Testing health check endpoint...")
    
    try:
        response = requests.get("http://127.0.0.1:8001/health", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "healthy":
                print("✅ Health check passed!")
                return True
            else:
                print(f"❌ Health check failed: {data}")
                return False
        else:
            print(f"❌ Health check failed with status code: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Is it running on port 8001?")
        return False
    except requests.exceptions.Timeout:
        print("❌ Request timed out. Server might be slow to respond.")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def test_chat_endpoint():
    """Test the chat endpoint with different languages"""
    print("\n🤖 Testing chat endpoint...")
    
    test_messages = [
        {"message": "Hello, how are you?", "expected_lang": "English"},
        {"message": "Namaste, aap kaise hain?", "expected_lang": "Hinglish"},
        {"message": "नमस्ते, आप कैसे हैं?", "expected_lang": "Hindi"},
        {"message": "Hi! Main theek hoon. Aap batao?", "expected_lang": "Mixed"}
    ]
    
    success_count = 0
    
    for i, test in enumerate(test_messages, 1):
        print(f"\n📝 Test {i}: {test['expected_lang']} message")
        print(f"Input: {test['message']}")
        
        try:
            response = requests.post(
                "http://127.0.0.1:8001/chat",
                json=test,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                if "response" in data and data["response"]:
                    print(f"✅ Response: {data['response'][:100]}...")
                    success_count += 1
                else:
                    print(f"❌ Empty or invalid response: {data}")
            else:
                print(f"❌ Request failed with status code: {response.status_code}")
                print(f"Response: {response.text}")
                
        except requests.exceptions.Timeout:
            print("❌ Request timed out. Gemini API might be slow.")
        except Exception as e:
            print(f"❌ Error: {e}")
        
        # Small delay between requests
        time.sleep(1)
    
    print(f"\n📊 Chat test results: {success_count}/{len(test_messages)} successful")
    return success_count == len(test_messages)

def test_api_documentation():
    """Test if API documentation is accessible"""
    print("\n📚 Testing API documentation...")
    
    try:
        response = requests.get("http://127.0.0.1:8001/docs", timeout=10)
        
        if response.status_code == 200:
            print("✅ API documentation is accessible at http://127.0.0.1:8001/docs")
            return True
        else:
            print(f"❌ Documentation not accessible: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error accessing documentation: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Starting Gemini API Tests")
    print("=" * 50)
    
    # Test 1: Health Check
    health_ok = test_health_check()
    
    if not health_ok:
        print("\n❌ Health check failed. Please check:")
        print("1. Is the server running? (python start_server.py)")
        print("2. Is the GEMINI_API_KEY set correctly in .env?")
        print("3. Are all dependencies installed?")
        sys.exit(1)
    
    # Test 2: Chat Endpoint
    chat_ok = test_chat_endpoint()
    
    # Test 3: Documentation
    docs_ok = test_api_documentation()
    
    # Summary
    print("\n" + "=" * 50)
    print("🎯 Test Summary:")
    print(f"Health Check: {'✅ PASS' if health_ok else '❌ FAIL'}")
    print(f"Chat Endpoint: {'✅ PASS' if chat_ok else '❌ FAIL'}")
    print(f"Documentation: {'✅ PASS' if docs_ok else '❌ FAIL'}")
    
    if health_ok and chat_ok and docs_ok:
        print("\n🎉 All tests passed! Your Gemini API is working correctly.")
        print("\n🔗 You can now use the chat in your frontend application.")
        print("Frontend should connect to: http://127.0.0.1:8001/chat")
    else:
        print("\n⚠️  Some tests failed. Please check the issues above.")
        print("Refer to GEMINI_SETUP_GUIDE.md for troubleshooting help.")

if __name__ == "__main__":
    main()
