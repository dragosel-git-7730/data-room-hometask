@echo off
echo 🔍 Checking for syntax errors...

REM Type check
echo 📝 Running TypeScript check...
call npx tsc --noEmit

if %errorlevel% neq 0 (
    echo ❌ TypeScript errors found
    pause
    exit /b 1
)

echo ✅ TypeScript check passed

REM Build check
echo 🏗️ Running build test...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed - Please check the errors above
    pause
    exit /b 1
)

echo ✅ Build successful - No syntax errors!
echo 🎉 All syntax checks passed!
pause