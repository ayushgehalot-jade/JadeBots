@echo off
REM Jade AI Application - Node.js Backend Version

echo 🚀 Starting Jade AI Application (Node.js Backend)...
echo.

REM Check if Node.js is installed
echo Checking Node.js installation...
node --version
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ and try again.
    echo Download from: https://nodejs.org/
    pause >nul
    exit /b 1
)
echo ✅ Node.js found

REM Check if npm is installed
echo Checking npm installation...
npm --version
if errorlevel 1 (
    echo ❌ npm is not installed. Please install Node.js (npm comes with it).
    pause >nul
    exit /b 1
)
echo ✅ npm found

echo ✅ Prerequisites check passed
echo.

REM Start backend setup
echo 🔧 Setting up Node.js backend...
cd backend-nodejs
if errorlevel 1 (
    echo ❌ Backend directory not found. Creating Node.js backend...
    mkdir backend-nodejs
    cd backend-nodejs
)

REM Create package.json if it doesn't exist
if not exist "package.json" (
    echo 📦 Creating package.json...
    echo {> package.json
    echo   "name": "jade-ai-backend",>> package.json
    echo   "version": "1.0.0",>> package.json
    echo   "description": "Jade AI Backend API",>> package.json
    echo   "main": "server.js",>> package.json
    echo   "scripts": {>> package.json
    echo     "start": "node server.js",>> package.json
    echo     "dev": "nodemon server.js">> package.json
    echo   },>> package.json
    echo   "dependencies": {>> package.json
    echo     "express": "^4.18.2",>> package.json
    echo     "cors": "^2.8.5",>> package.json
    echo     "multer": "^1.4.5",>> package.json
    echo     "jsonwebtoken": "^9.0.2",>> package.json
    echo     "bcryptjs": "^2.4.3",>> package.json
    echo     "sqlite3": "^5.1.6",>> package.json
    echo     "dotenv": "^16.3.1",>> package.json
    echo     "openai": "^4.20.1",>> package.json
    echo     "pdf-parse": "^1.1.1",>> package.json
    echo     "mammoth": "^1.6.0",>> package.json
    echo     "natural": "^6.5.0",>> package.json
    echo     "compromise": "^14.10.0">> package.json
    echo   }>> package.json
    echo }>> package.json
)

REM Install dependencies
echo 📦 Installing Node.js dependencies...
npm install
if errorlevel 1 (
    echo ❌ Failed to install Node.js dependencies.
    pause >nul
    exit /b 1
)
echo ✅ Node.js dependencies installed

REM Create .env file
if not exist ".env" (
    echo ⚙️  Creating environment configuration...
    echo PORT=8000> .env
    echo JWT_SECRET=your-secret-key-here-change-in-production>> .env
    echo OPENAI_API_KEY=your-openai-api-key-here>> .env
    echo DATABASE_URL=./jade_ai.db>> .env
    echo ✅ Environment file created
    echo 📝 Please edit backend-nodejs\.env file with your OpenAI API key
) else (
    echo ✅ Environment file already exists
)

REM Create upload directories
echo Creating upload directories...
if not exist "uploads" mkdir uploads
if not exist "uploads\resumes" mkdir uploads\resumes
if not exist "uploads\jds" mkdir uploads\jds
if not exist "uploads\jade_templates" 

echo ✅ Upload directories created

REM Create basic server.js if it doesn't exist
if not exist "server.js" (
    echo 📝 Creating basic server.js...
    echo const express = require('express');> server.js
    echo const cors = require('cors');>> server.js
    echo const path = require('path');>> server.js
    echo require('dotenv').config();>> server.js
    echo.>> server.js
    echo const app = express();>> server.js
    echo const PORT = process.env.PORT ^|^| 8000;>> server.js
    echo.>> server.js
    echo app.use(cors());>> server.js
    echo app.use(express.json());>> server.js
    echo app.use(express.static('uploads'));>> server.js
    echo.>> server.js
    echo app.get('/', (req, res) =^> {>> server.js
    echo   res.json({ message: 'Jade AI Backend API is running!' });>> server.js
    echo });>> server.js
    echo.>> server.js
    echo app.listen(PORT, () =^> {>> server.js
    echo   console.log(`Server running on http://localhost:${PORT}`);>> server.js
    echo });>> server.js
)

echo 🚀 Starting Node.js backend server...
start "Jade AI Backend (Node.js)" cmd /k "npm start"

cd ..

REM Wait for backend
echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

REM Start frontend setup
echo 🔧 Setting up frontend...
cd frontend
if errorlevel 1 (
    echo ❌ Frontend directory not found.
    pause >nul
    exit /b 1
)

REM Install dependencies
echo 📦 Installing Node.js dependencies...
npm install
if errorlevel 1 (
    echo ❌ Failed to install Node.js dependencies.
    echo You can manually run: cd frontend && npm install
    pause >nul
    exit /b 1
)

echo 🚀 Starting frontend server...
start "Jade AI Frontend" cmd /k "npm start"

cd ..

echo.
echo 🎉 Jade AI Application is starting up!
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8000
echo 📚 API Documentation: http://localhost:8000/docs
echo.
echo ✅ Setup completed successfully!
echo.
echo Press any key to exit this window (servers will continue running)
pause >nul
