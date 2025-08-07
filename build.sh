#!/bin/bash
set -e

echo "🔧 Starting build process..."

# Navigate to frontend-new and build
echo "📦 Building frontend..."
cd frontend-new
npm ci --only=production
npm run build
cd ..

# Install backend dependencies
echo "🔧 Installing backend dependencies..."
cd backend
npm ci --only=production
cd ..

echo "✅ Build completed successfully!"
