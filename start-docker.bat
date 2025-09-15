@echo off
REM Jade AI Application - Docker Version

echo 🚀 Starting Jade AI Application (Docker Version)...
echo.

REM Check if Docker is installed
echo Checking Docker installation...
docker --version
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker Desktop and try again.
    echo Download from: https://www.docker.com/products/docker-desktop/
    echo.
    echo After installing Docker Desktop:
    echo 1. Start Docker Desktop
    echo 2. Wait for it to fully start
    echo 3. Run this script again
    pause >nul
    exit /b 1
)
echo ✅ Docker found

REM Check if Docker is running
echo Checking if Docker is running...
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker Desktop and try again.
    echo.
    echo Steps to start Docker:
    echo 1. Open Docker Desktop application
    echo 2. Wait for it to show "Docker Desktop is running"
    echo 3. Run this script again
    pause >nul
    exit /b 1
)
echo ✅ Docker is running

echo ✅ Prerequisites check passed
echo.

REM Create .env file for Docker
if not exist ".env" (
    echo ⚙️  Creating environment configuration...
    echo DATABASE_URL=postgresql://jade_user:jade_password@db:5432/jade_ai> .env
    echo SECRET_KEY=your-secret-key-change-in-production>> .env
    echo OPENAI_API_KEY=your-openai-api-key-here>> .env
    echo HOST=0.0.0.0>> .env
    echo PORT=8000>> .env
    echo DEBUG=False>> .env
    echo ✅ Environment file created
    echo 📝 Please edit .env file with your OpenAI API key
) else (
    echo ✅ Environment file already exists
)

echo 🚀 Starting Jade AI with Docker Compose...
echo This will:
echo - Start PostgreSQL database
echo - Build and start the backend API
echo - Build and start the frontend
echo - Set up all dependencies automatically
echo.

REM Start Docker Compose
docker-compose up --build -d
if errorlevel 1 (
    echo ❌ Failed to start Docker containers.
    echo.
    echo Common issues:
    echo 1. Docker Desktop is not running
    echo 2. Ports 3000 or 8000 are already in use
    echo 3. Insufficient disk space
    echo.
    echo Try:
    echo 1. Make sure Docker Desktop is running
    echo 2. Close any applications using ports 3000/8000
    echo 3. Free up disk space
    echo 4. Run: docker-compose down (to clean up)
    pause >nul
    exit /b 1
)

echo ✅ Docker containers started successfully!
echo.

REM Wait for services to be ready
echo Waiting for services to be ready...
timeout /t 10 /nobreak >nul

echo.
echo 🎉 Jade AI Application is starting up!
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8000
echo 📚 API Documentation: http://localhost:8000/docs
echo.
echo ✅ Setup completed successfully!
echo.
echo To stop the application, run: docker-compose down
echo To view logs, run: docker-compose logs -f
echo.
echo Press any key to exit this window (containers will continue running)
pause >nul
