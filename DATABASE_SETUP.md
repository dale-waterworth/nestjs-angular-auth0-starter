# Database Setup Guide

## Prerequisites

- Docker and Docker Compose installed
- Node.js and npm installed

## Starting the Database

1. Start the MariaDB container:
```bash
docker-compose up -d
```

2. Verify the database is running:
```bash
docker-compose ps
```

3. The database will automatically run the migration scripts in `/database/migrations` on first startup.

## Database Configuration

The database connection is configured via environment variables in `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=app_user
DB_PASSWORD=app_password
DB_NAME=nestjs_angular_db
DB_ROOT_PASSWORD=root_password
```

## Database Schema

### User Table

| Column     | Type         | Description                    |
|------------|--------------|--------------------------------|
| id         | INT          | Auto-incrementing primary key  |
| email      | VARCHAR(100) | User email (unique)            |
| authid     | VARCHAR(100) | Auth0 user ID (unique)         |
| created_at | TIMESTAMP    | Account creation timestamp     |

## API Endpoints

All endpoints require authentication (valid Auth0 JWT token).

### User Sync
- **POST** `/api/user/sync` - Syncs Auth0 user to database (called automatically after login)

### User CRUD
- **GET** `/api/user/:id` - Get user by ID
- **POST** `/api/user` - Create new user
  ```json
  {
    "email": "user@example.com",
    "authid": "auth0|123456"
  }
  ```
- **PUT** `/api/user/:id` - Update user
  ```json
  {
    "email": "newemail@example.com"
  }
  ```
- **DELETE** `/api/user/:id` - Delete user

### Profile
- **GET** `/api/user/profile` - Get current authenticated user's Auth0 profile

## How User Sync Works

1. User logs in via Auth0 on the frontend
2. Frontend automatically calls `/api/user/sync` after successful login
3. Backend checks if user exists in database by `authid`
4. If not found:
   - Fetches user info from Auth0 `/userinfo` endpoint
   - Creates new user record with email and authid
5. Returns the user record

## Connecting to the Database

### Using MySQL CLI
```bash
docker exec -it nestjs-angular-mariadb mysql -u app_user -p
# Enter password: app_password
```

### Using MySQL Workbench or other GUI
- Host: localhost
- Port: 3306
- Username: app_user
- Password: app_password
- Database: nestjs_angular_db

## Stopping the Database

```bash
docker-compose down
```

To remove all data:
```bash
docker-compose down -v
```

## Adding New Migrations

1. Create a new SQL file in `/database/migrations` with a numbered prefix:
   - Example: `002_add_user_preferences.sql`
2. Write your SQL migration
3. Restart the container or run manually:
   ```bash
   docker exec -i nestjs-angular-mariadb mysql -u app_user -p${DB_PASSWORD} ${DB_NAME} < database/migrations/002_add_user_preferences.sql
   ```

## Troubleshooting

### Connection Refused
- Ensure Docker container is running: `docker-compose ps`
- Check logs: `docker-compose logs mariadb`

### Migration Not Running
- Migrations only run on first container creation
- To re-run: `docker-compose down -v && docker-compose up -d`

### Cannot Connect from Backend
- Verify environment variables in `.env`
- Check that database is ready: `docker-compose logs mariadb | grep "ready for connections"`
