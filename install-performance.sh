#!/bin/bash

# ⚡ PERFORMANCE OPTIMIZATION - AUTOMATED INSTALLATION SCRIPT
# This script installs all performance dependencies and sets up the environment

echo "⚡ Starting Performance Optimization Installation..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"
echo ""

# Install Backend Dependencies
echo "📦 Installing backend dependencies..."
cd backend || exit
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi
echo ""

# Install Frontend Dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend || exit
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
    exit 1
fi
echo ""

# Check if Redis is installed
echo "🔍 Checking for Redis..."
if command -v redis-cli &> /dev/null; then
    echo -e "${GREEN}✅ Redis found: $(redis-cli --version)${NC}"
    
    # Check if Redis is running
    if redis-cli ping &> /dev/null; then
        echo -e "${GREEN}✅ Redis is running${NC}"
    else
        echo -e "${YELLOW}⚠️  Redis is installed but not running${NC}"
        echo "   Start Redis with: redis-server"
    fi
else
    echo -e "${YELLOW}⚠️  Redis not found${NC}"
    echo "   Redis is optional but recommended for production"
    echo "   System will use in-memory cache fallback"
    echo ""
    echo "   To install Redis:"
    echo "   - Mac: brew install redis"
    echo "   - Linux: sudo apt-get install redis-server"
    echo "   - Windows: Download from https://github.com/microsoftarchive/redis/releases"
fi
echo ""

# Check .env file
echo "🔍 Checking environment configuration..."
cd ../backend || exit
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ .env file found${NC}"
    
    # Check if REDIS_URL is configured
    if grep -q "REDIS_URL=" .env; then
        echo -e "${GREEN}✅ Redis configuration found in .env${NC}"
    else
        echo -e "${YELLOW}⚠️  Redis not configured in .env${NC}"
        echo "   Add this line to backend/.env:"
        echo "   REDIS_URL=redis://localhost:6379"
    fi
else
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo "   Copy .env.example to .env and configure your settings"
    echo "   cp .env.example .env"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 Performance Optimization Installation Complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 What's been installed:"
echo "   ✅ Redis caching utilities"
echo "   ✅ Image optimization (Sharp)"
echo "   ✅ Response compression"
echo "   ✅ React Query for data fetching"
echo "   ✅ Skeleton loaders"
echo "   ✅ Lazy image loading"
echo ""
echo "🚀 Next Steps:"
echo ""
echo "1. Configure Redis (optional but recommended):"
echo "   Add to backend/.env:"
echo "   REDIS_URL=redis://localhost:6379"
echo ""
echo "2. Start the application:"
echo "   Terminal 1: cd backend && npm start"
echo "   Terminal 2: cd frontend && npm run dev"
echo ""
echo "3. Verify performance:"
echo "   - Open http://localhost:5173"
echo "   - Check Network tab in DevTools"
echo "   - Announcement load should be < 500ms"
echo ""
echo "📚 Documentation:"
echo "   - OPTIMIZATION_SUMMARY.md - Complete overview"
echo "   - PERFORMANCE_INSTALLATION.md - Detailed setup"
echo "   - PERFORMANCE_QUICK_REFERENCE.md - Quick commands"
echo ""
echo "🎯 Performance Targets:"
echo "   ✅ Home Page: < 500ms"
echo "   ✅ Gallery: < 700ms"
echo "   ✅ Dashboard: < 1 second"
echo "   ✅ API Response: 300-800ms"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
echo ""
