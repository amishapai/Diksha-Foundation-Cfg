#!/usr/bin/env python3
"""
Startup script for Gemini Chat API
This script handles environment setup and server startup
"""

import os
import sys
import subprocess
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def check_requirements():
    """Check if required packages are installed"""
    required_packages = [
        'fastapi',
        'uvicorn',
        'google-generativeai',
        'python-dotenv',
        'pydantic'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        logger.error(f"Missing required packages: {', '.join(missing_packages)}")
        logger.info("Install them with: pip install " + " ".join(missing_packages))
        return False
    
    return True

def check_env_file():
    """Check if .env file exists and has required variables"""
    env_path = Path(__file__).parent / '.env'
    
    if not env_path.exists():
        logger.error(".env file not found!")
        logger.info("Creating a template .env file...")
        
        template_content = """# Gemini API Configuration
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Server Configuration  
HOST=127.0.0.1
PORT=8001

# Environment
ENVIRONMENT=development
"""
        
        with open(env_path, 'w') as f:
            f.write(template_content)
        
        logger.info(f"Template .env file created at {env_path}")
        logger.error("Please add your actual GEMINI_API_KEY to the .env file and run again!")
        return False
    
    # Check if API key is set
    from dotenv import load_dotenv
    load_dotenv(env_path)
    
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key or api_key == 'your_actual_gemini_api_key_here':
        logger.error("GEMINI_API_KEY not set in .env file!")
        logger.info("Please add your actual Gemini API key to the .env file")
        return False
    
    logger.info("Environment configuration looks good!")
    return True

def start_server():
    """Start the FastAPI server"""
    host = os.getenv('HOST', '127.0.0.1')
    port = int(os.getenv('PORT', 8001))
    
    logger.info(f"Starting Gemini Chat API server on {host}:{port}")
    logger.info("Press Ctrl+C to stop the server")
    
    try:
        # Start uvicorn server
        subprocess.run([
            sys.executable, '-m', 'uvicorn',
            'gemini_api:app',
            '--reload',
            '--host', host,
            '--port', str(port),
            '--log-level', 'info'
        ], check=True)
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except subprocess.CalledProcessError as e:
        logger.error(f"Failed to start server: {e}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return False
    
    return True

def main():
    """Main function"""
    logger.info("🚀 Starting Gemini Chat API...")
    
    # Check requirements
    if not check_requirements():
        sys.exit(1)
    
    # Check environment
    if not check_env_file():
        sys.exit(1)
    
    # Start server
    if not start_server():
        sys.exit(1)

if __name__ == "__main__":
    main()
