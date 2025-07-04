// Test script untuk extensions API
const axios = require('axios');

async function testExtensionsAPI() {
  try {
    // Login sebagai admin
    console.log('🔐 Logging in as admin...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Setup headers with token
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // Test GET extensions
    console.log('\n📋 Fetching extensions...');
    const getResponse = await axios.get('http://localhost:5000/api/admin/extensions', { headers });
    console.log('✅ Extensions fetched:', getResponse.data.length, 'records');
    console.log('Sample data:', getResponse.data[0]);
    
    // Test POST new extension
    console.log('\n➕ Creating new extension...');
    const newExtension = {
      phone_number: '081999888777',
      expiry_date: '2025-08-15',
      user_name: 'Test User',
      amount: 75000,
      quota_type: 'XL'
    };
    
    const postResponse = await axios.post('http://localhost:5000/api/admin/extensions', newExtension, { headers });
    console.log('✅ Extension created:', postResponse.data);
    const createdId = postResponse.data.id;
    
    // Test PUT update extension
    console.log('\n✏️ Updating extension...');
    const updatedExtension = {
      ...newExtension,
      user_name: 'Updated Test User',
      amount: 80000
    };
    
    const putResponse = await axios.put(`http://localhost:5000/api/admin/extensions/${createdId}`, updatedExtension, { headers });
    console.log('✅ Extension updated:', putResponse.data);
    
    // Test GET expiring soon
    console.log('\n⚠️ Fetching expiring soon...');
    const expiringSoonResponse = await axios.get('http://localhost:5000/api/admin/extensions/expiring-soon', { headers });
    console.log('✅ Expiring soon:', expiringSoonResponse.data.length, 'records');
    
    // Test GET expired
    console.log('\n❌ Fetching expired...');
    const expiredResponse = await axios.get('http://localhost:5000/api/admin/extensions/expired', { headers });
    console.log('✅ Expired:', expiredResponse.data.length, 'records');
    
    // Test DELETE extension
    console.log('\n🗑️ Deleting test extension...');
    const deleteResponse = await axios.delete(`http://localhost:5000/api/admin/extensions/${createdId}`, { headers });
    console.log('✅ Extension deleted:', deleteResponse.data.message);
    
    console.log('\n🎉 All tests passed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testExtensionsAPI();
