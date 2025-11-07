#!/bin/bash
# Quick test script to verify backend is working

echo "🧪 Testing SafeAlert Backend..."
echo ""

# Check if server is running
if curl -s http://localhost:3001/ > /dev/null 2>&1; then
    echo "✅ Server is running"
    echo ""
    
    # Test health endpoint
    echo "📡 Health Check:"
    curl -s http://localhost:3001/ | jq '.'
    echo ""
    
    # Test contacts endpoint
    echo "👥 Testing Contacts API:"
    curl -s http://localhost:3001/contacts | jq '.'
    echo ""
    
    echo "✅ All tests passed!"
else
    echo "❌ Server is not running"
    echo ""
    echo "Start the server with:"
    echo "  npm run dev"
fi
