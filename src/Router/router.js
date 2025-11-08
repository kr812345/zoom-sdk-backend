const express = require('express');
const { getAccessToken, getZAKToken, getSignature, getRegistrantToken, getUser } = require('../Controller/controller');
const { validateSignature, validateRegistrant } = require('../middleware/validation/zoomValidation');

const zoomRouter = express.Router();

// Basic health check
zoomRouter.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Zoom SDK Backend API is running'
    });
});

// Protected routes
zoomRouter.post('/access-token', getAccessToken);
zoomRouter.get('/get-user', getUser);
zoomRouter.post('/signature', validateSignature, getSignature);
zoomRouter.post('/zak', getZAKToken);
zoomRouter.post('/registrant', validateRegistrant, getRegistrantToken);

module.exports = zoomRouter;