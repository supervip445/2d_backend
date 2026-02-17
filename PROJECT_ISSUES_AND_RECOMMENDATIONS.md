# Project Issues and Recommendations

## 🔴 Critical Issues

### 1. **Multiple Prisma Client Instances**
**Location:** `src/services/twoDigit.service.ts:4`
```typescript
const prisma = new PrismaClient();  // ❌ Creates new instance
```

**Issue:** Creates a separate Prisma Client instance instead of using the singleton from `src/index.ts`

**Impact:**
- Multiple database connections
- Potential connection pool exhaustion
- Inconsistent logging configuration

**Fix:**
```typescript
import { prismaClient } from '../index';

export class TwoDigitService {
  // Use the exported singleton
  async getAll(filters?: TwoDigitFilters): Promise<TwoDigit[]> {
    return prismaClient.twoDigit.findMany({...});
  }
}
```

---

### 2. **Inconsistent JWT Secret Handling**
**Location:** `src/middleware/auth.middleware.ts:47`
```typescript
const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
```

**Issue:** 
- Uses `process.env.JWT_SECRET` directly instead of imported `JWT_SECRET
- Has fallback to insecure default value `'your-secret-key'`

**Impact:**
- Security vulnerability if env var not set
- Inconsistent with `authenticateToken` which uses imported `JWT_SECRET`

**Fix:**
```typescript
import { JWT_SECRET } from '../secrets';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```

---

## ⚠️ Medium Priority Issues

### 3. **Duplicate Authentication Routes**
**Locations:**
- `src/routes/auth.routes.ts` - Has admin/player login
- `src/routes/user.routes.ts` - Also has admin/player login

**Issue:** Same endpoints defined in two places

**Current State:**
```
POST /api/auth/admin/login
POST /api/auth/player/login
POST /api/user/admin/login  (duplicate)
POST /api/user/player/login  (duplicate)
```

**Recommendation:**
- Keep authentication routes in `/api/auth/*`
- Remove login routes from `/api/user/*`
- Update frontend to use consistent endpoint

---

### 4. **Unused PHP Files**
**Locations:**
- `app/Models/TwoDigit.php`
- `database/migrations/2024_03_21_000000_create_two_digits_table.php`

**Issue:** This is a TypeScript/Node.js project, but Laravel PHP files exist

**Recommendation:**
- Remove if not needed
- Or document why they exist (legacy code, migration period, etc.)

---

### 5. **Missing Input Validation**
**Location:** Controllers

**Issue:** No request body validation before processing

**Example:** `UserController.createUser()` accepts any body without validation

**Recommendation:**
- Use Zod schemas for request validation
- Add validation middleware before controllers

**Example Fix:**
```typescript
import { z } from 'zod';

const createUserSchema = z.object({
  name: z.string().optional(),
  user_name: z.string().min(3).max(50),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().min(8),
  role: z.enum(['Owner', 'Agent', 'Sub_Agent', 'Player']),
  agent_id: z.number().optional(),
  deposit_amount: z.number().min(0).optional()
});

// In route:
router.post('/users', 
  validateRequest(createUserSchema),
  authenticateToken,
  isAdmin,
  userController.createUser
);
```

---

## 💡 Recommendations

### 6. **Error Handling Consistency**
**Current:** Mix of try-catch and asyncHandler

**Recommendation:**
- Use `asyncHandler` wrapper consistently for all async route handlers
- Remove manual try-catch blocks in controllers

**Example:**
```typescript
// Instead of:
async getAll(req: Request, res: Response, next: NextFunction) {
  try {
    // ...
  } catch (error) {
    next(new AppError(...));
  }
}

// Use:
async getAll(req: Request, res: Response) {
  const digits = await twoDigitService.getAll();
  res.json(digits);
}

// In route:
router.get('/getall', asyncHandler(twoDigitController.getAll.bind(twoDigitController)));
```

---

### 7. **Type Safety Improvements**
**Current:** Uses `(req as any).user` in some places

**Recommendation:**
- Extend Express Request type globally (already done in auth.middleware.ts)
- Use `req.user!` instead of `(req as any).user`

---

### 8. **Environment Configuration**
**Current:** Hardcoded CORS origin

**Location:** `src/index.ts:22`
```typescript
origin: 'http://localhost:5173'
```

**Recommendation:**
- Move to environment variable
- Support multiple origins in production

```typescript
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

---

### 9. **Database Connection Pooling**
**Current:** Default Prisma connection pool

**Recommendation:**
- Configure connection pool size in `DATABASE_URL` with pool parameters
- Or use Prisma connection pooling configuration

---

### 10. **Logging Improvements**
**Current:** Basic console.error logging

**Recommendation:**
- Use structured logging library (Winston, Pino)
- Log levels: error, warn, info, debug
- Include request ID for tracing

---

## ✅ Good Practices Found

1. ✅ Environment variable validation on startup
2. ✅ Graceful shutdown handling
3. ✅ Role-based access control
4. ✅ Password hashing with bcrypt
5. ✅ JWT token expiration (24h)
6. ✅ Database transactions for wallet operations
7. ✅ Error handling middleware
8. ✅ TypeScript strict mode enabled
9. ✅ CORS configuration
10. ✅ Prisma migrations structure

---

## 📋 Action Items Priority

### High Priority (Security & Stability)
1. Fix Prisma Client duplication in TwoDigitService
2. Fix JWT secret handling in authMiddleware
3. Add input validation with Zod

### Medium Priority (Code Quality)
4. Remove duplicate auth routes
5. Standardize error handling (use asyncHandler)
6. Improve type safety

### Low Priority (Enhancements)
7. Remove unused PHP files
8. Environment-based CORS configuration
9. Structured logging
10. Connection pool configuration

---

**Last Updated:** $(date)

