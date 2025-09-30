@echo off
echo 🚀 Starting Data Room MVP...

REM Check if node_modules exists
if not exist "node_modules\" (
    echo 📦 Installing dependencies...
    call npm install
    
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    
    echo ✅ Dependencies installed successfully
)

REM Start the development server
echo 🎯 Starting development server...
echo 🌐 Open http://localhost:3000 in your browser
echo 🛑 Press Ctrl+C to stop the server
echo.

call npm run dev

pause