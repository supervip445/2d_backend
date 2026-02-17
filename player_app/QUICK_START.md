# Quick Start Guide - Player App

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
cd player_app
npm install
```

### 2. Configure API URL
Edit `src/services/api.js` line 4:
- **Android Emulator**: `http://10.0.2.2:3000/api`
- **iOS Simulator**: `http://localhost:3000/api`
- **Physical Device**: `http://YOUR_IP:3000/api`

### 3. Start the App
```bash
npm start
```

Then press:
- `a` for Android
- `i` for iOS
- Scan QR code with Expo Go (physical device)

## 📱 App Features

✅ **Player Login** - Secure authentication  
✅ **Home Screen** - 2D/3D betting options  
✅ **Number Selection** - Interactive 00-99 grid  
✅ **Bet Placement** - Select numbers and amounts  
✅ **Cart** - Review and confirm bets  
✅ **History** - View transaction slips  
✅ **Profile** - Balance and account info  

## 🔧 Troubleshooting

**Can't connect to API?**
- Check backend is running on port 3000
- Verify API URL matches your platform
- For physical device, ensure same WiFi network

**Login not working?**
- Check player credentials
- Verify backend `/api/auth/player/login` endpoint
- Check console for errors

## 📝 Next Steps

1. Test login with player account
2. Try placing a bet
3. Check transaction history
4. Implement backend bet API endpoints

---

**Ready to test!** 🎉

