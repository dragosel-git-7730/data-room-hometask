@echo off
echo 🚀 Setting up Data Room MVP...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ and try again.
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully
echo.
echo 🎯 Starting development server...
echo 🌐 Open http://localhost:3000 in your browser
echo 🛑 Press Ctrl+C to stop the server
echo.

call npm run dev

pause