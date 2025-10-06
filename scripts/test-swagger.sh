#!/bin/bash

echo "🔧 Testing Swagger UI Access"
echo "=============================="

# Check if application is running
echo "⏳ Checking if application is running..."
if curl -f http://localhost:6548/actuator/health > /dev/null 2>&1; then
    echo "✅ Application is running"
else
    echo "❌ Application is not running. Please start it first:"
    echo "   docker-compose up -d"
    exit 1
fi

echo ""
echo "🔍 Testing Swagger UI endpoints..."

# Test Swagger UI
echo "Testing /swagger-ui.html..."
if curl -f http://localhost:6548/swagger-ui.html > /dev/null 2>&1; then
    echo "✅ Swagger UI is accessible at: http://localhost:6548/swagger-ui.html"
else
    echo "❌ Swagger UI is not accessible"
fi

# Test OpenAPI JSON
echo "Testing /v3/api-docs..."
if curl -f http://localhost:6548/v3/api-docs > /dev/null 2>&1; then
    echo "✅ OpenAPI JSON is accessible at: http://localhost:6548/v3/api-docs"
else
    echo "❌ OpenAPI JSON is not accessible"
fi

# Test Health Check
echo "Testing /actuator/health..."
if curl -f http://localhost:6548/actuator/health > /dev/null 2>&1; then
    echo "✅ Health check is accessible at: http://localhost:6548/actuator/health"
else
    echo "❌ Health check is not accessible"
fi

echo ""
echo "📋 Available endpoints:"
echo "   • Swagger UI: http://localhost:6548/swagger-ui.html"
echo "   • OpenAPI JSON: http://localhost:6548/v3/api-docs"
echo "   • Health Check: http://localhost:6548/actuator/health"
echo "   • API Base: http://localhost:6548/api"
echo ""
echo "🔐 Demo Credentials:"
echo "   • Admin: admin@cricketdb.com / admin123"
echo ""
echo "💡 If Swagger UI is still not accessible, try:"
echo "   1. Restart the application: docker-compose restart backend"
echo "   2. Check application logs: docker-compose logs backend"
echo "   3. Verify the application is running on port 6548"
