#!/bin/bash

echo "🔍 Checking for syntax errors..."

# Type check
echo "📝 Running TypeScript check..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
    echo "✅ TypeScript check passed"
else
    echo "❌ TypeScript errors found"
    exit 1
fi

# Build check
echo "🏗️ Running build test..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful - No syntax errors!"
else
    echo "❌ Build failed - Please check the errors above"
    exit 1
fi

echo "🎉 All syntax checks passed!"