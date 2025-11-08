const validateSignature = (req, res, next) => {
    console.log('Request body:', req.body);
    const { meetingNumber, role } = req.body;
    
    console.log('Extracted values:', { meetingNumber, role });
    console.log('Role type:', typeof role);
    
    if (!meetingNumber) {
        console.log('Validation failed: meetingNumber is required');
        return res.status(400).json({
            success: false,
            message: 'Meeting number is required'
        });
    }
    
    if (role === undefined || ![0, 1].includes(Number(role))) {
        console.log('Validation failed: invalid role value:', role);
        return res.status(400).json({
            success: false,
            message: 'Role must be 0 or 1'
        });
    }
    
    console.log('Validation passed');
    next();
};

const validateRegistrant = (req, res, next) => {
    const { meetingId, email, firstName } = req.body;
    
    if (!meetingId) {
        return res.status(400).json({
            success: false,
            message: 'Meeting ID is required'
        });
    }
    
    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email is required'
        });
    }
    
    if (!firstName) {
        return res.status(400).json({
            success: false,
            message: 'First name is required'
        });
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format'
        });
    }
    
    next();
};

module.exports = {
    validateSignature,
    validateRegistrant
};