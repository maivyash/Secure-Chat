@echo off
echo ========================================
echo   SECURE MILITARY CHAT APPLICATION
echo ========================================
echo.

echo Checking MongoDB status...
sc query MongoDB | find "RUNNING" >nul
if %errorlevel% neq 0 (
    echo MongoDB is not running. Starting MongoDB...
    net start MongoDB
    timeout /t 3 >nul
) else (
    echo MongoDB is already running.
)
echo.

echo Starting the application...
echo Server will run on: http://localhost:5000
echo Client will run on: http://localhost:3000
echo.
echo Press Ctrl+C to stop the application
echo.

npm run dev
