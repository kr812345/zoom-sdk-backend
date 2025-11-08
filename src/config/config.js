const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Required environment variables
const requiredEnvVars = [
    'ZOOM_OAUTH_URL',
    'ZOOM_BASE_URL',
    'ACCOUNT_ID',
    'CLIENT_ID',
    'CLIENT_SECRET',
    'ALLOWED_ORIGINS'
];

// Validate required environment variables
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

const config = {
    zoom: {
        oauthUrl: process.env.ZOOM_OAUTH_URL,
        baseUrl: process.env.ZOOM_BASE_URL,
        accountId: process.env.ACCOUNT_ID,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        allowedOrigins: process.env.ALLOWED_ORIGINS.split(','),
    },
    server: {
        port: process.env.PORT || 5000,
        env: process.env.NODE_ENV || 'development',
    },
    jwt: {
        signatureExpirationMinutes: 60, // 1 hour expiration for meeting signatures
    },
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
    }
};

module.exports = config;