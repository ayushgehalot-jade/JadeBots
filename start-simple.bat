@echo off
REM Simplified Jade AI Application Startup Script for Windows

echo 🚀 Starting Jade AI Application...
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

echo ✅ Prerequisites check passed
echo.

REM Start backend setup
echo 🔧 Setting up backend...
cd backend
if errorlevel 1 (
    echo ❌ Backend directory not found. Make sure you're in the project root.
    pause >nul
    exit /b 1
)

REM Create virtual environment
if not exist "venv" (
    echo 📦 Creating Python virtual environment...
    py -m venv venv
    if errorlevel 1 (
        echo ❌ Failed to create virtual environment.
        pause >nul
        exit /b 1
    )
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📦 Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Failed to install Python dependencies.
    pause >nul
    exit /b 1
)

REM Create .env file
if not exist ".env" (
    echo ⚙️  Creating environment configuration...
    copy env_example.txt .env
    echo 📝 Please edit backend\.env file with your OpenAI API key
)

REM Create upload directories
if not exist "uploads" mkdir uploads
if not exist "uploads\resumes" mkdir uploads\resumes
if not exist "uploads\jds" mkdir uploads\jds
if not exist "uploads\jade_templates" mkdir uploads\jade_templates

echo 🚀 Starting backend server...
start "Jade AI Backend" cmd /k "py run.py"

cd ..

REM Wait for backend
echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

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
    echo This might be because npm is not available.
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
