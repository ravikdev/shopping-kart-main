const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = process.env.ACCESS_PRIVATE_KEY;

const validateToken = (req, res) => {
    const { token } = req.body;

    jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
        if (err) {
            const errorDetails = {
                message: 'Token is not valid',
                type: 'Authentication Error',
                method: req.method,
                route: req.originalUrl,
                error: err.message
            };

            console.error("Validation Error:", errorDetails);

            return res.status(403).json({
                authenticated: false,
                errorDetails
            });
        }

        res.json({ authenticated: true, user });
    });
};

const authenticateToken = (req, res, next) => {
    const token = req.header('authorization');
    // if (!token) {
    //     return res.status(401).send({
    //         message: 'Access denied',
    //         status: false
    //     });
    // }
    if (!token) {
        const errorDetails = {
            message: 'Access denied: No token provided',
            type: 'Authentication Error',
            method: req.method,
            route: req.originalUrl,
            timestamp: new Date().toISOString()
        };

        // Log error to console
        console.error("Authentication Error:", errorDetails);

        // Send error details to New Relic
        // newrelic.noticeError(new Error('Token not provided'), errorDetails);

        return res.status(401).json({
            status: false,
            errorDetails
        });
    }

    jwt.verify(token, process.env.ACCESS_PRIVATE_KEY, (err, user) => {
        if (err) {
            const errorDetails = {
                message: 'Invalid token',
                type: 'Authentication Error',
                method: req.method,
                route: req.originalUrl,
                error: err.message
            };

            console.error("Authentication Error:", errorDetails);

            return res.status(403).send({
                status: false,
                errorDetails
            });
        }
        req.userId = user._id;
        next();
    });
};

const ALLOWED_IPS = process.env.ALLOWED_IPS ? process.env.ALLOWED_IPS.split(',') : [];

const ipAccessMiddleware = (req, res, next) => {

    const clientReferer = req.headers.origin;
    // console.log(req.headers);

    const clientIP = getClientIP(clientReferer);

    console.log(req.headers.origin,clientIP);

    if (ALLOWED_IPS.includes(clientIP)) {
        next();
    } else {
        res.status(403).json({ message: 'Access forbidden. Your IP is not allowed.' });
    }
};

const getClientIP = (referer) => {
    try {
        const ipRegex = /(?:https?:\/\/)?([^:/]+)(?::\d+)?/;
        const match = referer.match(ipRegex);

        if (match && match[1]) {
            return match[1];
        }
        return null;
    } catch (error) {
        console.error('Error extracting IP address:', error);
        return null;
    }
};

module.exports = { validateToken, authenticateToken, ipAccessMiddleware };
