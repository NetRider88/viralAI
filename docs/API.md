# VIRAL.AI API Documentation

## Base URL
```
http://127.0.0.1:8000/api/
```

## Authentication
Most API endpoints require JWT authentication. Include the access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## Authentication API

### 1. Register

**Endpoint:** `POST /api/auth/register/`

**Description:** Register a new user account.

**Request Body:**
```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "password2": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": "uuid",
    "username": "john",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "subscription_tier": "free",
    "subscription_status": "active",
    "created_at": "2025-10-26T10:00:00Z"
  },
  "tokens": {
    "refresh": "refresh_token_here",
    "access": "access_token_here"
  },
  "message": "User registered successfully"
}
```

---

### 2. Login

**Endpoint:** `POST /api/auth/login/`

**Description:** Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid",
    "username": "john",
    "email": "john@example.com",
    "subscription_tier": "free"
  },
  "tokens": {
    "refresh": "refresh_token_here",
    "access": "access_token_here"
  },
  "message": "Login successful"
}
```

---

### 3. Logout

**Endpoint:** `POST /api/auth/logout/`

**Authentication:** Required

**Request Body:**
```json
{
  "refresh": "refresh_token_here"
}
```

**Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```

---

### 4. Refresh Token

**Endpoint:** `POST /api/auth/token/refresh/`

**Description:** Get a new access token using refresh token.

**Request Body:**
```json
{
  "refresh": "refresh_token_here"
}
```

**Response (200 OK):**
```json
{
  "access": "new_access_token_here"
}
```

---

### 5. Get Profile

**Endpoint:** `GET /api/auth/profile/`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "id": "uuid",
  "username": "john",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "avatar_url": null,
  "subscription_tier": "free",
  "subscription_status": "active",
  "created_at": "2025-10-26T10:00:00Z"
}
```

---

### 6. Update Profile

**Endpoint:** `PUT /api/auth/profile/` or `PATCH /api/auth/profile/`

**Authentication:** Required

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Smith",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

---

### 7. Change Password

**Endpoint:** `POST /api/auth/change-password/`

**Authentication:** Required

**Request Body:**
```json
{
  "old_password": "OldPass123!",
  "new_password": "NewPass123!",
  "new_password2": "NewPass123!"
}
```

**Response (200 OK):**
```json
{
  "message": "Password changed successfully"
}
```

---

### 8. Get Usage Statistics

**Endpoint:** `GET /api/auth/usage/`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "usage": {
    "month": "2025-10-01",
    "content_blocks_created": 0,
    "video_generations": 0,
    "api_calls": 5,
    "image_generations": 0
  },
  "limits": {
    "content_blocks": 1,
    "videos": 0,
    "images": 1
  },
  "tier": "free",
  "percentage_used": {
    "content_blocks": 0,
    "videos": 0
  }
}
```

---

## Keyword Research API

### 1. Perform Keyword Research

**Endpoint:** `POST /api/keywords/research/`

**Description:** Performs comprehensive keyword research using Google Autocomplete API.

**Request Body:**
```json
{
  "keyword": "AI tools",
  "country": "us",
  "language": "en"
}
```

**Response (Success - 201 Created):**
```json
{
  "cached": false,
  "data": {
    "id": "uuid",
    "keyword": "AI tools",
    "country": "us",
    "language": "en",
    "search_volume": 450,
    "trend_direction": "",
    "platform_breakdown": {
      "instagram": {"count": 45, "percentage": 32.1},
      "tiktok": {"count": 52, "percentage": 37.1},
      "linkedin": {"count": 23, "percentage": 16.4},
      "twitter": {"count": 12, "percentage": 8.6},
      "youtube": {"count": 8, "percentage": 5.7}
    },
    "questions": [
      {
        "category": "what",
        "query": "AI tools what",
        "suggestions": ["what are the best AI tools", "what AI tools are free"],
        "count": 2
      }
    ],
    "prepositions": [...],
    "alphabetical": [...],
    "comparisons": [...],
    "related_keywords": [...],
    "viral_examples": [],
    "created_at": "2025-10-26T10:00:00Z"
  },
  "summary": {
    "total_suggestions": 450,
    "questions_count": 10,
    "prepositions_count": 10,
    "alphabetical_count": 26,
    "comparisons_count": 5
  }
}
```

**Response (Cached - 200 OK):**
```json
{
  "cached": true,
  "data": {
    // Same structure as above
  }
}
```

**Response (Error - 400 Bad Request):**
```json
{
  "keyword": ["This field is required."]
}
```

**Response (Error - 500 Internal Server Error):**
```json
{
  "error": "Failed to perform keyword research",
  "detail": "Error message"
}
```

---

### 2. List Keyword Research History

**Endpoint:** `GET /api/keywords/`

**Description:** Returns all keyword research performed by the authenticated user.

**Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "keyword": "AI tools",
    "country": "us",
    "language": "en",
    "search_volume": 450,
    "created_at": "2025-10-26T10:00:00Z"
  }
]
```

---

### 3. Get Single Keyword Research

**Endpoint:** `GET /api/keywords/{id}/`

**Description:** Returns detailed keyword research data.

**Response (200 OK):**
```json
{
  "id": "uuid",
  "keyword": "AI tools",
  "country": "us",
  "language": "en",
  "search_volume": 450,
  "platform_breakdown": {...},
  "questions": [...],
  "prepositions": [...],
  "alphabetical": [...],
  "comparisons": [...],
  "related_keywords": [...],
  "viral_examples": [],
  "created_at": "2025-10-26T10:00:00Z"
}
```

---

## Testing the API

### Using cURL

```bash
# Login first (get session cookie)
curl -X POST http://127.0.0.1:8000/admin/login/ \
  -d "username=admin&password=yourpassword" \
  -c cookies.txt

# Perform keyword research
curl -X POST http://127.0.0.1:8000/api/keywords/research/ \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"keyword": "AI tools", "country": "us", "language": "en"}'
```

### Using Browsable API

1. Navigate to: http://127.0.0.1:8000/api/keywords/research/
2. Login using the login form
3. Use the HTML form to test the API

---

## Coming Soon

- Content Generation API
- Link Tracking API
- Analytics API
- User Management API
