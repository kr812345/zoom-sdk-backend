const fetch = require('node-fetch');
const config = require('../config/config');

class TokenManager {
    constructor() {
        this.accessToken = null;
        this.expiresAt = null;
    }

    async getValidAccessToken() {
        if (this.accessToken && this.expiresAt && Date.now() < this.expiresAt) {
            return this.accessToken;
        }
        return this.refreshAccessToken();
    }

    async refreshAccessToken() {
        try {
            const auth = Buffer.from(`${config.zoom.clientId}:${config.zoom.clientSecret}`).toString('base64');
            
            const response = await fetch(
                `${config.zoom.oauthUrl}?grant_type=account_credentials&account_id=${config.zoom.accountId}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Basic ${auth}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Failed to get access token: ${error.message || 'Unknown error'}`);
            }

            const data = await response.json();
            
            this.accessToken = data.access_token;
            // Set expiration 5 minutes before actual expiry to ensure token validity
            this.expiresAt = Date.now() + (data.expires_in - 300) * 1000;
            
            return this.accessToken;
        } catch (error) {
            throw new Error(`Token refresh failed: ${error.message}`);
        }
    }

    clearToken() {
        this.accessToken = null;
        this.expiresAt = null;
    }
}

// Export singleton instance
module.exports = new TokenManager();