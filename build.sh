#!/bin/bash

# Build script for production deployment on Render

echo "Installing dependencies..."
npm install

echo "Building for production..."
npm run build

echo "Build completed successfully!" 