# 🤖 Gemini API Setup & Troubleshooting Guide

## 🚨 **Common Issues & Solutions**

### **Issue 1: "Cannot connect to assistant"**

#### **Root Causes:**
1. **Missing API Key** - No GEMINI_API_KEY in environment
2. **Wrong Port** - Server running on different port than frontend expects
3. **CORS Issues** - Frontend can't access backend
4. **Missing Dependencies** - Required packages not installed

#### **Solutions:**

### **Step 1: Get Your Gemini API Key**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key

### **Step 2: Setup Environment**
```bash
# Navigate to backend directory
cd backend

# Install required packages
pip install -r requirements.txt

# Or install individually:
pip install fastapi uvicorn google-generativeai python-dotenv pydantic
```

### **Step 3: Configure API Key**
1. Open `backend/.env` file
2. Replace `your_actual_gemini_api_key_here` with your actual API key:
```env
GEMINI_API_KEY=AIzaSyC-your-actual-api-key-here
HOST=127.0.0.1
PORT=8001
ENVIRONMENT=development
```

### **Step 4: Start the Server**

#### **Option A: Using the startup script (Recommended)**
```bash
cd backend
python start_server.py
```

#### **Option B: Using uvicorn directly**
```bash
cd backend
uvicorn gemini_api:app --reload --host 127.0.0.1 --port 8001
```

### **Step 5: Test the Connection**

#### **Test 1: Health Check**
Open browser and go to: `http://127.0.0.1:8001/health`

**Expected Response:**
```json
{
  "status": "healthy",
  "message": "Gemini API is working properly",
  "gemini_api": "connected"
}
```

#### **Test 2: API Documentation**
Go to: `http://127.0.0.1:8001/docs`

#### **Test 3: Chat Endpoint**
```bash
curl -X POST "http://127.0.0.1:8001/chat" \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello"}'
```

## 🔧 **Troubleshooting Steps**

### **Problem: Server won't start**

#### **Check 1: Python Version**
```bash
python --version
# Should be Python 3.8 or higher
```

#### **Check 2: Dependencies**
```bash
pip list | grep -E "(fastapi|uvicorn|google-generativeai)"
```

#### **Check 3: Port Availability**
```bash
# Windows
netstat -an | findstr :8001

# Linux/Mac
lsof -i :8001
```

### **Problem: "GEMINI_API_KEY not set"**

#### **Solution:**
1. Verify `.env` file exists in `backend/` directory
2. Check API key format (should start with `AIzaSy`)
3. No quotes around the API key in `.env` file
4. Restart the server after changing `.env`

### **Problem: Frontend can't connect**

#### **Check 1: Server URL**
Frontend expects: `http://127.0.0.1:8001/chat`

#### **Check 2: CORS Configuration**
Server allows these origins:
- `http://localhost:5173`
- `http://localhost:5174`
- `http://127.0.0.1:5173`
- `http://127.0.0.1:5174`

#### **Check 3: Network**
```bash
# Test from command line
curl -X POST "http://127.0.0.1:8001/chat" \
     -H "Content-Type: application/json" \
     -d '{"message": "test"}'
```

### **Problem: "Empty response from Gemini API"**

#### **Possible Causes:**
1. API quota exceeded
2. Invalid API key
3. Network connectivity issues
4. Gemini service temporarily down

#### **Solutions:**
1. Check API usage in Google Cloud Console
2. Verify API key is correct and active
3. Test with simple message first
4. Check Gemini service status

## 📋 **Quick Checklist**

- [ ] Python 3.8+ installed
- [ ] All dependencies installed (`pip install -r requirements.txt`)
- [ ] `.env` file exists with valid GEMINI_API_KEY
- [ ] Server starts without errors
- [ ] Health check returns "healthy" status
- [ ] Frontend can reach `http://127.0.0.1:8001/chat`
- [ ] CORS is properly configured
- [ ] No firewall blocking port 8001

## 🚀 **Quick Start Commands**

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
pip install -r requirements.txt

# 3. Add your API key to .env file
# Edit .env and add: GEMINI_API_KEY=your_actual_key_here

# 4. Start server
python start_server.py

# 5. Test in browser
# Go to: http://127.0.0.1:8001/health
```

## 📞 **Still Having Issues?**

### **Debug Information to Collect:**
1. Python version: `python --version`
2. Installed packages: `pip list`
3. Server logs (copy the terminal output)
4. Browser console errors (F12 → Console)
5. Network tab in browser dev tools

### **Common Error Messages:**

#### **"ModuleNotFoundError: No module named 'google.generativeai'"**
```bash
pip install google-generativeai
```

#### **"ValueError: GEMINI_API_KEY not set"**
- Add your API key to the `.env` file

#### **"Address already in use"**
- Another process is using port 8001
- Kill the process or use a different port

#### **"Connection refused"**
- Server is not running
- Check if server started successfully
- Verify the correct port (8001)

---

**Need more help?** Check the server logs for detailed error messages!
