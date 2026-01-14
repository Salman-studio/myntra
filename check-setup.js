// Quick setup checker for backend
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking backend setup...\n');

// Check .env file
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file exists');
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('MONGODB_URI')) {
    console.log('✅ MONGODB_URI found in .env');
  } else {
    console.log('❌ MONGODB_URI not found in .env');
  }
  if (envContent.includes('JWT_SECRET')) {
    console.log('✅ JWT_SECRET found in .env');
  } else {
    console.log('❌ JWT_SECRET not found in .env');
  }
} else {
  console.log('❌ .env file NOT found');
  console.log('   Create it with: MONGODB_URI, JWT_SECRET, PORT');
}

// Check node_modules
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('✅ node_modules exists');
} else {
  console.log('❌ node_modules NOT found');
  console.log('   Run: npm install');
}

// Check server.js
const serverPath = path.join(__dirname, 'server.js');
if (fs.existsSync(serverPath)) {
  console.log('✅ server.js exists');
} else {
  console.log('❌ server.js NOT found');
}

console.log('\n📋 Next steps:');
console.log('1. Make sure .env file exists with MONGODB_URI and JWT_SECRET');
console.log('2. Run: npm install (if node_modules missing)');
console.log('3. Run: npm run dev');
console.log('4. Check: http://localhost:5000/health');
