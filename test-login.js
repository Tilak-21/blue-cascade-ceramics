// Test script to verify admin login
const fetch = require('node-fetch');

async function testLogin() {
  try {
    const response = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'CascadeTiles2024!'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('Token:', data.token);
      console.log('Admin:', data.admin);
    } else {
      console.log('❌ Login failed:');
      console.log('Status:', response.status);
      console.log('Error:', data);
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testLogin();