#!/usr/bin/env node

const FtpDeploy = require('ftp-deploy');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: '.env.deploy' });

// Load deployment configuration
const deployConfig = {
  user: process.env.FTP_USER || 'your-ftp-username',
  password: process.env.FTP_PASSWORD || 'your-ftp-password',
  host: process.env.FTP_HOST || 'your-ftp-server.com',
  port: process.env.FTP_PORT || 21,
  localRoot: path.join(__dirname, 'dist'),
  remoteRoot: process.env.FTP_REMOTE_ROOT || '',
  include: ['*', '**/*', '.env*'],
  exclude: [
    'dist/**/*.map',
    'node_modules/**',
    'node_modules/**/.*',
    '.git/**',
    'tsconfig.tsbuildinfo'
  ],
  includeHiddenFiles: true,
  deleteRemote: false,
  forcePasv: true,
  sftp: false
};

console.log('🚀 Starting FTP deployment...\n');

// Debug: Show config being used
console.log('📋 Deploy Configuration:');
console.log('Host:', deployConfig.host);
console.log('User:', deployConfig.user);
console.log('Port:', deployConfig.port);
console.log('Local Root:', deployConfig.localRoot);
console.log('Remote Root:', deployConfig.remoteRoot);
console.log('');

// Check if dist folder exists
if (!fs.existsSync('dist')) {
  console.error('❌ dist folder not found. Please run "npm run build:full" first.');
  process.exit(1);
}

const ftpDeploy = new FtpDeploy();

ftpDeploy.on('uploading', function(data) {
  console.log('📤 Uploading:', data.filename);
});

ftpDeploy.on('uploaded', function(data) {
  console.log('✅ Uploaded:', data.filename);
});

ftpDeploy.on('log', function(data) {
  console.log('📝 Log:', data);
});

ftpDeploy.deploy(deployConfig)
  .then(res => {
    console.log('\n🎉 Deployment completed successfully!');
    console.log('📊 Files uploaded:', res.length);
  })
  .catch(err => {
    console.error('\n❌ Deployment failed:', err.message);
    process.exit(1);
  });