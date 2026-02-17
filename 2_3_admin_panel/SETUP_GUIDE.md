# Setup Guide - Admin Panel

## Step-by-Step Setup Instructions

### Step 1: Install Dependencies

```bash
cd 2_3_admin_panel
npm install
```

This will install:
- React and React DOM
- Vite (build tool)
- Tailwind CSS
- React Router DOM
- Axios

### Step 2: Configure Environment Variables

Create a `.env` file in the `2_3_admin_panel` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

**Note:** Make sure your backend server is running on `http://localhost:3000`

### Step 3: Start the Development Server

```bash
npm run dev
```

```

You should see output like:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 4: Access the Admin Panel

Open your browser and navigate to: `http://localhost:5173`

### Step 5: Login

1. Use your admin credentials (Owner, Agent, or Sub_Agent role)
2. Enter username and password
3. Click "Sign In"
4. You'll be redirected to the dashboard

## Project Structure Overview

```
2_3_admin_panel/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout/         # Layout components
│   │   │   ├── Sidebar.jsx      # Sidebar navigation
│   │   │   ├── Header.jsx       # Top header bar
│   │   │   └── MainLayout.jsx   # Main layout wrapper
│   │   └── ProtectedRoute.jsx   # Route protection
│   ├── context/            # React Context
│   │   └── AuthContext.jsx # Authentication state
│   ├── pages/              # Page components
│   │   ├── Login.jsx       # Login page
│   │   ├── Dashboard.jsx   # Dashboard with stats
│   │   ├── Users.jsx       # User management
│   │   └── TwoDigits.jsx   # Two-digit management
│   ├── services/           # API services
│   │   └── api.js          # Axios config & endpoints
│   ├── App.jsx             # Main app with routing
│   └── main.jsx            # Entry point
├── .env                    # Environment variables (create this)
├── package.json            # Dependencies
└── vite.config.js          # Vite configuration
```

## Features Implemented

### ✅ Authentication
- Login page with form validation
- JWT token management
- Protected routes
- Auto-logout on token expiry

### ✅ Dashboard
- Statistics cards (Users, Active/Inactive Digits, Balance)
- Quick action links
- Responsive grid layout

### ✅ User Management
- List all users in a table
- Create new users (with role restrictions)
- Edit user information
- Delete users
- Initial deposit option

### ✅ Two-Digit Management
- Grid view of all digits (00-99)
- Filter by status (All/Active/Inactive)
- Open/Close digits (admin only)
- Color-coded status indicators
- Statistics summary

### ✅ Mobile-First Design
- Responsive sidebar (collapsible on mobile)
- Touch-friendly buttons
- Mobile-optimized tables
- Responsive grid layouts

## API Integration

The admin panel connects to your backend API. Make sure:

1. **Backend is running** on `http://localhost:3000`
2. **CORS is enabled** on the backend (should allow `http://localhost:5173`)
3. **API endpoints match** the routes in `src/services/api.js`

### API Endpoints Used

- `POST /api/auth/admin/login` - Admin login
- `GET /api/user/users` - Get users
- `POST /api/user/users` - Create user
- `PUT /api/user/users/:id` - Update user
- `DELETE /api/user/users/:id` - Delete user
- `GET /api/two-digit/getall` - Get all digits
- `GET /api/two-digit/active` - Get active digits
- `GET /api/two-digit/inactive` - Get inactive digits
- `POST /api/two-digit/close/:two_digit` - Close digit
- `POST /api/two-digit/open/:two_digit` - Open digit

## Troubleshooting

### Issue: "Cannot connect to API"
**Solution:**
- Check if backend server is running: `cd .. && npm run dev`
- Verify `VITE_API_URL` in `.env` matches backend URL
- Check browser console for CORS errors

### Issue: "Login fails"
**Solution:**
- Verify username and password are correct
- Check user role is Owner, Agent, or Sub_Agent (not Player)
- Check browser console for error messages
- Verify backend is receiving the request

### Issue: "Blank page after login"
**Solution:**
- Check browser console for errors
- Verify token is stored: `localStorage.getItem('auth_token')`
- Clear localStorage and try again

### Issue: "Sidebar not working on mobile"
**Solution:**
- Check that Tailwind CSS is properly configured
- Verify viewport meta tag in `index.html`
- Check browser console for CSS errors

### Issue: "Build fails"
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Development Tips

1. **Hot Module Replacement (HMR)** - Changes reflect immediately
2. **Browser DevTools** - Use React DevTools extension
3. **Network Tab** - Monitor API calls in browser DevTools
4. **Console** - Check for errors and warnings

## Next Steps

After setup:
1. Test login with your admin account
2. Explore the dashboard
3. Try creating a user
4. Test two-digit management
5. Test on mobile device (responsive design)

## Production Build

To build for production:

```bash
npm run build
```

Output will be in `dist/` directory. Deploy this folder to your hosting service.

---

**Need Help?** Check the main README.md or review the code comments in the source files.

