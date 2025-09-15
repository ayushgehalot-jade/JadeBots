@echo off
REM Python Installation Fix Script

echo 🔧 Python Installation Fix Script
echo.

echo This script will help fix your corrupted Python installation.
echo.

REM Check current Python installation
echo Checking current Python installation...
py --version
if errorlevel 1 (
    echo ❌ Python launcher not found
) else (
    echo ✅ Python launcher found
)

echo.
echo Checking Python executable...
python --version 2>nul
if errorlevel 1 (
    echo ❌ Python executable not found
) else (
    echo ✅ Python executable found
)

echo.
echo Checking Python installation directory...
for /f "tokens=*" %%i in ('py -c "import sys; print(sys.executable)" 2^>nul') do set PYTHON_PATH=%%i
if defined PYTHON_PATH (
    echo ✅ Python path: %PYTHON_PATH%
) else (
    echo ❌ Could not determine Python path
)

echo.
echo ========================================
echo SOLUTIONS TO TRY:
echo ========================================
echo.
echo 1. REINSTALL PYTHON (RECOMMENDED):
echo    - Go to https://www.python.org/downloads/
echo    - Download Python 3.9 or 3.10 (avoid 3.11+ for now)
echo    - During installation, CHECK "Add Python to PATH"
echo    - CHECK "Install for all users" if you have admin rights
echo    - After installation, RESTART your computer
echo.
echo 2. USE PYTHON FROM MICROSOFT STORE:
echo    - Open Microsoft Store
echo    - Search for "Python 3.9" or "Python 3.10"
echo    - Install it
echo    - This often fixes PATH issues
echo.
echo 3. MANUAL PATH FIX:
echo    - Find your Python installation folder
echo    - Add it to Windows PATH environment variable
echo    - Restart command prompt
echo.
echo 4. USE CONDA/MINICONDA:
echo    - Download Miniconda from https://docs.conda.io/en/latest/miniconda.html
echo    - Install it
echo    - Use conda instead of pip
echo.
echo ========================================
echo.
echo Press any key to continue...
pause >nul

echo.
echo Testing if we can create a virtual environment with different methods...
echo.

REM Try with py launcher
echo Method 1: Using py launcher...
py -m venv test_venv_py 2>nul
if errorlevel 1 (
    echo ❌ py launcher method failed
) else (
    echo ✅ py launcher method worked
    rmdir /s /q test_venv_py 2>nul
)

REM Try with python command
echo Method 2: Using python command...
python -m venv test_venv_python 2>nul
if errorlevel 1 (
    echo ❌ python command method failed
) else (
    echo ✅ python command method worked
    rmdir /s /q test_venv_python 2>nul
)

echo.
echo ========================================
echo NEXT STEPS:
echo ========================================
echo.
echo If both methods failed, you need to reinstall Python.
echo.
echo If one method worked, we can modify the startup script to use that method.
echo.
echo Press any key to exit...
pause >nul
