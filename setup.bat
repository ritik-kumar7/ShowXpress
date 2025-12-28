@echo off
echo ========================================
echo Movie Ticket Booking Platform Setup
echo ========================================
echo.

echo Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies!
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

echo Installing Frontend Dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies!
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Create .env files in both backend and frontend directories
echo 2. Add your API keys and database connection strings
echo 3. Start the backend: cd backend && npm start
echo 4. Start the frontend: cd frontend && npm run dev
echo.
echo Check README.md for detailed setup instructions!
echo.
pause