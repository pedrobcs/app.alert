#!/bin/bash

# SafeAlert Backend Setup Script

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║  🚨 SafeAlert Backend Setup                           ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js version: $NODE_VERSION"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✅ npm version: $NPM_VERSION"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env and add your Twilio credentials!"
    echo ""
    echo "   1. Go to https://www.twilio.com/try-twilio"
    echo "   2. Sign up or log in"
    echo "   3. Copy your Account SID and Auth Token"
    echo "   4. Edit .env and paste your credentials"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Check if Twilio credentials are set
if grep -q "your_account_sid_here" .env 2>/dev/null; then
    echo "⚠️  WARNING: Twilio credentials not configured in .env"
    echo "   Please edit .env and add your credentials before starting the server"
    echo ""
else
    echo "✅ Twilio credentials appear to be configured"
    echo ""
fi

echo "╔════════════════════════════════════════════════════════╗"
echo "║  ✅ Setup Complete!                                   ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo ""
echo "  1. Configure .env with your Twilio credentials (if not done)"
echo "  2. Start the server:"
echo "     npm run dev    (development with auto-reload)"
echo "     npm start      (production)"
echo ""
echo "  3. Test the connection:"
echo "     npm test       (edit panic-test.js first)"
echo ""
echo "  4. The server will run on http://localhost:3001"
echo ""
echo "📖 For more information, see README.md"
echo ""
