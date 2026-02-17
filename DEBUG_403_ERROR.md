# Debugging 403 Forbidden Error

## Issue
Getting 403 Forbidden when Owner tries to create Agent via POST `/api/user/users`

## Possible Causes

### 1. **JWT Token Issue**
The token might not have the correct role, or the token might be expired.

**Solution:**
- Log out and log back in as Owner
- Verify the token includes the role in the payload
- Check token expiration (24h)

### 2. **Middleware Chain**
The request goes through:
1. `authenticateToken` - Verifies JWT and sets `req.user`
2. `isAdmin` - Checks if role is Owner, Agent, or Sub_Agent

**Check:**
- Is the token being sent in the Authorization header?
- Is the token valid?
- Does the token contain the role?

### 3. **Role Mismatch**
The role in the JWT might not match exactly.

**Check:**
- JWT payload should have: `{ id: number, role: 'Owner' }`
- Role must be exactly 'Owner' (case-sensitive)

## Debugging Steps

### Step 1: Check Token
```javascript
// In browser console
const token = localStorage.getItem('auth_token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Token payload:', payload);
// Should show: { id: 1, role: 'Owner', iat: ..., exp: ... }
```

### Step 2: Check Request Headers
```javascript
// Verify Authorization header is being sent
// Should be: Authorization: Bearer <token>
```

### Step 3: Check Backend Logs
Look for:
- Authentication errors
- Middleware execution
- Role validation

### Step 4: Test with Postman
1. Login as Owner
2. Copy the token
3. Make POST request to `/api/user/users` with token
4. Check response

## Quick Fixes

### Fix 1: Re-login
```bash
# Log out and log back in
# This will generate a fresh token with correct role
```

### Fix 2: Clear Local Storage
```javascript
// In browser console
localStorage.clear();
// Then log in again
```

### Fix 3: Verify Owner User Exists
```sql
-- Check if Owner user exists in database
SELECT * FROM users WHERE role = 'Owner';
```

## Updated Middleware

The `isAdmin` middleware has been updated to:
- Explicitly check for allowed roles
- Provide better error messages
- Include role information in error response

## Expected Behavior

1. Owner logs in → Gets JWT token with `role: 'Owner'`
2. Owner makes POST to `/api/user/users` → Token verified → Role checked → Request proceeds
3. Controller validates → Creates Agent → Returns success

## If Still Getting 403

1. **Check token expiration** - Token might be expired
2. **Verify user role in database** - Make sure user actually has Owner role
3. **Check middleware order** - Ensure `authenticateToken` runs before `isAdmin`
4. **Verify JWT_SECRET** - Make sure same secret is used for signing and verifying

---

**Next Steps:**
1. Try logging out and logging back in
2. Check the browser console for the token payload
3. Verify the Authorization header is being sent
4. Check backend logs for detailed error messages

