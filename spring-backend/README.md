# MealSense2 Spring Boot Backend

This backend provides REST APIs for user authentication, family group management, and recipe data for the MealSense2 app.

## Features
- User authentication endpoints (placeholder, for integration with Firebase/Auth)
- Family group management (CRUD)
- Recipe management (CRUD)

## Structure
- Java 17+
- Spring Boot 3.x
- Maven build

## Getting Started
1. Import this project into your IDE (IntelliJ, VS Code, Eclipse, etc.)
2. Run `./mvnw spring-boot:run` (Linux/macOS) or `mvnw.cmd spring-boot:run` (Windows)
3. API will be available at `http://localhost:8080/api/`

## Endpoints (to be implemented)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/family` - List family groups
- `POST /api/family` - Create family group
- `POST /api/family/join` - Join family group
- `POST /api/family/leave` - Leave family group
- `GET /api/recipes` - List recipes
- `POST /api/recipes` - Add recipe

## Notes
- This backend is for web companion use. Android app remains primary.
- Integrate with Firebase/Auth as needed for production.
