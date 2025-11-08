const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const zoomRouter = require('./src/Router/router')
const middleware = require('./src/Middlerware/middleware')

'use strict';


// Initialize express app
const app = express();

// Security middlewares
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://*.zoom.us"],
            connectSrc: ["'self'", "https://*.zoom.us", "wss://*.zoom.us"],
            frameSrc: ["'self'", "https://*.zoom.us"],
            imgSrc: ["'self'", "data:", "https://*.zoom.us"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            fontSrc: ["'self'", "data:"],
        },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.set('trust proxy', 1);
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5000'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json({ limit: '10kb' })); // Limit payload size

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);
app.use(middleware);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});
app.get('/ip', (req, res) => res.send(req.ip))

// Router Defination
app.use('/api/zoom/', zoomRouter);

// Error handling middleware
const { errorHandler } = require('./src/middleware/errorHandler');
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});