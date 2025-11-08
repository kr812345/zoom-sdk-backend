const fetch = require('node-fetch');
const KJUR = require('jsrsasign');
const config = require('../config/config');
const tokenManager = require('./tokenManager');

class ZoomService {
    async generateSignature(meetingNumber, role) {
        if (!meetingNumber || typeof meetingNumber !== 'string') {
            throw new Error('Meeting number is required and must be a string');
        }
        
        if (![0, 1].includes(Number(role))) {
            throw new Error('Role must be 0 or 1');
        }

        const iat = Math.round(Date.now() / 1000) - 30;
        const exp = iat + config.jwt.signatureExpirationMinutes * 60;
        
        const oHeader = { alg: 'HS256', typ: 'JWT' };
        const oPayload = {
            appKey: config.zoom.clientId,
            mn: meetingNumber,
            role: role,
            iat: iat,
            exp: exp,
            tokenExp: exp
        };

        const sHeader = JSON.stringify(oHeader);
        const sPayload = JSON.stringify(oPayload);
        
        return KJUR.jws.JWS.sign('HS256', sHeader, sPayload, config.zoom.clientSecret);
    }

    async getZAKToken() {
        try {
            const accessToken = await tokenManager.getValidAccessToken();
            
            const response = await fetch(`${config.zoom.baseUrl}/users/me/token?type=zak`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Failed to get ZAK token: ${error.message || 'Unknown error'}`);
            }

            const data = await response.json();
            return data.token;
        } catch (error) {
            throw new Error(`ZAK token generation failed: ${error.message}`);
        }
    }

    async createRegistrant(meetingId, registrantData) {
        if (!meetingId) {
            throw new Error('Meeting ID is required');
        }

        if (!registrantData.email || !registrantData.firstName) {
            throw new Error('Email and first name are required for registration');
        }

        try {
            const accessToken = await tokenManager.getValidAccessToken();
            
            const response = await fetch(`${config.zoom.baseUrl}/meetings/${meetingId}/registrants`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: registrantData.email,
                    first_name: registrantData.firstName,
                    last_name: registrantData.lastName || ''
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Failed to create registrant: ${error.message || 'Unknown error'}`);
            }

            return response.json();
        } catch (error) {
            throw new Error(`Registrant creation failed: ${error.message}`);
        }
    }

    async getUser(accessToken) {
        try {
            // const accessToken = await tokenManager.getValidAccessToken();
            // const accessToken = req.body.accessToken;
            
            console.log('Making request to Zoom API with token:', accessToken);
            
            const response = await fetch(`${config.zoom.baseUrl}/users/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Zoom API Response Status:', response.status);
            console.log('Response Headers:', response.headers.raw());

            const contentType = response.headers.get('content-type');
            if (contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Non-JSON response:', text);
                throw new Error('Received non-JSON response from Zoom API');
            }

            if (!response.ok) {
                const error = await response.json();
                console.error('Error response from Zoom:', error);
                throw new Error(`Failed to get user: ${error.message || 'Unknown error'}`);
            }

            const data = await response.text();
            console.log('Received user data:', data);
            return data;
        } catch (error) {
            console.error('Error in getUser:', error);
            throw new Error(`Get user failed: ${error.message}`);
        }
    }
}

module.exports = new ZoomService();