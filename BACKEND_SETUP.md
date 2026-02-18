# Makeda Threads Backend - Setup Guide

## 🏗️ Architecture Overview

This NestJS backend provides a RESTful API for the Makeda Threads e-commerce platform, built with MongoDB and Mongoose for data persistence.

## 📦 Core Technologies

- **NestJS**: Enterprise-grade Node.js framework
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: Elegant MongoDB object modeling
- **TypeScript**: Type-safe development
- **Class Validator**: Automatic DTO validation
- **Bcrypt**: Secure password hashing

## 🗂️ Project Structure

```
src/
├── config/
│   └── configuration.ts          # Environment configuration
├── database/
│   ├── database.module.ts        # Database module
│   ├── seed.service.ts           # Seeding service
│   └── seed.ts                   # Seed script runner
├── modules/
│   ├── auth/
│   │   └── auth.module.ts
│   ├── users/
│   │   ├── dto/
│   │   │   ├── create-users.dto.ts
│   │   │   └── update-users.dto.ts
│   │   ├── schemas/
│   │   │   └── users.schema.ts
│   │   └── users.module.ts
│   ├── products/
│   │   ├── dto/
│   │   │   ├── create-products.dto.ts
│   │   │   └── update-products.dto.ts
│   │   ├── schemas/
│   │   │   └── products.schema.ts
│   │   └── products.module.ts
│   ├── orders/
│   │   ├── dto/
│   │   │   └── create-orders.dto.ts
│   │   ├── schemas/
│   │   │   └── orders.schema.ts
│   │   └── orders.module.ts
│   └── notifications/
│       ├── schemas/
│       │   └── notifications.schema.ts
│       └── notifications.module.ts
├── app.module.ts                 # Root application module
└── main.ts                       # Application entry point
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/makeda-threads

# JWT Configuration
JWT_SECRET=your-secret-key-here-change-in-production
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

## 📊 Data Models

### User Schema
```typescript
{
  email: string (unique, required)
  name: string (required)
  password: string (required, hashed)
  role: 'customer' | 'admin' | 'brand-partner'
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
  isActive: boolean
  timestamps: true
}
```

### Product Schema
```typescript
{
  name: string (required)
  price: number (required)
  image: string (required)
  category: 'Female' | 'Male' | 'Kids' | 'General'
  stockQuantity: number (default: 0)
  discountPercentage: number (0-100)
  description?: string
  isActive: boolean
  timestamps: true
}
```

### Order Schema
```typescript
{
  orderNumber: string (unique, required)
  userId?: ObjectId (ref: User)
  customerName: string (required)
  customerEmail: string (required)
  total: number (required)
  status: 'Processing' | 'Shipped' | 'Delivered'
  refundStatus: 'None' | 'Requested' | 'Approved' | 'Rejected'
  items: OrderItem[]
  date: Date
  shippingAddress?: string
  city?: string
  postalCode?: string
  country?: string
  timestamps: true
}
```

### Notification Schema
```typescript
{
  userId: ObjectId (ref: User, required)
  title: string (required)
  message: string (required)
  type: 'order_update' | 'promotion' | 'system'
  isRead: boolean (default: false)
  orderId?: ObjectId (ref: Order)
  date: Date
  timestamps: true
}
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Copy `.env.example` to `.env` and update values:
```bash
cp .env.example .env
```

### 3. Start MongoDB
Ensure MongoDB is running locally or update `MONGODB_URI` to point to your MongoDB instance:
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env with your Atlas connection string
```

### 4. Seed the Database (Optional)
Populate the database with sample data:
```bash
npm run seed
```

This will create:
- 4 sample users (1 admin, 2 customers, 1 brand partner)
- 6 sample products
- 2 sample orders

**Default Admin Credentials:**
- Email: `admin@makedathreads.com`
- Password: `Password123`

### 5. Start Development Server
```bash
npm run start:dev
```

The API will be available at: `http://localhost:3000/api/v1`

## 🔌 API Configuration

### Global Prefix
All API routes are prefixed with `/api/v1`:
```
http://localhost:3000/api/v1/...
```

### Global Validation
All DTOs are automatically validated using class-validator. Invalid requests will return:
```json
{
  "statusCode": 400,
  "message": ["Validation error messages"],
  "error": "Bad Request"
}
```

### CORS
CORS is enabled for the frontend URL specified in `FRONTEND_URL` environment variable (default: `http://localhost:5173`).

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Available Scripts

```json
{
  "start": "Start production server",
  "start:dev": "Start development server with hot reload",
  "build": "Build production bundle",
  "seed": "Seed database with sample data",
  "lint": "Run ESLint",
  "test": "Run unit tests",
  "test:e2e": "Run end-to-end tests"
}
```

## 🔐 Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **DTO Validation**: Automatic request validation
- **Input Sanitization**: Whitelist and transform incoming data
- **CORS Protection**: Configured for specific frontend origin
- **Environment Variables**: Sensitive data stored in `.env`

## 📚 Next Steps

1. **Implement Controllers & Services**: Add CRUD operations for each module
2. **Authentication**: Implement JWT authentication strategy
3. **Authorization**: Add role-based guards
4. **Swagger Documentation**: Add API documentation
5. **Error Handling**: Implement custom exception filters
6. **Logging**: Add structured logging
7. **Rate Limiting**: Protect against abuse
8. **Testing**: Write comprehensive tests

## 🐛 Common Issues

### MongoDB Connection Failed
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify network connectivity for Atlas

### Port Already in Use
```bash
# Change PORT in .env or kill the process
npx kill-port 3000
```

### Validation Errors
- Check DTO definitions match your request payload
- Ensure all required fields are provided
- Verify enum values match schema definitions

## 📖 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Class Validator](https://github.com/typestack/class-validator)

## 👥 Team

Built by the Makeda Threads development team.

---

**Happy Coding! 🚀**
