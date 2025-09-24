# NestJS Angular and Auth0 Starter

### Populate Environment Variables
Add your Auth0 values to the [.env](.env) for production or [.env.dev](.env.dev) for development.

A script will build out the environment files Angular for local or prod builds.

### Run locally
To run locally run both the backend and frontend with the following command:

API
```bash
npm run start:dev
```

Front end 
```bash
cd frontend
npm run start
```
### Run Bundled Locally

```bash
npm run build:full
```


```bash
cd ./dist
npm run start
```

### Build for Production

Build files into the dist folder and upload to your server.
```bash
npm run deploy:full
```

### Deploy to Production

Ensure your environment variables are set in the [.env.deploy](.env.deploy) file for production.

```bash
npm run deploy:full:prod
```

This will copy all the files needed.

You may need to add this to the .htaccess file in the dist folder for Angular routing to work.

```
RewriteEngine On

# Handle Angular routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteCond %{REQUEST_URI} !^/assets/
RewriteCond %{REQUEST_URI} !\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$
RewriteRule ^.*$ /public/index.html [L]
```


Enjoy!


# AI overview

# NestJS Angular Auth0 Starter

A full-stack web application starter template featuring authentication, user management, and a modern development workflow.

## Features

### Authentication & Security
- **Auth0 Integration**: Complete OAuth2/OpenID Connect authentication flow
- **JWT Token Validation**: Secure API endpoints with RS256 token verification
- **Protected Routes**: Frontend route guards and backend API protection
- **User Profile Management**: Access user information and manage sessions

### Frontend (Angular)
- **Modern Angular**: Latest Angular framework with TypeScript
- **Responsive Design**: Mobile-friendly UI components
- **Client-side Routing**: SPA routing with fallback handling
- **Auth0 SPA SDK**: Seamless authentication integration
- **Environment Configuration**: Dynamic environment setup for dev/prod

### Backend (NestJS)
- **RESTful API**: Well-structured API endpoints
- **Express JWT**: Token validation middleware
- **CORS Support**: Configurable cross-origin resource sharing
- **Environment Variables**: Secure configuration management
- **TypeScript**: Full type safety across the stack

### Development & Deployment
- **Automated Build Process**: Single command production builds
- **Environment Management**: Separate dev/prod configurations
- **FTP Deployment**: Automated deployment with restart triggers
- **Static File Serving**: Optimized asset delivery
- **Development Server**: Hot reload for rapid development

### Project Structure
├── src/                 # NestJS backend source
├── frontend/           # Angular frontend source
├── dist/              # Production build output
├── .env/.env.prod     # Environment configurations
└── deploy.js          # Deployment automation

## Quick Start

  ```bash
# Install dependencies
npm install

# Development
npm run start:dev    # Backend
npm run start        # Frontend (separate terminal)

# Production Build & Deploy
npm run build:prod   # Build for production
npm run deploy       # Deploy to server

API Endpoints

- GET /api/user/profile - Get authenticated user profile (Protected)
- GET / - Serve Angular SPA
- /profile, /login - Frontend routes handled by Angular

Perfect for building modern web applications with authentication requirements.

