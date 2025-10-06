# CricketDB API Documentation

## Overview
CricketDB is a comprehensive cricket database management system with a React frontend, Spring Boot backend, and MySQL database. The API follows RESTful principles and uses JWT authentication with ADMIN-only access.

## Base URL
```
http://localhost:6548/api
```

## Authentication
The API uses JWT (JSON Web Token) authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Login to get JWT Token
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@cricketdb.com",
  "password": "admin123"
}
```

## API Endpoints

### Authentication Endpoints

#### Login
- **POST** `/api/auth/login`
- **Description**: Authenticate user and get JWT token
- **Authentication**: None required
- **Request Body**:
  ```json
  {
    "email": "admin@cricketdb.com",
    "password": "admin123"
  }
  ```
- **Response**:
  ```json
  {
    "jwtToken": "eyJhbGciOiJIUzI1NiJ9...",
    "email": "admin@cricketdb.com",
    "role": "ADMIN",
    "message": "Login successful"
  }
  ```

#### Register User
- **POST** `/api/auth/register`
- **Description**: Register a new admin user
- **Authentication**: Required (ADMIN only)
- **Request Body**:
  ```json
  {
    "email": "newadmin@cricketdb.com",
    "password": "newadmin123",
    "role": "ADMIN"
  }
  ```

### Player Management Endpoints

#### Get All Players
- **GET** `/api/players`
- **Description**: Retrieve all players
- **Authentication**: Required (ADMIN only)
- **Response**:
  ```json
  [
    {
      "playerId": 1,
      "playerName": "Virat Kohli",
      "country": "India",
      "startYear": 2008,
      "gender": "MALE",
      "role": "BATSMAN",
      "notes": "Test player"
    }
  ]
  ```

#### Get Player by ID
- **GET** `/api/players/{id}`
- **Description**: Retrieve a specific player
- **Authentication**: Required (ADMIN only)

#### Create Player
- **POST** `/api/players`
- **Description**: Create a new player
- **Authentication**: Required (ADMIN only)
- **Request Body**:
  ```json
  {
    "playerName": "Virat Kohli",
    "country": "India",
    "startYear": 2008,
    "gender": "MALE",
    "role": "BATSMAN",
    "notes": "Optional notes"
  }
  ```

#### Update Player
- **PUT** `/api/players/{id}`
- **Description**: Update an existing player
- **Authentication**: Required (ADMIN only)

#### Delete Player
- **DELETE** `/api/players/{id}`
- **Description**: Delete a player
- **Authentication**: Required (ADMIN only)

### Statistics Endpoints

#### Add Batting Statistics
- **POST** `/api/stats/batting`
- **Description**: Add batting statistics for a player
- **Authentication**: Required (ADMIN only)
- **Request Body**:
  ```json
  {
    "playerId": 1,
    "runs": 120,
    "ballsPlayed": 100,
    "sixes": 8,
    "fours": 12,
    "against": "Australia",
    "matchDate": "2024-01-15"
  }
  ```

#### Add Bowling Statistics
- **POST** `/api/stats/bowling`
- **Description**: Add bowling statistics for a player
- **Authentication**: Required (ADMIN only)
- **Request Body**:
  ```json
  {
    "playerId": 1,
    "overs": 10.0,
    "maidens": 2,
    "runsGiven": 45,
    "wicketsTaken": 3,
    "against": "Australia",
    "matchDate": "2024-01-15"
  }
  ```

#### Get Player Batting Statistics
- **GET** `/api/stats/batting/{playerId}`
- **Description**: Get batting statistics for a specific player
- **Authentication**: Required (ADMIN only)

#### Get Player Bowling Statistics
- **GET** `/api/stats/bowling/{playerId}`
- **Description**: Get bowling statistics for a specific player
- **Authentication**: Required (ADMIN only)

### Analytics Endpoints

#### Get Analytics Summary
- **GET** `/api/analytics/summary`
- **Description**: Get comprehensive analytics data
- **Authentication**: None required (Public endpoint)
- **Response**:
  ```json
  {
    "highestRunsPlayer": "Player Name",
    "highestRuns": 150,
    "highestWicketsPlayer": "Player Name",
    "highestWickets": 5,
    "mostMaidenOversPlayer": "Player Name",
    "mostMaidenOvers": 3,
    "bestBattingAveragePlayer": "Player Name",
    "bestBattingAverage": 45.67,
    "bestBowlingEconomyPlayer": "Player Name",
    "bestBowlingEconomy": 3.45,
    "totalCenturiesPlayer": "Player Name",
    "totalCenturies": 5,
    "totalFiveWicketHaulsPlayer": "Player Name",
    "totalFiveWicketHauls": 2,
    "mostRecentCenturyPlayer": "Player Name",
    "mostRecentCenturyDate": "2024-01-15",
    "mostRecentFiveWicketHaulPlayer": "Player Name",
    "mostRecentFiveWicketHaulDate": "2024-01-10",
    "mostSixesPlayer": "Player Name",
    "mostSixes": 25,
    "mostFoursPlayer": "Player Name",
    "mostFours": 50
  }
  ```

## Health Check

#### Application Health
- **GET** `/actuator/health`
- **Description**: Check application health status
- **Authentication**: None required
- **Response**:
  ```json
  {
    "status": "UP"
  }
  ```

## Swagger Documentation

### Swagger UI
- **URL**: `http://localhost:6548/swagger-ui/index.html`
- **Description**: Interactive API documentation

### OpenAPI Specification
- **URL**: `http://localhost:6548/v3/api-docs`
- **Description**: OpenAPI specification in JSON format

## Postman Collection

A complete Postman collection is available at:
```
./postman/CricketDB_API_Collection.json
```

### Import Instructions:
1. Open Postman
2. Click "Import" button
3. Select the `CricketDB_API_Collection.json` file
4. The collection will be imported with all endpoints and authentication setup

### Features:
- Pre-configured environment variables
- Automatic JWT token extraction and storage
- All API endpoints organized by category
- Sample request bodies
- Authentication headers automatically applied

## Error Handling

The API returns standard HTTP status codes:

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required or invalid token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

### Error Response Format:
```json
{
  "error": "Error message description",
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "path": "/api/players"
}
```

## Data Models

### Player
```json
{
  "playerId": 1,
  "playerName": "string",
  "country": "string",
  "startYear": 2008,
  "gender": "MALE" | "FEMALE",
  "role": "BATSMAN" | "BOWLER" | "ALL_ROUNDER",
  "notes": "string (optional)"
}
```

### Batting Statistics
```json
{
  "id": 1,
  "player": "Player object",
  "runs": 120,
  "ballsPlayed": 100,
  "sixes": 8,
  "fours": 12,
  "against": "string",
  "matchDate": "2024-01-15"
}
```

### Bowling Statistics
```json
{
  "id": 1,
  "player": "Player object",
  "overs": 10.0,
  "maidens": 2,
  "runsGiven": 45,
  "wicketsTaken": 3,
  "against": "string",
  "matchDate": "2024-01-15"
}
```

## Security

- JWT tokens expire after 24 hours
- All endpoints except login, analytics, health check, and Swagger require authentication
- Only ADMIN role is supported
- CORS is configured for localhost:3000 (frontend)

## Development

### Running with Docker Compose:
```bash
# Production mode
docker-compose up -d

# Development mode with hot reload
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Access Points:
- Frontend: http://localhost:3000
- Backend API: http://localhost:6548
- Swagger UI: http://localhost:6548/swagger-ui/index.html
- MySQL: localhost:3306

### Demo Credentials:
- **Admin**: admin@cricketdb.com / admin123
