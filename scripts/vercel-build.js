// This is a simple build script for Vercel
const { execSync } = require('child_process');

try {
  // Build the client
  console.log('Building client...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}