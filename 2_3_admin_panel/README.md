# 2D/3D Admin Panel

A modern, mobile-first admin dashboard built with React, Vite, and Tailwind CSS.

## Features

- 🔐 **Authentication** - Secure login with JWT tokens
- 📊 **Dashboard** - Overview with statistics and quick actions
- 👥 **User Management** - Create, update, and delete users with role-based access
- 🎲 **Two-Digit Management** - View and manage two-digit numbers (00-99)
- 📱 **Mobile-First Design** - Fully responsive, optimized for all screen sizes
- 🌙 **Dark Mode Support** - Automatic dark mode based on system preferences
- ⚡ **Fast & Modern** - Built with Vite for lightning-fast development

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3000/api
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable components
│   └── Layout/         # Layout components (Sidebar, Header, MainLayout)
├── context/            # React Context providers
│   └── AuthContext.jsx # Authentication state management
├── pages/              # Page components
│   ├── Login.jsx       # Login page
│   ├── Dashboard.jsx   # Dashboard page
│   ├── Users.jsx       # User management page
│   └── TwoDigits.jsx  # Two-digit management page
├── services/           # API services
│   └── api.js         # Axios configuration and API endpoints
├── App.jsx             # Main app component with routing
└── main.jsx            # Entry point
```

## API Integration

The admin panel integrates with the backend API at `http://localhost:3000/api`. Make sure your backend server is running before using the admin panel.

### Available Endpoints

- **Authentication**: `/api/auth/admin/login`
- **Users**: `/api/user/users` (GET, POST, PUT, DELETE)
- **Two-Digits**: `/api/two-digit/*`

See the main backend README for complete API documentation.

## Features in Detail

### Authentication
- Login with username and password
- JWT token stored in localStorage
- Automatic token refresh on API calls
- Protected routes that require authentication

### Dashboard
- Statistics cards showing:
  - Total users
  - Active/inactive two-digits
  - Total balance
- Quick action links to main features

### User Management
- View all users in a responsive table
- Create new users with role-based restrictions:
  - Owner → can create Agent
  - Agent → can create Sub_Agent or Player
  - Sub_Agent → can create Player
- Edit user information
- Delete users (with confirmation)
- Initial deposit option when creating users

### Two-Digit Management
- View all two-digit numbers (00-99) in a grid
- Filter by status (All, Active, Inactive)
- Toggle status (Open/Close) for admin users
- Color-coded status indicators
- Real-time statistics

## Mobile-First Design

The admin panel is designed mobile-first, meaning:
- Optimized for small screens first
- Responsive breakpoints for tablets and desktops
- Touch-friendly buttons and interactions
- Collapsible sidebar on mobile devices
- Horizontal scrolling tables on mobile

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000/api` |

## Troubleshooting

### API Connection Issues
- Make sure the backend server is running on port 3000
- Check that `VITE_API_URL` in `.env` matches your backend URL
- Verify CORS is enabled on the backend

### Authentication Issues
- Clear localStorage if you're having login issues
- Check browser console for error messages
- Verify JWT token is being stored correctly

### Build Issues
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear Vite cache: `rm -rf node_modules/.vite`

## License

ISC
