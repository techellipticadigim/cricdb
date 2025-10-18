# 🏏 TechElliptica CricketDB - Cricket Database Management System

**Copyright (c) 2024 TechElliptica. All rights reserved.**

A comprehensive full-stack web application for managing cricket players, statistics, and analytics with admin-only access control. Developed by TechElliptica for educational training purposes.

## 🏏 Features

### Core Functionality
- **Player Management**: CRUD operations for cricket players
- **Statistics Tracking**: Batting and bowling statistics management
- **Analytics Dashboard**: Real-time analytics and insights
- **Country-wise Views**: Filter players by country
- **Admin-only Access Control**: ADMIN role with full system access

### Technical Features
- **Authentication**: JWT-based authentication with Spring Security
- **API Documentation**: Swagger UI integration
- **Responsive Design**: Material UI with mobile-friendly interface
- **Accessibility**: Full ARIA support and test-friendly attributes
- **Docker Support**: Complete containerization setup

## 🛠 Tech Stack

### Backend
- **Spring Boot 3.2.0** with Java 17
- **Spring Security** with JWT authentication
- **Spring Data JPA** for database operations
- **MySQL 8.0** database
- **Maven** for dependency management
- **Swagger/OpenAPI 3** for API documentation

### Frontend
- **React 18** with TypeScript
- **Material UI (MUI)** for UI components
- **React Router** for navigation
- **Recharts** for analytics visualization
- **Axios** for API communication

### DevOps
- **Docker & Docker Compose** for containerization
- **Nginx** for frontend serving and API proxying

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Java 17+ (for local development)
- Node.js 18+ (for local development)
- MySQL 8.0+ (for local development)

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cricdb
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:6548
   - Swagger UI: http://localhost:6548/swagger-ui.html
   - phpMyAdmin: http://localhost:8080
   - MySQL: localhost:3306

### Manual Setup

#### Backend Setup
1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Start MySQL database**
   - Create database: `cricketdb`
   - Update `application.yml` with your database credentials

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

#### Frontend Setup
1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

## 👥 User Roles & Permissions

### ADMIN
- **Full system access** to all features
- **Player Management**: Add/edit/delete players
- **Statistics Management**: Add batting and bowling statistics
- **User Management**: Register new admin users
- **Analytics Access**: View comprehensive analytics dashboard
- **System Administration**: Complete system control

## 🔐 Default Credentials

The application comes with a pre-configured admin user:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Admin | admin@cricketdb.com | admin123 | Full system access |

**Note**: Additional admin users can be registered through the admin panel.

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Admin registration (Admin only)

### Players
- `GET /api/players` - Get all players
- `GET /api/players/{id}` - Get player by ID
- `POST /api/players` - Create new player
- `PUT /api/players/{id}` - Update player
- `DELETE /api/players/{id}` - Delete player
- `GET /api/players/country/{country}` - Get players by country
- `GET /api/players/countries` - Get distinct countries

### Statistics
- `POST /api/stats/batting` - Add batting statistics
- `POST /api/stats/bowling` - Add bowling statistics
- `GET /api/stats/batting/player/{id}` - Get batting stats by player
- `GET /api/stats/bowling/player/{id}` - Get bowling stats by player

### Analytics
- `GET /api/analytics/summary` - Get comprehensive analytics (Public access)

## 🧪 Testing

### Backend Testing
```bash
cd backend
mvn test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### E2E Testing with Playwright
The application includes comprehensive `data-testid` attributes for automated testing:

```typescript
// Example test selectors
await page.click('[data-testid="login-submit"]');
await page.fill('[data-testid="player-name-input"]', 'Test Player');
await page.click('[data-testid="add-player-button"]');
```

## 📁 Project Structure

```
cricdb/
├── backend/
│   ├── src/main/java/com/cricketdb/
│   │   ├── controller/          # REST controllers
│   │   ├── service/            # Business logic
│   │   ├── repository/         # Data access layer
│   │   ├── model/              # JPA entities
│   │   ├── dto/                # Data transfer objects
│   │   ├── security/           # Security configuration
│   │   └── exception/          # Exception handling
│   ├── src/main/resources/
│   │   └── application.yml     # Application configuration
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   ├── context/            # React context
│   │   └── types/              # TypeScript types
│   ├── public/                 # Static assets
│   └── Dockerfile
├── database/
│   └── init.sql               # Database initialization
├── docker-compose.yml         # Docker services
└── README.md
```

## 🎯 Key Features Implemented

### ✅ Player Management
- ✅ Add/Edit/Delete players
- ✅ Country-wise filtering
- ✅ Role-based access control
- ✅ Form validation

### ✅ Statistics Management
- ✅ Batting statistics (runs, balls, sixes, fours)
- ✅ Bowling statistics (overs, maidens, runs, wickets)
- ✅ Match details tracking
- ✅ Player association

### ✅ Analytics Dashboard
- ✅ Highest runs/wickets
- ✅ Best batting averages
- ✅ Best bowling economy
- ✅ Century and 5-wicket haul tracking
- ✅ Recent achievements
- ✅ Interactive charts

### ✅ Authentication & Security
- ✅ JWT-based authentication
- ✅ Admin-only authorization
- ✅ Secure API endpoints
- ✅ CORS configuration
- ✅ License validation system

### ✅ Accessibility & Testing
- ✅ ARIA labels and roles
- ✅ Data-testid attributes
- ✅ Keyboard navigation
- ✅ Screen reader support

## 🔧 Configuration

### Environment Variables

#### Backend
- `SPRING_DATASOURCE_URL` - Database connection URL
- `SPRING_DATASOURCE_USERNAME` - Database username
- `SPRING_DATASOURCE_PASSWORD` - Database password
- `SPRING_SECURITY_JWT_SECRET` - JWT secret key
- `SPRING_SECURITY_JWT_EXPIRATION` - JWT expiration time

#### Frontend
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:6548/api)

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Ensure MySQL is running on port 3306
   - Check database credentials in `application.yml`
   - Verify database `cricketdb` exists

2. **Frontend API Connection Issues**
   - Ensure backend is running on port 6548
   - Check CORS configuration
   - Verify API URL in frontend environment

3. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT token expiration
   - Verify user credentials

## 📈 Performance Considerations

- Database indexes on frequently queried columns
- JPA lazy loading for related entities
- React component memoization
- Material UI theme optimization
- Docker multi-stage builds for smaller images

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 🛡️ Intellectual Property Protection

This application includes comprehensive protection measures:

- **Code Obfuscation**: Both backend and frontend code is obfuscated
- **License Validation**: Runtime license checking system
- **Copyright Protection**: All files include copyright notices
- **Anti-Reverse Engineering**: Multiple layers of protection
- **Legal Documentation**: Complete license and protection documentation

## 📄 License

**Copyright (c) 2024 TechElliptica. All rights reserved.**

This software is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited. This application is developed by TechElliptica for educational training purposes only.

For licensing inquiries: techellipticaeducation@gmail.com

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- Material UI team for the beautiful components
- React team for the powerful frontend library
- MySQL team for the robust database system

---

**Developed by TechElliptica for Educational Training Purposes**
**Contact: techellipticaeducation@gmail.com**
