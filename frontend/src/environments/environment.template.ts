// Template file for environment configuration
// The actual environment.ts files are generated at build time from .env variables
// This file serves as documentation for the expected structure

export const environment = {
  production: false,
  auth0: {
    domain: 'your-auth0-domain.auth0.com',
    clientId: 'your-auth0-client-id',
    redirectUri: 'http://localhost:8000',
  },
  apiUrl: 'http://localhost:8000'
};
