# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Start Backend Server
```bash
# In the root directory (2d3d_backend)
npm run dev
```
Backend should run on `http://localhost:3000`

### Step 2: Start Admin Panel
```bash
# In the admin panel directory
cd 2_3_admin_panel
npm run dev
```
Admin panel will run on `http://localhost:5173`

### Step 3: Login
1. Open `http://localhost:5173` in your browser
2. Use your admin credentials (Owner, Agent, or Sub_Agent)
3. Start managing!

## 📋 Default Credentials

Use the credentials you created in your backend database. Make sure the user has one of these roles:
- Owner
- Agent  
- Sub_Agent

(Player role cannot access admin panel)

## 🎯 What You Can Do

### Dashboard
- View statistics (users, digits, balance)
- Quick navigation

### Users Management
- ✅ View all users
- ✅ Create new users
- ✅ Edit user info
- ✅ Delete users
- ✅ Set initial deposit

### Two-Digit Management
- ✅ View all digits (00-99)
- ✅ Filter by status
- ✅ Open/Close digits (admin only)
- ✅ See statistics

## 📱 Test on Mobile

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select a mobile device
4. Test the responsive design!

## 🐛 Troubleshooting

**Can't connect to API?**
- Make sure backend is running on port 3000
- Check `.env` file has correct URL

**Login not working?**
- Check browser console for errors
- Verify user role is admin (not Player)
- Clear localStorage and try again

**Blank page?**
- Check browser console
- Verify all dependencies installed: `npm install`
- Try clearing browser cache

## 📚 More Help

- See `SETUP_GUIDE.md` for detailed setup
- See `README.md` for project overview
- See `IMPLEMENTATION_SUMMARY.md` for features list

---

**Happy Coding! 🎉**

