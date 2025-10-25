# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack NestJS + Angular application with Auth0 authentication and structured logging via Pino. The backend serves both API endpoints and the compiled Angular frontend as a SPA.

## Development Commands

### Database (MariaDB via Docker)
```bash
docker-compose up -d     # Start MariaDB container
docker-compose down      # Stop MariaDB container
docker-compose logs      # View logs
```

### Backend (NestJS)
```bash
npm run start:dev        # Run backend in dev mode with ts-node
npm run start:debug      # Run backend with debugger
npm run build            # Compile TypeScript to dist/
```

### Frontend (Angular)
```bash
cd frontend
npm run start            # Run dev server on port 4200
npm run build            # Build frontend
npm run test             # Run Jasmine/Karma tests
```

The frontend has a `prestart` and `prebuild` hook that automatically generates `environment.ts` from root `.env` file.

### Full Stack
```bash
npm run build:full       # Build both backend and frontend (development)
npm run build:prod       # Build with production env (.env.prod)
npm run deploy:full      # Build development and deploy via FTP
npm run deploy:full:prod # Build production and deploy via FTP
```

## Architecture

### Backend Structure (NestJS)
- **Entry Point**: `src/main.ts` - Bootstraps NestJS app, enables CORS, loads env from `.env` or `env.txt`, configures Pino logger
- **App Module**: `src/app.module.ts` - Configures Pino logging, TypeORM, static file serving from `dist/public/`, and imports auth/user modules
- **Logging**: Uses Pino for structured JSON logging
  - Pretty-printed logs in development with timestamps
  - JSON logs in production
  - Automatic HTTP request/response logging
  - Context-aware logging in services with structured data
  - Configurable log level via `LOG_LEVEL` env var (debug, info, warn, error)
- **Auth Guard**: `src/auth/auth.guard.ts` - JWT validation using Auth0 JWKS (RS256 algorithm) with logging
- **Auth Service**: `src/auth/auth.service.ts` - Fetches user info from Auth0 userinfo endpoint with logging
- **User Module**: `src/user/` - User CRUD operations and Auth0 sync with comprehensive logging
  - `user.entity.ts` - TypeORM entity for user table
  - `user.service.ts` - Business logic for user operations with structured logging
  - `user.controller.ts` - REST endpoints: GET /user/:id, POST /user, PUT /user/:id, DELETE /user/:id, POST /user/sync
- **SPA Controller**: `src/spa/spa.controller.ts` - Serves Angular frontend for all non-API routes

### Frontend Structure (Angular)
- **Standalone Components**: Uses Angular's new standalone API (no NgModule)
- **Auth Service**: `frontend/src/app/services/auth.service.ts` - Wraps Auth0 SPA SDK and automatically syncs users with backend after login
- **Routes**: Defined in `frontend/src/app/app.routes.ts` (home, about, profile)
- **Environment**: Generated from `.env` by `frontend/generate-env.js`

### Database Structure
- **Docker Compose**: `docker-compose.yml` - MariaDB 10.6.23 container configuration
- **Migrations**: `database/migrations/` - SQL migration files executed on container startup
- **User Table**: id, email (unique), authid (unique), created_at

### Auth0 Integration & User Sync Flow
Both frontend and backend validate JWT tokens issued by Auth0:
- Frontend: Uses `@auth0/auth0-spa-js` for login/logout and token acquisition
- Backend: Uses `express-jwt` + `jwks-rsa` to validate RS256 tokens
- Protected routes require matching `AUTH0_AUDIENCE` and `AUTH0_DOMAIN`

**User Sync Flow**:
1. User logs in via Auth0 on frontend
2. After successful Auth0 callback, frontend automatically calls `POST /api/user/sync`
3. Backend checks if user exists in database by `authid` (from JWT token `sub` claim)
4. If user doesn't exist:
   - Backend calls Auth0 `/userinfo` endpoint to get email
   - Creates new user record in database
5. Returns user record to frontend

### Build Process
The `build.js` script:
1. Cleans previous builds
2. Compiles backend TypeScript to `dist/src/`
3. Generates frontend environment files from `.env` or `.env.prod`
4. Builds Angular app to `frontend/dist/frontend/browser/`
5. Copies Angular build to `dist/public/` (served by NestJS static middleware)
6. Creates production `package.json` in `dist/`
7. Copies environment file as both `.env` and `env.txt` (for deployment compatibility)
8. Creates `dist/tmp/restart.txt` timestamp file for deployment restart triggers

### Deployment
The `deploy.js` script uses FTP to upload `dist/` folder. Configuration from `.env.deploy`:
- `FTP_HOST`, `FTP_USER`, `FTP_PASSWORD`, `FTP_PORT`, `FTP_REMOTE_ROOT`
- Includes hidden `.env*` files
- Creates `tmp/restart.txt` to trigger application restart on server

## Environment Variables

Three environment files:
- `.env` - Local development
- `.env.prod` - Production values
- `.env.deploy` - FTP credentials for deployment

Required variables:
```
# Auth0
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_AUDIENCE=your-api-identifier
AUTH0_REDIRECT_URI=http://localhost:4200 (or production URL)

# Application
PORT=8000
NODE_ENV=development
LOG_LEVEL=info  # debug, info, warn, error
FRONTEND_URL=http://localhost:4200
API_URL=http://localhost:8000/api

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=app_user
DB_PASSWORD=app_password
DB_NAME=nestjs_angular_db
DB_ROOT_PASSWORD=root_password
```

## Important Notes

- Backend looks for `.env` first, falls back to `env.txt` (for servers that don't preserve hidden files)
- Frontend environment is code-generated - never edit `frontend/src/environments/environment.ts` directly
- Database migrations in `database/migrations/` run automatically on first container startup
- User sync happens automatically after Auth0 login - no manual action needed
- ServeStaticModule excludes `/api/*` routes to prevent conflicts with API endpoints
- Static files served from `dist/public/` in production builds
- CORS configured to allow credentials from `FRONTEND_URL`
- TypeORM synchronize is disabled - use SQL migrations for schema changes
