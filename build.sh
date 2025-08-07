#!/bin/bash

# Install backend dependencies
echo "Installing backend dependencies..."
npm install --prefix backend

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install --prefix frontend-new

# Build frontend
echo "Building frontend..."
npm run build --prefix frontend-new

echo "Build completed successfully!"
