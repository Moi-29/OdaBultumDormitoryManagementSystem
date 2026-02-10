const axios = require('axios');

const API_URL = 'https://odabultumdormitorymanagementsystem.onrender.com';

const testLogin = async (username, password, role) => {
    console.log(`\n🔐 Testing login for: ${username} (${role})`);
    console.log(`📡 API URL: ${API_URL}/api/multi-auth/login`);
    
    try {
        const response = await axios.post(`${API_URL}/api/multi-auth/login`, {
            username,
            password,
            role
        });

        console.log('✅ Login successful!');
        console.log('📦 Response data:', JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        console.log('❌ Login failed!');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Error:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.log('No response received from server');
            console.log('Request:', error.request);
        } else {
            console.log('Error:', error.message);
        }
        return null;
    }
};

const runTests = async () => {
    console.log('🧪 Starting Login API Tests...\n');
    console.log('=' .repeat(60));

    // Test 1: Admin login
    await testLogin('admin', 'password123', 'admin');
    
    console.log('\n' + '='.repeat(60));
    
    // Test 2: Proctor login
    await testLogin('proctor_amal-2a', 'password123', 'proctor');
    
    console.log('\n' + '='.repeat(60));
    
    // Test 3: Maintainer login
    await testLogin('maintainer_plumbing', 'password123', 'maintainer');
    
    console.log('\n' + '='.repeat(60));
    console.log('\n✅ All tests completed!');
};

runTests();
