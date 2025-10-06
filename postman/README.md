# CricketDB Postman Collection

This directory contains comprehensive Postman collections for testing the CricketDB API.

## Files Overview

### 1. CricketDB_API_Collection.json
**Main API Collection** - Contains all positive test cases for the CricketDB API endpoints.

### 2. CricketDB_Environment.json
**Environment File** - Contains all environment variables and test data.

### 3. CricketDB_Negative_Tests.json
**Negative Test Collection** - Contains negative test cases, authentication flow tests, and performance tests.

## Setup Instructions

### 1. Import Collections
1. Open Postman
2. Click "Import" button
3. Import all three JSON files:
   - `CricketDB_API_Collection.json`
   - `CricketDB_Environment.json`
   - `CricketDB_Negative_Tests.json`

### 2. Set Up Environment
1. In Postman, go to "Environments"
2. Select "CricketDB Environment"
3. Verify all variables are set correctly:
   - `baseUrl`: http://localhost:6548
   - `adminEmail`: admin@cricketdb.com
   - `adminPassword`: admin123
   - Other test variables as needed

### 3. Start the Application
Before running tests, ensure the CricketDB application is running:
```bash
# Using Docker Compose
docker-compose up -d

# Or using development mode
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## Test Execution

### Running Individual Tests
1. Select the "CricketDB API Collection"
2. Select the "CricketDB Environment"
3. Run individual requests or entire folders

### Running Collection Tests
1. Click on the collection name
2. Click "Run" button
3. Select the environment
4. Click "Run CricketDB API Collection"

### Running Negative Tests
1. Select the "CricketDB Negative Tests & Auth Flow" collection
2. Run individual test cases or the entire collection

## Test Categories

### 1. Authentication Tests
- ✅ Login with valid credentials
- ✅ Register new user
- ❌ Login with invalid credentials
- ❌ Access protected endpoints without token
- ❌ Access with invalid token

### 2. Player Management Tests
- ✅ Get all players
- ✅ Get player by ID
- ✅ Create new player
- ✅ Update existing player
- ✅ Delete player
- ❌ Get non-existent player
- ❌ Create player with invalid data
- ❌ Update non-existent player
- ❌ Delete non-existent player

### 3. Statistics Tests
- ✅ Add batting statistics
- ✅ Add bowling statistics
- ✅ Get player batting stats
- ✅ Get player bowling stats
- ❌ Add stats for non-existent player
- ❌ Add stats with invalid data
- ❌ Get stats for non-existent player

### 4. Analytics Tests
- ✅ Get analytics summary
- ✅ Verify analytics data structure
- ✅ Check analytics data validity

### 5. Health Check Tests
- ✅ Application health status
- ✅ Response time validation
- ✅ Health status verification

### 6. Performance Tests
- ✅ Concurrent login requests
- ✅ Large dataset performance
- ✅ Response time validation

## Test Assertions

Each test includes comprehensive assertions:

### Response Status Tests
- Validates correct HTTP status codes
- Tests for 200, 201, 400, 401, 404 status codes

### Response Time Tests
- Validates response times are within acceptable limits
- Different thresholds for different endpoint types

### Response Content Tests
- Validates JSON content type
- Checks response body structure
- Verifies required fields are present

### Data Validation Tests
- Validates data types and formats
- Checks data consistency
- Verifies business logic constraints

## Environment Variables

### Base Configuration
- `baseUrl`: API base URL (http://localhost:6548)
- `apiBaseUrl`: Full API URL ({{baseUrl}}/api)
- `token`: JWT authentication token (auto-populated)

### Test Data
- `adminEmail`: Admin user email
- `adminPassword`: Admin user password
- `testPlayerId`: Test player ID (auto-populated)
- `testPlayerName`: Test player name
- `testCountry`: Test country
- `testStartYear`: Test start year
- `testGender`: Test gender (MALE/FEMALE)
- `testRole`: Test role (BATSMAN/BOWLER/ALL_ROUNDER)

### Statistics Test Data
- `testRuns`: Test runs scored
- `testBallsPlayed`: Test balls played
- `testSixes`: Test sixes hit
- `testFours`: Test fours hit
- `testAgainst`: Test opponent team
- `testMatchDate`: Test match date

### Bowling Test Data
- `testOvers`: Test overs bowled
- `testMaidens`: Test maidens bowled
- `testRunsGiven`: Test runs given
- `testWicketsTaken`: Test wickets taken

## Automated Test Execution

### Newman (Command Line)
```bash
# Install Newman
npm install -g newman

# Run main collection
newman run CricketDB_API_Collection.json -e CricketDB_Environment.json

# Run negative tests
newman run CricketDB_Negative_Tests.json -e CricketDB_Environment.json

# Run with HTML report
newman run CricketDB_API_Collection.json -e CricketDB_Environment.json -r html --reporter-html-export report.html
```

### CI/CD Integration
```yaml
# Example GitHub Actions workflow
- name: Run API Tests
  run: |
    newman run CricketDB_API_Collection.json -e CricketDB_Environment.json
    newman run CricketDB_Negative_Tests.json -e CricketDB_Environment.json
```

## Test Data Management

### Pre-requisites
- Application must be running
- Database must be seeded with initial data
- Admin user must exist (admin@cricketdb.com / admin123)

### Data Cleanup
- Tests are designed to be idempotent
- No manual cleanup required
- Each test run starts with fresh data

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure application is running on correct port
   - Check docker-compose status

2. **Authentication Failures**
   - Verify admin credentials
   - Check token expiration

3. **Test Failures**
   - Check application logs
   - Verify database connectivity
   - Ensure all services are healthy

### Debug Mode
Enable debug mode in Postman:
1. Go to Console
2. Enable "Show console logs"
3. Run tests to see detailed logs

## API Documentation

- **Swagger UI**: http://localhost:6548/swagger-ui/index.html
- **OpenAPI JSON**: http://localhost:6548/v3/api-docs
- **Health Check**: http://localhost:6548/actuator/health

## Support

For issues or questions:
1. Check application logs
2. Verify environment configuration
3. Ensure all services are running
4. Review test assertions and expected responses
