#!/bin/bash

echo "🏏 CricketDB Setup Script"
echo "========================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create necessary directories
echo "📁 Creating project directories..."
mkdir -p database

# Set executable permissions
chmod +x setup.sh

echo "🚀 Starting CricketDB application..."

# Start the application using Docker Compose
docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 30

# Check if services are running
echo "🔍 Checking service status..."
if curl -f http://localhost:6548/actuator/health &> /dev/null; then
    echo "✅ Backend service is running on http://localhost:6548"
else
    echo "❌ Backend service is not responding"
fi

if curl -f http://localhost:3000 &> /dev/null; then
    echo "✅ Frontend service is running on http://localhost:3000"
else
    echo "❌ Frontend service is not responding"
fi

echo ""
echo "🎉 CricketDB is now running!"
echo ""
echo "📱 Access Points:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:6548"
echo "   Swagger UI: http://localhost:6548/swagger-ui/index.html"
echo "   MySQL: localhost:3306"
echo ""
echo "🔐 Demo Credentials (ADMIN Only):"
echo "   Admin: admin@cricketdb.com / admin123"
echo ""
echo "📋 Postman Collection:"
echo "   Import: ./postman/CricketDB_API_Collection.json"
echo ""
echo "🛠 Useful Commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart services: docker-compose restart"
echo "   Clean up: docker-compose down -v"
echo "   Development mode: docker-compose -f docker-compose.yml -f docker-compose.dev.yml up"
echo ""
echo "📚 For more information, see README.md"
