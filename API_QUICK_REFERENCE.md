# 🔐 Makeda Threads Auth API - Quick Reference

## Base URL
```
http://localhost:3000/api/v1
```

---

## 📝 Authentication Endpoints

### 1️⃣ Register New User

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "Password123"
}
```

**Response (201 Created):**
```json
{
  "message": "Registration successful",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65abc...",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer",
    "isActive": true
  }
}
```

---

### 2️⃣ Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@makedathreads.com",
  "password": "Password123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65abc...",
    "email": "admin@makedathreads.com",
    "name": "Admin User",
    "role": "admin",
    "phone": "+251911234567",
    "address": "123 Bole Road",
    "city": "Addis Ababa",
    "postalCode": "1000",
    "country": "Ethiopia"
  }
}
```

---

### 3️⃣ Get Current User (Protected)

```http
GET /auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "id": "65abc...",
  "email": "admin@makedathreads.com",
  "name": "Admin User",
  "role": "admin",
  "phone": "+251911234567",
  "address": "123 Bole Road",
  "city": "Addis Ababa",
  "postalCode": "1000",
  "country": "Ethiopia",
  "isActive": true
}
```

---

## 🛡️ Protected Route Examples

### Simple Authentication (Any Logged-in User)

```http
GET /users/profile
Authorization: Bearer YOUR_TOKEN
```

---

### Admin Only Route

```http
GET /users/admin/dashboard
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Required Role:** `admin`

---

### Multi-Role Route

```http
GET /users/partner/dashboard
Authorization: Bearer YOUR_ADMIN_OR_PARTNER_TOKEN
```

**Allowed Roles:** `admin`, `brand-partner`

---

## 🔑 Test Credentials

All users have password: `Password123`

| Email | Role |
|-------|------|
| admin@makedathreads.com | admin |
| abebe.bekele@example.com | customer |
| tigist.alemayehu@example.com | customer |
| partner@brandpartner.com | brand-partner |

---

## ❌ Error Responses

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```
**Causes:** Missing/invalid token, wrong credentials

---

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```
**Cause:** Insufficient role permissions

---

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Email already registered"
}
```
**Cause:** Email already exists

---

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 8 characters"
  ],
  "error": "Bad Request"
}
```
**Cause:** Validation errors

---

## 🎯 Frontend Integration

### Login Flow
```javascript
// 1. Login
const response = await fetch('http://localhost:3000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const { access_token, user } = await response.json();

// 2. Store token
localStorage.setItem('token', access_token);
localStorage.setItem('user', JSON.stringify(user));

// 3. Make authenticated requests
const profileResponse = await fetch('http://localhost:3000/api/v1/auth/me', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});
```

---

## 📦 Password Requirements

- ✅ Minimum 8 characters
- ✅ At least 1 uppercase letter (A-Z)
- ✅ At least 1 lowercase letter (a-z)
- ✅ At least 1 number (0-9)

**Valid Examples:**
- `Password123`
- `MySecret99`
- `Test1234`

**Invalid Examples:**
- `password` (no uppercase, no number)
- `PASSWORD` (no lowercase, no number)
- `Pass123` (less than 8 characters)

---

## 🧪 cURL Examples

### Register
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"Password123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@makedathreads.com","password":"Password123"}'
```

### Get Profile
```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔄 Token Lifecycle

```
Login/Register → Receive Token (7 days validity)
       ↓
Store in localStorage/sessionStorage
       ↓
Include in Authorization header for all requests
       ↓
Token expires after 7 days → User must re-login
```

---

## 🚀 Quick Start Commands

```bash
# Start server
npm run start:dev

# Seed test data
npm run seed

# Build for production
npm run build
```

---

**Documentation:** See [AUTH_GUIDE.md](AUTH_GUIDE.md) for detailed information  
**API Tests:** See [test/auth.http](test/auth.http) for test scenarios
