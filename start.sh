#!/bin/bash

echo "🚀 Starting Data Room MVP..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    
    echo "✅ Dependencies installed successfully"
fi

# Start the development server
echo "🎯 Starting development server..."
echo "🌐 Open http://localhost:3000 in your browser"
echo "🛑 Press Ctrl+C to stop the server"
echo ""

npm run dev