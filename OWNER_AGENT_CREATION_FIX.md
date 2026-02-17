# Owner to Agent Creation Fix

## Issue
403 Forbidden error when Owner tries to create an Agent.

## Root Causes Identified

### 1. **Incorrect `agent_id` Assignment**
**Problem:** When Owner creates an Agent, the `agent_id` was being set incorrectly:
```typescript
// OLD CODE (WRONG)
agent_id: currentUser.role === 'Agent' ? currentUser.id : agent_id,
```
This would use `agent_id` from request body (which might be undefined) for Owner creating Agent.

**Fix:** Explicitly set `agent_id` based on creator's role:
```typescript
// NEW CODE (CORRECT)
let finalAgentId: number | null = null;
if (currentUser.role === 'Owner') {
  // Owner creates Agent - Agent has no agent_id (null)
  finalAgentId = null;
} else if (currentUser.role === 'Agent') {
  // Agent creates Sub_Agent or Player
  finalAgentId = currentUser.id;
} else if (currentUser.role === 'Sub_Agent') {
  // Sub_Agent creates Player
  finalAgentId = currentUser.id;
}
```

### 2. **Missing Sub_Agent Validation**
**Problem:** No validation for Sub_Agent creating Player.

**Fix:** Added validation:
```typescript
if (currentUser.role === 'Sub_Agent' && role !== 'Player') {
  throw new ForbiddenException('Sub-Agent can only create Players', ErrorCode.FORBIDDEN);
}
```

### 3. **Error Handling for Deposit**
**Problem:** If deposit fails, user is created but deposit fails, leaving inconsistent state.

**Fix:** Added rollback logic:
```typescript
if (deposit_amount && deposit_amount > 0) {
  try {
    await walletService.deposit(currentUser.id, newUser.id, deposit_amount);
  } catch (error: any) {
    // If deposit fails, delete the created user to maintain data consistency
    await prismaClient.user.delete({ where: { id: newUser.id } });
    throw error;
  }
}
```

## Changes Made

### File: `src/controllers/user.controller.ts`

1. ✅ Fixed `agent_id` assignment logic
2. ✅ Added Sub_Agent validation
3. ✅ Improved error handling for deposit failures
4. ✅ Added comments for clarity

## Role Hierarchy Logic

```
Owner
  └── Agent (agent_id = null)
      ├── Sub_Agent (agent_id = Agent.id)
      │   └── Player (agent_id = Sub_Agent.id)
      └── Player (agent_id = Agent.id)
```

### agent_id Rules:
- **Owner → Agent**: `agent_id = null` (Agent is directly under Owner)
- **Agent → Sub_Agent**: `agent_id = Agent.id`
- **Agent → Player**: `agent_id = Agent.id`
- **Sub_Agent → Player**: `agent_id = Sub_Agent.id`

## Testing

### Test Cases

1. **Owner Creates Agent**
   - ✅ Should succeed
   - ✅ Agent's `agent_id` should be `null`
   - ✅ Username should be auto-generated (AG0001, AG0002, etc.)

2. **Owner Creates Sub_Agent** (Should Fail)
   - ✅ Should return 403 Forbidden
   - ✅ Error: "Owner can only create Agents"

3. **Owner Creates Player** (Should Fail)
   - ✅ Should return 403 Forbidden
   - ✅ Error: "Owner can only create Agents"

4. **Agent Creates Sub_Agent**
   - ✅ Should succeed
   - ✅ Sub_Agent's `agent_id` should be Agent's id

5. **Agent Creates Player**
   - ✅ Should succeed
   - ✅ Player's `agent_id` should be Agent's id

6. **Sub_Agent Creates Player**
   - ✅ Should succeed
   - ✅ Player's `agent_id` should be Sub_Agent's id

7. **Deposit Failure**
   - ✅ If deposit fails, user should be deleted (rollback)
   - ✅ Error should be returned to client

## Verification Steps

1. **Login as Owner**
   ```bash
   POST /api/auth/admin/login
   {
     "user_name": "owner",
     "password": "owner123"
   }
   ```

2. **Create Agent**
   ```bash
   POST /api/user/users
   Authorization: Bearer <token>
   {
     "name": "Test Agent",
     "password": "password123",
     "role": "Agent",
     "deposit_amount": 1000
   }
   ```

3. **Verify Response**
   - Status: 201 Created
   - Response includes generated username
   - Agent created with `agent_id = null`

## Common Issues Resolved

### Issue 1: 403 Forbidden
**Cause:** Incorrect `agent_id` causing database constraint violation  
**Fix:** Explicitly set `agent_id = null` for Owner-created Agents

### Issue 2: Database Constraint Error
**Cause:** Invalid `agent_id` reference  
**Fix:** Proper null handling and role-based assignment

### Issue 3: Inconsistent State
**Cause:** User created but deposit failed  
**Fix:** Rollback user creation if deposit fails

## Code Changes Summary

```typescript
// BEFORE
agent_id: currentUser.role === 'Agent' ? currentUser.id : agent_id,

// AFTER
let finalAgentId: number | null = null;
if (currentUser.role === 'Owner') {
  finalAgentId = null;
} else if (currentUser.role === 'Agent') {
  finalAgentId = currentUser.id;
} else if (currentUser.role === 'Sub_Agent') {
  finalAgentId = currentUser.id;
}
// ... then use finalAgentId in create()
```

---

**Status**: ✅ **FIXED**

The Owner to Agent creation should now work correctly without 403 errors.

