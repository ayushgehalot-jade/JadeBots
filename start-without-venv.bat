@echo off
REM Jade AI Application Startup Script WITHOUT Virtual Environment

echo 🚀 Starting Jade AI Application (No Virtual Environment)...
echo.

echo ⚠️  WARNING: This script will install packages globally on your system.
echo This is not recommended for production but will work for testing.
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

REM Upgrade pip first
echo 📦 Upgrading pip...
py -m pip install --upgrade pip
if errorlevel 1 (
    echo ⚠️  Warning: Could not upgrade pip, continuing anyway...
)

REM Install dependencies globally
echo 📦 Installing Python dependencies globally...
echo Installing core dependencies...
py -m pip install fastapi uvicorn sqlalchemy alembic
if errorlevel 1 (
    echo ❌ Failed to install core dependencies.
    pause >nul
    exit /b 1
)

echo Installing database dependencies...
py -m pip install psycopg2-binary python-multipart
if errorlevel 1 (
    echo ❌ Failed to install database dependencies.
    pause >nul
    exit /b 1
)

echo Installing authentication dependencies...
py -m pip install python-jose[cryptography] passlib[bcrypt]
if errorlevel 1 (
    echo ❌ Failed to install authentication dependencies.
    pause >nul
    exit /b 1
)

echo Installing utility dependencies...
py -m pip install python-dotenv pydantic pydantic-settings
if errorlevel 1 (
    echo ❌ Failed to install utility dependencies.
    pause >nul
    exit /b 1
)

echo Installing AI dependencies...
py -m pip install openai
if errorlevel 1 (
    echo ❌ Failed to install OpenAI dependency.
    pause >nul
    exit /b 1
)

echo Installing file processing dependencies...
py -m pip install pypdf2 python-docx pandas numpy scikit-learn nltk spacy textstat
if errorlevel 1 (
    echo ❌ Failed to install file processing dependencies.
    pause >nul
    exit /b 1
)

echo ✅ All Python dependencies installed successfully

REM Create .env file
if not exist ".env" (
    echo ⚙️  Creating environment configuration...
    copy env_example.txt .env
    if errorlevel 1 (
        echo ❌ Failed to create .env file.
        pause >nul
        exit /b 1
    )
    echo ✅ Environment file created
    echo 📝 Please edit backend\.env file with your OpenAI API key
) else (
    echo ✅ Environment file already exists
)

REM Create upload directories
echo Creating upload directories...
if not exist "uploads" mkdir uploads
if not exist "uploads\resumes" mkdir uploads\resumes
if not exist "uploads\jds" mkdir uploads\jds
if not exist "uploads\jade_templates" mkdir uploads\jade_templates
echo ✅ Upload directories created

REM Test if the backend can start
echo 🧪 Testing backend startup...
py -c "import fastapi; print('FastAPI import successful')"
if errorlevel 1 (
    echo ❌ Backend test failed. There might be dependency issues.
    pause >nul
    exit /b 1
)
echo ✅ Backend test passed

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
echo ⚠️  NOTE: Packages were installed globally. Consider fixing Python installation later.
echo.
echo Press any key to exit this window (servers will continue running)
pause >nul
