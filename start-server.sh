#!/bin/bash

echo "========================================"
echo "Starting Myntra Clone Backend Server"
echo "========================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

echo "Starting server..."
echo "Make sure MongoDB is running!"
echo ""
npm run dev
