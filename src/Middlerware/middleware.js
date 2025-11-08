const jwt = require("jsonwebtoken");

const PUBLIC_PATHS = [
    '/',
    '/api/zoom',
    '/api/zoom/',
    '/api/zoom/access-token',
    '/api/zoom/signature'
];

const middleware = (req, res, next) => {
    // Skip authentication for public paths
    if (PUBLIC_PATHS.includes(req.path)) {
        return next();
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ 
                success: false, 
                message: "Access token is required" 
            });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "Access token is missing" 
            });
        }

        const decoded = jwt.decode(token, process.env.CLIENT_SECRET);
        req.user = decoded;
        next();
        
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: "Invalid or expired access token", 
            error: error.message
        });
    }
};

module.exports = middleware;