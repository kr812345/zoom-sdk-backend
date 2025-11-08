const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000/api/zoom';

async function testEndpoint(endpoint, method = 'GET', body = null) {
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

        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        const data = await response.json();
        
        console.log(`\n=== Testing ${method} ${endpoint} ===`);
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));
        
        return { status: response.status, data };
    } catch (error) {
        console.error(`Error testing ${endpoint}:`, error.message);
        return { status: 500, error: error.message };
    }
}

async function runTests() {
    console.log('Starting API tests...\n');

    // Test health check endpoint
    await testEndpoint('/');

    // Test access token generation
    await testEndpoint('/access-token', 'POST');

    // Test user info retrieval
    await testEndpoint('/get-user', 'GET');

    // Test signature generation
    const signatureBody = {
        meetingNumber: "123456789",
        role: 0
    };
    await testEndpoint('/signature', 'POST', signatureBody);

    // Test ZAK token generation
    await testEndpoint('/zak', 'POST');

    // Test registrant creation
    const registrantBody = {
        meetingId: "123456789",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User"
    };
    await testEndpoint('/registrant', 'POST', registrantBody);

    console.log('\nAPI tests completed.');
}

// Run the tests
runTests().catch(console.error);