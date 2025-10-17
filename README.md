# SafeAlert - Emergency Alert System

A production-ready Next.js Progressive Web App (PWA) for sending emergency alerts with real-time GPS location via WhatsApp integration.

## Features

- 🚨 **One-Tap Emergency Alert**: Large, accessible emergency button with pulsing animation
- 📍 **Real-time GPS Location**: High-accuracy geolocation using browser Geolocation API
- 🗺️ **Reverse Geocoding**: Converts GPS coordinates to human-readable addresses
- 📱 **PWA Support**: Installable on mobile devices with offline capabilities
- 💬 **WhatsApp Integration**: Sends emergency messages via Twilio Sandbox
- 🎨 **Beautiful UI**: Clean, minimal design with Tailwind CSS
- ⚡ **Real-time Feedback**: Loading states, success/error alerts
- 🔐 **Permission Handling**: Graceful handling of location permissions

## Tech Stack

- **Framework**: Next.js 15.5.5 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **PWA**: Service Worker with offline support
- **State Management**: React Hooks
- **API**: RESTful backend integration

## Getting Started

### Prerequisites

- Node.js 18+ or Yarn
- Backend API endpoint (ngrok or production URL)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd workspace
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```

4. **Edit `.env.local`** with your configuration:
   ```env
   # Client-side (public)
   NEXT_PUBLIC_API_BASE_URL=https://your-ngrok-url.ngrok.io
   NEXT_PUBLIC_CONTACT_1=+15085140864
   
   # Server-side (sensitive - optional for WhatsApp)
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_WHATSAPP_NUMBER=+14155238886
   ```
   
   📚 **See [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) for detailed security best practices**

5. **Generate PWA icons** (optional, for production):
   ```bash
   # Visit https://realfavicongenerator.net/
   # Upload public/icon.svg
   # Download and extract icon-192.png and icon-512.png to public/
   
   # Or use ImageMagick:
   convert public/icon.svg -resize 192x192 public/icon-192.png
   convert public/icon.svg -resize 512x512 public/icon-512.png
   ```

6. **Run the development server**:
   ```bash
   yarn dev
   # or
   npm run dev
   ```

7. **Open your browser**: Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### For Users

1. **Open the app** in your browser or installed PWA
2. **Allow location permissions** when prompted
3. **Wait for location to load** (shown in status card)
4. **Tap the EMERGENCY button** when you need help
5. **Alert is sent** with your precise location and address

### For Developers

#### Project Structure

```
/workspace
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout with PWA meta tags
│   │   ├── page.tsx           # Main emergency screen
│   │   └── globals.css        # Global styles and animations
│   ├── components/
│   │   └── PWAInstallPrompt.tsx # PWA installation prompt
│   ├── hooks/
│   │   ├── useGeolocation.ts    # Location management hook
│   │   └── useEmergencyAlert.ts # Alert functionality hook
│   └── lib/
│       ├── geolocation.ts       # Location utilities
│       ├── api.ts               # API client
│       └── pwa.ts               # PWA utilities
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   └── icon*.png              # PWA icons
└── scripts/
    └── generate-icons.js      # Icon generation helper
```

#### API Integration

The app sends POST requests to `{API_BASE_URL}/panic` with the following payload:

```json
{
  "contacts": ["+15085140864"],
  "message": "🚨 EMERGÊNCIA! Preciso de ajuda! Estou em: {address}",
  "location": {
    "lat": -23.550520,
    "lng": -46.633308
  }
}
```

Expected response:
```json
{
  "success": true,
  "message": "Emergency alert sent successfully"
}
```

#### Custom Hooks

**`useGeolocation(autoFetch?: boolean)`**
- Manages location state and updates
- Returns: `{ coordinates, error, loading, accuracy, refreshLocation }`

**`useEmergencyAlert()`**
- Handles emergency alert sending
- Returns: `{ sendAlert, loading, error, success }`

#### Environment Variables

**Client-Side (Public):**
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL | Yes | - |
| `NEXT_PUBLIC_CONTACT_1` | Emergency contact #1 | No | +15085140864 |
| `NEXT_PUBLIC_CONTACT_2` | Emergency contact #2 | No | - |
| `NEXT_PUBLIC_CONTACT_3` | Emergency contact #3 | No | - |

**Server-Side (Sensitive):**
| Variable | Description | Required |
|----------|-------------|----------|
| `TWILIO_ACCOUNT_SID` | Twilio Account SID | Optional* |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token | Optional* |
| `TWILIO_WHATSAPP_NUMBER` | Twilio WhatsApp Number | Optional* |

*Required only if using WhatsApp integration

📚 **Detailed guides:**
- [Environment Variables Setup](./ENVIRONMENT_VARIABLES.md)
- [WhatsApp Integration](./WHATSAPP_INTEGRATION.md)

## PWA Features

### Installation

The app can be installed on mobile devices:

1. **iOS**: Open in Safari → Share → Add to Home Screen
2. **Android**: Chrome → Menu → Install App
3. **Desktop**: Address bar → Install icon

### Offline Support

- Basic offline functionality via Service Worker
- Cached assets for faster loading
- Graceful degradation when offline

### Manifest Configuration

See `public/manifest.json` for PWA configuration including:
- App name and description
- Icons and theme colors
- Display mode (standalone)
- Orientation preferences

## Development

### Build for Production

```bash
yarn build
yarn start
```

### Linting

```bash
yarn lint
```

### Testing Locally

1. Use ngrok to expose your backend:
   ```bash
   ngrok http 3001
   ```

2. Update `.env.local` with the ngrok URL

3. Test on your mobile device using the ngrok URL

## Browser Support

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Safari (iOS & macOS)
- ✅ Firefox (Desktop & Mobile)
- ⚠️ Requires HTTPS (except localhost)
- ⚠️ Requires Geolocation API support

## Security Considerations

- 🔐 **Sensitive credentials** (Twilio) are server-side only and never exposed to browser
- 🔑 **Environment variables** follow Next.js security best practices (see [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md))
- 📍 **Location data** is only accessed when user grants permission
- 🔒 **API requests** use HTTPS in production
- 💾 **No sensitive data** stored locally
- 📦 **Service worker** caches only public assets

⚠️ **Warning**: Never prefix sensitive credentials with `NEXT_PUBLIC_` - this would expose them to the browser!

## Troubleshooting

### Location not working

1. Check browser permissions (Settings → Site Settings → Location)
2. Ensure you're using HTTPS or localhost
3. Check browser console for errors
4. Try refreshing location manually

### PWA not installing

1. Ensure HTTPS is enabled (required for PWA)
2. Check manifest.json is accessible
3. Verify all icon files exist
4. Clear browser cache and try again

### API errors

1. Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly
2. Check backend is running and accessible
3. Verify CORS is enabled on backend
4. Check network tab for request details

## Production Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add environment variables in Vercel dashboard.

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- Cloudflare Pages
- Self-hosted with Docker

## License

MIT License - feel free to use this project for your own emergency alert systems.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions, please open an issue on the repository.

---

**⚠️ Important**: This is an emergency alert system. Always call local emergency services (911, 112, etc.) for life-threatening emergencies. This app is meant as a supplementary communication tool.
