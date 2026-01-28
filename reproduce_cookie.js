// Reproduction script for cookie setting
const fetch = require('node-fetch');

async function testCookie() {
  try {
    const response = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password' })
    });
    
    console.log('Status:', response.status);
    console.log('Headers:', response.headers.raw());
  } catch (error) {
    console.error('Error:', error);
  }
}

testCookie();
