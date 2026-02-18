// Test script to verify PDF endpoint
const axios = require('axios');
const fs = require('fs');

const API_URL = process.env.API_URL || 'http://localhost:5000';
const token = process.argv[2]; // Pass token as command line argument

if (!token) {
    console.log('Usage: node test-pdf-endpoint.js <your-auth-token>');
    console.log('Get your token from localStorage in the browser');
    process.exit(1);
}

async function testPDFEndpoint() {
    try {
        console.log('Testing PDF endpoint...');
        console.log(`API URL: ${API_URL}/api/permissions/export/all-pdf`);
        
        const response = await axios.get(`${API_URL}/api/permissions/export/all-pdf`, {
            headers: { 
                Authorization: `Bearer ${token}` 
            },
            responseType: 'blob'
        });
        
        console.log('Response received!');
        console.log('Content-Type:', response.headers['content-type']);
        console.log('Content-Disposition:', response.headers['content-disposition']);
        console.log('Data size:', response.data.size || response.data.length);
        
        // Save to file
        const filename = 'test-permissions.pdf';
        fs.writeFileSync(filename, response.data);
        console.log(`PDF saved as: ${filename}`);
        console.log('Please open the PDF to verify the table format');
        
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

testPDFEndpoint();
