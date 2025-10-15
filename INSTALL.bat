@echo off
echo ========================================
echo   SECURE MILITARY CHAT - INSTALLATION
echo ========================================
echo.

echo Step 1: Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

echo Step 2: Installing frontend dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..
echo Frontend dependencies installed successfully!
echo.

echo Step 3: Seeding database with dummy data...
call npm run seed
if %errorlevel% neq 0 (
    echo Warning: Database seeding failed. Make sure MongoDB is running.
    echo You can run 'npm run seed' manually later.
)
echo.

echo ========================================
echo   INSTALLATION COMPLETE!
echo ========================================
echo.
echo To start the application, run: START.bat
echo Or use: npm run dev
echo.
echo Demo Credentials:
echo   HQ Staff:     hq.admin / admin123
echo   Military:     soldier.john / soldier123
echo   Family:       family.jane / family123
echo.
pause
