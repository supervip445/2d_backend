# API Flow Diagrams

## 🔐 Authentication Flow

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ POST /api/auth/admin/login
       │ { user_name, password }
       ▼
┌─────────────────────────────────┐
│  UserController.adminLogin()    │
│  1. Find user by user_name       │
│  2. Check role (Owner/Agent/     │
│     Sub_Agent)                   │
│  3. Verify password (bcrypt)     │
│  4. Generate JWT token           │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Response:                      │
│  {                              │
│    token: "jwt_token",          │
│    user: { id, name, role... }  │
│  }                              │
└─────────────────────────────────┘
```

## 👤 User Creation Flow

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ POST /api/user/users
       │ Authorization: Bearer <token>
       │ { name, user_name, password, 
       │   role, deposit_amount }
       ▼
┌─────────────────────────────────┐
│  authenticateToken Middleware   │
│  - Extract token                │
│  - Verify JWT                   │
│  - Attach user to req.user      │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  isAdmin Middleware             │
│  - Check role ≠ Player          │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  UserController.createUser()    │
│  1. Validate role hierarchy     │
│  2. Hash password                │
│  3. Create user (balance = 0)    │
└──────┬──────────────────────────┘
       │
       │ If deposit_amount > 0
       ▼
┌─────────────────────────────────┐
│  WalletService.deposit()         │
│  1. Validate hierarchy          │
│  2. Check sender balance        │
│  3. Prisma Transaction:          │
│     - Decrement sender           │
│     - Increment receiver         │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Response:                      │
│  {                              │
│    message: "User created",     │
│    user: { id, name, role... }  │
│  }                              │
└─────────────────────────────────┘
```

## 🎲 Two-Digit Status Check Flow

```
┌─────────────┐
│   Client     │
└──────┬──────┘
       │ GET /api/two-digit/status/42
       │ (No auth required)
       ▼
┌─────────────────────────────────┐
│  TwoDigitController.checkStatus │
│  1. Validate format (2 digits)   │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  TwoDigitService.isActive()     │
│  1. Find by two_digit           │
│  2. Check status === 1          │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Prisma Query:                  │
│  twoDigit.findUnique({          │
│    where: { two_digit: "42" }   │
│  })                             │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Response:                      │
│  { isActive: true/false }       │
└─────────────────────────────────┘
```

## 🔒 Protected Route Flow (Close Digit)

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ POST /api/two-digit/close/42
       │ Authorization: Bearer <token>
       ▼
┌─────────────────────────────────┐
│  authMiddleware                 │
│  - Verify JWT token             │
│  - Attach user to req           │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  roleMiddleware(['Owner',       │
│                 'Agent',        │
│                 'Sub_Agent'])   │
│  - Check user role              │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  TwoDigitController.closeDigit  │
│  1. Validate format             │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  TwoDigitService.closeDigit()   │
│  1. Update status to 0          │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Prisma Update:                 │
│  twoDigit.update({              │
│    where: { two_digit: "42" },  │
│    data: { status: 0 }          │
│  })                             │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Response:                      │
│  {                              │
│    id: 1,                       │
│    two_digit: "42",             │
│    status: 0,                   │
│    ...                          │
│  }                              │
└─────────────────────────────────┘
```

## 💰 Wallet Deposit Flow

```
┌─────────────┐
│   Client     │
└──────┬──────┘
       │ (Internal call from createUser)
       ▼
┌─────────────────────────────────┐
│  WalletService.deposit()         │
│  Parameters:                     │
│  - fromUserId (Agent)            │
│  - toUserId (Player)             │
│  - amount (100)                  │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  1. Fetch both users            │
│  2. Validate role hierarchy     │
│     Agent → Player ✓            │
│  3. Validate amount > 0         │
│  4. Check sender balance         │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Prisma Transaction:            │
│  BEGIN TRANSACTION              │
│    UPDATE users                 │
│    SET balance = balance - 100  │
│    WHERE id = fromUserId        │
│                                 │
│    UPDATE users                 │
│    SET balance = balance + 100  │
│    WHERE id = toUserId          │
│  COMMIT                         │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Return: { message: "Success" } │
└─────────────────────────────────┘
```

## ⚠️ Error Handling Flow

```
┌─────────────────────────────────┐
│  Any Route Handler                     │
│  throws error                     │
└──────┬─────────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  errorHandler Middleware        │
│  (Global error handler)         │
└──────┬──────────────────────────┘
       │
       ├─── Prisma Error ──────────┐
       │                           │
       │   P2002 (Unique)          │
       │   → 409 Conflict          │
       │                           │
       │   P2025 (Not Found)       │
       │   → 404 Not Found         │
       │                           │
       │   P2003 (Foreign Key)     │
       │   → 400 Bad Request       │
       │                           │
       ├─── JWT Error ─────────────┤
       │                           │
       │   JsonWebTokenError       │
       │   → 401 Unauthorized      │
       │                           │
       │   TokenExpiredError       │
       │   → 401 Unauthorized      │
       │                           │
       ├─── HttpException ────────┤
       │                           │
       │   UnauthorizedException   │
       │   → 401                   │
       │                           │
       │   NotFoundException       │
       │   → 404                   │
       │                           │
       │   ForbiddenException      │
       │   → 403                   │
       │                           │
       └─── Unknown Error ────────┤
                                   │
                                   │
       ┌───────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Response to Client:            │
│  {                              │
│    message: "Error message",    │
│    errorCode: "ERROR_CODE",     │
│    statusCode: 400/401/404...   │
│  }                              │
└─────────────────────────────────┘
```

## 🏗️ Role Hierarchy Visualization

```
                    ┌─────────┐
                    │ Owner   │
                    └────┬────┘
                         │
                         │ Creates
                         ▼
                    ┌─────────┐
                    │ Agent   │
                    └────┬────┘
                         │
            ┌────────────┼────────────┐
            │            │            │
            │ Creates    │ Creates    │
            ▼            ▼            ▼
      ┌──────────┐  ┌──────────┐  ┌──────────┐
      │Sub_Agent │  │ Player   │  │ Player   │
      └────┬─────┘  └──────────┘  └──────────┘
           │
           │ Creates
           ▼
      ┌──────────┐
      │ Player   │
      └──────────┘

Deposit Flow (Money Down):
Owner → Agent → Sub_Agent → Player
Owner → Agent → Player

Withdraw Flow (Money Up):
Player → Sub_Agent → Agent → Owner
Player → Agent → Owner
```

---

**Note:** All diagrams show the request flow from client to database and back.

