# Player App Setup Guide

## Quick Start

### Step 1: Install Dependencies

```bash
cd player_app
npm install
```

### Step 2: Install Expo CLI (if not installed)

```bash
npm install -g expo-cli
```

### Step 3: Configure API URL

Edit `src/services/api.js` and update `API_BASE_URL`:

**For Android Emulator:**
```javascript
const API_BASE_URL = 'http://10.0.2.2:3000/api';
```

**For iOS Simulator:**
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

**For Physical Device:**
1. Find your computer's IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Update the URL:
```javascript
const API_BASE_URL = 'http://192.168.1.XXX:3000/api'; // Replace XXX with your IP
```

### Step 4: Start Backend Server

In the backend directory:
```bash
npm run dev
```

### Step 5: Start React Native App

```bash
npm start
```

### Step 6: Run on Device

- **Android**: Press `a` or run `npm run android`
- **iOS**: Press `i` or run `npm run ios`
- **Physical Device**: Install Expo Go app and scan QR code

## Testing Login

1. Open the app
2. Use player credentials (e.g., `P00000001` / password)
3. Should navigate to home screen after login

## Project Structure

```
player_app/
├── src/
│   ├── screens/          # All screen components
│   ├── navigation/        # Navigation setup
│   ├── context/           # React Context (Auth)
│   └── services/          # API services
├── App.js                 # Root component
├── app.json               # Expo config
└── package.json           # Dependencies
```

## Features Implemented

✅ Player login  
✅ Home screen with 2D/3D options  
✅ Number selection (00-99 grid)  
✅ Bet placement  
✅ Cart management  
✅ Transaction history  
✅ Profile screen  

## Next: Backend Bet API

You'll need to implement bet endpoints in the backend:
- `POST /api/bets` - Place bet
- `GET /api/bets` - Get user's bets
- `GET /api/bets/history` - Get bet history

---

**Ready to test!** 🚀

