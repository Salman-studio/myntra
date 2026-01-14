// Test if backend server is running
const http = require('http');

const testUrl = 'http://localhost:5000/health';

console.log('🔍 Testing backend connection...\n');
console.log(`Testing: ${testUrl}\n`);

const req = http.get(testUrl, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('✅ Backend is RUNNING!');
    console.log('Response:', data);
    process.exit(0);
  });
});

req.on('error', (error) => {
  console.log('❌ Backend is NOT running');
  console.log('Error:', error.message);
  console.log('\n💡 Start the backend with: npm run dev');
  process.exit(1);
});

req.setTimeout(3000, () => {
  console.log('❌ Connection timeout');
  console.log('💡 Make sure backend is running on port 5000');
  req.destroy();
  process.exit(1);
});
