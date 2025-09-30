# Backend API Specification for Data Room Authentication

This document outlines the required backend API endpoints for a fully functional authentication system.

## Base URL
```
http://localhost:3001/api
```

## Authentication Endpoints

### POST /auth/login
Login existing user

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user|admin|viewer"
  }
}
```

**Error Response (401):**
```json
{
  "message": "Invalid email or password"
}
```

### POST /auth/register
Register new user

**Request Body:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "User Name", 
    "email": "user@example.com",
    "role": "user"
  }
}
```

**Error Response (400):**
```json
{
  "message": "Email already exists"
}
```

### POST /auth/refresh
Refresh authentication token

**Headers:**
```
Authorization: Bearer <current_token>
```

**Response (200):**
```json
{
  "token": "new_jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com", 
    "role": "user"
  }
}
```

### POST /auth/logout
Logout user (invalidate token)

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

### GET /auth/validate
Validate current token and return user info

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "user_id",
  "name": "User Name",
  "email": "user@example.com",
  "role": "user"
}
```

**Error Response (401):**
```json
{
  "message": "Invalid or expired token"
}
```

### GET /auth/me
Get current user profile

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "user_id",
  "name": "User Name",
  "email": "user@example.com",
  "role": "user",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Security Requirements

1. **JWT Tokens**: Use JWT tokens for authentication
2. **Token Expiration**: Tokens should expire (recommended: 1 hour for access tokens)
3. **Password Hashing**: Hash passwords using bcrypt or similar
4. **CORS**: Configure CORS for your frontend domain
5. **Rate Limiting**: Implement rate limiting on auth endpoints
6. **Input Validation**: Validate all inputs (email format, password strength)

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin', 'viewer') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Optional: Refresh Tokens Table
```sql
CREATE TABLE refresh_tokens (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Implementation Notes

- The frontend includes fallback demo mode for development
- Implement proper error handling and logging
- Use environment variables for JWT secrets
- Consider implementing email verification for registration
- Add password reset functionality as needed

## Testing

Test all endpoints with tools like Postman or curl. The frontend will automatically fallback to demo mode if the backend is not available.