@echo off
REM ⚡ PERFORMANCE OPTIMIZATION - AUTOMATED INSTALLATION SCRIPT (Windows)
REM This script installs all performance dependencies and sets up the environment

echo ⚡ Starting Performance Optimization Installation...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version
echo.

REM Install Backend Dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed successfully
echo.

REM Install Frontend Dependencies
echo 📦 Installing frontend dependencies...
cd ..\frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed successfully
echo.

REM Check if Redis is installed
echo 🔍 Checking for Redis...
where redis-cli >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Redis found
    redis-cli --version
    
    REM Check if Redis is running
    redis-cli ping >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Redis is running
    ) else (
        echo ⚠️  Redis is installed but not running
        echo    Start Redis with: redis-server
    )
) else (
    echo ⚠️  Redis not found
    echo    Redis is optional but recommended for production
    echo    System will use in-memory cache fallback
    echo.
    echo    To install Redis on Windows:
    echo    Download from: https://github.com/microsoftarchive/redis/releases
)
echo.

REM Check .env file
echo 🔍 Checking environment configuration...
cd ..\backend
if exist ".env" (
    echo ✅ .env file found
    
    REM Check if REDIS_URL is configured
    findstr /C:"REDIS_URL=" .env >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Redis configuration found in .env
    ) else (
        echo ⚠️  Redis not configured in .env
        echo    Add this line to backend\.env:
        echo    REDIS_URL=redis://localhost:6379
    )
) else (
    echo ⚠️  .env file not found
    echo    Copy .env.example to .env and configure your settings
    echo    copy .env.example .env
)
echo.

REM Summary
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🎉 Performance Optimization Installation Complete!
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📊 What's been installed:
echo    ✅ Redis caching utilities
echo    ✅ Image optimization (Sharp)
echo    ✅ Response compression
echo    ✅ React Query for data fetching
echo    ✅ Skeleton loaders
echo    ✅ Lazy image loading
echo.
echo 🚀 Next Steps:
echo.
echo 1. Configure Redis (optional but recommended):
echo    Add to backend\.env:
echo    REDIS_URL=redis://localhost:6379
echo.
echo 2. Start the application:
echo    Terminal 1: cd backend ^&^& npm start
echo    Terminal 2: cd frontend ^&^& npm run dev
echo.
echo 3. Verify performance:
echo    - Open http://localhost:5173
echo    - Check Network tab in DevTools
echo    - Announcement load should be ^< 500ms
echo.
echo 📚 Documentation:
echo    - OPTIMIZATION_SUMMARY.md - Complete overview
echo    - PERFORMANCE_INSTALLATION.md - Detailed setup
echo    - PERFORMANCE_QUICK_REFERENCE.md - Quick commands
echo.
echo 🎯 Performance Targets:
echo    ✅ Home Page: ^< 500ms
echo    ✅ Gallery: ^< 700ms
echo    ✅ Dashboard: ^< 1 second
echo    ✅ API Response: 300-800ms
echo.
echo Happy coding! 🚀
echo.

cd ..
pause
