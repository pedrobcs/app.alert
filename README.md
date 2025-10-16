# Emergency Alert System 🚨

A modern, Apple-style emergency contact and alert system built with Next.js. Send instant SMS alerts to your emergency contacts with a single button press.

## Features

- 🚨 **Emergency Button**: Large, prominent button to send immediate alerts
- 📱 **Contact Management**: Add, view, and remove emergency contacts
- 💬 **SMS Alerts**: Powered by Twilio API
- 🎨 **Modern UI**: Clean, Apple-style design with dark mode support
- ⚡ **Fast & Responsive**: Built with Next.js 15 and React 19

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Twilio account (sign up at https://www.twilio.com)

### Installation

1. Install dependencies:
```bash
yarn install
# or
npm install
```

2. Set up environment variables (see Configuration section below)

3. Run the development server:
```bash
yarn dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Configuration

### Environment Variables

You need to set up Twilio credentials for SMS functionality:

1. **For Local Development**: Create a `.env.local` file in the root directory:

```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

2. **For Vercel Deployment**: Add these environment variables in your Vercel dashboard:

   - Go to your project in Vercel
   - Navigate to Settings → Environment Variables
   - Add the following variables:
     - `TWILIO_ACCOUNT_SID` (your Twilio Account SID)
     - `TWILIO_AUTH_TOKEN` (your Twilio Auth Token)
     - `TWILIO_PHONE_NUMBER` (your Twilio phone number in E.164 format, e.g., +1234567890)

### Getting Twilio Credentials

1. Sign up at [Twilio Console](https://console.twilio.com/)
2. Get a phone number (or use trial number for testing)
3. Find your Account SID and Auth Token on the dashboard
4. Copy these values to your environment variables

**Important**: Make sure your Twilio phone number is in E.164 format (e.g., `+15085140640`)

## How to Use

1. **Add Contacts**: Click the "+" button to add emergency contacts with names and phone numbers
2. **Emergency Alert**: Press the large red emergency button to send SMS alerts to all contacts
3. **Manage Contacts**: Delete contacts by clicking the "×" button next to their name

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables (see Configuration section)
4. Deploy!

Or use the Vercel CLI:

```bash
vercel --prod
```

Make sure to set the environment variables in your Vercel project settings before deploying.

## Tech Stack

- **Framework**: Next.js 15.5
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **SMS Provider**: Twilio API
- **Language**: TypeScript

## Important Notes

⚠️ **Always call 911 or your local emergency services first in a real emergency!**

This app is designed to alert your personal emergency contacts, but should not replace official emergency services.

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
