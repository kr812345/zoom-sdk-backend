const fetch = require('node-fetch');

async function testEndpoint(endpoint, method = 'GET', body = null) {
    const BASE_URL = 'http://localhost:5000/api/zoom';
    
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        console.log(`Testing ${method} ${endpoint}...`);
        console.log('Request body:', body ? JSON.stringify(body, null, 2) : 'None');

        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        const data = await response.json();
        
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));
        
        return { status: response.status, data };
    } catch (error) {
        console.error(`Error:`, error.message);
        return { status: 500, error: error.message };
    }
}

// Get the endpoint to test from command line arguments
const [,, endpoint = '/', method = 'GET', ...bodyArgs] = process.argv;
let body = null;

if (bodyArgs.length > 0) {
    try {
        body = JSON.parse(bodyArgs.join(' '));
    } catch (error) {
        console.error('Error parsing body arguments:', error.message);
        process.exit(1);
    }
}

// Run the test
testEndpoint(endpoint, method, body)
    .then(() => process.exit(0))
    .catch(error => {
        console.error('Test failed:', error);
        process.exit(1);
    });