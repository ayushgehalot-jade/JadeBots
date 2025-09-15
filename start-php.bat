@echo off
REM Jade AI Application - PHP Backend Version

echo 🚀 Starting Jade AI Application (PHP Backend)...
echo.

REM Check if PHP is installed
echo Checking PHP installation...
php --version
if errorlevel 1 (
    echo ❌ PHP is not installed. Please install PHP 8.0+ and try again.
    echo.
    echo Download options:
    echo 1. XAMPP: https://www.apachefriends.org/download.html
    echo 2. PHP directly: https://windows.php.net/download/
    echo 3. Laragon: https://laragon.org/download/
    echo.
    echo After installing PHP, make sure it's added to your PATH.
    pause >nul
    exit /b 1
)
echo ✅ PHP found

REM Check if Composer is installed
echo Checking Composer installation...
composer --version
if errorlevel 1 (
    echo ❌ Composer is not installed. Please install Composer and try again.
    echo Download from: https://getcomposer.org/download/
    pause >nul
    exit /b 1
)
echo ✅ Composer found

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

echo ✅ Prerequisites check passed
echo.

REM Start backend setup
echo 🔧 Setting up PHP backend...
cd backend-php
if errorlevel 1 (
    echo ❌ Backend directory not found. Creating PHP backend...
    mkdir backend-php
    cd backend-php
)

REM Create composer.json if it doesn't exist
if not exist "composer.json" (
    echo 📦 Creating composer.json...
    echo {> composer.json
    echo   "name": "jade-ai/backend",>> composer.json
    echo   "description": "Jade AI Backend API",>> composer.json
    echo   "type": "project",>> composer.json
    echo   "require": {>> composer.json
    echo     "php": "^8.0",>> composer.json
    echo     "slim/slim": "^4.0",>> composer.json
    echo     "slim/psr7": "^1.0",>> composer.json
    echo     "firebase/php-jwt": "^6.0",>> composer.json
    echo     "vlucas/phpdotenv": "^5.0",>> composer.json
    echo     "guzzlehttp/guzzle": "^7.0",>> composer.json
    echo     "ext-pdo": "*",>> composer.json
    echo     "ext-json": "*">> composer.json
    echo   },>> composer.json
    echo   "autoload": {>> composer.json
    echo     "psr-4": {>> composer.json
    echo       "App\\": "src/">> composer.json
    echo     }>> composer.json
    echo   }>> composer.json
    echo }>> composer.json
)

REM Install dependencies
echo 📦 Installing PHP dependencies...
composer install
if errorlevel 1 (
    echo ❌ Failed to install PHP dependencies.
    pause >nul
    exit /b 1
)
echo ✅ PHP dependencies installed

REM Create .env file
if not exist ".env" (
    echo ⚙️  Creating environment configuration...
    echo APP_ENV=development> .env
    echo APP_DEBUG=true>> .env
    echo JWT_SECRET=your-secret-key-here-change-in-production>> .env
    echo OPENAI_API_KEY=your-openai-api-key-here>> .env
    echo DATABASE_URL=sqlite:./jade_ai.db>> .env
    echo UPLOAD_DIR=./uploads>> .env
    echo ✅ Environment file created
    echo 📝 Please edit backend-php\.env file with your OpenAI API key
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

REM Create basic index.php if it doesn't exist
if not exist "index.php" (
    echo 📝 Creating basic index.php...
    echo ^<?php> index.php
    echo require_once 'vendor/autoload.php';>> index.php
    echo.>> index.php
    echo use Slim\Factory\AppFactory;>> index.php
    echo use Slim\Middleware\BodyParsingMiddleware;>> index.php
    echo.>> index.php
    echo $app = AppFactory::create();>> index.php
    echo.>> index.php
    echo $app-^>add(new BodyParsingMiddleware());>> index.php
    echo.>> index.php
    echo $app-^>get('/', function ($request, $response) {>> index.php
    echo     $data = ['message' =^> 'Jade AI Backend API is running!'];>> index.php
    echo     $response-^>getBody()-^>write(json_encode($data));>> index.php
    echo     return $response-^>withHeader('Content-Type', 'application/json');>> index.php
    echo });>> index.php
    echo.>> index.php
    echo $app-^>run();>> index.php
)

echo 🚀 Starting PHP backend server...
start "Jade AI Backend (PHP)" cmd /k "php -S localhost:8000"

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
