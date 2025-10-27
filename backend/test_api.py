#!/usr/bin/env python
"""
Simple script to test the Keyword Research API
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_keyword_research():
    """Test keyword research endpoint"""
    
    print("=" * 60)
    print("Testing Keyword Research API")
    print("=" * 60)
    
    # Note: You'll need to create a user and get a session first
    # For now, this shows the endpoint structure
    
    url = f"{BASE_URL}/api/keywords/research/"
    
    data = {
        "keyword": "AI tools",
        "country": "us",
        "language": "en"
    }
    
    print(f"\nEndpoint: {url}")
    print(f"Request data: {json.dumps(data, indent=2)}")
    
    # Note: This will fail without authentication
    # You need to login first or use session authentication
    
    print("\n⚠️  To test this API:")
    print("1. Create a superuser: python manage.py createsuperuser")
    print("2. Login to admin: http://127.0.0.1:8000/admin/")
    print("3. Use the browsable API: http://127.0.0.1:8000/api/keywords/research/")
    print("4. Or use curl with session cookie")

if __name__ == "__main__":
    test_keyword_research()
