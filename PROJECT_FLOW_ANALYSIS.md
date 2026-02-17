# Project Flow Analysis - 2D/3D Backend

## 📋 Project Overview
This is a **TypeScript/Node.js backend** application built with:
- **Express.js** - Web framework
- **Prisma ORM** - Database ORM (MySQL)
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Zod** - Validation

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (Frontend)                         │
│                  http://localhost:5173                       │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP Requests
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express Server                            │
│                  src/index.ts                                │
│                  Port: 3000 (default)                        │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Routes     │ │ Middleware   │ │  Controllers │
│  /api/*      │ │ Auth/Role    │ │  Business    │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │
       └────────────────┼────────────────┘
                        │
                        ▼
                ┌──────────────┐
                │   Services   │
                │  Data Logic  │
                └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │ Prisma Client │
                │   (MySQL)     │
                └──────────────┘
```

## 🔄 Request Flow

### 1. **Server Initialization** (`src/index.ts`)
```
1. Load environment variables (secrets.ts)
   - PORT (default: 3000)
   - JWT_SECRET (min 32 chars)
   - DATABASE_URL

2. Create Express app
   - JSON body parser
   - URL encoded parser
   - CORS (localhost:5173)

3. Initialize Prisma Client
   - Development: logs queries
   - Production: logs errors only

4. Register routes (/api prefix)
   - /api/auth
   - /api/user
   - /api/two-digit

5. Register error handlers
   - 404 handler
   - Global error handler

6. Start server
   - Listen on PORT
   - Graceful shutdown handler
```

### 2. **Route Structure** (`src/routes/index.ts`)
```
/api
├── /auth          → Authentication routes
├── /user          → User management routes
└── /two-digit     → Two-digit number management
```

## 🔐 Authentication Flow

### **Login Process**
```
POST /api/auth/admin/login
POST /api/auth/player/login
POST /api/user/admin/login (duplicate)
POST /api/user/player/login (duplicate)

Flow:
1. Extract credentials (user_name, password)
2. Find user by username + role
3. Compare password with bcrypt
4. Generate JWT token (24h expiry)
5. Return token + user data
```

### **Protected Routes**
```
Middleware Chain:
1. authenticateToken (auth.middleware.ts)
   - Extract token from Authorization header
   - Verify JWT signature
   - Attach user to req.user

2. roleMiddleware (role.middleware.ts)
   - Check if user role is in allowed roles
   - Owner, Agent, Sub_Agent can access admin routes
```

## 👥 User Management Flow

### **Role Hierarchy**
```
Owner
  └── Agent
      ├── Sub_Agent
      │   └── Player
      └── Player
```

### **User Creation** (`POST /api/user/users`)
```
Authorization: Owner, Agent, Sub_Agent

Flow:
1. Validate role hierarchy
   - Owner → can create Agent
   - Agent → can create Sub_Agent, Player
   - Sub_Agent → can create Player

2. Hash password (bcrypt, 10 rounds)

3. Create user in database
   - Set balance to 0 if deposit_amount provided

4. If deposit_amount > 0:
   - Call WalletService.deposit()
   - Transfer from creator to new user
   - Uses Prisma transaction

5. Return created user
```

### **Get Users** (`GET /api/user/users`)
```
Role-based filtering:
- Owner → All Agents + their Sub_Agents + Players
- Agent → Sub_Agents + Players under them
- Sub_Agent → Players under them
- Player → Access denied
```

## 💰 Wallet Service Flow

### **Deposit** (Higher → Lower Role)
```
Valid Hierarchies:
- Owner → Agent
- Agent → Sub_Agent, Player
- Sub_Agent → Player

Flow:
1. Validate users exist
2. Check role hierarchy
3. Validate amount > 0
4. Check sender balance
5. Prisma transaction:
   - Decrement sender balance
   - Increment receiver balance
```

### **Withdraw** (Lower → Higher Role)
```
Valid Hierarchies:
- Agent → Owner
- Sub_Agent → Agent
- Player → Agent, Sub_Agent

Flow: Same as deposit (reverse direction)
```

## 🎲 Two-Digit Management Flow

### **Public Routes** (No Auth Required)
```
GET /api/two-digit/getall
GET /api/two-digit/active
GET /api/two-digit/inactive
GET /api/two-digit/status/:two_digit

Flow:
1. TwoDigitController → TwoDigitService
2. Query Prisma (TwoDigit model)
3. Filter by status (1 = active, 0 = inactive)
4. Return results
```

### **Protected Routes** (Owner, Agent, Sub_Agent)
```
POST /api/two-digit/close/:two_digit
POST /api/two-digit/open/:two_digit

Flow:
1. Validate two_digit format (2 digits)
2. Update status in database
   - close → status = 0
   - open → status = 1
3. Return updated record
```

## 🗄️ Database Schema

### **User Model**
```prisma
- id: Int (PK, auto-increment)
- name: String?
- user_name: String?
- email: String? (unique)
- phone: String? (unique)
- password: String (hashed)
- address: String? (Text)
- role: Role (Owner|Agent|Sub_Agent|Player)
- status: Boolean (default: true)
- balance: Decimal(10,2) (default: 0)
- agent_id: Int? (FK to User)
- createdAt: DateTime
- updatedAt: DateTime
```

### **TwoDigit Model**
```prisma
- id: Int (PK, auto-increment)
- two_digit: String (unique, VarChar(2))
- status: Int (1 = active, 0 = inactive)
- createdAt: DateTime
- updatedAt: DateTime
```

## ⚠️ Error Handling Flow

### **Error Middleware** (`src/middleware/error.middleware.ts`)
```
Error Types Handled:
1. Prisma Errors
   - P2002: Unique constraint (409)
   - P2025: Not found (404)
   - P2003: Foreign key (400)

2. JWT Errors
   - JsonWebTokenError (401)
   - TokenExpiredError (401)

3. Validation Errors (422)

4. Custom HttpException
   - UnauthorizedException
   - NotFoundException
   - ForbiddenException
   - BadRequestsException

5. Unknown Errors (500)
```

## 🔍 Key Issues Found

### 1. **Duplicate Auth Routes**
- `/api/auth/admin/login` and `/api/user/admin/login` both exist
- Same for player login
- **Recommendation**: Consolidate to one location

### 2. **Inconsistent Auth Middleware**
- `authenticateToken` uses `JWT_SECRET` from secrets
- `authMiddleware` uses `process.env.JWT_SECRET` directly
- **Recommendation**: Use consistent approach

### 3. **Mixed PHP Files**
- `app/Models/TwoDigit.php` exists (Laravel?)
- `database/migrations/2024_03_21_000000_create_two_digits_table.php` exists
- **Recommendation**: Remove if not used (this is a TypeScript project)

### 4. **Prisma Client Duplication**
- `TwoDigitService` creates new PrismaClient instance
- Should use exported `prismaClient` from `index.ts`
- **Recommendation**: Use singleton pattern

### 5. **Missing Environment Validation**
- `authMiddleware` has fallback: `process.env.JWT_SECRET || 'your-secret-key'`
- **Security Risk**: Should fail if JWT_SECRET not set

## 📝 API Endpoints Summary

### **Authentication**
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/player/login` - Player login
- `POST /api/auth/admin/logout` - Admin logout (protected)

### **User Management** (Protected)
- `POST /api/user/users` - Create user (Admin)
- `GET /api/user/users` - Get users (role-based)
- `PUT /api/user/users/:id` - Update user (Admin)
- `DELETE /api/user/users/:id` - Delete user (Admin)
- `PUT /api/user/profile` - Update own profile

### **Two-Digit** (Public + Protected)
- `GET /api/two-digit/getall` - Get all digits
- `GET /api/two-digit/active` - Get active digits
- `GET /api/two-digit/inactive` - Get inactive digits
- `GET /api/two-digit/status/:two_digit` - Check status
- `POST /api/two-digit/close/:two_digit` - Close digit (Admin)
- `POST /api/two-digit/open/:two_digit` - Open digit (Admin)

### **Health Check**
- `GET /health` - Server health check

## 🚀 Development Workflow

### **Start Development Server**
```bash
npm run dev  # Uses nodemon with ts-node
```

### **Database Migrations**
```bash
npx prisma migrate dev    # Create & apply migration
npx prisma generate        # Generate Prisma Client
npx prisma db push         # Quick schema sync (dev only)
```

### **Seed Database**
```bash
npx prisma db seed         # Runs prisma/seed.ts
```

## 🔒 Security Considerations

1. ✅ Passwords hashed with bcrypt (10 rounds)
2. ✅ JWT tokens with 24h expiry
3. ✅ Role-based access control
4. ✅ CORS configured for specific origin
5. ⚠️ JWT_SECRET validation on startup
6. ⚠️ Environment variables validation

## 📊 Data Flow Example: Create User with Deposit

```
1. Client → POST /api/user/users
   Headers: { Authorization: "Bearer <token>" }
   Body: { name, user_name, password, role, deposit_amount }

2. Express → authenticateToken middleware
   - Verify JWT
   - Attach user to req.user

3. Express → isAdmin middleware
   - Check role is not Player

4. Express → UserController.createUser()
   - Validate role hierarchy
   - Hash password
   - Create user (balance = 0)

5. UserController → WalletService.deposit()
   - Validate hierarchy
   - Check balance
   - Prisma transaction:
     * UPDATE users SET balance = balance - amount WHERE id = fromUserId
     * UPDATE users SET balance = balance + amount WHERE id = toUserId

6. Response → Client
   { message: "User created successfully", user: {...} }
```

---

**Generated:** $(date)
**Project:** 2D/3D Backend
**Tech Stack:** TypeScript, Express, Prisma, MySQL

