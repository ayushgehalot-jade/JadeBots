@echo off
REM Simple script to start both servers correctly

echo 🚀 Starting Jade AI Servers...

echo Starting Backend Server...
start "Jade AI Backend" cmd /k "cd backend-nodejs && node server.js"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Jade AI Frontend" cmd /k "cd frontend && npm start"

echo.
echo ✅ Both servers are starting!
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:8000
echo.
echo Press any key to exit this window (servers will continue running)
pause >nul
