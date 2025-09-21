#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';
console.log(`🚀 Starting ${isProduction ? 'production' : 'development'} build process...\n`);

try {
  // Clean previous builds
  console.log('🧹 Cleaning previous builds...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  if (fs.existsSync('frontend/dist')) {
    fs.rmSync('frontend/dist', { recursive: true, force: true });
  }

  // Build backend
  console.log('📦 Building backend...');
  execSync('npm run build', { stdio: 'inherit' });

  // Build frontend
  console.log(`📦 Building frontend for ${isProduction ? 'production' : 'development'}...`);
  process.chdir('frontend');
  console.log(`🔧 Generating ${isProduction ? 'production' : 'development'} environment configuration...`);
  execSync('npm run generate-env', { stdio: 'inherit' });
  if(isProduction){
    execSync('npm run build -- --configuration=production', { stdio: 'inherit' });
  } else {
    execSync('npm run build', { stdio: 'inherit' });

  }
  process.chdir('..');

  // Copy frontend build to backend dist
  console.log('📁 Copying frontend build to backend...');
  const frontendDist = path.join('frontend', 'dist', 'frontend', 'browser');
  const backendPublic = path.join('dist', 'public');

  if (fs.existsSync(frontendDist)) {
    fs.mkdirSync(backendPublic, { recursive: true });
    fs.cpSync(frontendDist, backendPublic, { recursive: true });
  }

  // Copy package.json and node_modules for production
  console.log('📋 Preparing production files...');
  fs.copyFileSync('package.json', path.join('dist', 'package.json'));

  // Create production package.json
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const prodPackageJson = {
    name: packageJson.name,
    version: packageJson.version,
    main: 'src/main.js',
    scripts: {
      start: 'node src/main.js'
    },
    dependencies: packageJson.dependencies
  };
  fs.writeFileSync(path.join('dist', 'package.json'), JSON.stringify(prodPackageJson, null, 2));

  // Copy environment file template
  const envFile = isProduction ? '.env.prod' : '.env';
  console.log(`📄 Copying environment file: ${envFile} (isProduction: ${isProduction})`);
  if (fs.existsSync(envFile)) {
    fs.copyFileSync(envFile, path.join('dist', '.env'));
    fs.copyFileSync(envFile, path.join('dist', '.env.example'));
    fs.copyFileSync(envFile, path.join('dist', 'env.txt')); // Non-hidden copy for deployment
    console.log(`✅ Copied ${envFile} to dist/.env`);
  } else if (isProduction && fs.existsSync('.env')) {
    console.warn('⚠️  .env.prod file not found, copying .env instead');
    fs.copyFileSync('.env', path.join('dist', '.env'));
    fs.copyFileSync('.env', path.join('dist', '.env.example'));
  } else {
    console.error(`❌ Environment file ${envFile} not found!`);
  }

  // Create tmp directory with restart.txt for deployment
  console.log('📁 Creating deployment restart trigger...');
  const tmpDir = path.join('dist', 'tmp');
  fs.mkdirSync(tmpDir, { recursive: true });
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  fs.writeFileSync(path.join(tmpDir, 'restart.txt'), `${timestamp} - Application restart triggered`);

  // Clean up unnecessary frontend TypeScript files from dist
  console.log('🧹 Cleaning up unnecessary files...');
  if (fs.existsSync(path.join('dist', 'frontend'))) {
    fs.rmSync(path.join('dist', 'frontend'), { recursive: true, force: true });
  }
  fs.rmSync(path.join('dist', 'tsconfig.tsbuildinfo'), { force: true });


  console.log('✅ Build completed successfully!');
  console.log('📁 Production files are in the ./dist directory');
  console.log('🚀 To deploy: cd dist && npm install --production && npm start');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}