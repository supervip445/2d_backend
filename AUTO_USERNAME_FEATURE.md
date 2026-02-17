# Auto-Generated Username Feature

## Overview

Usernames are now automatically generated based on user role when creating new users. This ensures consistent, unique usernames without manual input.

## Username Format

| Role | Format | Example | Description |
|------|--------|---------|---------------|
| **Agent** | `AG` + 4 digits | `AG0001`, `AG0002`, `AG0003` | 6 characters total |
| **Sub_Agent** | `SA` + 7 digits | `SA0000001`, `SA0000002` | 9 characters total |
| **Player** | `P` + 8 digits | `P00000001`, `P00000002` | 9 characters total |

## Implementation Details

### Backend Changes

#### 1. New Utility Function (`src/utils/usernameGenerator.ts`)
- Generates sequential usernames based on role
- Finds the highest existing username for the role
- Increments and formats with leading zeros
- Handles edge cases (no existing users, invalid roles)

#### 2. Updated User Controller (`src/controllers/user.controller.ts`)
- Removed `user_name` from request body
- Auto-generates username before creating user
- Validates role before generation

### Frontend Changes

#### Updated Users Page (`2_3_admin_panel/src/pages/Users.jsx`)
- Removed username input field from create form
- Added informational message about auto-generation
- Shows generated username in success alert after creation
- Removed `user_name` from form state

## How It Works

1. **User Creation Flow:**
   ```
   Admin creates user → Selects role → Backend generates username → User created
   ```

2. **Username Generation Logic:**
   - Queries database for highest existing username with matching prefix
   - Extracts number portion
   - Increments by 1
   - Formats with leading zeros
   - Returns formatted username

3. **Example Sequence:**
   ```
   First Agent created:  AG0001
   Second Agent:         AG0002
   Third Agent:          AG0003
   ...
   ```

## Benefits

✅ **Consistency** - All usernames follow the same format  
✅ **Uniqueness** - Guaranteed unique usernames  
✅ **No Manual Input** - Reduces errors and saves time  
✅ **Role Identification** - Username prefix indicates role  
✅ **Scalable** - Handles large numbers of users per role  

## Testing

### Test Cases

1. **Create First Agent**
   - Expected: `AG0001`

2. **Create Multiple Agents**
   - Expected: Sequential `AG0001`, `AG0002`, `AG0003`, etc.

3. **Create Mixed Roles**
   - Agent: `AG0001`
   - Sub_Agent: `SA0000001`
   - Player: `P00000001`
   - All should increment independently

4. **Edge Cases**
   - No existing users → Starts at 1
   - Deleted users → Continues from highest number
   - Database gaps → Uses highest existing number

## API Changes

### Before
```json
POST /api/user/users
{
  "name": "John Doe",
  "user_name": "johndoe",  // ❌ Required
  "password": "password123",
  "role": "Player"
}
```

### After
```json
POST /api/user/users
{
  "name": "John Doe",
  // user_name removed - auto-generated
  "password": "password123",
  "role": "Player"
}
```

Response includes generated username:
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "user_name": "P00000001",  // ✅ Auto-generated
    "role": "Player",
    "balance": "0.00"
  }
}
```

## Migration Notes

### Existing Users
- Existing users with manual usernames are not affected
- Only new users get auto-generated usernames
- Old usernames remain unchanged

### Database
- No schema changes required
- `user_name` field remains optional in schema
- Backward compatible

## Frontend User Experience

### Create User Form
- Username field removed
- Info message displayed:
  ```
  ℹ️ Username will be auto-generated
  Format: Agent (AG000001), Sub_Agent (SA0000001), Player (P00000001)
  ```
- Success alert shows generated username after creation

## Code Files Modified

### Backend
- ✅ `src/utils/usernameGenerator.ts` (new)
- ✅ `src/controllers/user.controller.ts` (updated)

### Frontend
- ✅ `2_3_admin_panel/src/pages/Users.jsx` (updated)

## Future Enhancements (Optional)

1. **Username Preview** - Show what username will be generated before creation
2. **Custom Prefixes** - Allow configuration of prefixes
3. **Reset Counter** - Admin option to reset numbering
4. **Bulk Import** - Handle bulk user creation with auto-usernames

---

**Status**: ✅ **IMPLEMENTED AND TESTED**

