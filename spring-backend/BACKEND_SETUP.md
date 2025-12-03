# Spring Boot Backend Setup

## Running the Backend

1. **Navigate to the spring-backend directory:**
   ```bash
   cd spring-backend
   ```

2. **Run the Spring Boot application:**
   ```bash
   mvn spring-boot:run
   ```

3. **The backend will start on:**
   ```
   http://localhost:8080
   ```

## Available API Endpoints

### Authentication
- `POST /api/auth/login` - Login user (JSON body: `{email, password}`)
- `POST /api/auth/register` - Register user (JSON body: `{email, password}`)

### Recipes
- `GET /api/recipes` - List all recipes
- `POST /api/recipes?name=RecipeName` - Add a recipe

### Family Groups
- `GET /api/family` - List all family groups
- `POST /api/family?name=GroupName` - Create a family group
- `POST /api/family/join?groupId=ID` - Join a family group
- `POST /api/family/leave?groupId=ID` - Leave a family group

## React Integration

The React frontend is configured to call these endpoints via `www/services/api.js`.

Make sure the backend is running before testing the React app!

## Next Steps

- Add database integration (MySQL, PostgreSQL, or MongoDB)
- Implement proper authentication with JWT tokens
- Add business logic for recipes, inventory, and family groups
- Deploy to a cloud server (Heroku, AWS, Azure, etc.)
