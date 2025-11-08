const zoomService = require('../services/zoomService');
const tokenManager = require('../services/tokenManager');

const getAccessToken = async (req, res) => {
    try {
        const accessToken = await tokenManager.getValidAccessToken();
        return res.status(200).json({
            success: true,
            message: 'Access token generated successfully',
            data: { access_token: accessToken }
        });
    } catch (error) {
        console.error('Error in getAccessToken:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate access token',
            error: error.message
        });
    }
};

const getUser = async (req, res) => {
    try {
        const accessToken = req.body.accessToken;
        const userData = await zoomService.getUser(accessToken);
        return res.status(200).json({
            success: true,
            message: 'User data retrieved successfully',
            data: userData
        });
    } catch (error) {
        console.error('Error in getUser:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve user data',
            error: error.message
        });
    }
};

const getSignature = async (req, res) => {
    try {
        const { meetingNumber, role } = req.body;
        
        if (!meetingNumber || !role) {
            return res.status(400).json({
                success: false,
                message: 'Meeting number and role are required'
            });
        }

        const signature = await zoomService.generateSignature(meetingNumber, role);
        
        return res.status(200).json({
            success: true,
            message: 'Signature generated successfully',
            data: { signature }
        });
    } catch (error) {
        console.error('Error in getSignature:', error);
        return res.status(error.message.includes('required') ? 400 : 500).json({
            success: false,
            message: 'Failed to generate signature',
            error: error.message
        });
    }
};


const getZAKToken = async (req, res) => {
    try {
        const token = await zoomService.getZAKToken();
        return res.status(200).json({
            success: true,
            message: 'ZAK token generated successfully',
            data: { token }
        });
    } catch (error) {
        console.error('Error in getZAKToken:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate ZAK token',
            error: error.message
        });
    }
};

const getRegistrantToken = async (req, res) => {
    try {
        const { meetingId, email, firstName, lastName } = req.body;
        
        const registrantData = {
            email,
            firstName,
            lastName
        };

        const result = await zoomService.createRegistrant(meetingId, registrantData);
        
        return res.status(200).json({
            success: true,
            message: 'Registrant created successfully',
            data: result
        });
    } catch (error) {
        console.error('Error in getRegistrantToken:', error);
        return res.status(error.message.includes('required') ? 400 : 500).json({
            success: false,
            message: 'Failed to create registrant',
            error: error.message
        });
    }
};

module.exports = {
    getAccessToken,
    getSignature,
    getZAKToken,
    getRegistrantToken,
    getUser
};
