@echo off
REM Jade AI Application Startup Script for Windows

echo 🚀 Starting Jade AI Application...
echo Current directory: %CD%
echo.

REM Check if Python is installed
echo Checking Python installation...
py --version
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8+ and try again.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)
echo ✅ Python found

REM Check if Node.js is installed
echo Checking Node.js installation...
node --version
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ and try again.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)
echo ✅ Node.js found

REM Check if npm is installed
echo Checking npm installation...
npm --version 2>nul
if errorlevel 1 (
    echo ❌ npm is not installed or not in PATH.
    echo.
    echo This usually means:
    echo 1. Node.js was not installed properly
    echo 2. npm is not in your system PATH
    echo 3. You need to restart your command prompt after installing Node.js
    echo.
    echo Please try:
    echo 1. Reinstalling Node.js from https://nodejs.org/
    echo 2. Restarting your command prompt
    echo 3. Running this script again
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)
echo ✅ npm found

echo ✅ Prerequisites check passed

REM Start backend
echo 🔧 Setting up backend...
echo Changing to backend directory...
cd backend
if errorlevel 1 (
    echo ❌ Failed to change to backend directory. Make sure you're running this from the project root.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)
echo ✅ Backend directory found

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo 📦 Creating Python virtual environment...
    py -m venv venv
    if errorlevel 1 (
        echo ❌ Failed to create virtual environment.
        echo Press any key to exit...
        pause >nul
        exit /b 1
    )
    echo ✅ Virtual environment created
) else (
    echo ✅ Virtual environment already exists
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo ❌ Failed to activate virtual environment.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)
echo ✅ Virtual environment activated

REM Install dependencies
echo 📦 Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Failed to install Python dependencies.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)
echo ✅ Python dependencies installed

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo ⚙️  Creating environment configuration...
    copy env_example.txt .env
    if errorlevel 1 (
        echo ❌ Failed to create .env file.
        echo Press any key to exit...
        pause >nul
        exit /b 1
    )
    echo ✅ Environment file created
    echo 📝 Please edit backend\.env file with your OpenAI API key and other settings
) else (
    echo ✅ Environment file already exists
)

REM Create uploads directory
echo Creating upload directories...
if not exist "uploads" mkdir uploads
if not exist "uploads\resumes" mkdir uploads\resumes
if not exist "uploads\jds" mkdir uploads\jds
if not exist "uploads\jade_templates" mkdir uploads\jade_templates
echo ✅ Upload directories created

echo 🚀 Starting backend server...
start "Jade AI Backend" cmd /k "py run.py"

cd ..
if errorlevel 1 (
    echo ❌ Failed to return to project root directory.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

REM Wait a moment for backend to start
echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

REM Start frontend
echo 🔧 Setting up frontend...
echo Changing to frontend directory...
cd frontend
if errorlevel 1 (
    echo ❌ Failed to change to frontend directory.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)
echo ✅ Frontend directory found

REM Install dependencies
echo 📦 Installing Node.js dependencies...
npm install
if errorlevel 1 (
    echo ❌ Failed to install Node.js dependencies.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)
echo ✅ Node.js dependencies installed

echo 🚀 Starting frontend server...
start "Jade AI Frontend" cmd /k "npm start"

cd ..
if errorlevel 1 (
    echo ❌ Failed to return to project root directory.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

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


