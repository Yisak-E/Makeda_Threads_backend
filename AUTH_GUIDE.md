# Authentication & Authorization Guide

## 🔐 Overview

The Makeda Threads backend implements a secure JWT-based authentication system with role-based access control (RBAC).

## 🏗️ Architecture

### Components

1. **JWT Strategy** - Validates JWT tokens and extracts user information
2. **Auth Service** - Handles registration, login, and token generation
3. **Auth Controller** - Exposes authentication endpoints
4. **Guards** - Protects routes (JwtAuthGuard, RolesGuard)
5. **Decorators** - Custom decorators for roles and current user

## 📋 Authentication Flow

```
1. User Registration/Login
   ↓
2. Backend validates credentials
   ↓
3. Backend generates JWT token with user payload
   ↓
4. Frontend stores token
   ↓
5. Frontend sends token in Authorization header
   ↓
6. Backend validates token via JwtStrategy
   ↓
7. User object attached to request
```

## 🔑 API Endpoints

### POST /api/v1/auth/register

Register a new customer account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "Password123"
}
```

**Response:**
```json
{
  "message": "Registration successful",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer",
    "phone": null,
    "address": null,
    "city": null,
    "postalCode": null,
    "country": null,
    "isActive": true,
    "createdAt": "2026-02-18T10:00:00.000Z",
    "updatedAt": "2026-02-18T10:00:00.000Z"
  }
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### POST /api/v1/auth/login

Login with existing credentials.

**Request Body:**
```json
{
  "email": "admin@makedathreads.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@makedathreads.com",
    "name": "Admin User",
    "role": "admin",
    "phone": "+251911234567",
    "address": "123 Bole Road",
    "city": "Addis Ababa",
    "postalCode": "1000",
    "country": "Ethiopia",
    "isActive": true,
    "createdAt": "2026-02-18T10:00:00.000Z",
    "updatedAt": "2026-02-18T10:00:00.000Z"
  }
}
```

### GET /api/v1/auth/me

Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "admin@makedathreads.com",
  "name": "Admin User",
  "role": "admin",
  "phone": "+251911234567",
  "address": "123 Bole Road",
  "city": "Addis Ababa",
  "postalCode": "1000",
  "country": "Ethiopia",
  "isActive": true,
  "createdAt": "2026-02-18T10:00:00.000Z",
  "updatedAt": "2026-02-18T10:00:00.000Z"
}
```

## 🛡️ Role-Based Access Control

### User Roles

1. **customer** - Regular customers
2. **admin** - Platform administrators
3. **brand-partner** - Brand partners/vendors

### Protecting Routes

#### Simple Authentication (any logged-in user)

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('example')
export class ExampleController {
  @Get('protected')
  @UseGuards(JwtAuthGuard)
  getProtectedData() {
    return { message: 'This requires authentication' };
  }
}
```

#### Role-Based Authorization (specific roles)

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/users.schema';

@Controller('admin')
export class AdminController {
  // Admin only
  @Get('dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getAdminDashboard() {
    return { message: 'Admin only' };
  }

  // Admin or Brand Partner
  @Get('analytics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BRAND_PARTNER)
  getAnalytics() {
    return { message: 'Admin or Brand Partner' };
  }
}
```

### Accessing Current User

Use the `@CurrentUser()` decorator to get the authenticated user's information:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserData } from '../../common/decorators/current-user.decorator';

@Controller('profile')
export class ProfileController {
  @Get()
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: CurrentUserData) {
    // user contains: { userId, email, role, name }
    return {
      message: `Hello ${user.name}`,
      userId: user.userId,
      role: user.role,
    };
  }
}
```

## 🔧 JWT Token Structure

### Payload

```json
{
  "sub": "507f1f77bcf86cd799439011",  // User ID
  "email": "user@example.com",
  "role": "customer",
  "iat": 1708258800,                   // Issued at
  "exp": 1708863600                    // Expires at
}
```

### Configuration

JWT settings in `.env`:

```env
JWT_SECRET=your-secret-key-here-change-in-production
JWT_EXPIRES_IN=7d
```

## 🧪 Testing Authentication

### Using cURL

```bash
# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "Password123"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@makedathreads.com",
    "password": "Password123"
  }'

# Get Profile (replace TOKEN with actual token)
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer TOKEN"
```

### Using Thunder Client / Postman

1. **Register/Login**: Send POST request to get token
2. **Save Token**: Copy the `access_token` from response
3. **Protected Routes**: Add header `Authorization: Bearer <token>`

## 👥 Test Accounts

All seeded users have the password: `Password123`

### Admin Account
- **Email:** admin@makedathreads.com
- **Role:** admin

### Customer Accounts
- abebe.bekele@example.com (customer)
- tigist.alemayehu@example.com (customer)
- yohannes.tesfaye@example.com (customer)
- meron.haile@example.com (customer)
- dawit.solomon@example.com (customer)
- helen.getachew@example.com (customer)
- samuel.kifle@example.com (customer)
- ruth.mengistu@example.com (customer)

### Brand Partner Account
- **Email:** partner@brandpartner.com
- **Role:** brand-partner

## 🔒 Security Features

### Password Security
- Bcrypt hashing with 10 salt rounds
- Password strength validation
- Never returned in API responses

### Token Security
- Short-lived tokens (7 days default)
- Stateless authentication
- Signed with secret key

### Input Validation
- Email format validation
- Password complexity requirements
- DTO validation with class-validator

### Error Handling
- Generic error messages for security (e.g., "Invalid credentials")
- No information leakage
- Proper HTTP status codes

## 🚨 Common Errors

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```
**Cause:** Missing or invalid JWT token

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```
**Cause:** User doesn't have required role

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Email already registered"
}
```
**Cause:** Attempting to register with existing email

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": [
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  ],
  "error": "Bad Request"
}
```
**Cause:** Validation errors in request body

## 🔄 Frontend Integration

### Login Flow

```typescript
// Login
const response = await fetch('http://localhost:3000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});

const { access_token, user } = await response.json();

// Store token
localStorage.setItem('token', access_token);
localStorage.setItem('user', JSON.stringify(user));
```

### Making Authenticated Requests

```typescript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3000/api/v1/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

const user = await response.json();
```

### Auto-Populate User Data

The backend returns full user data including address, city, country, etc., which can be used to auto-populate forms on the frontend:

```typescript
const { user } = loginResponse;

// Auto-fill checkout form
setFormData({
  name: user.name,
  email: user.email,
  phone: user.phone,
  address: user.address,
  city: user.city,
  postalCode: user.postalCode,
  country: user.country,
});
```

## 📚 Next Steps

1. **Refresh Tokens**: Implement refresh token mechanism for better security
2. **Password Reset**: Add forgot password functionality
3. **Email Verification**: Verify user emails before activation
4. **OAuth**: Add social login (Google, Facebook)
5. **2FA**: Two-factor authentication for sensitive operations
6. **Session Management**: Track active sessions
7. **Rate Limiting**: Prevent brute force attacks

---

**Security Note:** Always use HTTPS in production and keep JWT secrets secure!
