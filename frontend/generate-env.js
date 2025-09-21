#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';
const envFile = isProduction ? '../.env.prod' : '../.env';

require('dotenv').config({ path: envFile });

const environment = {
  production: isProduction,
  auth0: {
    domain: process.env.AUTH0_DOMAIN || 'your-auth0-domain.auth0.com',
    clientId: process.env.AUTH0_CLIENT_ID || 'your-client-id',
    redirectUri: process.env.AUTH0_REDIRECT_URI || 'window.location.origin',
    audience: process.env.AUTH0_AUDIENCE || 'your-api-audience'
  },
  apiUrl: process.env.API_URL || (isProduction ? 'your-production-api-url' : `http://localhost:${process.env.PORT || 8000}`)
};

const envContent = `export const environment = ${JSON.stringify(environment, null, 2)
  .replace('"window.location.origin"', 'window.location.origin')};
`;

const targetFile = isProduction ?
  path.join(__dirname, 'src/environments/environment.prod.ts') :
  path.join(__dirname, 'src/environments/environment.ts');

fs.writeFileSync(targetFile, envContent);

console.log(`✅ Generated ${targetFile} from environment variables`);
console.log('Environment:', environment);
