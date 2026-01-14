@echo off
echo ========================================
echo Starting Myntra Clone Backend Server
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting server...
echo Make sure MongoDB is running!
echo.
call npm run dev

pause
