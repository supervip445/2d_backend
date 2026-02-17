# 2D/3D Player Mobile App

A React Native mobile application for players to place 2D/3D bets.

## Features

- 🔐 **Player Authentication** - Secure login for players only
- 🏠 **Home Screen** - Quick access to 2D/3D betting
- 🎲 **Number Selection** - Interactive grid (00-99) with active/inactive status
- 💰 **Bet Placement** - Select numbers, set amount, and place bets
- 🛒 **Cart Management** - Review and manage selected bets
- 📜 **Transaction History** - View all betting slips and transactions
- 👤 **Profile** - View balance and profile information

## Tech Stack

- **React Native** with **Expo** - Cross-platform mobile development
- **React Navigation** - Navigation and routing
- **Axios** - HTTP client for API calls
- **AsyncStorage** - Local storage for tokens
- **Expo Linear Gradient** - Beautiful gradients

## Prerequisites

- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (for testing) OR Android Studio / Xcode

## Installation

1. **Navigate to the player app directory:**
```bash
cd player_app
```

2. **Install dependencies:**
```bash
npm install
```

3. **Install additional dependencies:**
```bash
npm install react-native-dotenv
npm install @react-native-async-storage/async-storage
```

4. **Configure API URL:**
   - Update `API_BASE_URL` in `src/services/api.js`
   - For Android emulator: `http://10.0.2.2:3000/api`
   - For iOS simulator: `http://localhost:3000/api`
   - For physical device: `http://YOUR_COMPUTER_IP:3000/api`

## Running the App

### Development Mode

```bash
npm start
```

Then:
- Press `a` for Android
- Press `i` for iOS
- Scan QR code with Expo Go app (for physical device)

### Android

```bash
npm run android
```

### iOS

```bash
npm run ios
```

## Project Structure

```
player_app/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.js          # Player login
│   │   ├── HomeScreen.js           # Main home with 2D/3D options
│   │   ├── BettingScreen.js        # Bet placement screen
│   │   ├── NumberSelectionScreen.js # 00-99 number grid
│   │   ├── CartScreen.js           # Bet cart/review
│   │   ├── HistoryScreen.js        # Transaction history
│   │   └── ProfileScreen.js        # User profile
│   ├── navigation/
│   │   ├── AuthNavigator.js        # Auth flow navigation
│   │   └── MainNavigator.js        # Main app navigation
│   ├── context/
│   │   └── AuthContext.js          # Authentication state
│   └── services/
│       └── api.js                  # API service layer
├── App.js                           # Main app component
├── app.json                         # Expo configuration
└── package.json                     # Dependencies
```

## API Integration

The app connects to your backend API. Make sure:

1. **Backend is running** on `http://localhost:3000`
2. **CORS is enabled** for mobile app origin
3. **API endpoints** are accessible

### Available Endpoints

- `POST /api/auth/player/login` - Player login
- `GET /api/two-digit/active` - Get active digits
- `GET /api/two-digit/status/:two_digit` - Check digit status
- `PUT /api/user/profile` - Update profile

## Features in Detail

### Authentication
- Player-only login
- JWT token storage
- Auto-logout on token expiry
- Protected routes

### Home Screen
- User balance display
- 2D/3D betting options
- Quick action buttons
- Active/inactive digit stats

### Betting Flow
1. Select 2D or 3D
2. Choose time slot
3. Enter bet amount
4. Select numbers (00-99)
5. Review in cart
6. Place bet

### Number Selection
- Grid view of all numbers (00-99)
- Visual indicators for active/inactive
- Multi-select support
- Real-time status checking

### Cart
- Review selected bets
- Edit or delete bets
- Total amount calculation
- Balance validation
- Confirm and place bets

### History
- View all betting slips
- Filter by date/status
- Transaction details
- Pull to refresh

## Environment Setup

### For Android Emulator
Update `API_BASE_URL` in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://10.0.2.2:3000/api';
```

### For iOS Simulator
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

### For Physical Device
1. Find your computer's IP address
2. Update `API_BASE_URL`:
```javascript
const API_BASE_URL = 'http://192.168.1.100:3000/api'; // Your IP
```
3. Make sure phone and computer are on same network

## Building for Production

### Android APK
```bash
expo build:android
```

### iOS IPA
```bash
expo build:ios
```

## Troubleshooting

### Connection Issues
- Check backend server is running
- Verify API URL is correct for your platform
- Check firewall settings
- Ensure phone and computer on same network (for physical device)

### Authentication Issues
- Clear app data and re-login
- Check token expiration
- Verify backend CORS settings

### Build Issues
- Clear cache: `expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## Next Steps

1. **Backend API for Bets** - Implement bet placement endpoints
2. **Real-time Updates** - WebSocket for live digit status
3. **Push Notifications** - Bet results and updates
4. **Payment Integration** - Deposit/withdraw functionality
5. **Offline Support** - Cache bets when offline

---

**Status**: ✅ **READY FOR DEVELOPMENT**

