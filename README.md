# 🚑 Ambulance Live Tracking & Route Management System

A full-stack real-time ambulance tracking system with dual route calculation, live GPS tracking, and officer monitoring dashboard.

## ✨ Features

- **Real-Time GPS Tracking**: Live ambulance location updates with animated markers
- **Dual Route Calculation**: Primary and shortcut routes displayed simultaneously
- **Driver Interface**: Emergency-themed UI with trip control and live status
- **Officer Dashboard**: Glassmorphism design with Firebase real-time updates
- **Dynamic ETA**: Automatic calculation based on speed and distance
- **Google Maps Integration**: Animated markers, route polylines, and auto-zoom
- **Firebase Backend**: Real-time database for instant synchronization
- **Modern UI**: Built with Tailwind CSS, Framer Motion, and Shadcn/UI

## 🛠 Tech Stack

**Frontend:**
- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Shadcn/UI Components

**Backend & Services:**
- Firebase Realtime Database
- Google Maps JavaScript API
- Google Maps Directions API
- Google Maps Distance Matrix API

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Firebase account
- Google Cloud account with Maps API enabled

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ambulance-tracking
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory and add your credentials:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Realtime Database
4. Copy your configuration to `.env.local`

### Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - Maps JavaScript API
   - Directions API
   - Distance Matrix API
4. Create an API key
5. Add the API key to `.env.local`

### Run Development Server

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Application Structure

### Pages

- **`/`** - Homepage with system overview and navigation
- **`/driver`** - Driver interface with trip control and GPS tracking
- **`/officer`** - Officer dashboard with real-time monitoring

### Key Components

- **GoogleMapComponent**: Reusable Google Maps component with markers and routes
- **Driver Interface**: Emergency trip control with real-time GPS
- **Officer Dashboard**: Live monitoring with glassmorphism design

### API Routes

- **POST `/api/startTrip`** - Initialize new emergency trip
- **POST `/api/updateLocation`** - Update ambulance location
- **POST `/api/getRoutes`** - Calculate routes with alternatives

## 🎨 Features Breakdown

### Driver Interface
- Start/End trip functionality
- Real-time GPS tracking with high accuracy
- Speed, distance, and ETA displays
- Background location updates
- Dual route visualization (blue primary, orange shortcut)
- Emergency-themed responsive UI

### Officer Dashboard
- Firebase real-time listener for instant updates
- Live ambulance position tracking
- Glassmorphism cards with metrics
- Speed, distance, and ETA monitoring
- Connection status indicator
- Animated status alerts
- Auto-updating map with pulse markers

### Google Maps Integration
- Animated ambulance markers with pulse effect
- Color-coded route polylines
- Auto-zoom to fit routes
- Real-time location updates
- Destination markers
- Custom map styling

## 🔐 Security Notes

- Never commit `.env.local` or API keys to version control
- Restrict Google Maps API key to your domains
- Set up Firebase security rules for production
- Use environment variables for all sensitive data

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in project settings
4. Deploy

### Other Platforms

Ensure your platform supports:
- Node.js 18+
- Environment variables
- Next.js 15

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues and questions:
- Open an issue on GitHub
- Check Firebase and Google Maps documentation
- Review Next.js 15 documentation

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn/UI](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Animations with [Framer Motion](https://www.framer.com/motion/)
- Maps by [Google Maps Platform](https://developers.google.com/maps)
- Backend by [Firebase](https://firebase.google.com/)