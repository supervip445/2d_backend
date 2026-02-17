# Postman Collection Guide

This directory contains Postman collection and environment files for testing the 2D/3D Backend API.

## 📦 Files

1. **2D3D_Backend_API.postman_collection.json** - Complete API collection with all endpoints
2. **2D3D_Backend_Environment.postman_environment.json** - Environment variables for development

## 🚀 Quick Start

### Step 1: Import Collection
1. Open Postman
2. Click **Import** button (top left)
3. Select `2D3D_Backend_API.postman_collection.json`
4. Click **Import**

### Step 2: Import Environment
1. Click **Import** again
2. Select `2D3D_Backend_Environment.postman_environment.json`
3. Click **Import**
4. Select the environment from the dropdown (top right): **"2D/3D Backend - Development"**

### Step 3: Update Environment Variables
1. Click the **eye icon** (top right) to view environment variables
2. Update `base_url` if your server runs on a different port
3. Update `admin_username` and `admin_password` with your actual credentials
4. Update `player_username` and `player_password` with your actual credentials

### Step 4: Test Authentication
1. Go to **Authentication** folder
2. Run **Admin Login** or **Player Login**
3. The token will be automatically saved to `auth_token` variable
4. All subsequent requests will use this token automatically

## 📁 Collection Structure

### 1. **Health Check**
- `GET /health` - Check server status

### 2. **Authentication**
- `POST /api/auth/admin/login` - Login for Owner/Agent/Sub_Agent
- `POST /api/auth/player/login` - Login for Player
- `POST /api/auth/admin/logout` - Logout (protected)

**Note:** Login requests automatically save the token to `auth_token` environment variable.

### 3. **User Management** (Protected - Admin Only)
- `POST /api/user/users` - Create new user
- `GET /api/user/users` - Get users (role-based filtering)
- `PUT /api/user/users/:id` - Update user
- `DELETE /api/user/users/:id` - Delete user
- `PUT /api/user/profile` - Update own profile

### 4. **Two-Digit Operations**

#### Public Routes (No Auth Required)
- `GET /api/two-digit/getall` - Get all two-digits (with optional filters)
- `GET /api/two-digit/active` - Get active two-digits
- `GET /api/two-digit/inactive` - Get inactive two-digits
- `GET /api/two-digit/status/:two_digit` - Check specific digit status

#### Protected Routes (Admin Only)
- `POST /api/two-digit/close/:two_digit` - Close a digit (set status to 0)
- `POST /api/two-digit/open/:two_digit` - Open a digit (set status to 1)

## 🔑 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `base_url` | API base URL | `http://localhost:3000` |
| `auth_token` | JWT token (auto-set on login) | `eyJhbGciOiJIUzI1NiIs...` |
| `user_id` | Current user ID (auto-set on login) | `1` |
| `user_role` | Current user role (auto-set on login) | `Owner` |
| `admin_username` | Admin username for login | `admin` |
| `admin_password` | Admin password for login | `password123` |
| `player_username` | Player username for login | `player1` |
| `player_password` | Player password for login | `password123` |

## 📝 Usage Examples

### Example 1: Create User with Deposit

1. **Login as Admin**
   - Run: `POST /api/auth/admin/login`
   - Token is automatically saved

2. **Create User**
   - Run: `POST /api/user/users`
   - Body:
   ```json
   {
       "name": "John Doe",
       "user_name": "johndoe",
       "email": "john@example.com",
       "phone": "+1234567890",
       "password": "password123",
       "role": "Player",
       "deposit_amount": 1000
   }
   ```

### Example 2: Check and Close Two-Digit

1. **Check Status** (No auth needed)
   - Run: `GET /api/two-digit/status/42`
   - Response: `{ "isActive": true }`

2. **Login as Admin**
   - Run: `POST /api/auth/admin/login`

3. **Close Digit**
   - Run: `POST /api/two-digit/close/42`
   - Response: Updated digit object with `status: 0`

### Example 3: Get Users (Role-Based)

1. **Login as Owner**
   - Run: `POST /api/auth/admin/login` (with Owner credentials)

2. **Get All Users**
   - Run: `GET /api/user/users`
   - Response: All Agents with their Sub_Agents and Players

## 🔒 Authentication Flow

All protected endpoints require an `Authorization` header:
```
Authorization: Bearer {{auth_token}}
```

The collection automatically includes this header for protected routes using the `{{auth_token}}` variable.

## 🎯 Role Hierarchy

```
Owner
  └── Agent
      ├── Sub_Agent
      │   └── Player
      └── Player
```

**User Creation Rules:**
- Owner → can create Agent
- Agent → can create Sub_Agent or Player
- Sub_Agent → can create Player

**User Access Rules:**
- Owner → sees all Agents + their hierarchy
- Agent → sees Sub_Agents + Players under them
- Sub_Agent → sees Players under them
- Player → access denied

## 🐛 Troubleshooting

### Issue: "Authentication token required"
**Solution:** 
1. Make sure you've run a login request first
2. Check that `auth_token` is set in environment variables
3. Verify the token hasn't expired (24h expiry)

### Issue: "Access denied"
**Solution:**
1. Check your user role matches the required role
2. Verify you're using the correct login endpoint
3. Check the role hierarchy requirements

### Issue: "Invalid credentials"
**Solution:**
1. Verify username and password are correct
2. Check user exists in database
3. Verify user role matches the login endpoint (admin vs player)

### Issue: Connection refused
**Solution:**
1. Make sure the backend server is running
2. Check `base_url` in environment matches server URL
3. Verify port number (default: 3000)

## 📊 Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (e.g., duplicate email) |
| 422 | Validation Error |
| 500 | Internal Server Error |

## 🔄 Auto-Save Token

The login requests include a **Test Script** that automatically saves the token:

```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("auth_token", jsonData.token);
    pm.environment.set("user_id", jsonData.user.id);
    pm.environment.set("user_role", jsonData.user.role);
}
```

This means after logging in, all subsequent requests will automatically use the token.

## 📚 Additional Resources

- See `PROJECT_FLOW_ANALYSIS.md` for detailed API documentation
- See `API_FLOW_DIAGRAM.md` for visual flow diagrams
- See `PROJECT_ISSUES_AND_RECOMMENDATIONS.md` for known issues

---

**Happy Testing! 🚀**

