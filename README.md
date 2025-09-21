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
